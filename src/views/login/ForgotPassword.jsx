import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { IoMdArrowRoundBack } from "react-icons/io";

const ForgotPassword = () => {
  const { userInfo, resetAccount, resetSuccess, resetError, setResetError, setResetSuccess } = useAuthStore();

  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  // check if already logged in
  useEffect(() => {
    if(userInfo){
      navigate('/');
    }
  }, [navigate, userInfo]);

  // submit reset link to email
  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAccount(email);
  };

  return (
    <div className='min-h-[80vh] flex items-stretch flex-col'>
      <div className="m-auto">
        <div className="w-full sm:w-[500px] max-w-md bg-base-100 p-8 rounded-xl border shadow-md my-6 bg_style">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-500">Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                  type="email"
                  id="email"
                  placeholder='Email'
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => {
                      setResetError();
                      setResetSuccess();
                      setEmail(e.target.value);
                  }}
                  required
              />
              {resetSuccess && <p className='text-green-400 text-center'>{resetSuccess}</p>}
              {resetError && <p className='text-red-400 text-center'>{resetError}</p>}
            </div>
            <button type="submit" className="btn border border-blue-500 bg-blue-500 hover:border-blue-400 hover:bg-blue-400 text-neutral-100 w-full">Reset Password</button>
            <Link to='/login' className="mt-2 btn border border-neutral-300 bg-white text-neutral-500 w-full"><IoMdArrowRoundBack className='align-middle'/> Back</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
