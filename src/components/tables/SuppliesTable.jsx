import { useState } from 'react'
import { formatDateWT, rowsPerPage } from '../../lib';
import Pagination from '../Pagination';

function SuppliesTable({ supplies, searchQuery, selectAllChecked, handleCheckboxClick, handleSelectAll, handleDetails, filter }) {
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    
    // function for sorting
    const getSortedData = () => {
        let sortableData = supplies.sort((a, b) => a.name.localeCompare(b.name));

        // if filtered sort then ignore top sort
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                let aValue, bValue;

                if (sortConfig.key === 'fullName') {
                    aValue = a.fullName ? a.fullName.toLowerCase() : '';
                    bValue = b.fullName ? b.fullName.toLowerCase() : '';
                } else if (sortConfig.key === 'type') {
                    aValue = a.type ? a.type.toLowerCase() : '';
                    bValue = b.type ? b.type.toLowerCase() : '';
                } else if (sortConfig.key === 'name') {
                    aValue = a.name ? a.name.toLowerCase() : '';
                    bValue = b.name ? b.name.toLowerCase() : '';
                } else if (sortConfig.key === 'createdAt') {
                    aValue = a.createdAt ? a.createdAt.seconds : 0;
                    bValue = b.createdAt ? b.createdAt.seconds : 0;
                } else if (sortConfig.key === 'updatedAt') {
                    aValue = a.updatedAt ? a.updatedAt.seconds : 0;
                    bValue = b.updatedAt ? b.updatedAt.seconds : 0;
                }
                

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        // search for complaint name, description and address
        if(searchQuery != ''){
            sortableData = sortableData.filter(supply => {
                const searchLowerCase = searchQuery.toLowerCase();

                return (
                    supply.fullName.toLowerCase().includes(searchLowerCase) ||
                    supply.name.toLowerCase().includes(searchLowerCase) || 
                    supply.type.toLowerCase().includes(searchLowerCase)
                );
            });
        }

        if(filter == 'fruit'){
            sortableData = sortableData.filter(supply => {
                return supply.type.toLowerCase() == 'fruit'
            });
        } else if(filter == 'vegetable'){
            sortableData = sortableData.filter(supply => {
                return supply.type.toLowerCase() == 'vegetable'
            });
        }

        return sortableData;
    };

    // filter sort data function
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const paginatedData = getSortedData().slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const totalPages = Math.ceil(getSortedData().length / rowsPerPage);
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    }

    return (
        <>
            <table className="table w-full">
                <thead>
                    <tr className='text-xl'>
                        <th>
                            <label>
                                <input
                                    type="checkbox"
                                    className="checkbox" 
                                    value='all'
                                    checked={selectAllChecked}
                                    onChange={handleSelectAll} 
                                />
                            </label>
                        </th>
                        <th onClick={() => requestSort('name')} className="cursor-pointer">
                        Product Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => requestSort('type')} className="cursor-pointer">
                        Product Type {sortConfig.key === 'type' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => requestSort('fullName')} className="cursor-pointer">
                        Last Edit By {sortConfig.key === 'fullName' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => requestSort('createdAt')} className="cursor-pointer">
                        Created At {sortConfig.key === 'createdAt' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => requestSort('updatedAt')} className="cursor-pointer">
                        Updated At {sortConfig.key === 'updatedAt' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {getSortedData().length > 0 ? 
                    <>
                        {paginatedData.map((supply) => (
                            <tr key={supply?.id} className='text-xl'>
                                <th>
                                    <label>
                                        <input
                                        type="checkbox"
                                        className="checkbox"
                                        value={supply?.id}
                                        onClick={handleCheckboxClick}
                                        />
                                    </label>
                                </th>
                                <td>
                                    <div className="font-bold">{supply?.name}</div>
                                </td>
                                <td>
                                    <div className="font-bold capitalize">{supply?.type}</div>
                                </td>
                                <td>{supply?.fullName}</td>
                                <td>{supply?.createdAt ? formatDateWT(supply?.createdAt) : '--'}</td>
                                <td>{supply?.updatedAt ? formatDateWT(supply?.updatedAt) : '--'}</td>
                                <th>
                                    <button className="btn btn-xs rounded-md" onClick={() => handleDetails(supply)}>Edit</button>
                                </th>
                            </tr>
                        ))}
                    </>
                    :
                    <tr><td colSpan='9' className='text-center'>No supply found.</td></tr>
                    }
                </tbody>
            </table>
            {
                getSortedData().length > 0 &&
                <Pagination handlePageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages}/>
            }
        </>
    )
}

export default SuppliesTable;
