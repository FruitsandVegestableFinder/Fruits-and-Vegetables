import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import useAuditStore from "../../store/useAuditStore";
import LOGO from "../../assets/logo.png";
import LOGO2 from "../../assets/logo.jpg";

function Navbar() {
    const { signOut, userInfo } = useAuthStore();
    const { addAudit } = useAuditStore();
    
    const handleLogout = async () => {
        signOut();
        addAudit(`Logout an account.`, userInfo.id);
    };
      
    return (
        <div className="navbar bg-neutral-900 py-4 h-[100px] w-screen">
            <div className="container mx-auto px-6 flex justify-between">
                {userInfo ?
                    <label htmlFor="my-drawer" className="btn bg-neutral-800 hover:bg-neutral-700  text-neutral-100 border-none drawer-button">
                        <div className="rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </div>
                    </label>
                    :
                    <div>
                        <Link to='/' className="btn border-none bg-neutral-900 hover:bg-neutral-700 focus:bg-neutral-700 text-xl font-black">
                        <img src={LOGO} alt="" className="h-[100%]" />
                        </Link>
                    </div>
                }

                <div>
                    {userInfo ? // check if has userInfo/loggedin
                        // if already logged in display info
                        <>
                            <div className="flex gap-2">
                                {/* User Dropdown */}
                                <img src={LOGO} alt="" className="w-12 h-12" />
                                <img src={LOGO2} alt="" className="rounded-full w-12 h-12" />
                                <div className="dropdown dropdown-end flex gap-2">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar dropdown-toggle">
                                        <div className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 flex justify-center items-center">
                                            <div className="text-lg flex justify-center items-center h-full uppercase text-neutral-300">{userInfo?.fullName[0]}</div>
                                        </div>
                                    </div>
                                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-14 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border">
                                        <li>
                                            <Link to='/profile' className="capitalize">
                                                {userInfo?.fullName}
                                            </Link>
                                        </li>
                                        <li onClick={handleLogout}>
                                            <a>Logout</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </>
                        :
                        // if not logged in display login and sign up
                        <div className="flex justify-center items-center">
                            <div className="flex lg:hidden dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-sm border-none bg-neutral-800 hover:bg-neutral-700 text-neutral-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                                </div>
                                
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-14 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border">
                                    <li><Link to='/register'>Sign Up</Link></li>
                                    <li><Link to='/login'>Login</Link></li>
                                </ul>
                            </div>    

                            <div className="navbar-end hidden lg:flex">
                                <Link to='/register' className="btn btn-sm rounded-full text-sm bg-neutral-900 hover:bg-neutral-800 border border-neutral-500 hover:border-neutral-500 px-6 text-neutral-400">SIGN UP</Link>
                                <div className="m-2"></div>
                                <Link to='/login' className="btn btn-sm rounded-full text-sm border border-blue-500 bg-blue-500 hover:border-blue-400 hover:bg-blue-400 text-neutral-100 px-6">LOGIN</Link>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar
