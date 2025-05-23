import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import jobData from "../../data/jobs.js"; 
import "../../pages/Jobs/Jobs.css";

const JobDetails = () => {
  const { jobType } = useParams(); 
  const location = useLocation();
  const job = jobData[jobType];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!job) {
    return <h2 className="error-message">Job Not Found</h2>; 
  }

  return (
    <>
      <h1 className="title">{job.title}</h1>
      <div className="content">
        <div className="text-section">
          <h2>Description</h2>
          <p>{job.description}</p>
        </div>
        <div className="image-container">
          <img src={job.image} alt={`${job.title} Responsibilities`} className="job-image" />
        </div>
      </div>
      <div className="responsibilities-container">
        <div className="responsibilities-border">
          <h2>Key Responsibilities and Opportunities</h2>
          <p>As a {job.title}, your responsibilities will include:</p>
          <div className="key-responsibilities">
            {job.responsibilities.map((item, index) => (
              <div className="responsibility-card" key={index}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="slogan-section">
          <h2 className="slogan">{job.slogan}</h2>
          <button className="apply-btn">Apply Now</button>
        </div>
      </div>
      </>
  );
};

export default JobDetails;
