import React, { useState } from 'react';
import "./EditProfile.css";
import image_logo from "../../Components/assets/image_logo.png"

export default function EditProfile() {

    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [accountCategory, setAccountCategory] = useState("public");
    const [profilePicture, setProfilePicture] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updates = {};
        if (fullName) updates.fullName = fullName;
        if (password) {
            if (password === confirmPassword) {
                updates.password = password;
            } else {
                setError("Passwords do not match.");
                return;
            }
        }
        if (accountCategory) updates.accountCategory = accountCategory;

        if (profilePicture) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64ImageData = reader.result.split(',')[1];
                updates.profilePicture = base64ImageData;
                await updateProfile(updates);
            };
            reader.readAsDataURL(profilePicture);
        } else {
            await updateProfile(updates);
        }
    };

    const updateProfile = async (updates) => {
        try {
            const response = await fetch("http://localhost:4000/updateProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(updates),
            });
            const result = await response.json();
            if (result.success) {
                window.location.href = '/profile';
            } else {
                setError(result.message);

                setTimeout(() => {
                    setError("");
                }, 2000);
            }
        } catch (error) {
            setError("Failed to update profile. Please try again.");
        }
    };

    const handleBack = (e) => {
        e.preventDefault();
        window.location.href = '/profile';
    };

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
                    value={password}
                    placeholder='Enter new Password'
                    onChange={(e) => { setPassword(e.target.value) }}
                />

                <br />

                <input
                    className='edit-profile-input-field'
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    placeholder='Confirm new Password'
                    onChange={(e) => { setConfirmPassword(e.target.value) }}
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
                        <option value="default">Default</option>
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
                        className='back-btn'
                        onClick={handleBack}
                    >
                        Back
                    </button>
                    <button
                        className='update-button'
                        type='submit'
                    >
                        Update Profile
                    </button>
                </div>

            </form>
        </div >
    )
}
