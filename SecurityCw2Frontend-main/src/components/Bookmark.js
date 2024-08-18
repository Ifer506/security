import axios from "axios";
import { React, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { GetBookmarked } from "./services/GetAllJobs";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const getBookmarks = async () => {
    try {
      // Get the access token from your authentication system
      const accessToken = localStorage.getItem("token"); // You might need to adjust this based on how you store the access token
      if (!accessToken) {
        // If the access token is not available, handle the authentication error
        console.error("User not authenticated.");
        return;
      }

      // Set the Authorization header with the access token
      const headers = {
        Authorization: `${accessToken}`,
      };

      const response = await axios.get("/jobs/getBookmarked", { headers });
      if (response.data.success) {
        setBookmarks(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    getBookmarks();
  }, []);

  return (
    <div>
      <Navbar />
      <GetBookmarked bookmarkData={bookmarks} getBookmarks={getBookmarks} />
      
    </div>
  );
}
