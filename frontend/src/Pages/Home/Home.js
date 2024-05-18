import React, { useEffect, useState } from 'react';
import "./Home.css";
import Post from "../../Components/Post/Post";

export default function Home() {
    const [postsData, setPostsData] = useState([]);
    const [showNoFeed, setShowNoFeed] = useState(false);

    setTimeout(() => {
        setShowNoFeed(true);
    }, 2000);


    const getHomeFeed = async () => {
        try {
            const response = await fetch("http://localhost:4000/HomeFeed", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const posts = await response.json();
                setPostsData(posts);
                console.log(posts);
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
                <Post key={post.id} post={post} />
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