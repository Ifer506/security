import { message } from "antd";
import axios from "axios";
import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const getSearched = async () => {
    try {
      const response = await axios.post(`/search/mainSearch/${searchQuery}`);
      console.log("response");
      console.log(response);
      if (response.status === 200) {
        console.log(response.data);
        onSearch(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div class="relative w-full max-w-xl mx-auto bg-white rounded-full">
      <input
        placeholder="e.g. California, Web Developer"
        class="rounded-full w-full h-16 bg-transparent py-2 pl-8 pr-32 outline-none border-2 border-gray-100 shadow-md hover:outline-none focus:ring-teal-200 focus:border-teal-200"
        type="text"
        name="query"
        id="query"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* <input
        type="text"
        placeholder="Search"
        class="input input-bordered w-24 md:w-auto"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      /> */}
      <button
      onClick={getSearched}
        type="submit"
        class="absolute inline-flex items-center h-10 px-4 py-2 text-sm text-white transition duration-150 ease-in-out rounded-full outline-none right-3 top-3 bg-teal-600 sm:px-6 sm:text-base sm:font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
      
      >
        <svg class="-ml-0.5 sm:-ml-1 mr-2 w-4 h-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
    Search
  </button>

      {/* <button class="btn btn-ghost" onClick={getSearched}>
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button> */}
    </div>
  );
};

export default SearchBar;
