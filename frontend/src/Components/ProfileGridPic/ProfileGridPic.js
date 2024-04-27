import React from 'react';
import "./ProfileGridPic.css";
import heart_icon from "../../Components/assets/heart_icon.png"
import comment_icon from "../../Components/assets/comment_icon.png"

export default function ProfileGridPic(props) {
    return (
        <div className="grid-item">
            <img src={props.image} alt="Post img" className='ProfileGridImg' />

            <div className="overlay">
                <div className='likes'>
                    <img src={heart_icon} alt='likes' className='heart-icon' />
                    <p className="overlay-text">{props.number_of_likes}</p>
                </div>

                <div className='comments'>
                    <img src={comment_icon} alt='comments' className='heart-icon' />
                    <p className="overlay-text">{props.number_of_comments}</p>
                </div>
            </div>
        </div>
    )
}