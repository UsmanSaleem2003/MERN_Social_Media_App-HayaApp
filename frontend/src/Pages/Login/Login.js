import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./Login.css";
import haya_logo from "../../Components/assets/haya_logo.png";
import google_logo from "../../Components/assets/google_icon.png"

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
                    <span className='user-login-span'>User Login</span>

                    <input
                        type="text"
                        placeholder="Username"
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className='show-password'>
                        <label className="show-password-checkbox">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            Show Password
                        </label>
                    </div>


                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <button type="submit" name='simple-login' className='login-btn' disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                        <button type="submit" name='google-login' className='login-btn-google' disabled={loading}>{loading ? 'Logging in...' : <div className='google-btn'><img className='google-icon' src={google_logo} alt='google-logo' /><span>Login with Google</span></div>}</button>
                    </form>

                    <p className='signup-account'>Don't have an Account? <Link to="/signup" className='signup-account-link'>Create Account</Link ></p>
                </div>
            </div>
        </div>
    );
}
