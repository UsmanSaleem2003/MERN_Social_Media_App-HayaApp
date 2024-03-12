import React, { useContext, useEffect } from 'react'
import "./Home.css";
import Post from "../../Components/Post/Post";
import { PostsDataContext } from "../../Context/PostDataContextProvider"

export default function Home() {

    const postsData = useContext(PostsDataContext);
    //home will fetch data from database using server
    //and will map the data on the post component by giving required props to it to make it dynamic 

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const halfScreenHeight = window.innerHeight / 2;

            if (scrollPosition > halfScreenHeight) {
                document.body.classList.add('scrollTop-btn-visible');
            } else {
                document.body.classList.remove('scrollTop-btn-visible');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className='home'>

            {postsData.map(post => (
                <Post key={post.id} post={post} />
            ))}

            <button className="scroll-to-top" onClick={scrollToTop}>
                <span>&#8593;</span>
            </button>

        </div>
    )
}
