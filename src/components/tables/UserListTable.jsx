// library
import { useState } from 'react';

// utils
import { formatDateWT, rowsPerPage } from '../../lib';

// store
import useAuthStore from '../../store/useAuthStore';
import Pagination from '../Pagination';

function UserListTable({ users, searchQuery, setDetails }) {
    const { userInfo } = useAuthStore();
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    
    // function for sorting
    const getSortedData = () => {
        let sortableData = users.sort((a, b) => {
        // sort created date
            const createdA = a.createdAt.seconds;
            const createdB = b.createdAt.seconds;
            return createdB - createdA;
        });

        // if filtered sort then ignore top sort
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                let aValue, bValue;

                if (sortConfig.key == 'id'){
                    aValue = a.id.toLowerCase();
                    bValue = b.id.toLowerCase();
                }  else if (sortConfig.key === 'fullName') {
                    aValue = a.fullName.toLowerCase();
                    bValue = b.fullName.toLowerCase();
                } else if (sortConfig.key === 'email') {
                    aValue = a.email.toLowerCase();
                    bValue = b.email.toLowerCase();
                } else if (sortConfig.key === 'contactNumber') {
                    aValue = a.contactNumber.toLowerCase();
                    bValue = b.contactNumber.toLowerCase();
                } else if (sortConfig.key === 'userAddress') {
                    aValue = a.userAddress.toLowerCase();
                    bValue = b.userAddress.toLowerCase();
                } else if(sortConfig.key === 'createdAt') {
                    aValue = a.createdAt.seconds;
                    bValue = b.createdAt.seconds;
                } else if(sortConfig.key === 'updatedAt') {
                    aValue = a.updatedAt.seconds;
                    bValue = b.updatedAt.seconds;
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        // search for incident name, description and address
        if(searchQuery != ''){
            sortableData = sortableData.filter(user => {
                const searchLowerCase = searchQuery.toLowerCase();

                return (
                    user?.id?.toLowerCase().includes(searchLowerCase) ||
                    user?.fullName?.toLowerCase().includes(searchLowerCase) ||
                    user?.email?.toLowerCase().includes(searchLowerCase) ||
                    user?.userAddress?.toLowerCase().includes(searchLowerCase) ||
                    user?.contactNumber?.includes(searchLowerCase) ||
                    user?.address?.toLowerCase().includes(searchLowerCase)
                );
            });
        }

        sortableData = sortableData.filter((user) => {
            if(user?.id != userInfo?.id){
                return user
            }
        })

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

    // open modal
    const handleDetails = (user) => {
        document.getElementById('user_modal').showModal();
        setDetails(user);
    }
    
    const paginatedData = getSortedData().slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const totalPages = Math.ceil(getSortedData().length / rowsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

  return (
    <>
        <table className="table w-full">
            <thead>
                <tr className='text-xl'>
                    <th onClick={() => requestSort('id')} className="cursor-pointer">
                    ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => requestSort('fullName')} className="cursor-pointer">
                    Full Name {sortConfig.key === 'fullName' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => requestSort('email')} className="cursor-pointer">
                    Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => requestSort('userAddress')} className="cursor-pointer">
                    Address {sortConfig.key === 'userAddress' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
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
                    {paginatedData.map((user) => (
                        <tr key={user?.id} className='text-xl'>
                            <td>
                                {user?.id}
                            </td>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div>
                                    <div className="font-bold capitalize">{user?.fullName}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{user?.email}  <span className="badge badge-sm bg-blue-500 text-neutral-100"><a href={`mailto:${user?.email}`} target="_blank">Email Now</a></span></td>
                            <td>
                                {user?.userAddress}
                            </td>
                            <td>{user?.contactNumber}  <span className="badge badge-sm bg-blue-500 text-neutral-100"><a href={`tel:${user?.contactNumber}`} target="_blank">Call Now</a></span></td>
                            <td>{formatDateWT(user?.createdAt)}</td>
                            <td>{formatDateWT(user?.updatedAt)}</td>
                            <th>
                                <button className="btn btn-xs rounded-md" onClick={() => handleDetails(user)}>Details</button>
                            </th>
                        </tr>
                    ))}
                </>
                :
                <tr><td colSpan='9' className='text-center'>No user found.</td></tr>
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

export default UserListTable;
