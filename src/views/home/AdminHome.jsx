// libraries
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// utils
import LogsTable from "../../components/tables/LogsTable";

// store
import useAuditStore from "../../store/useAuditStore";
import LoadingProgress from "../../components/LoadingProgress";
import useAuthStore from "../../store/useAuthStore";
import useUserStore from "../../store/useUserStore";
import useSuppliersStore from "../../store/useSuppliersStore";
import useSuppliesStore from "../../store/useSuppliesStore";

function AdminHome() {
    const { logs, getAllAudit } = useAuditStore();
    const { userInfo } = useAuthStore();
    const { users, getUsers } = useUserStore();
    const { suppliers, getAllSuppliers } = useSuppliersStore();
    const { supplies, getAllSupplies } = useSuppliesStore();
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoaded){
            setTimeout(() => {
                setIsLoaded(true);
            }, 1500)
        }
        
        if(isLoaded){
            if(!userInfo){
                navigate('/login');
            } else {
                if(userInfo?.userType != 1) {
                    navigate('/');
                } else {
                    getUsers();
                    getAllAudit();
                    getAllSupplies();
                    getAllSuppliers();
                }
            }
        }
    },[userInfo, navigate, isLoaded]);

    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true);
        }, 1000)
    },[logs])

    return (
        <div className="flex justify-center flex-col my-12 container mx-auto">
            <div className="flex justify-start flex-wrap">
                <div className="p-1 w-full md:w-1/2 xl:w-1/4">
                    <div className="border px-12 py-8 rounded-md flex justify-start items-center gap-2 w-[100%] text-white bg-info">
                        <span className="text-5xl font-bold items-center mr-2">{users.length}</span>
                        <span className="text-xl font-xl">Users</span>
                    </div>
                </div>
                <div className="p-1 w-full md:w-1/2 xl:w-1/4">
                    <div className="border px-12 py-8 rounded-md flex justify-start items-center gap-2 w-[100%] text-white bg-success">
                        <span className="text-5xl font-bold items-center mr-2">{suppliers.length}</span>
                        <span className="text-xl font-xl">Suppliers</span>
                    </div>
                </div>
                <div className="p-1 w-full md:w-1/2 xl:w-1/4">
                    <div className="border px-12 py-8 rounded-md flex justify-start items-center gap-2 w-[100%] text-white bg-error">
                        <span className="text-5xl font-bold items-center mr-2">{supplies.filter((supply) => supply.type == 'fruit').length}</span>
                        <span className="text-xl font-xl">Fruits</span>
                    </div>
                </div>
                <div className="p-1 w-full md:w-1/2 xl:w-1/4">
                    <div className="border px-12 py-8 rounded-md flex justify-start items-center gap-2 w-[100%] text-white bg-warning">
                        <span className="text-5xl font-bold items-center mr-2">{supplies.filter((supply) => supply.type == 'vegetable').length}</span>
                        <span className="text-xl font-xl">Vegetables</span>
                    </div>
                </div>
            </div>


            <div className="container m-auto mt-6">
                <div className="py-12 px-6 border rounded-xl bg_style">
                    <div className="text-center font-black capitalize text-xl">Audit Logs</div>
                    <input type="text" className='input w-full lg:w-[250px] input-xl input-bordered my-4' placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <div className="overflow-x-auto w-full">
                        <div className="overflow-x-auto">
                            {isLoaded ?
                                <LogsTable logs={logs} searchQuery={searchQuery}/>
                                :
                                <LoadingProgress/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHome;
