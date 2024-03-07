import React, { useState, useEffect } from 'react';
import "./Post.css";
import mypic from "../assets/mypic.jpg";
import khan from "../assets/khan.jpg";
import like_btn from "../assets/like_btn.png";
import comment_btn from "../assets/comment_btn.png";


export default function Post() {
    const [showMenu, setShowMenu] = useState(false);

    const handleMenuClick = () => {
        setShowMenu(!showMenu);
    };

    const handleOptionClick = (option) => {
        // Handle the selected option (e.g., delete post, report)

        console.log(`Selected option: ${option}`);

        // You can perform the corresponding action here
        // For example, you can delete the post or show a report modal
        // ...

        // Close the menu after handling the option
        setShowMenu(false);
    };


    const handleGlobalClick = (event) => {
        // Check if the click is outside the menu
        const menuButton = document.getElementById('menu-button');
        if (menuButton && !menuButton.contains(event.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowMenu(false);
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('click', handleGlobalClick);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);





    return (
        <div className='post'>

            <div className='head'>
                <img src={khan} alt='page_logo' className='page-logo-img' />

                <div className='head-titles'>
                    {/* make page title span tag as link */}
                    <span className='page-title'>Page Title or Username </span>
                    <span className='dot'> . </span>
                    <span className='time-ago'> Time Ago</span>
                </div>

                <div className='menu-button' id='menu-button' onClick={handleMenuClick}>
                    <button className='menu-btn'>&#8226;&#8226;&#8226;</button>
                </div>

                {showMenu && (
                    <div className='menu'>
                        <div onClick={() => handleOptionClick('delete')}>Don't Show</div>
                        <div onClick={() => handleOptionClick('report')}><span className='report'>Report</span> </div>
                        <div onClick={() => handleOptionClick('cancel')}>Cancel</div>
                        {/* Add more options as needed */}
                    </div>
                )}
            </div>

            <div className='content-pic'>
                <img src={khan} alt='content-pic' />
            </div>

            <div className='bottom'>
                <div className='post-buttons'>
                    <img src={like_btn} alt='like_btn' />
                    <img src={comment_btn} alt='comment_btn' />
                </div>

                <span className='likes'>987,165 likes</span>

                <div className='description'>
                    <span id='page-title'>(page-title)</span><span id='post-description'> (description description description) </span>
                </div>

                <span className='view-comments'>View all 418 comments</span>

                <div className='commments'>
                    <span id='page-title'>(page-title)</span><span id='post-comments'> (comment description jdjbf jsnf ndjfknjksn f)</span>
                </div>

                <input className='write-comment' type='text' placeholder='Write a comment...' />
            </div>

            <hr />

        </div>
    );
}
