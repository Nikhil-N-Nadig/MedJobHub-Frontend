import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaBuilding, FaMapMarkerAlt, FaMoneyBill } from "react-icons/fa";
import "./JobInfo.css"
import { useSelector } from "react-redux";
import backendService from "../../Flask_service/flask";
import { useFlash } from "../../context/FlashContext";
import { Link } from "react-router-dom";
const JobInfo = () => {
  const { job_id } = useParams();
  const { setFlashMessage } = useFlash();
  const user = useSelector((state) => state.auth.userData);
  const role = user?.role;

  const [job,setJob]=useState(null)
  const handleFetchJobDetails = async (job_id) => {
    try {
      const response = await backendService.getJobDetails(job_id); 
      if (response.success) {
        setJob(response.job);
      } else {
        setFlashMessage(response.message || "Failed to fetch job details", "error");
      }
    } catch (error) {
      setFlashMessage(error?.message || "An error occurred while fetching job details.", "error");
    }
  };

  useEffect(() => {
    handleFetchJobDetails(job_id);
  }, [job_id]);
  
  if (!job) {
    return <p>Loading job details...</p>;
  }
  return (
    <div className="job-details-container">
      <div className="job-details-card">
        <div className="job-box">
          <h2 className="job-title">{job.title}</h2>
          <p className="company-name">
            <FaBuilding /> {job.company}
          </p>
          <p className="job-location">
            <FaMapMarkerAlt /> {job.location}
          </p>
          <p className="job-salary">
            <FaMoneyBill /> ₹{parseFloat(job.salary).toFixed(2)} LPA
          </p>
          <p className="posted-date">
            <strong>Posted On:</strong> {new Date(job.posted_on).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>

        <div className="job-description">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="additional-details">
          <p><strong>Employment Type:</strong> {job.employment_type}</p>
          <p><strong>Specialization:</strong> {job.specialization || "Not specified"}</p>
          <p><strong>Experience Required:</strong> {job.required_experience || "Not specified"}</p>
          <p><strong>Qualifications:</strong> {job.required_qualifications || "Not specified"}</p>
          <p><strong>Shift Timing:</strong> {job.shift_timing || "Not specified"}</p>
          <p><strong>Job Type:</strong> {job.job_type}</p>
          <p><strong>Application Deadline:</strong> {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not specified"}</p>
        </div>

        <div className="job-benefits">
          <h3>Benefits</h3>
          <p>{job.benefits || "Not specified"}</p>
        </div>

        <div className="contact-info">
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> {job.contact_email || "Not provided"}</p>
          <p><strong>Phone:</strong> {job.contact_phone || "Not provided"}</p>
        </div>

        {role === "job_seeker" && (
          <div className="apply-btn-container">
            <Link to={`/apply-job/${job_id}`} className="apply-btn">
                Apply Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobInfo;
