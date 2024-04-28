import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./Profile.css";
import ProfileGridPic from '../../Components/ProfileGridPic/ProfileGridPic';
import khan from "../../Components/assets/khan.jpg";
import edit_icon from "../../Components/assets/edit_logo.png"
import logout_icon from "../../Components/assets/logout_icon.png"

export default function Profile() {

    const [ProfilePostData, setProfilePostData] = useState([]);
    const [status, setStatus] = useState("");
    const [user, setUser] = useState({});

    const getProfilePosts = async () => {
        setStatus("Fetching Posts");
        const response = await fetch("http://localhost:4000/ProfilePostsList", {
            credentials: 'include'
        });

        try {
            if (response.ok) {
                const data = await response.json();
                // console.log("Fetched posts data:", data);
                setStatus("");
                setProfilePostData(data.posts);
                setUser(data.user);
                console.log(data.user);
            } else {
                setStatus("Failed to fetch Posts!!! Reload please !")
                console.error("Failed to fetch profile posts and user data");
            }
        } catch (e) {
            console.log("Error Occured : ", e);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getProfilePosts();
        };

        fetchData();
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

    return (
        <div className='profile'>

            <div className='header'>

                <img src={khan} alt="user-profile pic" className='user-profile-pic' />

                <div className='content'>

                    <div className='content-upper'>
                        <p className='profile-username'>{user.username}</p>
                        <Link to={"/editprofile"}><img src={edit_icon} alt='edit_icon' className='edit-icon' /><span className='edit-text'>Edit Profile</span></Link>
                        <button onClick={logout}><img src={logout_icon} alt='logout_icon' className='logout-icon' /><span className='edit-text'>Logout</span></button>
                    </div>

                    <div className='content-lower'>
                        <p>{user.posts?.length || 0} posts</p>
                        <p>{user.followers?.length || 0} followers</p>
                        <p>{user.following?.length || 0} following</p>
                    </div>

                    <div className='fullname'>
                        <p>{user.fullname}</p>
                    </div>
                </div>
            </div>

            <hr />


            {/* fetch data from database and map it using ProfileGridPic
            component */}
            <div>{status}</div>
            <div className='posts-grid'>
                {
                    ProfilePostData.map(post => (
                        <ProfileGridPic
                            key={post._id}
                            image={`data:image/jpeg;base64,${arrayBufferToBase64(post.imageData.data)}`}
                            number_of_comments={post.NOC} // Assuming CommentsList is an array of comments
                            number_of_likes={post.NOL}
                        />
                    ))
                }

            </div>
        </div >
    )
}