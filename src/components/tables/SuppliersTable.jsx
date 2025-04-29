import { useState } from 'react'
import { formatDateWT, rowsPerPage } from '../../lib';
import Pagination from '../Pagination';

function SuppliersTable({ suppliers, searchQuery, selectAllChecked, handleCheckboxClick, handleSelectAll, handleDetails, filter }) {
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    
    // function for sorting
    const getSortedData = () => {
        let sortableData = suppliers.sort((a, b) => {
            // sort created date
            if(a.updatedAt && b.updatedAt){
                const createdA = a.updatedAt.seconds;
                const createdB = b.updatedAt.seconds;
                return createdB - createdA;
            }
        });

        // if filtered sort then ignore top sort
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                let aValue, bValue;

                if (sortConfig.key === 'supplierName') {
                    aValue = a.supplierName ? a.supplierName.toLowerCase() : '';
                    bValue = b.supplierName ? b.supplierName.toLowerCase() : '';
                } else if (sortConfig.key === 'storeName') {
                    aValue = a.storeName ? a.storeName.toLowerCase() : '';
                    bValue = b.storeName ? b.storeName.toLowerCase() : '';
                } else if (sortConfig.key === 'address') {
                    aValue = a.address ? a.address.toLowerCase() : '';
                    bValue = b.address ? b.address.toLowerCase() : '';
                } else if (sortConfig.key === 'contactNumber') {
                    aValue = a.contactNumber ? a.contactNumber : '';
                    bValue = b.contactNumber ? b.contactNumber : '';
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
                    supply.storeName.toLowerCase().includes(searchLowerCase) ||
                    supply.supplierName.toLowerCase().includes(searchLowerCase) || 
                    supply.address.toLowerCase().includes(searchLowerCase) || 
                    supply.contactNumber.includes(searchLowerCase)
                );
            });
        }

        // if(filter == 'fruit'){
        //     sortableData = sortableData.filter(supply => {
        //         return supply.type.toLowerCase() == 'fruit'
        //     });
        // } else if(filter == 'vegetable'){
        //     sortableData = sortableData.filter(supply => {
        //         return supply.type.toLowerCase() == 'vegetable'
        //     });
        // }

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
                        <th onClick={() => requestSort('supplierName')} className="cursor-pointer">
                        Supplier Name {sortConfig.key === 'supplierName' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => requestSort('storeName')} className="cursor-pointer">
                        Store Name {sortConfig.key === 'storeName' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => requestSort('address')} className="cursor-pointer">
                        Address {sortConfig.key === 'address' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => requestSort('contactNumber')} className="cursor-pointer">
                        Contact Number {sortConfig.key === 'contactNumber' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
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
                        {paginatedData.map((supplier) => (
                            <tr key={supplier?.id} className='text-xl'>
                                <th>
                                    <label>
                                        <input
                                        type="checkbox"
                                        className="checkbox"
                                        value={supplier?.id}
                                        onClick={handleCheckboxClick}
                                        />
                                    </label>
                                </th>
                                <td>
                                    <div className="font-bold capitalize">{supplier?.supplierName}</div>
                                </td>
                                <td>
                                    <div className="font-bold capitalize">{supplier?.storeName}</div>
                                </td>
                                <td>{supplier?.address}</td>
                                <td>{supplier?.contactNumber}</td>
                                <td>{supplier?.createdAt ? formatDateWT(supplier?.createdAt) : '--'}</td>
                                <td>{supplier?.updatedAt ? formatDateWT(supplier?.updatedAt) : '--'}</td>
                                <th>
                                    <button className="btn btn-xs rounded-md" onClick={() => handleDetails(supplier)}>Edit</button>
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

export default SuppliersTable;
