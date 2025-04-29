import useAuthStore from '../../store/useAuthStore';
import LandingPage from './LandingPage';
import AdminHome from './AdminHome';
import { useEffect } from 'react';

function Home() {
  const { userInfo } = useAuthStore();
    
  useEffect(() => {
    document.title = 'Home';
  },[]);

  return (
    <div>
      {userInfo ? 
        // if has userinfo
        <AdminHome/>
        :
        // else display landing page
        <LandingPage/> 
      }
    </div>
  )
}

export default Home
