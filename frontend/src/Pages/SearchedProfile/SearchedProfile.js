import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./SearchedProfile.css";

export default function SearchedProfile() {
    const { userId } = useParams();  // Get userId from URL parameter
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/SearchedUser/${userId}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setUserData(data);
                    console.log(data);
                } else {
                    throw new Error(data.message || "Failed to fetch user data");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {userData ? (
                <div>
                    <h1>{userData.fullname}</h1>
                    <p>Username: {userData.username}</p>
                    <p>Unique Name: {userData.uniqueName}</p>
                    <p>Gender: {userData.gender}</p>
                </div>
            ) : (
                <p>User not found.</p>
            )}
        </div>
    );
}
