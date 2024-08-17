import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsApple, BsFacebook, BsGoogle } from "react-icons/bs";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "../../styles/card.css";
import "../../styles/signup_page.css";

const onResSuccess = (response) => {
  // Handle the response from Google Sign-In
  console.log("Success");
  console.log(response);
};
const onResFailure = (response) => {
  // Handle the response from Google Sign-In
  console.log("Failure");
  console.log(response);
};

export function getIcons() {
  return (
    <div className="signup-social-logos">
      <BsGoogle
        data-testid="google-icon"
        style={{ fontSize: "30px", "padding-right": "10px" }}
      />
      <BsApple
        data-testid="apple-icon"
        style={{ fontSize: "30px", "padding-right": "10px" }}
      />
      <BsFacebook
        data-testid="facebook-icon"
        style={{ fontSize: "30px", "padding-right": "10px" }}
      />
    </div>
  );
}

export function GetUserPill({
  jobId,
  userId,
  fullName,
  num,
  cv,
  title,
  accept,
  applicants,
}) {
  const [applicant, setApplicant] = useState([]);

  const getUserDetails = async (userId) => {
    console.log("in getUserDetails");
    setApplicant([]);

    try {
      if (!userId) {
        return;
      }
      const response = await axios.get(`/auth/getUser/${userId}`);
      setApplicant(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const rejectUser = async (jobId, userId) => {
    console.log("IN rejectUser");
    try {
      const response = await axios.post(
        `/jobs/reject/${jobId}/${userId}`,
        null
      );
      if (response.status === 200) {
        message.success("User Rejected");
      } else {
        message.error("Unable to reject user");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNoti = async (jobTitle,userId) => {
    console.log("in addNoti");
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        message.error("Not Authorized");
        return;
      }
      const headers = {
        Authorization: `${accessToken}`,
      };
      var noti = `You have been accepted for the job ${jobTitle}`;
      const res = await axios.post(`/users/addNoti/${noti}/${userId}`, null, {
        headers,
      });
      if (res.status === 200) {
        console.log("Notification sent");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const acceptUser = async (jobId, userId, title) => {
    try {
      console.log("IN acceptUser");

      const response = await axios.post(
        `/jobs/acceptedUser/${jobId}/${userId}`
      );
      console.log(response);
      if (response.status === 200) {
        message.success(response.data.message);
        handleAddNoti(title,userId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const downloadCV = async () => {
    console.log(applicant.cv);
    try {
      const response = await axios.get(`${applicant.cv}`, {
        responseType: "blob",
      });
      console.log(response);
      // Create a URL for the blob data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${applicant.fullName}_cv.pdf`); // You can set the desired filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getUserDetails(userId);
  }, []);
  if (!applicants.appliedJobs.includes(jobId)) {
    return;
  }
  return (
    <div
      class="spacer card w-96 bg-primary text-primary-content"
      style={{ padding: 10 }}
    >
      <div className="card-header">
        <img src={applicants.profile} alt="Logo" className="logo" />
        <h1 className="card-title">{title}</h1>
        <div></div>
      </div>
      <div class="card-body">
        <h3 class="card-title" className="text-xl font">
          {applicants.fullName}
        </h3>
        <h3 class="card-title" className="text-xl font">
          {applicants.email}
        </h3>
        <h3 class="card-title" className="text-xl font">
          {applicants.phoneNumber}
        </h3>
        <div class="card-actions justify-end">
          <button onClick={() => rejectUser(jobId, userId)} class="btn btn-sm">
            <AiOutlineDelete />
          </button>
          <button className="btn btn-sm" onClick={() => downloadCV()}>
            CV
          </button>
          <button
            className="btn btn-sm"
            onClick={() => acceptUser(jobId, userId, title)}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
