import React, { useState } from 'react';
import "./EditProfile.css";
import image_logo from "../../Components/assets/image_logo.png"

export default function EditProfile() {

    const [fullName, setFullName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [accountCategory, setAccountCategory] = useState("public");
    const [profilePicture, setProfilePicture] = useState(null);


    const handleSubmit = () => {
        //send data and do posting functionality to server
    }

    const handleback = (e) => {
        e.preventDefault();
        window.location.href = '/profile';
    }

    return (
        <div className='edit-profile-page'>
            <p>Edit Profile</p>
            <hr className='edit-profile-line' />

            <form className='EditProfileForm' onSubmit={handleSubmit}>

                <input
                    className='edit-profile-input-field'
                    type='text'
                    value={fullName}
                    placeholder='Enter new Full Name'
                    onChange={(e) => { setFullName(e.target.value) }}
                />

                <br />

                <input
                    className='edit-profile-input-field'
                    type={showPassword ? "text" : "password"}
                    value={Password}
                    placeholder='Enter new Password'
                    onChange={(e) => { setPassword(e.target.value) }}
                />

                <br />

                <input
                    className='edit-profile-input-field'
                    type={showPassword ? "text" : "password"}
                    value={ConfirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                    placeholder='Confirm new Password'
                />

                <div className='edit-page-show-password'>
                    <label className="edit-page-show-password-checkbox">
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        Show Password
                    </label>

                </div>

                <br />

                <label className='edit-profile-account-type-selection' htmlFor="account-type-selection">Select Account Type : </label>
                <div className="select-container">
                    <select
                        className='selection'
                        value={accountCategory}
                        onChange={(e) => setAccountCategory(e.target.value)}
                    >
                        <option value="">Default</option>
                        <option value="public">Public Account</option>
                        <option value="private">Private Account</option>
                    </select>
                </div>

                <br />

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
                        <span className="choose-profile-text">
                            Choose Profile Picture
                            <img
                                src={image_logo}
                                alt='profile_image-logo'
                                className='image-logo'
                            />
                        </span>
                    )}


                </div>


                {error && <div className="error-message">{error}</div>}

                <div className='edit-profile-btns'>

                    <button
                        className='update-button'
                        onClick={handleback}
                    >
                        Back
                    </button>
                    <button
                        className='update-button'
                        onClick={handleSubmit}
                    >
                        Update Profile
                    </button>
                </div>
            </form>

        </div >
    )
}
