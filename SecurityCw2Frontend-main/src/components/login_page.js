import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login_page.css";
import { useAuth } from "../utils/authContext";
import { setAdmin } from "./global.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  // const dispatch = useDispatch()
  const auth = useAuth();
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = {
        email: email,
        password: password,
      };

      console.log(user);

      auth.setEmail(user.email);

      setAdmin(email);
      console.log("IN LOGIN.....");

      const response = await axios.post("/auth/login", user);
      console.log("RESPONSE");

      console.log(response);

      if (response.data.success) {
        message.success(response.data.message);

        // Check if password change is required
        const passwordChangeInterval = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
        const lastPasswordChange = response.data.user.lastPasswordChange;

        if (lastPasswordChange < Date.now() - passwordChangeInterval) {
          // Redirect to change password page
          window.login_modal.showModal();
        } else {
          // Set authentication token and navigate to home
          localStorage.setItem("token", response.data.token);
          navigate("/home");
        }
      } else {
        console.log("IN LOGIN");

        message.error(response.data.error);
      }
    } catch (error) {
      message.error("No response from server");
    }
  };
  return (
    <section>
      <div className="px-8 py-24 mx-auto md:px-12 lg:px-32 max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold tracking-tighter text-gray-900 lg:text-5xl">
              Find New Job Oppurtunity,
              <span className="text-gray-600"> from any location</span>
            </h1>
            <p className="mt-4 text-base font-medium text-gray-500">
              A quick and easy way to apply for employment.
            </p>
          </div>
          <div className="p-2 border bg-gray-50 rounded-3xl">
            <div className="p-10 bg-white border shadow-lg rounded-2xl">
              <div>
                <button
                  className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  type="button"
                  aria-label="Sign in with Google"
                >
                  <ion-icon
                    name="logo-google"
                    role="img"
                    className="md hydrated"
                    aria-label="logo google"
                  ></ion-icon>
                  <span>Sign in with Google</span>
                </button>
                <div className="relative py-3">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-sm text-black bg-white">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div>
              <form>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-3 text-sm font-medium text-black"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      placeholder="Your email"
                      className="block w-full h-12 px-4 py-2 text-blue-500 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 focus:border-zinc-300 focus:outline-none focus:ring-zinc-300 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="password"
                      className="block mb-3 text-sm font-medium text-black"
                    >
                      Password
                    </label>
                    <div className="password-input-container">
                      <input
                        id="password"
                        className="block w-full h-12 px-4 py-2 text-blue-500 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 focus:border-zinc-300 focus:outline-none focus:ring-zinc-300 sm:text-sm"
                        placeholder="Type password here..."
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className={`password-toggle-button ${
                          showPassword ? "visible" : ""
                        }`}
                        onClick={toggleShowPassword}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-full">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium text-white duration-200 bg-gray-900 rounded-xl hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      onClick={handleSubmit}
                    >
                      Log In
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="flex mx-auto text-sm font-medium leading-tight text-center text-black">
                    <p className="">Register for an account?</p>
                    <Link
                      to="/signup"
                      className="ml-auto text-blue-500 hover:text-black"
                    >
                      Sign up now
                    </Link>
                  </p>
                  <dialog id="login_modal" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h3 className="font-bold text-lg" style={{ "margin-bottom": "20px" }}>
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
