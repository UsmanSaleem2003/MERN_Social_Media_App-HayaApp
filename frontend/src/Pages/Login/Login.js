import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./Login.css";
import haya_logo from "../../Components/assets/haya_logo.png";
// import google_logo from "../../Components/assets/google_icon.png";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                console.log("User Login Successful")
                window.location.href = '/';
            } else {
                setError(data.message);
                setTimeout(() => {
                    setError("");
                }, 2000);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An unexpected error occurred');
        } finally {
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

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Email or Username"
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


                        <button type="submit" name='simple-login' className='login-btn' disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                        {/* <button type="submit" name='google-login' className='login-btn-google' disabled={loading}>{loading ? 'Logging in...' : <div className='google-btn'><img className='google-icon' src={google_logo} alt='google-logo' /><span>Login with Google</span></div>}</button> */}
                    </form>

                    <p className='signup-account'>Don't have an Account? <Link to="/signup" className='signup-account-link'>Create Account</Link ></p>
                </div>
            </div>
        </div>
    );
}
