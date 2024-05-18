import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./SearchedProfile.css";
import ProfileGridPic from '../../Components/ProfileGridPic/ProfileGridPic';

export default function SearchedProfile() {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [following, setFollowing] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [accountType, setAccountType] = useState("");
    const [joiningDate, setJoiningDate] = useState("YYYY/MM/DD");
    const [birthdate, setbirthdate] = useState("YYYY/MM/DD");
    const [postsData, setpostsData] = useState([]);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/SearchedUser/${userId}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setUserData(data.user);
                    setpostsData(data.postsData);
                    setFollowing(data.following);
                    setbirthdate(formatDate(data.user.birthdate));
                    setJoiningDate(formatDate(data.user.time));
                    setRequestSent(data.pendingRequest);
                    setAccountType(data.user.account_type);
                } else {
                    throw new Error(data.message || "Failed to fetch user data");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleFollowRequest = async () => {
        try {
            const response = await fetch(`http://localhost:4000/sendFollowRequest/${userId}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setRequestSent(true);
        } catch (err) {
            setError(err.message);
        }
    }

    const handleUnfollowRequest = async () => {
        try {
            const response = await fetch(`http://localhost:4000/unfollow/${userId}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setFollowing(false);
            setRequestSent(false);
        } catch (err) {
            setError(err.message);
        }
    }

    const handleRequestCancel = async () => {
        try {
            const response = await fetch(`http://localhost:4000/requestCancel/${userId}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setFollowing(false);
            setRequestSent(false);
        } catch (err) {
            setError(err.message);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                {userData && userData.profilePic && (

                    <img src={`data:image/jpeg;base64,${arrayBufferToBase64(userData.profilePic.data)}`} alt="user-profile pic" className='user-profile-pic' />

                )}
                <div className='content'>
                    <div className='content-upper'>
                        <p className='profile-username'>{userData ? userData.uniqueName : "User"}</p>
                        {following ? (
                            <button className="action-btn" onClick={handleUnfollowRequest}>Unfollow</button>
                        ) : requestSent ? (
                            <button className="action-btn" onClick={handleRequestCancel}>Request Sent</button>
                        ) : (
                            <button className="action-btn" onClick={handleFollowRequest}>Follow</button>
                        )}
                    </div>

                    <div className='content-lower'>
                        <p>{userData.posts?.length || 0} posts</p>
                        <p>{userData.followers?.length || 0} followers</p>
                        <p>{userData.following?.length || 0} following</p>
                    </div>

                    <div className='fullname'>
                        <div className='user-details1'>
                            <span>{userData.fullname}</span>
                        </div>

                        {following || accountType === "public" ? (
                            <div className='user-details'>
                                <span>Joined : {joiningDate}</span>
                                <span>{userData.username}</span>
                                <span>Account-type : {userData.account_type}</span>
                                <span>Born : {birthdate}</span>
                            </div>
                        ) : null}

                    </div>
                </div>
            </div>

            <hr />

            {
                following || accountType === "public" ?
                    <div className='posts-grid'>
                        {
                            postsData.map(post => (
                                <ProfileGridPic
                                    key={post._id}
                                    image={`data:image/jpeg;base64,${arrayBufferToBase64(post.imageData.data)}`}
                                    number_of_comments={post.NOC}
                                    number_of_likes={post.NOL}
                                />
                            ))
                        }

                    </div>
                    :
                    <div className='private-account-text'>
                        <p>User's profile is private</p>
                        <p>Kindly follow the user to see their content</p>
                    </div>
            }

        </div >
    );
}
