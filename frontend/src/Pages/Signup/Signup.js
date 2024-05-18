import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./Signup.css";
import haya_logo from "../../Components/assets/haya_logo.png";
import google_logo from "../../Components/assets/google_icon.png";
import image_logo from "../../Components/assets/image_logo.png";

export default function Signup() {
    const [fullName, setFullName] = useState("");
    const [uniqueUsername, setUniqueUsername] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [gender, setGender] = useState("male");
    const [birthdate, setBirthdate] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [accountCategory, setAccountCategory] = useState("public");
    const [profileImgURL, setProfileImgURL] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            fullName: fullName,
            uniqueName: uniqueUsername,
            username: username,
            password: password,
            gender: gender,
            birthdate: birthdate,
            accountCategory: accountCategory,
            profilePic: profileImgURL,
        };

        try {
            const response = await fetch('http://localhost:4000/userSignup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                console.log("User Signup Successful");
                window.location.href = '/';
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('signup error:', error);
            setError('An unexpected error occurred');
        } finally {
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

                    <form onSubmit={handleSubmit}>
                        <input
                            type='text'
                            className='input-field'
                            value={fullName}
                            name='fullName'
                            placeholder='Your Full Name'
                            onChange={(e) => setFullName(e.target.value)}
                        />

                        <input
                            type='text'
                            className='input-field'
                            value={uniqueUsername}
                            name='uniqueUsername'
                            placeholder='Your unique username'
                            onChange={(e) => setUniqueUsername(e.target.value)}
                            required
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            className="input-field"
                            value={username}
                            name='username'
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="input-field"
                            value={password}
                            name='password'
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input
                            type={showPassword ? "text" : "password"}
                            className='input-field'
                            value={confirmedPassword}
                            name='confirmedPassword'
                            placeholder='Re-Enter Your Password'
                            onChange={(e) => setConfirmedPassword(e.target.value)}
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

                        <div className='signup-selections'>
                            <div className='signup-selections'>
                                <label htmlFor="gender-selection">Select Gender : </label>
                                <div className="select-container">
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
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
                                required
                            />
                        </div>

                        <div className='image-upload-container'>
                            <input
                                type='file'
                                className='signup-image-input-field'
                                accept='image/*'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) {
                                        console.error('No file selected');
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        const base64ImageData = reader.result.split(',')[1];
                                        setProfilePicture(base64ImageData);
                                        setProfileImgURL(base64ImageData)
                                    };
                                    reader.onerror = (error) => {
                                        console.error('File reading error:', error);
                                    };
                                    reader.readAsDataURL(file);
                                }}
                            />
                            {profilePicture ? (
                                <img src={`data:image/jpeg;base64,${profilePicture}`} alt='Profile' className='profile-preview' />
                            ) : (
                                <span className="choose-profile-text">Choose Profile Picture<img src={image_logo} alt='imag-logo' className='image-logo' /></span>
                            )}
                        </div>



                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" name='simple-signup' className='signup-btn' disabled={loading}>{loading ? 'Signing in...' : 'Signup'}</button>
                        <button type="submit" name='google-signup' className='signup-btn-google' disabled={loading}>{loading ? 'Signing in...' : <div className='google-btn'><img className='google-icon' src={google_logo} alt='google-logo' /><span>signup with Google</span></div>}</button>
                    </form>

                    <p className='signup-account'>Already have an Account? <Link to="/" className='signup-account-link'>Login Account</Link ></p>
                </div>
            </div>
        </div >
    );
}
