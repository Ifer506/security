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
      <div class="text-4xl font-bold">Hi!</div>
      <div class="text-4xl font">Welcome to The Job Finder</div>
      <hr class="gap"></hr>
      <h4 className="text-4xl font-bold">Sign Up</h4>
      <hr class="gap"></hr>

      <div className="signup-form">
        <input
          type="text"
          placeholder="Email"
          class="input input-primary input-bordered w-full "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div class="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            class="input input-primary input-bordered w-full password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button
            data-testId="togglePass"
            className={`password-toggle-button ${
              showPassword ? "visible" : ""
            }`}
            onClick={toggleShowPassword}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <div class="password-input-container">
          <input
            type={showPassword0 ? "text" : "password"}
            placeholder="Confirm Password"
            class="input input-primary input-bordered w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
          <button
            data-testId="togglePass0"
            className={`password-toggle-button ${
              showPassword0 ? "visible" : ""
            }`}
            onClick={toggleShowPassword0}
          >
            <FontAwesomeIcon icon={showPassword0 ? faEyeSlash : faEye} />
          </button>
        </div>

        <button
          class="btn btn-primary h-10 w-60 rounded-full btn-xs sm:btn-sm md:btn-md lg:btn-lg"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </div>

      <div class=" divider-vertical">OR</div>

      {/* {getIcons()} */}
      <p className="signup-login-link">
        Already have an account?{" "}
        <Link to={"/"}>
          <a href="/login">Log In</a>
        </Link>
      </p>
      <dialog id="otpModal" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h3 className="font-bold text-lg" style={{ "margin-bottom": "20px" }}>
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
  );
};

export default SignupPage;
