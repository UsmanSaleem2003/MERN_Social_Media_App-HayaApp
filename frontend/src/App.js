import './App.css';
import Home from "./Pages/Home/Home";
import Sidebar from "./Components/Sidebar/Sidebar";
import Messages from "./Pages/Messages/Messages";
import Search from "./Pages/Search/Search";
import Create from "./Pages/Create/Create";
import Notifications from "./Pages/Notifications/Notifications";
import Profile from "./Pages/Profile/Profile";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditProfile from './Pages/EditProfile/EditProfile';

function App() {
  return (
    <BrowserRouter>
      <div className='app-container'>
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
      </div>
    </BrowserRouter>
  );
}

export default App;
