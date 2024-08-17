import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import { message } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { React, useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { IoBriefcaseOutline, IoDocumentsOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import "../tailwind.css";
import { isAdmin } from "./global.js";
import { GetAllUsers } from "./services/GetUserData";

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const [activeButton, setActiveButton] = useState(location.pathname);
  const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [filterQuery, setFilterQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [notis, setNotis] = useState([]);

  const handleButtonClick = (path) => {
    setActiveButton(path);
  };

  const isButtonActive = (path) => {
    return activeButton === path;
  };
  const getSearched = async () => {
    try {
      const response = await axios.post(`/search/mainSearch/${searchQuery}`);
      if (response.status === 200) {
        setJobs(response.data.data);
        onSearch(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getUserProfile = async () => {
    console.log("INSIDE GETuserprofile");
    try {
      const accessToken = localStorage.getItem("token");
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

      if (response.status === 200) {
        setProfileImage(response.data.data.profile);
        setEmail(response.data.data.email);
        console.log(response.data);
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const getNotifications = async () => {
    try {
      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        // If the access token is not available, handle the authentication error
        console.error("User not authenticated.");
        return;
      }
      const headers = {
        Authorization: `${accessToken}`,
      };
      console.log("In getNoti");
      const response = await axios.get("/users/getNoti", {
        headers,
      });
      if (response.status === 200) {
        setNotis(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const clearNotifications = async () => {
    try {
      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        // If the access token is not available, handle the authentication error
        console.error("User not authenticated.");
        return;
      }
      const headers = {
        Authorization: `${accessToken}`,
      };
      console.log("In getNoti");
      const response = await axios.post("/users/clearNoti", null, {
        headers,
      });
      if (response.status === 200) {
        console.log(response.data.message);
        getNotifications();
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const deleteAccount = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        // If the access token is not available, handle the authentication error
        console.error("User not authenticated.");
        return;
      }
      const headers = {
        Authorization: `${accessToken}`,
      };
      const response = await axios.post(
        `/users/profile/`,
        { password },
        {
          headers,
        }
      );
      if (response.status === 200) {
        message.success(response.data.message);
        navigate("/signup");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const logOut = async () => {
    try {
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  const changePassword = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        message.error("User not authenticated.");
        return;
      }
      const headers = {
        Authorization: `${accessToken}`,
      };
      const pws = {
        currentPassword: password,
        newPassword: newPassword,
        reenterNewPassword: confirmPassword,
      };
      const response = await axios.post("/auth/changePassword", pws, {
        headers,
      });
      console.log(response.data);
      if (response.data.success) {
        message.success(response.data.message);
        logOut();
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const changeEmail = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        message.error("User not authenticated.");
        return;
      }
      const headers = {
        Authorization: `${accessToken}`,
      };
      const emails = {
        email: newEmail,
        confirmEmail: confirmEmail,
      };
      const response = await axios.post("/users/changeEmail", emails, {
        headers,
      });
      if (response.data.success) {
        logOut();

        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };
  // Function to render notifications
  const renderNotifications = () => {
    if (notis.length === 0) {
      return (
        <li>
          <a>Empty</a>
        </li>
      );
    } else {
      return notis.map((notification, index) => (
        <li key={index}>
          <a>{notification}</a>
        </li>
      ));
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  useEffect(() => {
    getUserProfile();
    getNotifications();
  }, []);
  return (
    <div>
      <div className={`navbar bg-neutral ${menuOpen ? "menu-open" : ""}`}>
        <div className="navbar-start">
          <div className="menu-dropdown" onClick={toggleMenu}>
            <div className="dropdown-icon"></div>
            {menuOpen && (
              <div className="dropdown-content">
                <Link to="/home" onClick={() => handleButtonClick("/home")}>
                  Home
                </Link>
              </div>
            )}
          </div>
          <div
            className={`tabs-boxed bg-neutral ${
              menuOpen ? "menu-open" : "menu-closed"
            }`}
          >
            <Link to="/home">
              <div
                className={`tab ${isButtonActive("/home") ? "tab-active" : ""}`}
                onClick={() => handleButtonClick("/home")}
              >
                <AiOutlineHome className="tab-icon" />
                <span>Home</span>
              </div>
            </Link>
            <Link to="/bookmark">
              <div
                className={`tab ${
                  isButtonActive("/bookmark") ? "tab-active" : ""
                }`}
                onClick={() => handleButtonClick("/bookmark")}
              >
                <BsBookmark className="tab-icon" />
                <span>Bookmark</span>
              </div>
            </Link>
            <Link to="/application">
              <div
                className={`tab ${
                  isButtonActive("/application") ? "tab-active" : ""
                }`}
                onClick={() => handleButtonClick("/application")}
              >
                <IoDocumentsOutline className="tab-icon" />
                <span>Applications</span>
              </div>
            </Link>
            <Link to="/addjob">
              <div
                className={`tab ${
                  isButtonActive("/addjob") ? "tab-active" : ""
                }`}
                onClick={() => handleButtonClick("/addjob")}
              >
                <IoBriefcaseOutline className="tab-icon" />
                <span> Add Job</span>
              </div>
            </Link>
          </div>
        </div>
        <div class="navbar-center">
          <div class="text-3xl font-bold">The Job Finder</div>
        </div>
        <div class="navbar-end">
          <div class="form-control">
            <input
              type="text"
              placeholder="Search"
              class="input input-bordered w-24 md:w-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            data-testid="searchBtn"
            class="btn btn-ghost"
            onClick={getSearched}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
          </button>
          <div class="dropdown dropdown-end">
            <button class="btn btn-ghost btn-circle" onClick={getNotifications}>
              <div class="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span class="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
            <ul
              tabindex="0"
              class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              {/* Render notifications */}
              {renderNotifications()}
              {notis.length > 0 && (
                <li>
                  <a onClick={clearNotifications}>Clear All</a>
                </li>
              )}
            </ul>
          </div>
          <div class="dropdown dropdown-end" data-testId="profileBtn">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img src={profileImage} alt="pp" />
              </div>
            </label>
            <ul
              tabindex="0"
              class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a tabIndex="0" onClick={() => navigate("/editProfile")}>
                  Profile
                </a>
              </li>
              <li>
                <a tabIndex="0" onClick={() => window.my_modal_3.showModal()}>
                  Change Password
                </a>
              </li>
              <li>
                {isAdmin() && (
                  <a
                    tabIndex="0"
                    onClick={() => window.userListModal.showModal()}
                  >
                    View Users
                  </a>
                )}
                {!isAdmin() && (
                  <a tabIndex="0" onClick={() => window.my_modal_1.showModal()}>
                    Change Email
                  </a>
                )}
              </li>
              <li>
                <a tabIndex="1" onClick={() => window.my_modal_5.showModal()}>
                  Delete Account
                </a>
              </li>
              <li>
                <a tabIndex="1" onClick={() => window.my_modal.showModal()}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
        <dialog id="my_modal_3" className="modal">
          <form method="dialog" className="modal-box">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
            <h3
              className="font-bold text-lg"
              style={{ "margin-bottom": "20px" }}
            >
              Change Password
            </h3>
            <input
              style={{ marginBottom: "10px" }}
              type="password"
              placeholder="Current Password"
              class="input input-primary input-bordered w-full password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <input
              style={{ marginBottom: "10px" }}
              type="password"
              placeholder="New Password"
              class="input input-primary input-bordered w-full password-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            ></input>
            <input
              type="password"
              placeholder="Re-enter New Password"
              class="input input-primary input-bordered w-full password-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
            <div className="modal-action">
              <button className="btn" onClick={changePassword}>
                Change
              </button>
            </div>
          </form>
        </dialog>
        <dialog id="my_modal_1" className="modal">
          <form method="dialog" className="modal-box">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
            <h3
              className="font-bold text-lg"
              style={{ "margin-bottom": "20px" }}
            >
              Change Email
            </h3>
            <div class="text-2xl font" style={{ "margin-bottom": "10px" }}>
              Current Email:- {email}
            </div>

            <input
              style={{ marginBottom: "10px" }}
              type="text"
              placeholder="New Email"
              class="input input-primary input-bordered w-full"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            ></input>
            <input
              type="text"
              placeholder="Re-enter New Email"
              class="input input-primary input-bordered w-full"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            ></input>
            <p
              className="mt-1 text-sm leading-6 text-gray-600"
              style={{ marginBottom: "20px" }}
            >
              *This email will be used as your login email.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={changeEmail}>
                Change
              </button>
            </div>
          </form>
        </dialog>
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Delete Account !!!</h3>
            <p className="py-4">Are you sure you want to delete?</p>
            <input
              style={{ marginBottom: "10px" }}
              type="password"
              placeholder="Enter Password"
              class="input input-primary input-bordered w-full password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">No</button>
              <button className="btn" onClick={deleteAccount}>
                Yes
              </button>
            </div>
          </form>
        </dialog>{" "}
        <dialog
          id="userListModal"
          className="modal modal-bottom sm:modal-middle"
        >
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">List of Users </h3>
            <GetAllUsers />
            <div className="modal-action">
              <button className="btn">Close</button>
            </div>
          </form>
        </dialog>
        <dialog id="my_modal" className="modal modal-bottom sm:modal-middle">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Log Out !!!</h3>
            <p className="py-4">Are you sure you want to Log Out?</p>
            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">No</button>
              <button className="btn" onClick={logOut}>
                Yes
              </button>
            </div>
          </form>
        </dialog>
      </div>
      <div class="spacer"></div>
    </div>
  );
};

export default Navbar;
