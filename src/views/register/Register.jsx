import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Register = () => {
  const { signUp, setRegisterError, registerError, userInfo } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();
  // check if already logged in
  useEffect(() => {
    if(userInfo){
      navigate('/');
    }
  }, [userInfo, navigate]);


  // submit details to auth store 
  const handleSubmit = async (e) => {
    e.preventDefault();
    signUp(email, password, confirmPassword, fullName, contactNumber, address);
  };

  return (
    <div className='min-h-[80vh] flex items-stretch flex-col'>
      <div className="m-auto">
        <div className="w-full sm:w-[500px] max-w-md bg-base-100 p-8 rounded-xl border shadow-md my-6 bg_style">
          <h2 className="text-2xl text-center font-bold mb-6 text-neutral-500">Sign Up</h2>

          {/* if has other error */}
          {registerError?.other && <p className='text-red-400 text-center mb-2'>{registerError.other}</p>}

          {/* REGISTRATION FORM */}
          <form onSubmit={handleSubmit}>
            {/* fullname field */}
            <div className="mb-4">
              <input
                placeholder='Full Name'
                type="text"
                id="fullName"
                className="input input-bordered w-full rounded-full"
                value={fullName}
                onChange={(e) => {
                  setRegisterError();
                  setFullName(e.target.value);
                }}
                required
              />
              {/* if has fullName error */}
              {registerError?.fullName && <p className='text-red-400 text-center'>{registerError.fullName}</p>}
            </div>
            <div className="mb-4">
              <input
                placeholder='Contact Number'
                type="text"
                id="contactNumber"
                className="input input-bordered w-full rounded-full"
                value={contactNumber}
                onChange={(e) => {
                  setRegisterError();
                  setContactNumber(e.target.value);
                }}
                required
              />
              {/* if has contactNumber error */}
              {registerError?.contactNumber && <p className='text-red-400 text-center'>{registerError.contactNumber}</p>}
            </div>
            <div className="mb-4">
              <input
                placeholder='Address'
                type="text"
                id="address"
                className="input input-bordered w-full rounded-full"
                value={address}
                onChange={(e) => {
                  setRegisterError();
                  setAddress(e.target.value);
                }}
                required
              />
              {/* if has email error */}
              {registerError?.email && <p className='text-red-400 text-center'>{registerError.email}</p>}
            </div>

            {/* email field */}
            <div className="mb-4">
              <input
                type="email"
                placeholder='Email'
                id="email"
                className="input input-bordered w-full rounded-full"
                value={email}
                onChange={(e) => {
                  setRegisterError();
                  setEmail(e.target.value)
                }}
                required
              />
              
              {/* if has email error */}
              {registerError?.email && <p className='text-red-400 text-center'>{registerError.email}</p>}
            </div>
            
            {/* password field */}
            <div className="mb-4">
              <input
                type="password"
                id="password"
                placeholder='Password'
                className="input input-bordered w-full rounded-full"
                value={password}
                onChange={(e) => {
                  setRegisterError();
                  setPassword(e.target.value);
                }}
                required
              />

              {/* if has password error */}
              {registerError?.password && <p className='text-red-400 text-center'>{registerError.password}</p>}
            </div>

            {/* confirm password field */}
            <div className="mb-6">
              <input
                type="password"
                id="confirmPassword"
                placeholder='Confirm Password'
                className="input input-bordered w-full rounded-full"
                value={confirmPassword}
                onChange={(e) => {
                  setRegisterError();
                  setConfirmPassword(e.target.value);
                }}
                required
              />
              
              {/* if has confirm password error */}
              {registerError?.passwordConfirm && <p className='text-red-400 text-center'>{registerError.passwordConfirm}</p>}
            </div>

            <button type="submit" className="btn border rounded-full border-blue-500 bg-blue-500 hover:border-blue-400 hover:bg-blue-400 text-neutral-100 w-full">Signup</button>
            <p className='mt-2 text-center'>Have an account? <Link to="/login" className='text-blue-500'>Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
