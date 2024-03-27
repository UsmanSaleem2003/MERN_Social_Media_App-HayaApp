// import React, { useState } from "react";
// import './App.css';
// import Home from "./Pages/Home/Home";
// import Sidebar from "./Components/Sidebar/Sidebar";
// import Messages from "./Pages/Messages/Messages";
// import Search from "./Pages/Search/Search";
// import Create from "./Pages/Create/Create";
// import Notifications from "./Pages/Notifications/Notifications";
// import Profile from "./Pages/Profile/Profile";
// import Login from "./Pages/Login/Login";
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import EditProfile from './Pages/EditProfile/EditProfile';


// function App() {

//   const [isLoggedIn, setisLoggedIn] = useState(false);

//   function handleLogin() {
//     setisLoggedIn(true);
//   }



//   return (
//     <BrowserRouter>
//       <div className='app-container'>
//         {isLoggedIn ? <Sidebar handleLogin={handleLogin} /> : null}
//         <div className='routess'>
//           <Routes>
//             <Route path='/' element={<Login />} />
//             <Route path='/Home' element={<Home />} />
//             <Route path='/search' element={<Search />} />
//             <Route path='/messages' element={<Messages />} />
//             <Route path='/notifications' element={<Notifications />} />
//             <Route path='/create' element={<Create />} />
//             <Route path='/profile' element={<Profile />} />
//             <Route path='/editprofile' element={<EditProfile />} />
//           </Routes>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;



import React, { useState } from 'react';
import "./App.css";
import Home from "./Pages/Home/Home";
import Sidebar from "./Components/Sidebar/Sidebar";
import Messages from "./Pages/Messages/Messages";
import Search from "./Pages/Search/Search";
import Create from "./Pages/Create/Create";
import Notifications from "./Pages/Notifications/Notifications";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditProfile from './Pages/EditProfile/EditProfile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (isLogged) => {
    console.log(isLoggedIn);
    setIsLoggedIn(isLogged);
    console.log(isLoggedIn);
  };

  return (
    <BrowserRouter>
      <div className='app-container'>
        {isLoggedIn && <Sidebar />}
        <div className='routess'>
          <Routes>
            {isLoggedIn ? <Route path='/' element={<Home />} /> : <Route path='/' element={<Login onLogin={handleLogin} />} />}
            <Route path='/search' element={<Search />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/notifications' element={<Notifications />} />
            <Route path='/create' element={<Create />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/editprofile' element={<EditProfile />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
