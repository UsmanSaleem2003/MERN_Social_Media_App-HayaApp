import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./FollowRequests.css";

export default function FollowRequests() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const navigate = useNavigate();

    const fetchPendingRequests = async () => {
        try {
            const response = await fetch("http://localhost:4000/pendingFollowRequests", {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.pendingRequests);
                setPendingRequests(data.pendingRequests);
            } else {
                console.error("Failed to fetch pending follow requests");
            }
        } catch (error) {
            console.error("Error fetching pending follow requests:", error);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const acceptFollowRequest = async (followerId) => {
        try {
            const response = await fetch(`http://localhost:4000/acceptFollowRequest/${followerId}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            console.log(data.message);
            fetchPendingRequests();
        } catch (err) {
            console.error("Error accepting follow request:", err);
            throw err;
        }
    }

    const rejectFollowRequest = async (followerId) => {
        try {
            const response = await fetch(`http://localhost:4000/rejectFollowRequest/${followerId}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            console.log(data.message);
            fetchPendingRequests();
        } catch (err) {
            console.error("Error accepting follow request:", err);
            throw err; // Re-throw the error to handle it at a higher level
        }
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

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <div className='follow-requests'>
            <div className='pending-requests'>
                <span className='pending-requests-heading'>Pending Follow Requests</span>
                <span className='clear-requests'>Clear All</span>
            </div>

            <div className='pending-requests-list'>
                {pendingRequests.map((request, index) => (
                    <div key={index} className='pending-request'>
                        <div className='setting' onClick={() => handleUserClick(request.id)}>
                            <img src={`data:image/jpeg;base64,${arrayBufferToBase64(request.profilePic.data)}`} alt="notification-profile-pic" className='notification-profile-pic' />
                            <span className='unique-name'>{request.uniqueName}</span>
                        </div>

                        <div className='btns'>
                            <button className='accept' onClick={() => acceptFollowRequest(request.id)}>Accept</button>
                            <button className='reject' onClick={() => rejectFollowRequest(request.id)}>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
