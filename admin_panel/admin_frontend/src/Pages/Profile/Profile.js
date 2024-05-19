import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./Profile.css";

export default function Profile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4000/server-users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(error => console.error('Error fetching user:', error));
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
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

    return (
        <div className="profile-card">
            <img src={`data:image/png;base64,${arrayBufferToBase64(user.profilePic.data)}`} alt={`${user.username}'s profile`} className="profile-pic" />
            <h2>{user.fullname}</h2>
            <p><strong>Username : </strong> {user.username}</p>
            <p><strong>Unique Name : </strong> {user.uniqueName}</p>
            <p><strong>Date Joined : </strong> {new Date(user.time).toLocaleDateString()}</p>
            <p><strong>Birthdate : </strong> {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Account Type : </strong> {user.account_type}</p>
            <p><strong>Gender : </strong> {user.gender}</p>
            <p><strong>Followers : </strong> {user.followers.length}</p>
            <p><strong>Following : </strong> {user.following.length}</p>
            <p><strong>Posts : </strong> {user.posts.length}</p>
        </div>
    );
}
