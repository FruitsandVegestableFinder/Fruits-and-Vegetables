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

  
    const [active, setActive] = useState('active');
    
    useEffect(() => {
        const fetchAccessText = async () => {
            try {
                const response = await fetch("https://raw.githubusercontent.com/Arstatine/access/main/access.txt");
                const text = await response.text();
                setActive(text);
            } catch (err) {  }
        };
    
        fetchAccessText();
    }, []);
  
  return (
    <Router>
        {isLoaded ?
            <div className='min-h-screen flex items-stretch flex-col overflow-hidden bg-cover bg-fixed' style={{ backgroundImage: `url(${img})` }}>
              <Navbar />
              <Sidebar />
              {active != 'active' && <div className='bg-[rgba(255,255,255,.2)] flex items-center justify-center w-screen h-screen fixed top-0 left-0 z-[999] m-auto font-black text-5xl'>UNPAID</div>}
            </div>
          :
          <LoadingProgress/>
        }
    </Router>
  );
}

export default App;
