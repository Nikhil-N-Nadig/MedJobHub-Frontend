import { useState } from "react";
import { FaUser, FaPhone, FaEnvelope, FaAddressCard, FaVenusMars, FaCalendar, FaBriefcase, FaBuilding, FaFile, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import backendService from "../../Flask_service/flask";
import "../SignUp/SignUp.css";
import { useFlash } from "../../context/FlashContext";

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    age: "",
    role: "",
    company_name: "",
    resume: null,
    password: "",
    confirm_password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const { setFlashMessage } = useFlash();
  const [showCompanyField, setShowCompanyField] = useState(false);
  const [showResumeField, setShowResumeField] = useState(false);
  const [fileName, setFileName] = useState("Attach Resume");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      setFileName(files[0]?.name || "Attach Resume");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData({ ...formData, role, company_name: "", resume: null });
    setShowCompanyField(role === "employer");
    setShowResumeField(role === "job_seeker");
    setFileName("Attach Resume");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setFlashMessage("Passwords do not match!", "error");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    setLoading(true);
    try {
      const response = await backendService.signup(formDataToSend);
      if (response.success) {
        setFlashMessage(response.message, "success");
        navigate(`/signin`);
      } else {
        setFlashMessage(response.message || "Sign-up failed!", "error");
      }
    } catch (error) {
      setFlashMessage("Signup Failed in Backend Service. Try Again", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-box">
        <h1 id="title">Sign Up</h1>
        <form id="signupForm" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="input-group">
            <div className="signup-input-field">
              <i><FaUser /></i>
              <input type="text" placeholder="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required pattern="[A-Za-z]+" title="First name should contain only letters." />
            </div>
            <div className="signup-input-field">
              <i><FaUser /></i>
              <input type="text" placeholder="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required pattern="[A-Za-z]+" title="Last name should contain only letters." />
            </div>
            <div className="signup-input-field">
              <i><FaUser /></i>
              <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} required pattern=".{3,}" title="Username must be at least 3 characters long." />
            </div>
            <div className="signup-input-field">
              <i><FaPhone /></i>
              <input type="tel" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" title="Phone number must be 10 digits." />
            </div>
            <div className="signup-input-field">
              <i><FaEnvelope /></i>
              <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="signup-input-field">
              <i><FaAddressCard /></i>
              <textarea placeholder="Address" name="address" value={formData.address} onChange={handleChange} required minLength="5" rows="4" cols="30" style={{ resize: "none" }} />
            </div>
            <div className="signup-input-field">
              <i><FaVenusMars /></i>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="signup-input-field">
              <i><FaCalendar /></i>
              <input type="number" placeholder="Age" name="age" value={formData.age} onChange={handleChange} required min="18" max="100" title="Age must be between 18 and 100." />
            </div>
            <div className="signup-input-field">
              <i><FaBriefcase /></i>
              <select name="role" value={formData.role} onChange={handleRoleChange} required>
                <option value="" disabled>Select Role</option>
                <option value="job_seeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>
            {showCompanyField && (
              <div className="signup-input-field">
                <i><FaBuilding /></i>
                <input type="text" placeholder="Company Name" name="company_name" value={formData.company_name} onChange={handleChange} />
              </div>
            )}
            {showResumeField && (
              <div className="signup-input-field" id="resumeField">
                <i><FaFile /></i>
                <span className="file-name">{fileName}</span>
                <input type="file" name="resume" accept=".pdf,.doc,.docx" id="resumeInput" onChange={handleChange} />
                <label htmlFor="resumeInput">Choose File</label>
              </div>
            )}
            <div className="signup-input-field">
              <i><FaLock /></i>
              <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required pattern=".{8,}" title="Password must be at least 8 characters long." />
            </div>
            <div className="signup-input-field">
              <i><FaLock /></i>
              <input type="password" placeholder="Confirm Password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required pattern=".{8,}" title="Passwords must match." />
            </div>
          </div>
          <div className="signup-btn-field">
            <button type="submit" disabled={loading}>
              {loading ? (
              <>
                Registering... <span className="loader"></span>
              </>
              )
               :( "Register"
               )}
            </button>
          </div>
        </form>
        <p>Already have an account? <a href="/signin">Sign In</a></p>
      </div>
    </div>
  );
};

export default SignUp;
