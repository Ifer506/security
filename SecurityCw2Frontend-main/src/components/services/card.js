import { ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import "../../styles/card.css";
import { isAdmin } from "../global.js";
import { initializeModal } from "../modal";
import { GetUserData } from "./GetUserData";

export const getCard = ({
  logo,
  companyName,
  jobName,
  location,
  time,
  onUnbookmark,
  addBookmark,
  bookmarked,
  applied,
  apply,
  withdraw,
  deleteJob,
}) => {
  initializeModal();

  return (
    <div class="spacer">
      <Card className="custom-card">
        <div className="card-header">
          <img src={logo} alt="Logo" className="logo" />
          <div class="text-xl font">{companyName}</div>
          <span
            className="bookmark-icon"
            onClick={bookmarked ? onUnbookmark : addBookmark}
          >
            {bookmarked ? <BsBookmarkFill /> : <BsBookmark />}
          </span>
        </div>
        <div className="card-body">
          <div class="text-lg font">{jobName}</div>
          <div className="location">
            <span className="location-icon">
              <EnvironmentOutlined />
            </span>
            <div class="text-sm font-bold">{location}</div>
          </div>
          <div className="time">
            <span className="clock-icon">
              <ClockCircleOutlined />
            </span>
            <div class="text-sm font-bold">{time}</div>
          </div>
        </div>
        {isAdmin() && (
          <button
            class="btn btn-sm"
            onClick={() => window.deleteByAdmin.showModal()}
          >
            <AiOutlineDelete />
          </button>
        )}

        <button
          onClick={applied ? withdraw : apply}
          class="btn btn-sm card-footer"
        >
          {applied ? "Withdraw" : "Apply"}
        </button>
      </Card>
      <dialog id="deleteByAdmin" className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Delete Job !!!</h3>
          <p className="py-4">Are you sure you want to delete?</p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">No</button>
            <button className="btn" onClick={deleteJob}>
              Yes
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export const GetCreatedCard = ({
  logo,
  companyName,
  jobName,
  location,
  time,
  deleteJob,
  view,
  //   applicants,
  jobId,
}) => {
  initializeModal();

  return (
    <div className="spacer">
      <Card className="custom-card">
        <div className="card-header">
          <img src={logo} alt="Logo" className="logo" />
          <div className="text-xl font">{companyName}</div>
        </div>
        <div className="card-body">
          <div className="text-lg font">{jobName}</div>
          <div className="location">
            <span className="location-icon">
              <EnvironmentOutlined />
            </span>
            <div className="text-sm font-bold">{location}</div>
          </div>
          <div className="time">
            <span className="clock-icon">
              <ClockCircleOutlined />
            </span>
            <div className="text-sm font-bold">{time}</div>
          </div>
        </div>
        <div className="card-footer">
          <div style={{ marginRight: "10px" }}>
            <button
              class="btn btn-sm"
              onClick={() => window.deleteJobModel.showModal()}
            >
              <AiOutlineDelete />
            </button>
          </div>

          <GetUserData jobId={jobId} jobName={jobName} />
        </div>
      </Card>
      <dialog
        id="deleteJobModel"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Delete Job !!!</h3>
          <p className="py-4">Are you sure you want to delete?</p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">No</button>
            <button className="btn" onClick={deleteJob}>
              Yes
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};
