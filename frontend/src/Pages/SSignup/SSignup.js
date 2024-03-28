import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./SSignup.css";
import haya_logo from "../../Components/assets/haya_logo.png";
import google_logo from "../../Components/assets/google_icon.png"
import image_logo from "../../Components/assets/image_logo.png"


export default function SSignup({ onsignup }) {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [gender, setGender] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [accountCategory, setAccountCategory] = useState("public");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Show loading state
        setLoading(true);

        // Simulate API call for signup
        try {
            // Make API call for signup
            // Replace this with your actual signup API call
            // For example:
            // const response = await fetch('/api/signup', {
            //     method: 'POST',
            //     body: JSON.stringify({ username, password }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });
            // const data = await response.json();
            // Check if signup is successful
            // if (response.ok) {
            //     onsignup(true);
            // } else {
            //     setError('Invalid username or password');
            // }

            // Simulate successful signup after 1 second

            onsignup(true);
        } catch (error) {
            // Handle error
            console.error('signup error:', error);
            setError('An unexpected error occurred');
        } finally {
            // Hide loading state
            setLoading(false);
        }
    };

    return (
        <div className='signup'>
            <div className='left-part'>
                <img src={haya_logo} alt="Haya Logo" className="logo" />
            </div>

            <div className='signup-right-part'>
                <div className="signup-form">
                    <span className='user-signup-span'>User Signup</span>

                    <input
                        type='text'
                        className='input-field'
                        value={fullName}
                        name='fullName'
                        placeholder='Your Full Name'
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="input-field"
                        value={username}
                        name='username'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="input-field"
                        value={password}
                        name='password'
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        className='input-field'
                        value={confirmedPassword}
                        name='confirmedPassword'
                        placeholder='Re-Enter Your Password'
                        onChange={(e) => setConfirmedPassword(e.target.value)}
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

                    <div className='signup-selections'>
                        <div className='signup-selections'>
                            <label htmlFor="gender-selection">Select Gender : </label>
                            <div className="select-container">
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className="arrow">&#9660;</div>
                            </div>
                        </div>


                        <label className='account-type-selection' htmlFor="account-type-selection">Select Account Type : </label>
                        <div className="select-container">
                            <select
                                value={accountCategory}
                                onChange={(e) => setAccountCategory(e.target.value)}
                            >
                                <option value="public">Public Account</option>
                                <option value="private">Private Account</option>
                            </select>
                            <div className="arrow">&#9660;</div>
                        </div>
                    </div>

                    <div className='birthdate'>
                        <label className='birthdate-label'>Select Birthdate : </label>
                        <input
                            type='date'
                            className='input-field'
                            value={birthdate}
                            name='birthdate'
                            placeholder='Birthdate'
                            onChange={(e) => setBirthdate(e.target.value)}
                        />
                    </div>

                    <div className='image-upload-container'>
                        <input
                            type='file'
                            className='signup-image-input-field'
                            accept='image/*'
                            onChange={(e) => setProfilePicture(e.target.files[0])}
                        />
                        {profilePicture ? (
                            <img src={URL.createObjectURL(profilePicture)} alt='Profile' className='profile-preview' />
                        ) : (
                            <span className="choose-profile-text">Choose Profile Picture<img src={image_logo} alt='image-logo' className='image-logo' /></span>
                        )}
                    </div>


                    {error && <div className="error-message">{error}</div>}



                    <form onSubmit={handleSubmit}>
                        <button type="submit" name='simple-signup' className='signup-btn' disabled={loading}>{loading ? 'Signing in...' : 'Signup'}</button>
                        <button type="submit" name='google-signup' className='signup-btn-google' disabled={loading}>{loading ? 'Signing in...' : <div className='google-btn'><img className='google-icon' src={google_logo} alt='google-logo' /><span>signup with Google</span></div>}</button>
                    </form>

                    <p className='signup-account'>Already have an Account? <Link to="/" className='signup-account-link'>Login Account</Link ></p>
                </div>
            </div>
        </div >
    );
}
