import React, { useState, useEffect } from 'react';
import khan from "../../Components/assets/khan.jpg";
import cross_icon from "../../Components/assets/cross_icon.png";
import "./Notifications.css";

export default function Notifications() {

    const [allNotification, setallNotification] = useState([]);

    const updateNotifications = async () => {
        const response = await fetch("http://localhost:4000/getNotifications");

        try {
            if (response.ok) {
                const data = await response.json();
                setallNotification(data);
                console.log(data);
            } else {
                console.error("Failed to fetch notifications");
            }
        } catch (e) {
            console.log("Error Occured : ", e);
        }
    }

    useEffect(() => {
        updateNotifications();
    }, [])

    const timeAgo = (isoTime) => {
        const date = new Date(isoTime);
        const now = new Date();
        const secondsPast = (now.getTime() - date.getTime()) / 1000;

        if (secondsPast < 60) {
            return `${parseInt(secondsPast)} secs ago`;
        } else if (secondsPast < 3600) {
            return `${parseInt(secondsPast / 60)} mins ago`;
        } else if (secondsPast < 86400) {
            return `${parseInt(secondsPast / 3600)} hours ago`;
        } else if (secondsPast < 2592000) {
            return `${parseInt(secondsPast / 86400)} days ago`;
        } else if (secondsPast < 31536000) {
            return `${parseInt(secondsPast / 2592000)} months ago`;
        } else {
            return `${parseInt(secondsPast / 31536000)} years ago`;
        }
    }

    const clearNotifications = async () => {
        const response = await fetch("http://localhost:4000/deleteNotifications", { method: "DELETE" });

        try {
            if (response.ok) {
                setallNotification([]);
            } else {
                console.error("Failed to delete notifications");
            }
        } catch (e) {
            console.log("Error Occured : ", e);
        }
    }

    const deleteNotification = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/deleteNotification/${id}`, { method: "DELETE" });
            if (response.ok) {
                setallNotification(allNotification.filter(notification => notification._id !== id));
            } else {
                console.error("Failed to delete notification");
            }
        } catch (e) {
            console.error("Error Occurred: ", e);
        }
    };

    return (
        <div>
            <div className='notifications'>
                <div className='previous-searches-header'>
                    <span className='previous-searches-heading'>All Notifications</span>
                    <span className='clear-searches' onClick={clearNotifications}>Clear All</span>
                </div>

                {
                    allNotification.map(profileNotification => (
                        <div key={profileNotification._id} className="previous-notification">
                            <img src={khan} alt='notification-profile-pic' className='notification-profile-pic' />
                            <span className='userprofile-name'>Harry <span>{profileNotification.Content}</span></span>
                            <span id='time'> - {timeAgo(profileNotification.time)}</span>
                            <img src={cross_icon} alt="Cross Icon" className="cross-icon" onClick={() => deleteNotification(profileNotification._id)} />
                        </div>
                    ))
                }

            </div>
        </div >
    )
}