
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/Homepage/Home';
import About from './pages/Homepage/About';
import Login from './pages/Authpage/Login';
import SignUp from './pages/Authpage/Signup';
import ResetPassword from './pages/Authpage/ResetPassword';
import EmailVerify from './pages/Authpage/EmailVerify';
import GetStarted from './pages/Homepage/GetStarted';
import Profile from './pages/Homepage/Profile';
import Library from './pages/Homepage/Library';
import WelcomePage from './pages/Homepage/WelcomePage';
import ForgotPassword from './pages/Authpage/ForgotPassword';
import Navbar from './Components/Navbar';
import { useAuth } from './Context/Authcontext';
import BookProfile from './pages/Homepage/BookProfile';
import Cart from './pages/Homepage/Cart';
import Wishlist from './pages/Homepage/Wishlist';
import EditProfile from './pages/Homepage/EditProfile';
import Categoriespage from './pages/Homepage/Categoriespage';
import BackButton from './Components/BackButton';



function App() {
  
const {user} = useAuth();
  const location = useLocation();

  const hideNavbarRoutes =["/","/login","/register","/getstarted","/signup","/forgot-password","/reset-password","/verify-email"];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    < >
    <div className='background'>
      <BackButton/>
   {!hideNavbar  &&  <Navbar/>}
      <Routes>
        <Route path='/' element={<WelcomePage/>}/>
        <Route path='/getstarted' element={<GetStarted/>}/>
       <Route path='/home' element={<Home />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/forgot-password' element={<ForgotPassword />}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
        <Route path='/verify-email' element={<EmailVerify />}/>
        <Route path='/book/:id' element={<BookProfile />}/>
         <Route path='/profile' element={<Profile />}/>
          <Route path='/library' element={<Library />}/>
           <Route path='/cart' element={<Cart/>}/>
            <Route path='/wishlist/' element={<Wishlist />}/>
             <Route path='/edit-profile' element={<EditProfile />}/>
              <Route path='/categories' element={<Categoriespage />}/>
      </Routes>
    </div>
    </>
  );
}

export default App;
