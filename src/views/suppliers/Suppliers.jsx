import { useEffect, useState } from 'react';
import SupplierModal from '../../components/modals/SupplierModal';
import SuppliersTable from '../../components/tables/SuppliersTable';
import useAuthStore from '../../store/useAuthStore';
import useSuppliersStore from '../../store/useSuppliersStore';
import { useNavigate } from 'react-router-dom';
import LoadingProgress from '../../components/LoadingProgress';
import useAuditStore from '../../store/useAuditStore';
import usePathStore from '../../store/usePathStore';

function Suppliers() {
    const { suppliers, getAllSuppliers, deleteSuppliers } = useSuppliersStore();
    const { setPathFromWindow } = usePathStore();
    const { userInfo } = useAuthStore();
    const { addAudit } = useAuditStore();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Suppliers';
        setPathFromWindow();
    },[]);

    const [success, setSuccess] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [details, setDetails] = useState({ 
        supplierName: "",
        storeName: "",
        description: "",
        address: "",
        contactNumber: "",
        latitude: 15.0125,
        longitude: 120.6877,
        action: 'Add'
    });
    const [filter, setFilter] = useState('all');

    const addSupplierModal = () => {
        setDetails(() => ({ 
            supplierName: "",
            storeName: "",
            description: "",
            address: "",
            contactNumber: "",
            latitude: 15.0125,
            longitude: 120.6877,
            action: 'Add'
        }));

        setIsOpen(true);
    };

    const closeModal = () => {
        setDetails(() => ({ 
            supplierName: "",
            storeName: "",
            description: "",
            address: "",
            contactNumber: "",
            latitude: 15.0125,
            longitude: 120.6877,
            action: 'Add'
        }));

        setIsOpen(false);
    };

    const [isOpen, setIsOpen] = useState(false);

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
                    getAllSuppliers();
                }
            }
        }
    },[userInfo, navigate, isLoaded]);

    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true);
        }, 1000)
    },[suppliers])

    const handleSelectAll = () => {
        const checkboxes = document.getElementsByClassName('checkbox');
        const newSelectedItems = [];
    
        setSelectAllChecked(!selectAllChecked);
    
        if (!selectAllChecked) {
          for (let checkbox of checkboxes) {
            checkbox.checked = true;
            const row = checkbox.value;
    
            if(row != 'all'){
              newSelectedItems.push(row);
            }
          }
          setSelectedItems(newSelectedItems);
        } else {
          for (let checkbox of checkboxes) {
            checkbox.checked = false;
          }
          setSelectedItems([]);
        }
    };
    
    const handleCheckboxClick = (event) => {
        const checkboxes = document.getElementsByClassName('checkbox');
        const checkbox = event.target;
        const row = checkbox.value;
        const notAllItem = selectedItems.filter((item) => {
          return item !== 'all';
        })
    
        if (checkbox.checked) {
          if((checkboxes.length - 1) == (notAllItem.length + 1)){
            setSelectAllChecked(true);
          }
    
          setSelectedItems(prevItems => [...prevItems, row]);
        } else {
          setSelectedItems(prevItems => prevItems.filter(selectedItem => selectedItem !== row));
          setSelectAllChecked(false);
        }
    };

    const handleDetails = (supplier) => {
        if(supplier.id){
            setDetails({...supplier, action: 'Edit'});
            setIsOpen(true);
        } else {
            setDetails({ 
                supplierName: "",
                storeName: "",
                description: "",
                address: "",
                contactNumber: "",
                latitude: 15.0125,
                longitude: 120.6877,
                action: 'Add'
            });
        }
    }

    // delete complaint type
    const handleDelete = () => {
        deleteSuppliers(selectedItems);
        addAudit(`Deleted a supplier.`,userInfo?.id)
        setSelectedItems([]);
        setSelectAllChecked(false);
        setIsLoaded(false);
    }

    return (
        <div className="container m-auto p-6">
            <div className="py-12 px-6 border rounded-xl bg_style">
                <div className="text-center font-black capitalize text-xl">Suppliers</div>
                    <div className='flex justify-between items-center flex-col lg:flex-row mt-4'>
                    {/* SEARCH FEATURE */}
                    <input type="text" className='input w-full lg:w-[250px] input-sm input-bordered my-4' placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <div>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className='select select-bordered select-sm mr-4'>
                        <option value="all">All</option>
                        <option value="fruit">Fruits</option>
                        <option value="vegetable">Vegetables</option>
                    </select>
                    <button className='btn btn-sm text-sm btn-success text-neutral-100' onClick={addSupplierModal}>Add Supplier</button>
                    </div>
                </div>
                <div className="overflow-x-auto w-full">
                    <div className="overflow-x-auto">
                        {isLoaded ?
                            <SuppliersTable
                                suppliers={suppliers}
                                searchQuery={searchQuery}
                                selectAllChecked={selectAllChecked}
                                handleCheckboxClick={handleCheckboxClick}
                                handleSelectAll={handleSelectAll}
                                handleDetails={handleDetails}
                                filter={filter}
                            />
                            :
                            <LoadingProgress/>
                        }

                        {selectedItems.length > 0 && (
                            <div className='py-4 flex justify-end overflow-hidden border-t'>
                                <div className='btn btn-sm text-neutral-50 bg-red-500 hover:bg-red-400' onClick={handleDelete}>Delete {selectedItems.length > 1 ? 'Items' : 'Item'}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <SupplierModal setIsLoaded={setIsLoaded} details={details} isOpen={isOpen} closeModal={closeModal} success={success} setSuccess={setSuccess}/>
            {success && 
                <div className="toast z-[999]">
                    <div className="alert alert-success text-white">
                        <span>{success}</span>
                    </div>
                </div>
            }
        </div>
    )
}

export default Suppliers
