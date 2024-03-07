import React from 'react'
import "./Home.css";
import Post from "../../Components/Post/Post";


export default function Home() {

    //home will fetch data from database using server
    //and will map the data on the post component by giving required props to it to make it dynamic 

    return (
        <div className='home'>
            <Post />
        </div>
    )
}
