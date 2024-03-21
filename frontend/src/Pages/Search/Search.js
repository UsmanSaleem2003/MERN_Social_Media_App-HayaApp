import React, { useState, useEffect } from 'react';
import search_icon from "../../Components/assets/search_icon.png";
import cross_icon from "../../Components/assets/cross_icon.png";
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

    function handlePreviousSearch(e) {
        const previousSearchText = e.target.textContent;
        setsearchText(previousSearchText);
    }

    function performSearch() {

    }

    useEffect(() => {
        console.log(searchText);
        console.log(AccountCategory);
        console.log(AccountType);
    }, [searchText, AccountCategory, AccountType]);


    return (
        <div className='search-page'>
            <div className='search-content'>

                <div className='search-input'>
                    <input type='text' onChange={handleInputChange} placeholder="Enter Account's Username" />
                    <button type='submit' onClick={performSearch} className='search-btn'> <img src={search_icon} className='search-icon' alt='search-icon' /> </button>
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
                    <div className='previous-searches-header'>
                        <span className='previous-searches-heading'>Previous Searches</span>
                        <span className='clear-searches'>Clear All</span>
                    </div>
                    <div className="previous-search">
                        <span onClick={handlePreviousSearch}>Harry</span>
                        <img src={cross_icon} alt="Cross Icon" className="cross-icon" />
                    </div>

                </div>

            </div>
        </div>
    )
}
