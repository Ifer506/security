import { message } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/edit_profile.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function EditProfile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [num, setNum] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const fileInputRef = useRef(null);
  const [seeProfile, setAvatarImage] = useState(null);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();
  const getUserProfile = async () => {
    console.log("INSIDE GETuserprofile");
    try {
      const accessToken = localStorage.getItem("token"); // You might need to adjust this based on how you store the access token
      const userId = jwtDecode(accessToken).userId;

      if (!accessToken) {
        // If the access token is not available, handle the authentication error
        console.error("User not authenticated.");
        return;
      }
      const headers = {
        Authorization: `${accessToken}`,
      };
      const response = await axios.get(`/users/profile/${userId}`, {
        headers,
      });
      console.log(response.data.data.cv);
      if (response.status === 200) {
        setAvatarImage(response.data.data.profile);
        setFullName(response.data.data.fullName);
        setNum(response.data.data.phoneNumber);
        setCvFile(response.data.data.cv);
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleEditProfile = async () => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      // If the access token is not available, handle the authentication error
      console.error("User not authenticated.");
      return;
    }

    if (!fullName || !num) {
      message.error("Fields cannot be left empty");
      return;
    }
    const formData = new FormData();
    formData.append("fullName", fullName);
    // formData.append("email", email);
    formData.append("phoneNumber", num);
    formData.append("cv", cvFile);
    formData.append("profile", profile);

    const headers = {
      Authorization: `${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    try {
      const response = await axios.post("/users/editProfile", formData, {
        headers,
      });
      console.log(response);
      if (response.status === 200) {
        navigate("/home");
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleAvatarClick = () => {
    // Trigger the click event on the file input
    fileInputRef.current.click();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the avatarImage state with the selected file data
        setAvatarImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCvFile(file);
  };
  useEffect(() => {
    getUserProfile();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="content ">
          <h1 className="title">Edit Profile</h1>
          <p className="subtitle">
            This information will be displayed publicly so be careful what you
            share.
          </p>
          <div className="avatar-container">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <div className="avatar" onClick={handleAvatarClick}>
              <img src={seeProfile || "default-avatar-url"} alt="Profile" />
            </div>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Phone Number"
              value={num}
              onChange={(e) => setNum(e.target.value)}
            />
          </div>
          {/* <div className="form-group">
            <label className="label">CV</label>
            <input
              type="file"
              onChange={handleFileChange}
            />
          </div> */}
          <div class="relative h-24 ">
            <label
              title="Click to upload"
              for="button2"
              class="cursor-pointer flex items-center gap-4 px-6 py-4 before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-3xl before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 justify-center"
            >
              <div class="w-max relative">
                <img
                  class="w-12"
                  src="https://www.svgrepo.com/show/485545/upload-cicle.svg"
                  alt="file upload icon"
                  width="512"
                  height="512"
                />
              </div>
              <div class="relative">
                <span class="block text-base font-semibold relative text-blue-900 group-hover:text-blue-500">
                  Upload a your CV in .pdf
                </span>
                <span class="mt-0.5 block text-sm text-gray-500">Max 2 MB</span>
              </div>
            </label>
            <input
              hidden="true"
              type="file"
              name="button2"
              id="button2"
              onChange={handleFileChange}
            />
          </div>
          <p className="cv-info">
            Your CV will be sent to employer when you apply for a job.
          </p>
          <button className="submit-btn" onClick={handleEditProfile}>
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
