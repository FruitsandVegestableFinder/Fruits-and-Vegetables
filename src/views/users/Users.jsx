// libraries
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

// store
import useAuthStore from '../../store/useAuthStore';
import useUserStore from '../../store/useUserStore';
import usePathStore from '../../store/usePathStore';

// components
import LoadingProgress from '../../components/LoadingProgress'
import UserModal from '../../components/modals/UserModal';
import UserListTable from '../../components/tables/UserListTable';

function Users() {
    const { users, getUsers } = useUserStore();
    const { setPathFromWindow } = usePathStore();
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const { userInfo } = useAuthStore();
    const [isLoaded, setIsLoaded] = useState(false);
    const [details, setDetails] = useState(null);
    
    useEffect(() => {
        document.title = 'Users';
        setPathFromWindow();
    },[]);

    useEffect(() => {
        if(!isLoaded){
            setTimeout(() => {
                setIsLoaded(true);
            }, 500)
        }
        
        if(isLoaded){
            if(!userInfo){
                navigate('/login');
            } else {
                if(userInfo?.userType != 1){
                    navigate('/');
                }
                // get all users
                getUsers();
            }
        }
    },[userInfo, navigate, isLoaded, getUsers]);

    return (
        <div>
            {isLoaded ?
                <div className="container m-auto p-6">
                    <div className="py-12 px-6 border rounded-xl bg_style">
                        <div className="text-center font-black capitalize text-xl">User Lists</div>
                        <div className='flex justify-between items-center flex-col lg:flex-row mt-4'>
                        {/* SEARCH FEATURE */}
                        <input type="text" className='input w-full lg:w-[250px] input-sm input-bordered my-4' placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="overflow-x-auto w-full">
                            <div className="overflow-x-auto">
                                <UserListTable users={users} searchQuery={searchQuery} setDetails={setDetails} />
                            </div>
                        </div>
                    </div>
                    
                    {/* modal for displaying user information */}
                    <UserModal details={details} setDetails={setDetails} />
                </div>
                :
                <LoadingProgress/>
            }
        </div>
    )
}

export default Users
