import React, { useState, useEffect } from "react";
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

  // populate form from redux user / server profile if available
  useEffect(() => {
    const mergeProfile = async () => {
      try {
        // first try values from redux user
        const fromUser = {};
        if (user) {
          const name = user.name || `${(user.first_name || "").trim()} ${(user.last_name || "").trim()}`.trim();
          if (name) fromUser.applicant_name = name;
          if (user.email) fromUser.email = user.email;
          if (user.phone) fromUser.phone = user.phone;
          // profile may be nested
          const prof = user.profile || user.user_profile || {};
          if (prof) {
            if (prof.qualifications) fromUser.qualifications = prof.qualifications;
            if (prof.experience) fromUser.experience = prof.experience;
            if (prof.expected_salary) fromUser.expected_salary = prof.expected_salary;
          }
        }

        // if some important fields still missing, try fetch current user profile
        const needsFetch = !fromUser.email || !fromUser.phone || !fromUser.applicant_name;
        if (needsFetch) {
          try {
            const resp = await backendService.getCurrentUserProfile();
            // prefer resp.user, then resp.profile, then resp.data
            const profile = resp?.user || resp?.profile || resp?.data || {};
            if (profile) {
              // combine first_name + last_name if available
              const first = (profile.first_name || "").trim();
              const last = (profile.last_name || "").trim();
              const combined = [first, last].filter(Boolean).join(" ");
              const fallbackName = profile.full_name || profile.name || "";
              if (combined || fallbackName) {
                fromUser.applicant_name = fromUser.applicant_name || combined || fallbackName;
              }
              if (profile.email) fromUser.email = fromUser.email || profile.email;
              if (profile.phone) fromUser.phone = fromUser.phone || profile.phone;
              // keep other profile fields if present
              if (profile.qualifications) fromUser.qualifications = fromUser.qualifications || profile.qualifications;
              if (profile.experience) fromUser.experience = fromUser.experience || profile.experience;
              if (profile.expected_salary) fromUser.expected_salary = fromUser.expected_salary || profile.expected_salary;
            }
          } catch (e) {
            // ignore, fallback to whatever we had from redux
          }
        }

        // merge into state (do not overwrite any manual changes if already present)
        setFormData((prev) => ({ ...prev, ...fromUser }));
      } catch (e) {
        // noop
      }
    };
    mergeProfile();
  }, [user]);

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
