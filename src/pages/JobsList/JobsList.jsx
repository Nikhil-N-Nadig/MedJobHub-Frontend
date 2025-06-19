import React from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../../components/JobCard/JobCard";
import { useState,useEffect } from "react";
import backendService from "../../Flask_service/flask";
import { useSelector } from "react-redux";
import "../JobsList/JobsList.css"
import { useFlash } from "../../context/FlashContext";
import { Link } from "react-router-dom";
const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const { setFlashMessage } =useFlash()
  const user = useSelector((state) => state.auth.userData);
  const role = user?.role;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let response;
        if(!user){
          setFlashMessage("Please Login","error")
        } 
  
        if (role === "employer") {
          response = await backendService.getEmployerJobs();
        } else {
          response = await backendService.getAvailableJobs();
        }
        if (response.success) {
          setJobs(response.jobs);
        }
      } catch (error) {
        setFlashMessage(`Error fetching jobs: ${error}` ,"error");
      }
    };
  
    fetchJobs();
  }, [role]);

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
  };

  return (
    <>
      <h2 className="jobs-head">{role === "employer" ? "Your Jobs" : "Available Jobs"}</h2>
      <section className="job-container">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              userRole={role}
              userId={user.id}
              onDeleteJob={handleDeleteJob}
            />
          ))
        ) : (
          <p className="no-applications">No jobs available.</p>
        )}
      </section>

      {role === "employer" && (
        <>
          <p className="add-job-info">Click here to add more job opportunities and grow your team!</p>
          <div className="jobcard-btn-field">
            <Link to="/add-job">Add a New Job</Link>
          </div>
        </>
      )}
    </>
  );
};

export default JobListings;
