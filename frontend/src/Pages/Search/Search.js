import React, { useState, useEffect } from 'react';
import search_icon from "../../Components/assets/search_icon.png";
import cross_icon from "../../Components/assets/cross_icon.png";
import "./Search.css";

export default function Search(e) {

    const [searchText, setsearchText] = useState("");
    const [genderCategory, setgenderCategory] = useState("none");
    const [AccountType, setAccountType] = useState("none");
    const [error, setError] = useState("");
    const [foundUser, setfoundUser] = useState({});
    const [previousSearches, setPreviousSearches] = useState([]);

    const performSearch = async (e) => {
        e.preventDefault();
        const formData = {
            username: searchText,
            gender: genderCategory,
            accountType: AccountType
        };

        try {

            const response = await fetch("http://localhost:4000/searchUsers", {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setError(data.message);
                setfoundUser(data.user);
                // window.location.href = '/';
            } else {
                setfoundUser(null);
                setError("User not found");
            }
        } catch (e) {
            console.log("Catch error : ", e);
        }
    }

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    useEffect(() => {
        const fetchPreviousSearches = async () => {
            try {
                const response = await fetch("http://localhost:4000/getPreviousSearches", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setPreviousSearches(data.previousSearchesInfo);
                } else {
                    console.error("Failed to fetch previous searches");
                }
            } catch (error) {
                console.error("Error fetching previous searches:", error);
            }
        };
        fetchPreviousSearches();
    }, []);


    return (
        <div className='search-page'>
            <div className='search-content'>

                <form onSubmit={performSearch}>
                    <div className='search-input'>
                        <input type='text' onChange={(e) => setsearchText(e.target.value)} value={searchText} placeholder="Enter Account's Username or Email" />
                        <button type='submit' className='search-btn'> <img src={search_icon} className='search-icon' alt='search-icon' /> </button>
                    </div>

                    <div className='filters'>
                        <span>Filters : </span>

                        <label htmlFor="gender-filter">Gender Filter</label>
                        <select name="gender-filter" id="Gender-Category" onChange={(e) => setgenderCategory(e.target.value)}>
                            <option value="none">None</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

                        <label htmlFor="Account-Type">Account Type</label>
                        <select name="Account-Type" id="Account-Type" onChange={(e) => setAccountType(e.target.value)}>
                            <option value="none">None</option>
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>

                    </div>
                </form>

                <div className='previous-searches'>
                    <div className='previous-searches-header-user'>
                        {foundUser !== null ? (
                            error ? (
                                <div className='user'>
                                    <img src={`data:image/jpeg;base64,${arrayBufferToBase64(foundUser.profilePic.data)}`} alt="notification-profile-pic" className='notification-profile-pic' />
                                    <span className='unique-username'>{foundUser.username}</span>
                                </div>
                            ) : (
                                <span className='findFriend'>Find Your Friend</span>
                            )
                        ) : (
                            <span className='error-msg'>{error}</span>
                        )}
                    </div>

                    <div className='previous-searches-header'>
                        <span className='previous-searches-heading'>Previous Searches</span>
                        <span className='clear-searches'>Clear All</span>
                    </div>

                    {/* get previous searches from user's schema and map them here */}
                    {previousSearches.map((search, index) => (
                        <div className="previous-search" key={index} onClick={() => setsearchText(search.uniqueName)}>
                            <img src={`data:image/jpeg;base64,${arrayBufferToBase64(search.profilePic.data)}`} alt="notification-profile-pic" className="notification-profile-pic" />
                            <span>{search.uniqueName}</span>
                            <img src={cross_icon} alt="Cross Icon" className="cross-icon" />
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}
