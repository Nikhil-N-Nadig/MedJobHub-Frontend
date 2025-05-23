import React, { useState } from "react";
import { useSelector } from "react-redux";
import backendService from "../../Flask_service/flask";
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBriefcase, FaClock, FaDollarSign, FaFileAlt } from "react-icons/fa";
import { useFlash } from "../../context/FlashContext";
import { useParams, useNavigate } from "react-router-dom";
import "../AddApplicationForm/AddApplicationForm.css";

const ApplyJobForm = () => {
  const [formData, setFormData] = useState({
    applicant_name: "",
    email: "",
    phone: "",
    qualifications: "",
    experience: "",
    preferred_shift: "",
    expected_salary: "",
    cover_letter: ""
  });
  
  const [loading, setLoading] = useState(false);
  const { setFlashMessage } = useFlash();
  const { job_id } = useParams();  
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.userData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedFormData = {
      ...formData,
      resume_link: user?.resume || ""
    };

    try {
      const response = await backendService.applyJob(job_id, updatedFormData);
      setFlashMessage(response.message, "success");
      navigate('/job-applications');
    } catch (err) {
      setFlashMessage("Error Occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobapli-container1">
      <div className="jobapli-form-box">
        <h1 id="title">Apply for</h1>
        <form id="applyJobForm" onSubmit={handleSubmit}>
          <div className="jobapli-input-group">
            <div className="jobapli-input-field">
              <i><FaUser /></i>
              <input 
                type="text" 
                placeholder="Full Name" 
                name="applicant_name" 
                value={formData.applicant_name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="jobapli-input-field">
              <i><FaEnvelope /></i>
              <input 
                type="email" 
                placeholder="Email Address" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="jobapli-input-field">
              <i><FaPhone /></i>
              <input 
                type="text" 
                placeholder="Phone Number" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
            </div>
            {/* Removed the manual resume link field */}
            <div className="jobapli-input-field">
              <i><FaGraduationCap /></i>
              <input 
                type="text" 
                placeholder="Qualifications" 
                name="qualifications" 
                value={formData.qualifications} 
                onChange={handleChange} 
              />
            </div>
            <div className="jobapli-input-field">
              <i><FaBriefcase /></i>
              <input 
                type="text" 
                placeholder="Experience" 
                name="experience" 
                value={formData.experience} 
                onChange={handleChange} 
              />
            </div>
            <div className="jobapli-input-field">
              <i><FaClock /></i>
              <input 
                type="text" 
                placeholder="Preferred Shift" 
                name="preferred_shift" 
                value={formData.preferred_shift} 
                onChange={handleChange} 
              />
            </div>
            <div className="jobapli-input-field">
              <i><FaDollarSign /></i>
              <input 
                type="text" 
                placeholder="Expected Salary" 
                name="expected_salary" 
                value={formData.expected_salary} 
                onChange={handleChange} 
              />
            </div>
            <div className="jobapli-input-field">
              <i><FaFileAlt /></i>
              <textarea 
                placeholder="Cover Letter (Optional)" 
                name="cover_letter" 
                value={formData.cover_letter} 
                onChange={handleChange} 
                rows="5"
              ></textarea>
            </div>
            <div className="jobapli-btn-field">
              <button type="submit" id="applyJobBtn" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobForm;
