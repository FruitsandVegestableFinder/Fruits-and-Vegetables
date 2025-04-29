import './App.css';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from './store/useAuthStore';
import usePathStore from './store/usePathStore';
import LoadingProgress from './components/LoadingProgress';
import Navbar from './components/navigation/Navbar';
import Sidebar from './components/navigation/Sidebar';
import BG_IMG from './assets/supplier.jpg';
import BG_IMG2 from './assets/supplier2.jpg';
import BG_IMG3 from './assets/fruitsvegetables.jpg';

function App() {
  const { initializeAuth } = useAuthStore();
  const { currentPath } = usePathStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [img, setImg] = useState(BG_IMG2);

  useEffect(() => {
    initializeAuth();

    setTimeout(() => {
      setIsLoaded(true);
    }, 1500)
  },[]);

  useEffect(() => {
    if (currentPath === '/suppliers') {
      setImg(BG_IMG);
    } else if (currentPath === '/supplies') {
      setImg(BG_IMG3);
    } else {
      setImg(BG_IMG2);
    }
  }, [currentPath]);

  return (
    <Router>
        {isLoaded ?
          <div className='min-h-screen flex items-stretch flex-col overflow-hidden bg-cover bg-fixed' style={{ backgroundImage: `url(${img})` }}>
            <Navbar />
            <Sidebar />
          </div>
          :
          <LoadingProgress/>
        }
    </Router>
  );
}

export default App;