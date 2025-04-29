import { Routes, Route } from 'react-router-dom';
import {
  Home,
  Login,
  Register,
  NotFound,
  Supplies,
  Suppliers,
  ForgotPassword,
  Profile,
  Users
} from '../views';

function AppRoutes() {
  return (
    <Routes>
      <Route index path='/' element={<Home />} />
      <Route index path='/login' element={<Login />} />
      <Route index path='/register' element={<Register />} />
      <Route index path='/supplies' element={<Supplies />} />
      <Route index path='/suppliers' element={<Suppliers />} />
      <Route index path='/forgot' element={<ForgotPassword />} />
      <Route index path='/profile' element={<Profile />} />
      <Route index path='/users' element={<Users />} />
      <Route index path='*' element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
