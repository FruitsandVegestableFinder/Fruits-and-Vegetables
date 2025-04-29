import { useEffect, useState } from 'react';
import SupplyLists from '../supplies/SupplyLists';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import useSuppliersStore from '../../store/useSuppliersStore';
import useAuthStore from '../../store/useAuthStore';
import useSuppliesStore from '../../store/useSuppliesStore';
import useAuditStore from '../../store/useAuditStore';
import { getLocationDetails } from '../../lib';

function SupplierModal({ setIsLoaded, details, isOpen, closeModal }){
  const { updateSuppliers, addSuppliers } = useSuppliersStore();
  const { userInfo } = useAuthStore();
  const { addAudit } = useAuditStore();
  const { supplies, getAllSupplies } = useSuppliesStore();
  const [checkedItems, setCheckedItems] = useState([]);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [image, setImage] = useState([]);
  const [preview, setPreview] = useState([]);
  const [imageProfile, setImageProfile] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [err, setErr] = useState(null);
  const [formData, setFormData] = useState({
    createdBy: userInfo?.id,
    supplierName: details.supplierName,
    storeName: details.storeName,
    description: details.description,
    address: details.address,
    contactNumber: details.contactNumber,
    latitude: details.latitude,
    longitude: details.longitude
  });

  useEffect(() => {
    if(details.id){
      setCheckedItems(details.supplyLists);
      setFormData({
        createdBy: userInfo?.id,
        supplierName: details.supplierName,
        storeName: details.storeName,
        description: details.description,
        address: details.address,
        contactNumber: details.contactNumber,
        latitude: details.latitude,
        longitude: details.longitude
      });
      setPreview(details.imageUrls);
      setPreviewProfile(details.imageProfile);
    } else {
      setFormData({ 
        createdBy: userInfo?.id,
        supplierName: "",
        storeName: "",
        description: "",
        address: "",
        contactNumber: "",
        latitude: 15.0125,
        longitude: 120.6877,
        action: 'Add'
      });
      setPreview([]);
      setCheckedItems([]);
      setPreviewProfile('');
    }
  },[details])

  useEffect(() => {
    getAllSupplies();
  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErr(null);
    if(name == 'contactNumber'){
      const formattedValue = value.replace(/[^0-9+]/g, '');
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  const handleMapClick = (map) => {
    if (!isMapInitialized) {
      setIsMapInitialized(true);
    }

    map.target.on("click", (e)  =>{
      const { lat, lng } = e.latlng;
      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
      const getAddress = async () => {
        let text =  await getLocationDetails(lat, lng);
        setFormData((prev) => ({ ...prev, address: text }));
      }
      
      getAddress();
    });
  }

  // get image
  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;
    setImage([...selectedFiles]);
    setErr(null);
  };

  const handleImageProfileChange = (e) => {
    const selectedFiles = e.target.files[0];
    setImageProfile(selectedFiles);
    setErr(null);
  };

  useEffect(() => {
      if(image){
        const urls = [];
        image.forEach((img) => {
          urls.push(URL.createObjectURL(img));
        })
        setPreview(urls);
      }
  },[image]);

  useEffect(() => {
    if(imageProfile){
        setPreviewProfile(URL.createObjectURL(imageProfile));
    }
  },[imageProfile])

  useEffect(() => {
    setErr(null);
  },[checkedItems]);

  const handleSubmitSupplier = (e) => {
    e.preventDefault();

    let hasError = false;
    if(formData?.supplierName == ''){
      setErr((prev) => ({ ...prev, supplierName: 'Please enter supplier name.' })); hasError = true;
    }
    if(formData?.storeName == ''){
      setErr((prev) => ({ ...prev, storeName: 'Please enter supplier store name.' })); hasError = true;
    }
    if(formData?.description == ''){
      setErr((prev) => ({ ...prev, description: 'Please enter description.' })); hasError = true;
    }
    if(formData?.address == ''){
      setErr((prev) => ({ ...prev, address: 'Please enter address.' })); hasError = true;
    }
    if(formData?.contactNumber == '' || formData?.contactNumber == null){
      setErr((prev) => ({ ...prev, contactNumber: 'Please enter contact number.' })); hasError = true;
    }
    if(checkedItems.length <= 0){
      setErr((prev) => ({ ...prev, supplyLists: 'Please select atleast one (1) supply.' })); hasError = true;
    }

    if(details.action == 'Edit'){
      if(hasError) return;
      updateSuppliers(formData, image, checkedItems, details.imageUrls, details.id, imageProfile, details.imageProfile);
      addAudit(`Updated a supplier details.`, userInfo?.id);
      setIsLoaded(false);
    } else {
      if(image.length <= 0){
        setErr((prev) => ({ ...prev, image: 'Please upload atleast one (1) image of your store.' })); hasError = true;
      }
      if(!imageProfile){
        setErr((prev) => ({ ...prev, imageProfile: 'Please upload image profile of your store.' })); hasError = true;
      }
      
      if(hasError) return;
      addSuppliers(formData, image, imageProfile, checkedItems);
      addAudit(`Added a supplier.`, userInfo?.id);
      setIsLoaded(false);
    }
    setImage([]);
    setImageProfile(null);
    setPreview([]);
    setPreviewProfile(null);
    const prev = document.getElementById('prev_img');
    const prevProfile = document.getElementById('prevprofile_img');
    prev.value = '';
    prevProfile.value = '';
    setCheckedItems([]);
    closeModal();
  }

  return (
    <div>
      {isOpen && (
        <div className="modal modal-open px-4 lg:px-48">
          <div className="modal-box w-full max-w-none h-full p-0">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-gray-300">
                <h3 className="text-lg font-bold">{details.action} Supplier</h3>
                <button className="btn btn-md btn-circle" onClick={closeModal}>
                  ✕
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="container m-auto p-4">
                  <input 
                      type="text" 
                      value={formData.supplierName}
                      onChange={handleChange}
                      name='supplierName'
                      className='input input-bordered w-full mb-4' 
                      placeholder='Supplier Name' />
                      {/* if no supplier name */}
                      {err?.supplierName && <p className='text-red-400 text-center'>{err.supplierName}</p>}

                  <input 
                      type="text" 
                      value={formData.storeName}
                      onChange={handleChange}
                      name='storeName'
                      className='input input-bordered w-full mb-4' 
                      placeholder='Supplier Shop Name' />
                      {/* if no store name */}
                      {err?.storeName && <p className='text-red-400 text-center'>{err?.storeName}</p>}

                  <textarea 
                      className='textarea textarea-bordered w-full mb-2' 
                      value={formData.description}
                      onChange={handleChange}
                      name='description'
                      placeholder='Description'>
                  </textarea>
                  {/* if no description */}
                  {err?.description && <p className='text-red-400 text-center'>{err?.description}</p>}

                  <input 
                      type="number" 
                      className='input input-bordered w-full mb-4' 
                      value={formData.contactNumber}
                      onChange={handleChange}
                      name='contactNumber'
                      placeholder='Contact Number' />
                  
                  <SupplyLists supplies={supplies} checkedItems={checkedItems} setCheckedItems={setCheckedItems}/>
                  {/* if no supply */}
                  {err?.supplyLists && <p className='text-red-400 text-center mt-4'>{err.supplyLists}</p>}

                  <div className="mt-4">
                    <label>Select Shop Location:</label>
                    <MapContainer
                      center={[formData?.latitude, formData?.longitude]} 
                      zoom={13}
                      scrollWheelZoom={true} 
                      style={{ aspectRatio: '16/6', height: 'auto', width: '100%' }}
                      whenReady={handleMapClick}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom={19}
                        tileSize={256}
                      />
                      <Marker position={[formData?.latitude, formData?.longitude]}>
                        <Popup>
                          Supplier Shop.
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>

                  <input 
                      type="text" 
                      className='input input-bordered w-full mt-4 mb-2'  
                      value={formData.address}
                      onChange={handleChange}
                      name='address'
                      placeholder='Address' />

                      {/* if no address */}
                      {err?.address && <p className='text-red-400 text-center'>{err.address}</p>}
                      
                  <input 
                      type="text" 
                      className='input input-bordered w-full mt-4 mb-2'  
                      value={formData.address}
                      onChange={handleChange}
                      name='address'
                      placeholder='Address' />

                      {/* if no address */}
                      {err?.address && <p className='text-red-400 text-center'>{err.address}</p>}
                      
                    <div className="mt-2">
                      <label>Upload Profile Image: </label>
                      <input type="file" className='file-input file-input-bordered w-full' id='prevprofile_img' onChange={handleImageProfileChange} accept=".jpg, .jpeg, .png, .gif" />
                    </div>

                    {/* if no image */}
                    {err?.imageProfile && <p className='text-red-400 text-center'>{err.imageProfile}</p>}

                    <div className='mt-2'>
                      {previewProfile && 
                        <div className='flex flex-wrap justify-start'>
                            <a href={previewProfile} target='_blank' className='w-1/2 sm:w-1/3 lg:w-1/5'>
                              <img src={previewProfile} alt={`Preview Store Profile`} className='object-cover aspect-square border w-full' />
                            </a>
                        </div>
                      }
                    </div>

                    <div className="mt-2">
                      <label>Upload Related Image: </label>
                      <input type="file" className='file-input file-input-bordered w-full' id='prev_img' onChange={handleImageChange} multiple accept=".jpg, .jpeg, .png, .gif" />
                    </div>

                    {/* if no image */}
                    {err?.image && <p className='text-red-400 text-center'>{err.image}</p>}

                    <div className='mt-2'>
                      {preview && 
                        <div className='flex flex-wrap justify-start'>
                          {preview.map((previewUrl, index) => (
                            <a key={index} href={previewUrl} target='_blank' className='w-1/2 sm:w-1/3 lg:w-1/5'>
                              <img src={previewUrl} alt={`Preview ${index}`} className='object-cover aspect-square border w-full' />
                            </a>
                          ))}
                        </div>
                      }
                    </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-300 flex  justify-end gap-2">
                <button className="btn btn-default" onClick={closeModal}>
                  Close
                </button>
                <button className="btn btn-success text-white" onClick={handleSubmitSupplier}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierModal;
