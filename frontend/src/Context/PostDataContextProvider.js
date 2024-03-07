import React, { createContext } from 'react'
import posts_json_data from "../Components/Post/posts_data.json";

const PostsDataContext = createContext();

export default function PostDataContextProvider({ children }) {
    return (
        <>
            <PostsDataContext.Provider value={posts_json_data}>
                {children}
            </PostsDataContext.Provider>
        </>
    )
}

export { PostsDataContext };
