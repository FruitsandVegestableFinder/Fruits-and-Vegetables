import { Link } from 'react-router-dom';
import AppRoutes from '../../routes/AppRoutes';
import useAuthStore from '../../store/useAuthStore';
import { IoHome } from 'react-icons/io5';
import { CiShop } from "react-icons/ci";
import { GiFruitBowl } from "react-icons/gi";
import { FaUsers } from 'react-icons/fa';

function Sidebar() {
    const { userInfo } = useAuthStore();

    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <AppRoutes/>
            </div> 
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-0 w-80 min-h-full bg-neutral-900 text-neutral-100">
                    <div className='p-4'>
                        <Link to='/' className="rounded-none pt-6 pb-0 focus:text-neutral-300 text-xl text-neutral-300 font-black leading-none">SUPPLIER FINDER</Link>
                        <div className='rounded-none pt-1 pb-4 focus:text-neutral-300 text-sm text-neutral-300 font-normal leading-none'>{userInfo?.fullName}</div>
                    </div>
                    <li><Link className="rounded-none py-4 hover:bg-neutral-800 focus:bg-neutral-300 focus:text-neutral-900" to='/'><IoHome /> Home</Link></li>
                    <li><Link className="rounded-none py-4 hover:bg-neutral-800 focus:bg-neutral-300 focus:text-neutral-900" to='/suppliers'><CiShop /> Suppliers</Link></li>
                    <li><Link className="rounded-none py-4 hover:bg-neutral-800 focus:bg-neutral-300 focus:text-neutral-900" to='/supplies'><GiFruitBowl /> Fruits & Vegetables</Link></li>
                    <li><Link className="rounded-none py-4 hover:bg-neutral-800 focus:bg-neutral-300 focus:text-neutral-900" to='/users'><FaUsers /> Users</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;
