import React from 'react';
import { Link } from "react-router-dom";
import "./Sidebar.css";
import home_icon from "../assets/home_icon.png"
import search_icon from "../assets/search_icon.png"
// import message_icon from "../assets/message_icon.png"
import followrequests_icon from "../assets/followrequests_icon.png"
import notification_icon from "../assets/notification_icon.png"
import create_icon from "../assets/create_icon.png"
import profile_icon from "../assets/profile_icon.png"

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <div className='logo'>
                <Link to={"/"}><span className='logo_span'>HayaApp</span></Link>
            </div>

            <div className='sidebar-btns'>
                <Link to={"/"}><img src={home_icon} alt='home_icon' /><span>Home</span></Link>
                <Link to={"/search"}><img src={search_icon} alt='search_icon' /><span>Search</span></Link>
                <Link to={"/followRequests"}><img src={followrequests_icon} alt='message_icon' /><span>Follow Requests</span></Link>
                <Link to={"/notifications"}><img src={notification_icon} alt='notification_icon' /><span>Notifications</span></Link>
                <Link to={"/create"}><img src={create_icon} alt='create_icon' /><span>Create</span></Link>
                <Link to={"/profile"}><img src={profile_icon} alt='profile_icon' /><span>Profile</span></Link>
            </div>
        </div>
    )
}
