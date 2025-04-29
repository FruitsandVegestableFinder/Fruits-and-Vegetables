import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Login = () => {
  const { signIn, loginError, setLoginError, userInfo } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // check if already logged in
  useEffect(() => {
    if(userInfo){
      navigate('/');
    }
  }, [navigate, userInfo]);

  // submit/login using email and password
  const handleSubmit = async (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <div className='min-h-[80vh] flex items-stretch flex-col'>
      <div className="m-auto">
      <div className="w-full sm:w-[500px] max-w-md bg-base-100 p-8 rounded-xl border shadow-md my-6 bg_style">
        <h2 className="text-2xl font-bold mb-6 text-neutral-500 text-center">Login</h2>

        {/* if has error during login process */}
        {loginError && <p className='text-center mb-6 text-red-400'>{loginError}</p>}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>
          {/* email field */}
          <div className="mb-4">
            <input
              type="email"
              id="email"
              placeholder='Email'
              className="input input-bordered w-full rounded-full"
              value={email}
              onChange={(e) => {
                setLoginError();
                setEmail(e.target.value);
              }}
            />
          </div>
          
          {/* password field */}
          <div className="mb-6">
            <input
              type="password"
              id="password"
              placeholder='Password'
              className="input input-bordered w-full rounded-full"
              value={password}
              onChange={(e) => {
                setLoginError();
                setPassword(e.target.value);
              }}
            />

            <div className='text-right'>
              <Link to='/forgot' className='text-blue-500'>Forgot password?</Link>
            </div>
          </div>
          
          <button type="submit" className="btn rounded-full border border-blue-500 bg-blue-500 hover:border-blue-400 hover:bg-blue-400 text-neutral-100 w-full ">Login</button>
          <p className='mt-2 text-center'>Don&apos;t have an account? <Link to="/register" className='text-blue-500'>Sign Up</Link></p>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Login;