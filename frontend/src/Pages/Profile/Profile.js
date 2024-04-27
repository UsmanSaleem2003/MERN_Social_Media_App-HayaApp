import React from 'react';
import { Link } from "react-router-dom";
import "./Profile.css";
import ProfileGridPic from '../../Components/ProfileGridPic/ProfileGridPic';
import khan from "../../Components/assets/khan.jpg";
import edit_icon from "../../Components/assets/edit_logo.png"
import logout_icon from "../../Components/assets/logout_icon.png"

export default function Profile() {


    return (
        <div className='profile'>

            <div className='header'>

                <img src={khan} alt="user-profile pic" className='user-profile-pic' />

                <div className='content'>

                    <div className='content-upper'>
                        <p className='profile-username'>usman.saleem.252</p>
                        <Link to={"/editprofile"}><img src={edit_icon} alt='edit_icon' className='edit-icon' /><span className='edit-text'>Edit Profile</span></Link>
                        <Link to={"/"}><img src={logout_icon} alt='logout_icon' className='logout-icon' /><span className='edit-text'>Logout</span></Link>
                    </div>

                    <div className='content-lower'>
                        <p>2 posts</p>
                        <p>139 followers</p>
                        <p>1,122 following</p>
                    </div>


                    <div className='fullname'>
                        <p>Muhammad Usman Saleem</p>
                    </div>
                </div>
            </div>

            <hr />


            {/* fetch data from database and map it using ProfileGridPic
            component */}
            <div className='posts-grid'>
                <ProfileGridPic
                    image={khan}
                    number_of_comments="1k"
                    number_of_likes="12k"
                />
                <ProfileGridPic
                    image={khan}
                    number_of_comments="1k"
                    number_of_likes="12k"
                />
                <ProfileGridPic
                    image={khan}
                    number_of_comments="1k"
                    number_of_likes="12k"
                />
            </div>
        </div >
    )
}
