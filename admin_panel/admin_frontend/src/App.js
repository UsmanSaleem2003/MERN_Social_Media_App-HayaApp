// import React, { useState, useEffect } from 'react';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from "./Pages/Home/Home";
import Search from "./Pages/Search/Search";
// import Sidebar from "./Components/Sidebar/Sidebar";
import Profile from "./Pages/Profile/Profile";
import Users from "./Pages/Users/Users";
import Posts from "./Pages/Posts/Posts";


function App() {
  return (
    <BrowserRouter>
      <div className='app-container'>
        {/* <Sidebar /> */}
        <div className='routess'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:postId" element={<Profile />} />
            <Route path="*" element={<Navigate replace to="/" />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            {/* <Route path="/notifications" element={<Notifications />} /> */}
            {/* <Route path="/create" element={<Create />} /> */}
            {/* <Route path="/create" element={<CreateAdd />} /> this Create component will be used to create advertisements or announcements */}
            {/* <Route path="/editprofile" element={<EditProfile />} /> */}
            {/* <Route path="/profile/:userId" element={<SearchedProfile />} />
          <Route path="/image/:imageId" element={<ImageView />} />
          <Route path="/profile/:userId/image/:imageId" element={<ImageView />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
