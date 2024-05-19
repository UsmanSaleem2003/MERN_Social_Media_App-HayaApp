import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Posts.css";
import Modal from './ConfirmationModal/Modal';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {
        fetch('http://localhost:4000/server-posts')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
    }, []);


    const handleDelete = (id) => {
        setSelectedPostId(id);
        setIsModalOpen(true);
    };


    const confirmDelete = (id) => {
        fetch(`http://localhost:4000/server-posts/${selectedPostId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    // Remove the deleted post from the state
                    setPosts(posts.filter(post => post._id !== selectedPostId));

                    // Close the modal
                    setIsModalOpen(false);
                } else {
                    console.error('Error deleting post:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting post:', error))
            .finally(() => {
                setSelectedPostId(null);
            });
    };

    const handleViewProfile = (id) => {
        navigate(`/profile/${id}`);
    };

    const handleViewPost = (id) => {
        navigate(`/posts/${id}`);
    };


    return (
        <div className='posts'>
            <button className='back-btn' onClick={() => navigate('/')}>Back</button>
            <h2>Haya Posts</h2>
            <table className='posts-table'>
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Creator</th>
                        <th>Description</th>
                        <th>Likes</th>
                        <th>Comments</th>
                        <th>Date</th>
                        <th>View Post</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post, index) => (
                        <tr key={post._id}>
                            <td>{index + 1}</td>
                            <td className='viewProfile' onClick={() => handleViewProfile(post.creator._id)}>
                                {/* <td> */}
                                {post.creator.uniqueName}
                                <span className="tooltip-text">View profile</span>

                            </td>
                            <td>{post.description}</td>
                            <td>{post.NOL}</td>
                            <td>{post.NOC}</td>
                            <td>{new Date(post.time).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleViewPost(post._id)}>View</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(post._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
            >
                Are you sure you want to delete this user?
            </Modal>
        </div>
    );
}
