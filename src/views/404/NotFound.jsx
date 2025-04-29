import { useEffect } from "react";
import { Link } from "react-router-dom";

function NotFound() {
  useEffect(() => {
    document.title = 'Not Found';
  },[]);

  return (<div className="flex justify-center items-center flex-col h-[calc(100vh-200px)] text-center">
    <div className="text-8xl sm:text-9xl font-black text-center">404</div>
    <div className="text-2xl sm:text-4xl tracking-[10px] text-center">&nbsp;Not Found</div>
    <Link to='/' className="btn btn-wide mt-6 text-center">HOME</Link>
  </div>)
}

export default NotFound;
