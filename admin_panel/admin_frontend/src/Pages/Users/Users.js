import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Users.css";
import Modal from './ConfirmationModal/Modal';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:4000/server-users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleDelete = (id) => {
        setSelectedUserId(id);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        fetch(`http://localhost:4000/server-users/${selectedUserId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    setUsers(users.filter(user => user._id !== selectedUserId));
                } else {
                    console.error('Error deleting user:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting user:', error))
            .finally(() => {
                setIsModalOpen(false);
                setSelectedUserId(null);
            });
    };

    const handleViewProfile = (id) => {
        navigate(`/profile/${id}`);
    };


    return (
        <div className='users'>
            <button className='back-btn' onClick={() => navigate('/')}>Back</button>
            <h2 className='users-heading'>Haya Users</h2>
            <table className='users-table'>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Unique Name</th>
                        <th>Full Name</th>
                        <th>Date Joined</th>
                        <th>Birthdate</th>
                        <th>Followers</th>
                        <th>Followings</th>
                        <th>Posts</th>
                        <th>Account</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td className='viewProfile' onClick={() => handleViewProfile(user._id)}>
                                {user.username}
                                <span className="tooltip-text">View profile</span>
                            </td>
                            <td className='viewProfile' onClick={() => handleViewProfile(user._id)}>
                                {user.uniqueName}
                                <span className="tooltip-text">View profile</span>
                            </td>
                            <td>{user.fullname}</td>
                            <td>{new Date(user.time).toLocaleDateString()}</td>
                            <td>{user.birthdate ? new Date(user.birthdate).toLocaleDateString() : ''}</td>
                            <td>{user.followers.length}</td>
                            <td>{user.following.length}</td>
                            <td>{user.posts.length}</td>
                            <td>{user.account_type}</td>
                            <td>
                                <div className='button-container'>
                                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                                </div>
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

