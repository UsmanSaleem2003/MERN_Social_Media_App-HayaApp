import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css";
import Home from "./Pages/Home/Home";
import FollowRequests from "./Pages/FollowRequests/FollowRequests";
import Search from "./Pages/Search/Search";
import Create from "./Pages/Create/Create";
import Sidebar from "./Components/Sidebar/Sidebar";
import Notifications from "./Pages/Notifications/Notifications";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import EditProfile from './Pages/EditProfile/EditProfile';
import SearchedProfile from "./Pages/SearchedProfile/SearchedProfile";
import ImageView from "./Components/ImageView/ImageView";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:4000/check-auth', {
        credentials: 'include'
      });
      const data = await response.json();
      setIsLoggedIn(data.isAuthenticated);
    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className='app-container'>
        {isLoggedIn && <Sidebar />}
        <div className='routess' style={{ marginLeft: isLoggedIn ? '200px' : '0px' }}>
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/followRequests" element={<FollowRequests />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/create" element={<Create />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/editprofile" element={<EditProfile />} />
                <Route path="/profile/:userId" element={<SearchedProfile />} />
                <Route path="/image/:imageId" element={<ImageView />} />
                <Route path="/profile/:userId/image/:imageId" element={<ImageView />} />
                <Route path="*" element={<Navigate replace to="/" />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate replace to="/login" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
