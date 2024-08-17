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
      const response = await axios.post("/auth/login", user);
      console.log(response);
      if (response.data.success) {
        message.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      message.error("No response from server");
    }
  };
  return (
    <div className="login-page dir=rtl">
      <div className="text-4xl font-bold">Hi!</div>

      <div className="text-4xl font">Welcome Back</div>
      <hr className="gap"></hr>
      <h4 className="text-4xl font-bold">Log In</h4>
      <hr className="gap"></hr>

      <div className="login-form">
        <input
          type="text"
          placeholder="Email"
          className="input input-primary input-bordered w-full "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input input-primary input-bordered w-full password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button
            className={`password-toggle-button ${
              showPassword ? "visible" : ""
            }`}
            onClick={toggleShowPassword}
            data-testid="password-toggle-button"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <button
          className="btn btn-primary h-10 w-60 rounded-full btn-xs sm:btn-sm md:btn-md lg:btn-lg"
          onClick={handleSubmit}
        >
          Log In
        </button>
      </div>
      <div className=" divider-vertical">OR</div>

      {/* {getIcons()} */}

      <p className="signup-login-link">
        Don't have an account?{" "}
        <Link to={"/signup"}>
          <a href="/signup">Sign Up</a>
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
