import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./Profile.css";
import ProfileGridPic from '../../Components/ProfileGridPic/ProfileGridPic';
import edit_icon from "../../Components/assets/edit_logo.png"
import logout_icon from "../../Components/assets/logout_icon.png"

export default function Profile() {

    const [ProfilePostData, setProfilePostData] = useState([]);
    const [status, setStatus] = useState("");
    const [user, setUser] = useState({});
    const [joiningDate, setJoiningDate] = useState("YYYY/MM/DD");
    const [birthdate, setbirthdate] = useState("YYYY/MM/DD");


    useEffect(() => {
        const getProfilePosts = async () => {
            setStatus("Fetching Posts");
            const response = await fetch("http://localhost:4000/ProfilePostsList", {
                credentials: 'include'
            });
            try {
                if (response.ok) {
                    const data = await response.json();
                    setStatus("");
                    setProfilePostData(data.posts);
                    setUser(data.user);
                    setJoiningDate(formatDate(data.user.time));
                    setbirthdate(formatDate(data.user.birthdate));
                } else {
                    setStatus("Failed to fetch Posts!!! Reload please !")
                    console.error("Failed to fetch profile posts and user data");
                }
            } catch (e) {
                console.log("Error Occured : ", e);
            }
        }
        getProfilePosts();
    }, []);

    const logout = async () => {
        try {
            const response = await fetch("http://localhost:4000/logout", {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                window.location.href = '/login';
            } else {
                alert("Failed to logout");
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert("An unexpected error occurred");
        }
    };

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function formatDate(dateString) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate();
        return `${day}-${month}-${year}`;
    }

    return (
        <div className='profile'>

            <div className='header'>

                {user.profilePic && (
                    <img src={`data:image/jpeg;base64,${arrayBufferToBase64(user.profilePic.data)}`} alt="user-profile pic" className='user-profile-pic' />
                )}

                <div className='content'>

                    <div className='content-upper'>
                        <p className='profile-username'>{user.uniqueName}</p>
                        <Link to={"/editprofile"}><img src={edit_icon} alt='edit_icon' className='edit-icon' /><span className='edit-text'>Edit Profile</span></Link>
                        <button onClick={logout} className="logout-btn"><img src={logout_icon} alt='logout_icon' className='logout-icon' /><span className='logout-text'>Logout</span></button>
                    </div>

                    <div className='content-lower'>
                        <p>{user.posts?.length || 0} posts</p>
                        <p>{user.followers?.length || 0} followers</p>
                        <p>{user.following?.length || 0} following</p>
                    </div>

                    <div className='fullname'>
                        <div className='user-details1'>
                            <span>{user.fullname}</span>
                        </div>
                        <div className='user-details'>
                            <span>Joined : {joiningDate}</span>
                            <span >{user.username}</span>
                            <span >Account-type : {user.account_type}</span>
                            <span>Born : {birthdate}</span>
                        </div>
                    </div>
                </div>
            </div>

            <hr />


            {status && <div className='status'>{status}</div>}
            <div className='posts-grid'>
                {
                    ProfilePostData.map(post => (
                        <ProfileGridPic
                            key={post._id}
                            postId={post._id}
                            image={`data:image/jpeg;base64,${arrayBufferToBase64(post.imageData.data)}`}
                            number_of_comments={post.NOC}
                            number_of_likes={post.NOL}
                        />
                    ))
                }

            </div>
        </div >
    )
}