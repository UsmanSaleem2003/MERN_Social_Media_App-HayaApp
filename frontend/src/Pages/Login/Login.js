import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./Login.css";
import haya_logo from "../../Components/assets/haya_logo.png";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Show loading state
        setLoading(true);

        // Simulate API call for login
        try {
            // Make API call for login
            // Replace this with your actual login API call
            // For example:
            // const response = await fetch('/api/login', {
            //     method: 'POST',
            //     body: JSON.stringify({ username, password }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });
            // const data = await response.json();
            // Check if login is successful
            // if (response.ok) {
            //     onLogin(true);
            // } else {
            //     setError('Invalid username or password');
            // }

            // Simulate successful login after 1 second

            onLogin(true);
        } catch (error) {
            // Handle error
            console.error('Login error:', error);
            setError('An unexpected error occurred');
        } finally {
            // Hide loading state
            setLoading(false);
        }
    };

    return (
        <div className='login'>
            <div className='left-part'>
                <img src={haya_logo} alt="Haya Logo" className="logo" />
            </div>

            <div className='right-part'>
                <div className="login-form">
                    <span>User Login</span>
                    {/* Use controlled components for the input fields */}
                    <input
                        type="text"
                        placeholder="Username"
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Display error message if login fails */}
                    {error && <div className="error-message">{error}</div>}

                    {/* Use onSubmit event handler for the form */}
                    <form onSubmit={handleSubmit}>
                        <button type="submit" className='login-btn' disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                    </form>

                    <Link to="/signup">Create Account</Link >
                </div>
            </div>
        </div>
    );
}
