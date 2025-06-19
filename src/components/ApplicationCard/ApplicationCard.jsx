import React, { useState } from "react";
import "../ApplicationCard/ApplicationCard.css";
import backendService from "../../Flask_service/flask";
import { useFlash } from "../../context/FlashContext";
import ConfirmModal from "../ConfirmModel/ConfirmModel";
import { Link } from "react-router-dom";

const ApplicationCard = ({ application, userRole, userId, onUpdateStatus, onWithdraw }) => {
  const [status, setStatus] = useState(application.application_status);
  const { setFlashMessage } = useFlash();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [withdrawing, setWithdrawing] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const confirmDeleteApplication = async () => {
    setWithdrawing(true); 
    try {
      const response = await backendService.deleteApplication(application.id);
      if (response.success) {
        setFlashMessage("Application withdrawn successfully!", "success");
        onWithdraw(application.id); 
      } else {
        setFlashMessage(response.message || "Failed to withdraw application.", "error");
      }
    } catch (error) {
      setFlashMessage("An error occurred while withdrawing the application", "error");
    }
    setWithdrawing(false); 
    closeModal();
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    try {
      const response = await backendService.updateApplicationStatus(application.id, status);
      if (response.success) {
        setFlashMessage(response.message, "success");

        if (status === "Rejected") {
          onUpdateStatus(application.id, "delete");
        } else {
          onUpdateStatus(application.id, status);
        }
      } else {
        setFlashMessage(response.message || "An error occurred while updating status", "error");
      }
    } catch (error) {
      setFlashMessage(error || "An error occurred while updating the status.", "error");
    }
    setLoading(false); 
  };

  return (
    <>
      <div className="application-card">
        <h3>{application.applicant_name}</h3>
        <p><strong>Applied To:</strong> {application.job.title}</p>
        <p><strong>Email:</strong> {application.email}</p>
        <p><strong>Phone:</strong> {application.phone}</p>
        <p><strong>Qualifications:</strong> {application.qualifications}</p>
        <p><strong>Experience:</strong> {application.experience}</p>
        <p><strong>Preferred Shift:</strong> {application.preferred_shift}</p>
        <p><strong>Expected Salary:</strong> ₹{application.expected_salary.toFixed(2)} LPA</p>
        <p><strong>Applied On:</strong> {new Date(application.applied_on).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
        <p><strong>Status:</strong> {status}</p>
        <p>
          <strong>Resume:</strong> 
          <a href={application.resume_link} target="_blank" rel="noopener noreferrer" className="text-blue-600"> View Applicant's Resume</a>
        </p>

        {userRole === "employer" && userId === application.job.posted_by ? (
            <>
              <form onSubmit={handleUpdateStatus} className="status-form">
                <label htmlFor="status">Update Status:</label>
                <select value={status} onChange={handleStatusChange} required>
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button type="submit" className="update-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update"}
                </button>
              </form>
              
              <Link
                to={`/chat/${userId}/${application.applicant.id}`}
                className="appli-apply-btn"
                style={{ marginTop: "5px" }}
              >
                Chat with Candidate
              </Link>
            </>
          ) : (
            <>
              <button type="button" className="appli-apply-btn" onClick={openModal} disabled={withdrawing}>
                {withdrawing ? "Withdrawing..." : "Withdraw Application"}
              </button>

              <Link
                to={`/chat/${userId}/${application.job.posted_by}`}
                className="appli-apply-btn"
                style={{ marginTop: "5px", backgroundColor: "#2e8b57" }}
              >
                Chat with Employer
              </Link>
            </>
          )}
      </div>

      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <ConfirmModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onConfirm={confirmDeleteApplication} 
          message="Are you sure you want to withdraw this application?" 
        />
      )}
    </>
  );
};

export default ApplicationCard;
