import { ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import { Card, Modal, message } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import "../../styles/home_page.css";
import "../../tailwind.css";
import { GetCreatedCard, getCard } from "./card";

const checkUserBookmark = (job, userId) => {
  if (!!job.bookmarkedBy && job.bookmarkedBy.includes(userId)) {
    return true;
  }
  return false;
};
const checkAppliedJob = (job, userId) => {
  if (!!job.appliedBy && job.appliedBy.includes(userId)) {
    return true;
  }
  return false;
};

const handleUnbookmark = async (jobId, getJobs) => {
  try {
    const accessToken = localStorage.getItem("token"); // You might need to adjust this based on how you store the access token
    var userId = jwtDecode(localStorage.getItem("token")).userId;
    console.log(userId);
    if (!accessToken) {
      // If the access token is not available, handle the authentication error
      console.error("User not authenticated.");
      return;
    }
    const headers = {
      Authorization: `${accessToken}`,
    };
    const response = await axios.delete(`/jobs/removeBookmark/${jobId}`, {
      headers,
    });
    console.log(response);
    if (response.status === 200) {
      message.success(response.data.message);
    } else {
      message.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
  }
  getJobs();
};

const handleDeleteJob = async (jobId, getJobs) => {
  try {
    console.log("In DELETE JOB");
    console.log(jobId);
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      // If the access token is not available, handle the authentication error
      console.error("User not authenticated.");
      return;
    }
    const headers = {
      Authorization: `${accessToken}`,
    };
    const response = await axios.delete(`/jobs/${jobId}`);
    if (response.status === 200) {
      message.success(response.data.message);
    } else {
      message.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
  }
  getJobs();
};

const handleApplyJob = async (jobId, getJobs) => {
  try {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      message.error("Not Authorized");
      return;
    }
    const headers = {
      Authorization: `${accessToken}`,
    };
    var userId = jwtDecode(localStorage.getItem("token")).userId;
    const res = await axios.get(`/users/profile/${userId}`, {
      headers,
    });
    if (res.status === 200) {
      console.log("handleApplyJob");
      console.log(res.data.data.cv);
      if (
        res.data.data.cv == null ||
        res.data.data.profile == null ||
        res.data.data.fullName == null ||
        res.data.data.phoneNumber == null
      ) {
        message.error("First fill in your profile");
        return;
      }
    } else {
      message.error(res.data.message);
      return;
    }

    const response = await axios.post(`/jobs/applyJob/${jobId}`, null, {
      headers,
    });

    if (response.status === 200) {
      message.success(response.data.message);
    } else {
      message.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
  }
  getJobs();
};
const handleWithdrawJob = async (jobId, getJobs) => {
  try {
    const accessToken = localStorage.getItem("token"); // You might need to adjust this based on how you store the access token
    var userId = jwtDecode(localStorage.getItem("token")).userId;
    console.log(userId);
    if (!accessToken) {
      // If the access token is not available, handle the authentication error
      console.error("User not authenticated.");
      return;
    }
    const headers = {
      Authorization: `${accessToken}`,
    };
    const response = await axios.post(`/jobs/withdraw/${jobId}`, null, {
      headers,
    });
    console.log(response);
    if (response.status === 200) {
      message.success(response.data.message);
    } else {
      message.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
  }
  getJobs();
};
const handleAddBookmark = async (jobId, getJobs) => {
  try {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      message.error("Not Authorized");
      return;
    }
    const headers = {
      Authorization: `${accessToken}`,
    };
    const response = await axios.post(`/jobs/addBookmark/${jobId}`, null, {
      headers,
    });
    console.log(`/jobs/addBookmark/${jobId}`);

    console.log(response);
    if (response.status === 200) {
      message.success(response.data.message);
    } else {
      message.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
  }
  getJobs();
};

export const GetAllJobs = ({ jobsData, getJobs }) => {
  useEffect(() => {
    getJobs();
  }, []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  // Function to show the modal and store the selected job
  const handleShowModal = (job, getJobs) => {
    setSelectedJob(job); // Store the selected job in the state
    setIsModalVisible(true); // Show the modal
  };
  // Function to hide the modal when the user clicks "Cancel"
  const handleCancelModal = () => {
    setIsModalVisible(false);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-8 card-container">
      {jobsData.map((job) => (
        <div key={job._id}>
          {getCard({
            logo: job.logo,
            companyName: job.company,
            jobName: job.title,
            location: job.location,
            time: job.jobTime,
            applied: checkAppliedJob(
              job,
              jwtDecode(localStorage.getItem("token")).userId
            ),
            bookmarked: checkUserBookmark(
              job,
              jwtDecode(localStorage.getItem("token")).userId
            ),
            onUnbookmark: () => handleUnbookmark(job._id, getJobs),
            addBookmark: () => handleAddBookmark(job._id, getJobs),
            apply: () => handleShowModal(job, getJobs),
            withdraw: () => handleWithdrawJob(job._id, getJobs),
            deleteJob: () => handleDeleteJob(job._id, getJobs),
          })}
        </div>
      ))}
      {/* Modal component */}
      <Modal
        title="Confirm Apply"
        visible={isModalVisible}
        onCancel={handleCancelModal} // Hide the modal when the user clicks "Cancel"
        onOk={() => {
          if (selectedJob) {
            console.log("selectedJob");
            console.log(selectedJob.logo);
            handleApplyJob(selectedJob._id, getJobs);
          }
          setIsModalVisible(false); // Hide the modal
        }}
        okText="Apply"
        okButtonProps={{ ghost: true }}
      >
        {selectedJob && (
          <Card>
            <div className="card-header">
              <img src={selectedJob.logo} alt="Logo" className="logo" />
              <div class="text-xl font">{selectedJob.title}</div>
            </div>
            <div className="card-body">
              <div className="company-location-container">
                <div className="location">
                  <div class="text-lg font">{selectedJob.company}</div>
                </div>
                <div className="location">
                  <span className="location-icon">
                    <EnvironmentOutlined />
                  </span>
                  <div class="text-sm font-bold">{selectedJob.location}</div>
                </div>
              </div>
              <div className="company-location-container">
                <div className="location">
                  <span className="clock-icon">
                    <ClockCircleOutlined />
                  </span>
                  <div class="text-sm font-bold">{selectedJob.jobTime}</div>
                </div>
                <div className="location">
                  <div class="text-md font">{selectedJob.salary}</div>
                </div>
              </div>
              <div class="text-lg font-bold">Qualifications</div>
              <p>{selectedJob.desc}</p>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export const GetBookmarked = ({ bookmarkData, getBookmarks }) => {
  useEffect(() => {
    getBookmarks();
  }, [getBookmarks]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  // Function to show the modal and store the selected job
  const handleShowModal = (job) => {
    setSelectedJob(job); // Store the selected job in the state
    setIsModalVisible(true); // Show the modal
  };
  // Function to hide the modal when the user clicks "Cancel"
  const handleCancelModal = () => {
    setIsModalVisible(false);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-8 card-container">
      {bookmarkData.map((job) => (
        <div key={job.id}>
          {getCard({
            logo: job.logo,
            companyName: job.company,
            jobName: job.title,
            location: job.location,
            time: job.jobTime,
            applied: checkAppliedJob(
              job,
              jwtDecode(localStorage.getItem("token")).userId
            ),
            bookmarked: checkUserBookmark(
              job,
              jwtDecode(localStorage.getItem("token")).userId
            ),
            onUnbookmark: () => handleUnbookmark(job._id, getBookmarks),
            apply: () => handleShowModal(job),
            withdraw: () => handleWithdrawJob(job._id, getBookmarks),
          })}
        </div>
      ))}
      {/* Modal component */}
      <Modal
        title="Confirm Apply"
        visible={isModalVisible}
        onCancel={handleCancelModal} // Hide the modal when the user clicks "Cancel"
        onOk={() => {
          if (selectedJob) {
            console.log("selectedJob");
            console.log(selectedJob.logo);
            handleApplyJob(selectedJob._id, getBookmarks);
          }
          setIsModalVisible(false); // Hide the modal
        }}
        okText="Apply"
        okButtonProps={{ ghost: true }}
      >
        {selectedJob && (
          <Card>
            <div className="card-header">
              <img src={selectedJob.logo} alt="Logo" className="logo" />
              <div class="text-xl font">{selectedJob.title}</div>
            </div>
            <div className="card-body">
              <div className="company-location-container">
                <div className="location">
                  <div class="text-lg font">{selectedJob.company}</div>
                </div>
                <div className="location">
                  <span className="location-icon">
                    <EnvironmentOutlined />
                  </span>
                  <div class="text-sm font-bold">{selectedJob.location}</div>
                </div>
              </div>
              <div className="company-location-container">
                <div className="location">
                  <span className="clock-icon">
                    <ClockCircleOutlined />
                  </span>
                  <div class="text-sm font-bold">{selectedJob.jobTime}</div>
                </div>
                <div className="location">
                  <div class="text-md font">{selectedJob.salary}</div>
                </div>
              </div>
              <div class="text-lg font-bold">Qualifications</div>
              <p>{selectedJob.desc}</p>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export const GetAppliedJobs = ({
  appliedJobsData,
  getAppliedJobs,
  getJobs,
}) => {
  useEffect(() => {
    getAppliedJobs();
  }, [getAppliedJobs]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-8 card-container">
      {appliedJobsData.map((job) => (
        <div>
          {getCard({
            logo: job.logo,
            companyName: job.company,
            jobName: job.title,
            location: job.location,
            time: job.jobTime,
            addBookmark: () => handleAddBookmark(job._id, getJobs),
            bookmarked: checkUserBookmark(
              job,
              jwtDecode(localStorage.getItem("token")).userId
            ),
            applied: checkAppliedJob(
              job,
              jwtDecode(localStorage.getItem("token")).userId
            ),
            onUnbookmark: () => handleUnbookmark(job._id, getJobs),
            withdraw: () => handleWithdrawJob(job._id, getJobs),
          })}
        </div>
      ))}
    </div>
  );
};

export const GetCreatedJobs = ({
  createdJobsData,
  getCreatedJobs,
  getJobs,
}) => {
  useEffect(() => {
    getCreatedJobs();
  }, [getCreatedJobs]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-8 card-container">
      {createdJobsData.map((job) => (
        <div>
          {GetCreatedCard({
            jobId: job._id,
            logo: job.logo,
            companyName: job.company,
            jobName: job.title,
            location: job.location,
            time: job.jobTime,
            applicants: job.appliedBy,
            deleteJob: () => handleDeleteJob(job._id),
          })}
        </div>
      ))}
    </div>
  );
};
