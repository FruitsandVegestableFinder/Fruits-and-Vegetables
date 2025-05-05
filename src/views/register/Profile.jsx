import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useAuditStore from '../../store/useAuditStore';

const Profile = () => {
  const { updateProfile, setUpdateError, setUpdateSuccess, updateError, updateSuccessProfile, updateSuccessPassword, userInfo } = useAuthStore();
  const { addAudit } = useAuditStore();

  const [fullName, setFullName] = useState(userInfo?.fullName);
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState(userInfo?.address);
  const [contactNumber, setContactNumber] = useState(userInfo?.contactNumber);
  
  const navigate = useNavigate();

  // check if already logged in
  useEffect(() => {
    if(!userInfo){
      navigate('/');
    }
  }, [userInfo, navigate]);


  // submit details to auth store 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = userInfo?.id;
    const email = userInfo?.email;
    updateProfile(email, password, confirmPassword, oldPassword, fullName, address, contactNumber, id);
    addAudit(`Updated a profile.`, userInfo?.id)
  };

  return (
    <div className='min-h-[80vh] flex items-stretch flex-col'>
      <div className="m-auto">
        <div className="w-full sm:w-[500px] max-w-md bg-base-100 p-8 rounded-xl border shadow-md my-6 bg_style">
          <h2 className="text-2xl text-center font-bold mb-6 text-neutral-500">Profile</h2>

          {/* if has other error */}
          {updateError?.other && <p className='text-red-400 text-center mb-2'>{updateError?.other}</p>}

          {/* if profile updated */}
          {updateSuccessProfile && <p className='text-green-400 text-center mb-2'>{updateSuccessProfile}</p>}

          {/* UPDATE FORM */}
          <form onSubmit={handleSubmit}>
            {/* fullname field */}
            <div className="mb-4">
              <input
                  placeholder='Full Name'
                  type="text"
                  id="fullName"
                  className="input input-bordered w-full"
                  value={fullName}
                  onChange={(e) => {
                    setUpdateError();
                    setUpdateSuccess();  
                    setFullName(e.target.value);
                  }}
                  required
              />
            </div>

            {/* email field */}
            <div className="mb-4">
              <input
                  type="text"
                  placeholder='address'
                  id="address"
                  className="input input-bordered w-full"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value)
                    setUpdateError();
                    setUpdateSuccess();
                  }}
              />
            </div>
            
            {/* email field */}
            <div className="mb-4">
              <input
                  type="number"
                  placeholder='Contact Number'
                  id="contactNumber"
                  className="input input-bordered w-full"
                  value={contactNumber}
                  onChange={(e) => {
                    setContactNumber(e.target.value.replace(/[^0-9+]/g, '').slice(0, 11))
                    setUpdateError();
                    setUpdateSuccess();
                  }}
              />
            </div>

            {/* email field */}
            <div className="mb-4">
              <input
                  type="email"
                  placeholder='Email'
                  id="email"
                  className="input input-bordered w-full"
                  value={userInfo?.email}
                  onChange={() => {
                    setUpdateError();
                    setUpdateSuccess();
                  }}
                  readOnly
                  disabled
              />
            </div>

            {/* if password updated */}
            {updateSuccessPassword && <p className='text-green-400 text-center mb-2'>{updateSuccessPassword}</p>}
            <div className='text-sm mb-2'>Leave the password blank if you don&apos;t want to change.</div>
            {/* old password field */}
            <div className="mb-4">
              <input
                  type="password"
                  id="oldPassword"
                  placeholder='Old Password'
                  className="input input-bordered w-full"
                  value={oldPassword}
                  onChange={(e) => {
                    setUpdateError();
                    setUpdateSuccess();  
                    setOldPassword(e.target.value);
                  }}
              />

              {/* if has password error */}
              {updateError?.oldPassword && <p className='text-red-400 text-center'>{updateError.oldPassword}</p>}
            </div>

            {/* password field */}
            <div className="mb-4">
              <input
                  type="password"
                  id="password"
                  placeholder='New Password'
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => {
                    setUpdateError();
                    setUpdateSuccess();  
                    setPassword(e.target.value);
                  }}
              />

              {/* if has password error */}
              {updateError?.password && <p className='text-red-400 text-center'>{updateError.password}</p>}
            </div>

            {/* confirm password field */}
            <div className="mb-6">
              <input
                  type="password"
                  id="confirmPassword"
                  placeholder='Confirm New Password'
                  className="input input-bordered w-full"
                  value={confirmPassword}
                  onChange={(e) => {
                    setUpdateError();
                    setUpdateSuccess();  
                    setConfirmPassword(e.target.value);
                  }}
              />
              
              {/* if has confirm password error */}
              {updateError?.passwordConfirm && <p className='text-red-400 text-center'>{updateError.passwordConfirm}</p>}
            </div>

            <button type="submit" className="btn border border-blue-500 bg-blue-500 hover:border-blue-400 hover:bg-blue-400 text-neutral-100 w-full">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
