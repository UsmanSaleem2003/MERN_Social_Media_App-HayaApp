import React, { useState } from 'react';
import "./App.css";
import Home from "./Pages/Home/Home";
import Messages from "./Pages/Messages/Messages";
import Search from "./Pages/Search/Search";
import Create from "./Pages/Create/Create";
import Sidebar from "./Components/Sidebar/Sidebar";
import Notifications from "./Pages/Notifications/Notifications";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import SSignup from "./Pages/SSignup/SSignup";
// import Signup from "./Pages/Signup/Signup";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditProfile from './Pages/EditProfile/EditProfile';

function AuthenticatedRoutes() {
  return (
    <>
      <Sidebar />
      <div className='routess'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/create' element={<Create />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/editprofile' element={<EditProfile />} />
        </Routes>
      </div>
    </>
  );
}

function UnauthenticatedRoutes({ handleLogin }) {
  return (
    <Routes>
      <Route path='/' element={<Login onLogin={handleLogin} />} />
      {/* <Route path='/signup' element={<Signup />} /> */}
      <Route path='/signup' element={<SSignup />} />
    </Routes>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (isLogged) => {
    setIsLoggedIn(isLogged);
  };

  return (
    <BrowserRouter>
      <div className='app-container'>
        {/* Pass handleLogin to UnauthenticatedRoutes */}
        {/* {isLoggedIn ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes handleLogin={handleLogin} />} */}
        {/* ........ for frontend development without login/signup/logout.....for testing frontend APIs */}
        <AuthenticatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
