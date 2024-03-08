import React, { useContext } from 'react'
import "./Home.css";
import Post from "../../Components/Post/Post";
import { PostsDataContext } from "../../Context/PostDataContextProvider"


export default function Home() {

    const postsData = useContext(PostsDataContext);
    //home will fetch data from database using server
    //and will map the data on the post component by giving required props to it to make it dynamic 

    return (
        <div className='home'>

            {postsData.map(post => (
                <Post key={post.id} post={post} />
            ))}

        </div>
    )
}
