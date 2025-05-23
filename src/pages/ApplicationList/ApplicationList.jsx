import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ApplicationCard from "../../components/ApplicationCard/ApplicationCard";
import backendService from "../../Flask_service/flask";
import "../ApplicationList/ApplicationList.css";
import { useFlash } from "../../context/FlashContext";


const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const { setFlashMessage } = useFlash();
  const user = useSelector((state) => state.auth.userData); // Get user from Redux
  const role = user?.role;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        let response;
        if (role === "employer") {
          response = await backendService.getEmployerApplications();
        } else {
          response = await backendService.getJobSeekerApplications();
        }

        if (response.success) {
          setApplications(response.applications);
        }
      } catch (error) {
        setFlashMessage(`Error fetching applications: ${error}`, "error");
      }
    };
    fetchApplications();
  }, [role]);


  const handleUpdateApplicationStatus = (applicationId, action) => {
    if (action === "delete") {
      setApplications((prevApps) => prevApps.filter((app) => app.id !== applicationId));
    } else {
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === applicationId ? { ...app, application_status: action } : app
        )
      );
    }
  };

  const handleWithdrawApplication = (applicationId) => {
    setApplications(applications.filter((application) => application.id !== applicationId));
  };

  return (
    <>
      <h2 className="applications-head">Job Applications</h2>
      <section className="applications-container">
        {applications.length > 0 ? (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              userRole={role}
              userId={user.id}
              onUpdateStatus={handleUpdateApplicationStatus}
              onWithdraw={handleWithdrawApplication}
            />
          ))
        ) : (
          <p className="no-applications">No job applications received yet.</p>
        )}
      </section>
      </>
  );
};

export default JobApplications;
