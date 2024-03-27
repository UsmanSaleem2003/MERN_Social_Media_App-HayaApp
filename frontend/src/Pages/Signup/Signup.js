import React, { useState } from 'react';
import haya_logo from "../../Components/assets/haya_logo.png";
import "./Signup.css";

export default function Signup() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [gender, setGender] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [accountCategory, setAccountCategory] = useState("public");
    const [region, setRegion] = useState("");

    // Function to handle location access
    const handleLocationAccess = () => {
        // Use the Geolocation API to get the user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Retrieve latitude and longitude
                    const { latitude, longitude } = position.coords;
                    // You can use latitude and longitude to fetch the region or any other location-based information
                    // For now, we'll just set the region to a string
                    setRegion(`Latitude: ${latitude}, Longitude: ${longitude}`);
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your signup form submission logic here
        console.log("Form submitted!");
    };

    return (
        <div className='signup'>

            <div className='signup-left-part'>
                <img src={haya_logo} alt="Haya Logo" className="logo" />
            </div>

            <div className='signup-right-part'>
                <form onSubmit={handleSubmit}>
                    <div className='signup-right-upper-part'>
                        <div className='row'>

                            <input
                                type='text'
                                className='signup-input-field'
                                value={fullName}
                                name='fullName'
                                placeholder='Your Full Name'
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <input
                                type='email'
                                className='signup-input-field'
                                value={email}
                                name='email'
                                placeholder='Your Email'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='row'>

                            <input
                                type={showPassword ? "text" : "password"}
                                className='signup-input-field'
                                value={password}
                                name='password'
                                placeholder='Password'
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                className='signup-input-field'
                                value={confirmedPassword}
                                name='confirmedPassword'
                                placeholder='Re-Enter Your Password'
                                onChange={(e) => setConfirmedPassword(e.target.value)}
                            />
                        </div>

                        <div className='signup-show-password'>
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label className="show-password-checkbox" onClick={() => setShowPassword(!showPassword)} >
                                Show Password
                            </label>
                        </div>
                    </div>

                    <div className='birthdate'>
                        <label>Select Birthdate : </label>
                        <input
                            type='date'
                            className='signup-birthdate-input-field'
                            value={birthdate}
                            name='birthdate'
                            placeholder='Birthdate'
                            onChange={(e) => setBirthdate(e.target.value)}
                        />
                    </div>

                    <div className='signup-selections'>
                        <label htmlFor="gender-selection">Select Gender : </label>
                        <select
                            className='signup-input-field'
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>


                        <label className='account-type-selection' htmlFor="account-type-selection">Select Account Type : </label>
                        <select
                            className='signup-input-field-account-category'
                            value={accountCategory}
                            onChange={(e) => setAccountCategory(e.target.value)}
                        >
                            <option value="public">Public Account</option>
                            <option value="private">Private Account</option>
                        </select>
                    </div>

                    <button type="button" onClick={handleLocationAccess}>Allow Location Access for region Selection</button>
                    <input
                        type='text'
                        className='signup-input-field'
                        value={region}
                        name='region'
                        placeholder='Region'
                        readOnly
                    />

                    <input
                        type='file'
                        className='signup-input-field'
                        accept='image/*'
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                    <button type="submit">Sign Up</button>
                </form>
            </div >

        </div >
    );
}
