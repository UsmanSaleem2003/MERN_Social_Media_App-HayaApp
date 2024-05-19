import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();
    return (
        <div className='home'>
            <span className='logo'>Haya Admin Panel</span>
            <div className='admin-home'>
                <button className='admin-btn' onClick={() => navigate('/users')}>Users</button>
                <button className='admin-btn' onClick={() => navigate('/posts')}>Posts</button>
            </div>
        </div>
    );
}
