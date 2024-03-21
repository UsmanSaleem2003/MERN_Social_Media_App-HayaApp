import React from 'react';
import khan from "../../Components/assets/khan.jpg";
import cross_icon from "../../Components/assets/cross_icon.png";
import "./Notifications.css";

export default function Notifications() {
    return (
        <div>
            <div className='notifications'>
                <div className='previous-searches-header'>
                    <span className='previous-searches-heading'>All Notifications</span>
                    <span className='clear-searches'>Clear All</span>
                </div>

                {/* get notifications from user's schema and map them here */}
                <div className="previous-notification">
                    <img src={khan} alt='notification-profile-pic' className='notification-profile-pic' />
                    <span className='userprofile-name'>Harry <span>Liked your pic</span></span>
                    <img src={cross_icon} alt="Cross Icon" className="cross-icon" />
                </div>

                {/* all below are dummy notifications */}
                <div className="previous-notification">
                    <img src={khan} alt='notification-profile-pic' className='notification-profile-pic' />
                    <span className='userprofile-name'>Harry <span>Commented on your pic</span></span>
                    <img src={cross_icon} alt="Cross Icon" className="cross-icon" />
                </div>
                <div className="previous-notification">
                    <img src={khan} alt='notification-profile-pic' className='notification-profile-pic' />
                    <span className='userprofile-name'>Harry <span>Commented on your pic</span></span>
                    <img src={cross_icon} alt="Cross Icon" className="cross-icon" />
                </div>
                <div className="previous-notification">
                    <img src={khan} alt='notification-profile-pic' className='notification-profile-pic' />
                    <span className='userprofile-name'>Harry <span>Commented on your pic</span></span>
                    <img src={cross_icon} alt="Cross Icon" className="cross-icon" />
                </div>
                <div className="previous-notification">
                    <img src={khan} alt='notification-profile-pic' className='notification-profile-pic' />
                    <span className='userprofile-name'>Harry <span>Commented on your pic</span></span>
                    <img src={cross_icon} alt="Cross Icon" className="cross-icon" />
                </div>
                <div className="previous-notification">
                    <img src={khan} alt='notification-profile-pic' className='notification-profile-pic' />
                    <span className='userprofile-name'>Harry <span>Commented on your pic</span></span>
                    <img src={cross_icon} alt="Cross Icon" className="cross-icon" />
                </div>
                <div className="previous-notification">
                    <img src={khan} alt='notification-profile-pic' className='notification-profile-pic' />
                    <span className='userprofile-name'>Harry <span>Commented on your pic</span></span>
                    <img src={cross_icon} alt="Cross Icon" className="cross-icon" />
                </div>
                <div className="previous-notification">
                    <img src={khan} alt='notification-profile-pic' className='notification-profile-pic' />
                    <span className='userprofile-name'>Harry <span>Commented on your pic</span></span>
                    <img src={cross_icon} alt="Cross Icon" className="cross-icon" />
                </div>

            </div>
        </div>
    )
}
