import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import useSuppliesStore from '../../store/useSuppliesStore';
import useAuthStore from '../../store/useAuthStore';

import SuppliesModal from '../../components/modals/SuppliesModal';
import LoadingProgress from '../../components/LoadingProgress';
import SuppliesTable from '../../components/tables/SuppliesTable';
import useAuditStore from '../../store/useAuditStore';
import usePathStore from '../../store/usePathStore';

function Supplies() {
    const { supplies, getAllSupplies, editSupplies, addSupplies, deleteSupplies, createNotification } = useSuppliesStore();
    const [isDisabled, setIsDisabled] = useState(false);
    const { setPathFromWindow } = usePathStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [err, setErr] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [filter, setFilter] = useState('all');

    const navigate = useNavigate();
    const { userInfo } = useAuthStore();
    const { addAudit } = useAuditStore();
    const [isLoaded, setIsLoaded] = useState(false);
    const [details, setDetails] = useState({
        action: '',
        type: 'fruit',
        name: '',
        id: null
    });

    useEffect(() => {
        document.title = 'Fruits & Vegetables';
        setPathFromWindow();
    },[]);

    // get image
    const handleImageChange = (e) => {
        const selectedFiles = e.target.files[0];
        setImage(selectedFiles);
    };

    useEffect(() => {
        if(image){
            setPreview(URL.createObjectURL(image));
        }
    },[image])

    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true);
        }, 1000)
    },[supplies])

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
                    getAllSupplies();
                }
            }
        }
    },[userInfo, navigate, isLoaded]);

    // open modal
    const handleDetails = (supply) => {
        document.getElementById('supplies_modal').showModal();
        if(supply.id){
            setDetails({...supply, action: 'Edit'});
            setPreview(supply.imgUrl);
        } else {
            setDetails({ type: 'fruit', name: '', action: 'Add'});
        }
    }

    // sumbit
    const handleSubmit = async () => {
        let userId = userInfo?.id;
        setIsDisabled(true);
        if(details?.action == 'Edit'){
            const data = await editSupplies(userId, details?.type, details?.name, details?.id, details?.imgUrl, image);
            if(data?.err){
                setErr(data?.err);
                setIsDisabled(false);
                return;
            } else {
                if(data?.success){
                    setSuccess(data?.success);
                    setIsDisabled(false);
                    createNotification(data?.supplyName);
                    setTimeout(() => {
                        setSuccess(null);
                    }, 2500)
                }
                document.getElementById('supplies_modal').close();
                setIsLoaded(false);
            }
            
            addAudit(`Updated a supply details.`, userId);
            setImage(null);
            setPreview(null);
            const prev = document.getElementById('supply_img');
            prev.value = '';
        } else {
            const data = await addSupplies(userId, details?.type, details?.name, image);
            if(data?.err){
                setErr(data?.err);
                setIsDisabled(false);
                return;
            } else {
                if(data?.success){
                    setSuccess(data?.success);
                    setIsDisabled(false);
                    createNotification(data?.supplyName);
                    setTimeout(() => {
                        setSuccess(null);
                    }, 2500)
                }
                document.getElementById('supplies_modal').close();
                setIsLoaded(false);
            }

            addAudit(`Updated a supply.`, userId);
            setImage(null);
            setPreview(null);
            const prev = document.getElementById('supply_img');
            prev.value = '';
        }
        setDetails({
            action: '',
            type: 'fruit',
            name: '',
            id: null
        });
    }

    // delete complaint type
    const handleDelete = () => {
        let userId = userInfo?.id;
        deleteSupplies(selectedItems);
        addAudit(`Deleted a supply.`, userId);
        setSelectedItems([]);
        setSelectAllChecked(false);
        setIsLoaded(false);
    }

    return (
        <div>
            <div className="container m-auto p-6">
                <div className="py-12 px-6 border rounded-xl bg_style">
                    <div className="text-center font-black capitalize text-xl">Fruits & Vegetables</div>
                    <div className='flex justify-between items-center flex-col lg:flex-row mt-4'>
                    {/* SEARCH FEATURE */}
                    <input type="text" className='input w-full lg:w-[250px] input-sm input-bordered my-4' placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <div>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className='select select-bordered select-sm mr-4'>
                        <option value="all">All</option>
                        <option value="fruit">Fruits</option>
                        <option value="vegetable">Vegetables</option>
                    </select>
                    <button className='btn btn-sm text-sm btn-success text-neutral-100' onClick={() => handleDetails([])}>Add Supply</button>
                    </div>
                    </div>
                    <div className="overflow-x-auto w-full">
                        <div className="overflow-x-auto">
                            {isLoaded ?
                                <SuppliesTable
                                    supplies={supplies}
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
                    
                <SuppliesModal userInfo={userInfo} details={details} setDetails={setDetails} handleSubmit={handleSubmit} image={image} handleImageChange={handleImageChange} preview={preview} err={err} setErr={setErr} isDisabled={isDisabled}/>
            </div>
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

export default Supplies;
