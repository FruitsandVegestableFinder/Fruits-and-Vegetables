import { useState } from 'react'
import { formatDateWT, rowsPerPage } from '../../lib';
import Pagination from '../Pagination';

function LogsTable({ logs, searchQuery }) {
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    
    // function for sorting
    const getSortedData = () => {
        let sortableData = logs.sort((a, b) => {
            // sort created date
            if(a.createdAt && b.createdAt){
                const createdA = a.createdAt.seconds;
                const createdB = b.createdAt.seconds;
                return createdB - createdA;
            }
        });

        // if filtered sort then ignore top sort
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                let aValue, bValue;

                if (sortConfig.key === 'log') {
                    aValue = a.log ? a.log.toLowerCase() : '';
                    bValue = b.log ? b.log.toLowerCase() : '';
                } else if (sortConfig.key === 'createdBy') {
                    aValue = a.createdBy ? a.createdBy.toLowerCase() : '';
                    bValue = b.createdBy ? b.createdBy.toLowerCase() : '';
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
            sortableData = sortableData.filter(log => {
                const searchLowerCase = searchQuery.toLowerCase();

                return (
                    log.createdBy.toLowerCase().includes(searchLowerCase) ||
                    log.log.toLowerCase().includes(searchLowerCase)
                );
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
                        <th onClick={() => requestSort('log')} className="cursor-pointer">
                        Logs {sortConfig.key === 'log' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => requestSort('createdBy')} className="cursor-pointer">
                        Name {sortConfig.key === 'createdBy' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => requestSort('createdAt')} className="cursor-pointer">
                        Created At {sortConfig.key === 'createdAt' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => requestSort('updatedAt')} className="cursor-pointer">
                        Updated At {sortConfig.key === 'updatedAt' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {getSortedData().length > 0 ? 
                    <>
                        {paginatedData.map((log) => (
                            <tr key={log?.id} className='text-xl'>
                                <td>{log?.log}</td>
                                <td>
                                    <div className="font-bold capitalize">{log?.createdBy}</div>
                                </td>
                                <td>{log?.createdAt ? formatDateWT(log?.createdAt) : '--'}</td>
                                <td>{log?.updatedAt ? formatDateWT(log?.updatedAt) : '--'}</td>
                            </tr>
                        ))}
                    </>
                    :
                    <tr><td colSpan='9' className='text-center'>No audit log found.</td></tr>
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

export default LogsTable;
