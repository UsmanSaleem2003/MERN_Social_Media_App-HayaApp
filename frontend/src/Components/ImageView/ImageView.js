import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ImageView.css';
import like_btn from "../assets/like_btn.png";
import comment_btn from "../assets/comment_btn.png";
import like_button from "../assets/like_button.png";

export default function ImageView() {
    const { imageId } = useParams();
    const [postData, setPostData] = useState(null);
    const [currentUserID, setCurrentUserId] = useState("");
    const [comment, setComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [like, setLike] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/image/${imageId}`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setPostData(data.post);
                    setCurrentUserId(data.currentUserID);
                } else {
                    console.error('Failed to fetch image data');
                }
            } catch (error) {
                console.error('Error fetching image data:', error);
            }
        };

        fetchImageData();
    }, [imageId, comment]);

    const handleAddLike = async () => {
        try {
            const response = await fetch(`http://localhost:4000/updateLike/${postData._id}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                const newLikesCount = await response.json();
                setLike(!like);
                setPostData(prev => ({
                    ...prev,
                    NOL: newLikesCount
                }));
            }
        } catch (error) {
            console.error("Error adding like:", error);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        try {
            const response = await fetch(`http://localhost:4000/addComment/${postData._id}`, {
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

    if (!postData) {
        return <p>Loading...</p>;
    }

    return (
        <div className='image'>
            <div className='head'>
                <img src={`data:image/jpeg;base64,${arrayBufferToBase64(postData.creator.profilePic.data)}`}
                    alt='page_logo'
                    className='page-logo-img'
                    onClick={() => handleUserClick(postData.creator._id)}
                />
                <div className='head-titles'>
                    <span className='page-title' onClick={() => handleUserClick(postData.creator._id)}>{postData.creator.uniqueName}</span>
                    <span className='time-ago'> - {timeAgo(postData.time)}</span>
                </div>
                <div className='menu-button' id='menu-button'>
                    <button className='menu-btn'>&#8226;&#8226;&#8226;</button>
                </div>
            </div>

            <div className='content-pic'>
                <img onDoubleClick={handleAddLike} src={`data:image/jpeg;base64,${arrayBufferToBase64(postData.imageData.data)}`} alt="content-pic" />
            </div>

            <div className='bottom'>
                <div className='post-buttons'>
                    <img src={like ? like_button : like_btn} alt='like_btn' onClick={handleAddLike} />
                    <img src={comment_btn} alt='comment_btn' />
                </div>

                <span className='likes'>{postData.NOL} likes</span>

                <div className='description'>
                    <span id='page-title'>{postData.creator.uniqueName}</span>
                    <span id='post-description'>{postData.description}</span>
                </div>

                <span className='view-comments' onClick={toggleComments}>
                    {showComments ? 'Hide Comments' : `View all ${postData.NOC} comments`}
                </span>

                {showComments ?
                    <div className={showComments ? 'comments show' : 'comments'}>
                        {postData.CommentsList.map((comment, index) => (
                            <div key={comment._id || index} className='comment'>
                                <img onClick={() => handleUserClick(comment.commentby._id)} src={`data:image/jpeg;base64,${arrayBufferToBase64(comment.commentby.profilePic.data)}`} alt={`${comment.commentby.username}'s profile`} className='comment-user-pic' />
                                <div className='comment-details'>
                                    <span onClick={() => handleUserClick(comment.commentby._id)} id='comment-page-title'>{comment.commentby.uniqueName}</span>
                                    <span id='post-comment'>{comment.commentDescription}</span>
                                </div>
                                {comment.commentby._id === postData._id &&
                                    <button className='delete-comment' onClick={() => handleDeleteComment(postData._id, comment._id)}>Delete</button>
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
