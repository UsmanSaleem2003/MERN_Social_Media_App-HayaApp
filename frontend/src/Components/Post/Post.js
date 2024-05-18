import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Post.css";
import like_btn from "../assets/like_btn.png";
import comment_btn from "../assets/comment_btn.png";
import like_button from "../assets/like_button.png";
import cross_icon from "../../Components/assets/cross_icon.png";

export default function Post({ post, currentUserID }) {
    const [postData, setPostData] = useState(post);
    const [comment, setComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [like, setLike] = useState(false);
    const navigate = useNavigate();

    const handleAddLike = async () => {
        try {
            const response = await fetch(`http://localhost:4000/updateLike/${postData.id}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                const newLikesCount = await response.json();
                setLike(!like);
                setPostData(prev => ({
                    ...prev,
                    number_of_likes: newLikesCount
                }));
            }
        } catch (error) {
            console.error("Error adding like:", error);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        try {
            const response = await fetch(`http://localhost:4000/addComment/${postData.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commentDescription: comment }),
                credentials: 'include'
            });
            if (response.ok) {
                const updatedPost = await response.json();
                setPostData(prev => ({
                    ...prev,
                    post_comments: updatedPost.CommentsList,
                    number_of_comments: updatedPost.NOC
                }));
                setComment('');
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const response = await fetch(`http://localhost:4000/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                setPostData(prev => ({
                    ...prev,
                    post_comments: prev.post_comments.filter(comment => comment._id !== commentId),
                    number_of_comments: prev.number_of_comments - 1
                }));
            } else {
                console.error("Failed to delete the comment");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const handleUserClick = (userId) => {
        if (userId === currentUserID) {
            navigate("/profile");
        } else {
            navigate(`/profile/${userId}`);
        }
    };

    return (
        <div className='post'>
            <div className='head'>
                <img src={`data:image/jpeg;base64,${arrayBufferToBase64(postData.page_logo.data)}`}
                    alt='page_logo'
                    className='page-logo-img'
                    onClick={() => handleUserClick(postData.creatorId)} // Assuming `page_owner_id` is the ID you need
                />

                <div className='head-titles'>
                    <span onClick={() => handleUserClick(postData.creatorId)} className='page-title'>{postData.page_title}</span>
                    <span className='time-ago'> - {timeAgo(postData.time_ago)}</span>
                </div>
                <div className='menu-button' id='menu-button'>
                    <button className='menu-btn'>&#8226;&#8226;&#8226;</button>
                </div>
            </div>

            <div className='content-pic'>
                <img onDoubleClick={handleAddLike} src={`data:image/jpeg;base64,${arrayBufferToBase64(postData.content_pic.data)}`} alt="content-pic" />
            </div>

            <div className='bottom'>
                <div className='post-buttons'>
                    <img src={like ? like_button : like_btn} alt='like_btn' onClick={handleAddLike} />
                    <img src={comment_btn} alt='comment_btn' />
                </div>

                <span className='likes'>{postData.number_of_likes} likes</span>

                <div className='description'>
                    <span id='page-title'>{postData.page_title}</span>
                    <span id='post-description'>{postData.post_description}</span>
                </div>

                <span className='view-comments' onClick={toggleComments}>
                    {showComments ? 'Hide Comments' : `View all ${postData.number_of_comments} comments`}
                </span>

                {showComments ?
                    <div className={showComments ? 'comments show' : 'comments'}>
                        {postData.post_comments.map((comment, index) => (
                            <div key={comment.id || index} className='comment'>
                                <img onClick={() => handleUserClick(comment.commentby._id)} src={`data:image/jpeg;base64,${arrayBufferToBase64(comment.commentby.profilePic.data)}`} alt={`${comment.commentby.username}'s profile`} className='comment-user-pic' />
                                <div className='comment-details'>
                                    <span onClick={() => handleUserClick(comment.commentby._id)} id='comment-page-title'>{comment.commentby.uniqueName}</span>
                                    <span id='post-comment'>{comment.commentDescription}</span>
                                </div>
                                {comment.commentby._id === postData.currentUser &&
                                    <button className='delete-comment' onClick={() => handleDeleteComment(postData.id, comment._id)}><img src={cross_icon} alt='cross_sign' className='delete-btn-img' /></button>
                                }
                            </div>
                        ))}
                    </div>
                    : null}

                <input
                    className='write-comment'
                    type='text'
                    placeholder='Write a comment...'
                    value={comment}
                    maxLength={100}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                        }
                    }}
                />

            </div>
            <hr className='post-line' />
        </div>
    );
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

function timeAgo(isoTime) {
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
