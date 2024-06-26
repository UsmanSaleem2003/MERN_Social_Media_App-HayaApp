import React, { useEffect, useState } from 'react';
import "./Home.css";
import Post from "../../Components/Post/Post";

export default function Home() {
    const [postsData, setPostsData] = useState([]);
    const [showNoFeed, setShowNoFeed] = useState(false);
    const [currentUserID, setCurrentUserId] = useState("");

    setTimeout(() => {
        setShowNoFeed(true);
    }, 500);


    const getHomeFeed = async () => {
        try {
            const response = await fetch("http://localhost:4000/HomeFeed", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setPostsData(data.postsData);
                setCurrentUserId(data.currentUserID);
                // console.log(data);
            } else {
                throw new Error('Failed to fetch posts');
            }
        } catch (error) {
            console.error("Error in execution of getHomeFeed function:", error);
        }
    };

    useEffect(() => {
        getHomeFeed();
    }, []);

    return (
        <div className='home'>
            {postsData.map(post => (
                <Post key={post.id} post={post} currentUserID={currentUserID} />
            ))}

            {showNoFeed ? <NoFeed /> : <p className='loading'> Wait a while!!! Fetching Feed... </p>}
        </div>
    );
}

function NoFeed() {
    return (
        <div className='no-feed'>
            <div className='no-feed-line'></div>
            <p className='no-feed-text'> No more feed available </p>
            <div className='no-feed-line'></div>
        </div>
    );
}