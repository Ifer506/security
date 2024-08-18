import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/signup_page.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setotp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword0, setShowPassword0] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowPassword0 = () => {
    setShowPassword0(!showPassword0);
  };
  const checkOtp = async () => {
    try {
      // Validate the OTP
      const response = await axios.post("/auth/verify-otp", { email, otp });
      if (response.status === 200) {
        message.success("Email verified! You can now login.");
        navigate("/login");
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Error verifying OTP. Please try again.");
    }
  };
  const validatePassword = (password) => {
    const errors = [];

    if (!email || !password || !confirmPassword) {
      errors.push("Fields cannot be left empty");
    }

    // Check length
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    // Check for digit
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one digit");
    }

    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain a special character");
    }

    // Check for personal information
    const lowerCasePassword = password.toLowerCase();
    const usernameFromEmail = email.split("@")[0];
    if (lowerCasePassword.includes(usernameFromEmail.toLowerCase())) {
      errors.push("Password cannot contain the name or email");
    }

    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }

    return errors;
  };
  const handleSignup = async () => {
    console.log("in signup page");

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      message.error(passwordErrors[0]);
      return;
    }

    const user = {
      email: email,
      password: password,
    };
    window.otpModal.showModal();

    try {
      //   dispatch(ShowLoading());
      const response = await axios.post("/auth/signup", user);
      //   dispatch(ShowLoading())
      console.log(response);
      if (response.status === 201) {
        message.success(response.data.message);
        navigate("/");
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      message.error("No response from server");
    }
  };

  return (
    <div className="signup-page">
      <section>
        <div className="px-8 py-24 mx-auto md:px-12 lg:px-32 max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold tracking-tighter text-gray-900 lg:text-5xl">
                Become a part of the community,
                <span className="text-gray-600"> sign up today</span>
              </h1>
              <p className="mt-4 text-base font-medium text-gray-500">
                A quick and easy way to apply for employment.
              </p>
            </div>
            <div className="p-2 border bg-gray-50 rounded-3xl">
              <div className="p-10 bg-white border shadow-lg rounded-2xl ">
                {/* <div className="avatar-container ">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <div className="avatar" onClick={handleAvatarClick}>
              <img src={seeProfile || "default-avatar-url"} alt="Profile" />
            </div>
          </div> */}
                <div className="signup-form space-y-3 flex mx-auto ">
                  {/* <label
                    htmlFor="email"
                    className="block mb-3 text-sm font-medium text-black"
                  >
                    Email
                  </label> */}
                  <input
                    type="text"
                    placeholder="Email"
                    className="block w-full h-12 px-4 py-2 text-blue-500 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 focus:border-zinc-300 focus:outline-none focus:ring-zinc-300 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="block w-full h-12 px-4 py-2 text-blue-500 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 focus:border-zinc-300 focus:outline-none focus:ring-zinc-300 sm:text-sm"
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
                  <div className="flex-none hover:flex-1 password-input-container ">
                    <input
                      type={showPassword0 ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="block w-full h-12 px-4 py-2 text-blue-500 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 focus:border-zinc-300 focus:outline-none focus:ring-zinc-300 sm:text-sm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      className={`password-toggle-button ${
                        showPassword0 ? "visible" : ""
                      }`}
                      onClick={toggleShowPassword0}
                    >
                      <FontAwesomeIcon
                        icon={showPassword0 ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>
                <div className="col-span-full mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium text-white duration-200 bg-gray-900 rounded-xl hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </button>
                </div>

                <div className="mt-6">
                  <p className="flex justify-between mx-auto text-sm font-medium leading-tight text-center text-black">
                    <p className="">Already have an account ?</p>
                    <Link
                      to="/"
                      className="ml-auto text-blue-500 hover:text-black"
                    >
                      Log In Now
                    </Link>
                  </p>
                  <dialog id="otpModal" className="modal">
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
                        placeholder="Enter OTP"
                        class="input input-primary input-bordered w-full password-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      ></input>
                      <div className="modal-action">
                        <button className="btn" onClick={checkOtp}>
                          Activate
                        </button>
                      </div>
                    </form>
                  </dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <button className="signup-button" onClick={handleSignup}>
        Sign Up
      </button> */}

      {/* <p className="signup-login-link">
        Already have an account?{" "}
        <Link to="/">
          Log In
        </Link>
      </p> */}
    </div>
  );
};

export default SignupPage;
