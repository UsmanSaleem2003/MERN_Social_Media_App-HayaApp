import './App.css';
import Home from "./Pages/Home/Home";
import Sidebar from "./Components/Sidebar/Sidebar";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Home />} />
          <Route path='/messages' element={<Home />} />
          <Route path='/notifications' element={<Home />} />
          <Route path='/create' element={<Home />} />
          <Route path='/profile' element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
