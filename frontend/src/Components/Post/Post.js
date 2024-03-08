import React, { useState, useEffect } from 'react';
import "./Post.css";
import like_btn from "../assets/like_btn.png";
import comment_btn from "../assets/comment_btn.png";

export default function Post({ post }) {

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

                <img src={post.page_logo} alt='page_logo' className='page-logo-img' />

                <div className='head-titles'>
                    {/* make page title span tag as link */}
                    <span className='page-title'>{post.page_title}</span>
                    <span className='dot'> . </span>
                    <span className='time-ago'> {post.time_ago}</span>
                </div>

                <div className='menu-button' id='menu-button' onClick={handleMenuClick}>
                    <button className='menu-btn'>&#8226;&#8226;&#8226;</button>
                </div>

                {showMenu && (
                    <div className='menu'>
                        <div onClick={() => handleOptionClick('delete')}>Don't Show</div>
                        <div onClick={() => handleOptionClick('report')}><span className='report'>Report</span> </div>
                        <div onClick={() => handleOptionClick('cancel')}>Cancel</div>
                    </div>
                )}
            </div>

            <div className='content-pic'>
                <img src={post.content_pic} alt='content-pic' />
            </div>

            <div className='bottom'>
                <div className='post-buttons'>
                    <img src={like_btn} alt='like_btn' />
                    <img src={comment_btn} alt='comment_btn' />
                </div>

                <span className='likes'>{post.number_of_likes} likes</span>

                <div className='description'>
                    <span id='page-title'>{post.page_title}</span><span id='post-description'> {post.post_description} </span>
                </div>

                <span className='view-comments'>View all {post.number_of_comments} comments</span>

                <div className='comments'>
                    {post.post_comments.map(comment => (
                        <div key={comment.id} className='comment'>
                            <span id='comment-page-title'>{comment['comment-page-title']}</span>
                            <span id='post-comment'> {comment.comment} </span>
                        </div>
                    ))}
                </div>

                <input className='write-comment' type='text' placeholder='Write a comment...' />

            </div>
            <hr />
        </div>
    );
}
