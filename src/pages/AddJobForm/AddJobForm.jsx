import React, { useState } from "react";
import backendService from "../../Flask_service/flask";
import { useFlash } from "../../context/FlashContext";
import { useNavigate } from "react-router-dom";
import { 
  FaBriefcase, FaBuilding, FaMapMarkerAlt, FaInfoCircle, FaDollarSign, FaClock, 
  FaUserMd, FaGraduationCap, FaHospital, FaCalendar, FaGift, FaEnvelope, FaPhone 
} from "react-icons/fa";
import "../AddJobForm/AddJobForm.css";

const AddJobForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
    employment_type: "Full-time",
    specialization: "",
    required_experience: "",
    required_qualifications: "",
    shift_timing: "Morning (8 AM - 4 PM)",
    job_type: "Hospital",
    application_deadline: "",
    benefits: "",
    contact_email: "",
    contact_phone: "",
  });

  const [loading, setLoading] = useState(false);
  const { setFlashMessage } = useFlash();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await backendService.addJob(formData);
      setFlashMessage(response.message, "success");
      navigate('/job-listings');
    } catch (err) {
      setFlashMessage("Failed to post job. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adjobs-container">
      <div className="adjobs-form-box">
        <h1 id="title">Add Job</h1>
        <form id="addJobForm" onSubmit={handleSubmit}>
          <div className="adjobs-input-group">

            {/* Job Title */}
            <div className="adjobs-input-field">
            <i><FaBriefcase /></i>
              <input type="text" placeholder="Job Title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            {/* Company Name */}
            <div className="adjobs-input-field">
            <i><FaBuilding /></i>
              <input type="text" placeholder="Company Name" name="company" value={formData.company} onChange={handleChange} required />
            </div>

            {/* Location */}
            <div className="adjobs-input-field">
            <i><FaMapMarkerAlt /></i>
              <input type="text" placeholder="Location" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            {/* Job Description */}
            <div className="adjobs-input-field">
             <i><FaInfoCircle /></i>
              <textarea placeholder="Job Description" name="description" value={formData.description} onChange={handleChange} required rows="4"></textarea>
            </div>

            {/* Salary */}
            <div className="adjobs-input-field">
            <i><FaDollarSign /></i>
              <input type="number" placeholder="Salary" name="salary" value={formData.salary} onChange={handleChange} step="0.01" required />
            </div>

            {/* Employment Type */}
            <div className="adjobs-input-field">
            <i><FaClock /></i>
              <select name="employment_type" value={formData.employment_type} onChange={handleChange} required>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Specialization */}
            <div className="adjobs-input-field">
            <i><FaUserMd /></i>
              <input type="text" placeholder="Specialization (e.g., Cardiology, Nursing)" name="specialization" value={formData.specialization} onChange={handleChange} />
            </div>

            {/* Required Experience */}
            <div className="adjobs-input-field">
            <i><FaBriefcase /></i>
              <input type="text" placeholder="Required Experience (e.g., 2+ years in ICU)" name="required_experience" value={formData.required_experience} onChange={handleChange} />
            </div>

            {/* Required Qualifications */}
            <div className="adjobs-input-field">
            <i><FaGraduationCap /></i>
              <input type="text" placeholder="Required Qualifications (e.g., MBBS, MD, B.Sc Nursing)" name="required_qualifications" value={formData.required_qualifications} onChange={handleChange} />
            </div>

            {/* Shift Timing */}
            <div className="adjobs-input-field">
            <i><FaClock /></i>
              <select name="shift_timing" value={formData.shift_timing} onChange={handleChange}>
                <option value="Morning (8 AM - 4 PM)">Morning (8 AM - 4 PM)</option>
                <option value="Evening (4 PM - 10 PM)">Evening (4 PM - 10 PM)</option>
                <option value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</option>
              </select>
            </div>

            {/* Job Type */}
            <div className="adjobs-input-field">
            <i><FaHospital /></i>
              <select name="job_type" value={formData.job_type} onChange={handleChange}>
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Clinic</option>
                <option value="Pharmaceutical">Pharmaceutical</option>
                <option value="Research">Research</option>
                <option value="Telemedicine">Telemedicine</option>
              </select>
            </div>

            {/* Application Deadline */}
            <div className="adjobs-input-field">
            <i><FaCalendar /></i>
              <input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleChange} min={new Date().toISOString().split("T")[0]} />
            </div>

            {/* Benefits */}
            <div className="adjobs-input-field">
            <i><FaGift /></i>
              <textarea placeholder="Benefits (e.g., Health Insurance, Free Accommodation)" name="benefits" value={formData.benefits} onChange={handleChange} rows="2"></textarea>
            </div>

            {/* Contact Email */}
            <div className="adjobs-input-field">
            <i><FaEnvelope /></i>
              <input type="email" placeholder="Contact Email" name="contact_email" value={formData.contact_email} onChange={handleChange} />
            </div>

            {/* Contact Phone */}
            <div className="adjobs-input-field">
            <i><FaPhone /></i>
              <input type="tel" placeholder="Contact Phone" name="contact_phone" value={formData.contact_phone} onChange={handleChange} />
            </div>

            {/* Submit Button */}
            <div className="adjobs-btn-field">
              <button type="submit" id="addJobBtn" disabled={loading}>
                {loading ? "Posting..." : "Post Job"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobForm;
