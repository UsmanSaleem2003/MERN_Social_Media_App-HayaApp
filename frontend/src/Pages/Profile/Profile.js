import React from 'react';
import { Link } from "react-router-dom";
import "./Profile.css";
import khan from "../../Components/assets/khan.jpg";
import edit_icon from "../../Components/assets/edit_logo.png"

export default function Profile() {
    return (
        <div className='profile'>

            <div className='header'>
                <img src={khan} alt="user-profile pic" className='user-profile-pic' />

                <div className='content'>

                    <div className='content-upper'>
                        <p className='profile-username'>usman.saleem.252</p>
                        <Link to={"/editprofile"}><img src={edit_icon} alt='edit_icon' className='edit-icon' /><span className='edit-text'>Edit Profile</span></Link>
                    </div>

                    <div className='content-lower'>
                        <p>2 posts</p>
                        <p>139 followers</p>
                        <p>1,122 following</p>
                    </div>

                </div>

            </div>

            <hr />
            <div className='posts-grid'>
                <div className="post-item">
                    <img src={khan} alt='post-pic' />
                    <div className="overlay-text">Text Here</div>
                </div>
                <div className="post-item">
                    <img src={khan} alt='post-pic' />
                    <div className="overlay-text">Text Here</div>
                </div>
                <div className="post-item">
                    <img src={khan} alt='post-pic' />
                    <div className="overlay-text">Text Here</div>
                </div>
                <div className="post-item">
                    <img src={khan} alt='post-pic' />
                    <div className="overlay-text">Text Here</div>
                </div>
                <div className="post-item">
                    <img src={khan} alt='post-pic' />
                    <div className="overlay-text">Text Here</div>
                </div>
                {/* Add more items as needed */}
            </div>

        </div >
    )
}
