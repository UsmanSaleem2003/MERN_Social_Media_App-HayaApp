import React, { useState, useEffect } from 'react';
import search_icon from "../../Components/assets/search_icon.png";
import "./Search.css";

export default function Search() {

    const [searchText, setsearchText] = useState("");
    const [AccountCategory, setAccountCategory] = useState("None");
    const [AccountType, setAccountType] = useState("None");

    function handleInputChange(e) {
        setsearchText(e.target.value);
    }

    function handleAccountCategory(e) {
        setAccountCategory(e.target.value);
    }

    function handleAccountType(e) {
        setAccountType(e.target.value);
    }

    function performSearch() {

    }

    useEffect(() => {
        console.log(searchText);
        console.log(AccountCategory);
        console.log(AccountType);
    }, [searchText, AccountCategory, AccountType]);


    return (
        <div>
            <div className='search-header'>
                <div className='search-input'>
                    <input type='text' onChange={handleInputChange} placeholder="Enter Account's Username" />
                    <img src={search_icon} alt='search-icon' className='search-icon' onClick={performSearch} />
                </div>

                {/* add functionality of filters for search */}
                <div className='filters'>
                    <span>Filters : </span>

                    <label htmlFor="Account-Category">Account Category</label>
                    <select name="Account-Category" id="Account-Category" onChange={handleAccountCategory}>
                        <option value="None">None</option>
                        <option value="Music">Music</option>
                        <option value="Poetry">Poetry</option>
                        <option value="Memes">Memes</option>
                        <option value="News">News</option>
                    </select>

                    <label htmlFor="Account-Type">Account Type</label>
                    <select name="Account-Type" id="Account-Type" onChange={handleAccountType}>
                        <option value="None">None</option>
                        <option value="Private">Private</option>
                        <option value="Public">Public</option>
                    </select>

                </div>

                <div className='previous-searches'>
                    <p>Previous Searches</p>
                    <p>Harry</p>
                    <p>Fan</p>
                    <p>Memes</p>

                </div>
            </div>
        </div>
    )
}
