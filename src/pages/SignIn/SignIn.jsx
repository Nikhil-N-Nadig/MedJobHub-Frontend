import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../SignIn/SignIn.css";
import { FaUser, FaLock } from "react-icons/fa";
import backendService from "../../Flask_service/flask";
import { useDispatch } from "react-redux";
import { login as authlogin } from "../../store/authSlice";
import { useFlash } from "../../context/FlashContext";

const SignIn = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setFlashMessage } = useFlash();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await backendService.signin(formData);
      setFlashMessage(response.message, "success");

      if (response.success) {
        if (response.otp_required) {
          navigate(`/verify-otp?username=${formData.username}`);
        } else {
          dispatch(authlogin({ userData: response.user }));
          localStorage.setItem("userData", JSON.stringify(response.user));
          localStorage.setItem("authToken", response.user.auth_token);
          navigate("/");
        }
      } else {
        setFlashMessage(response.message, "error");
      }
    } catch (error) {
      setFlashMessage("Can't get data from the server", "error");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="signin-container1">
      <div className="signin-form-box">
        <h1 id="title">Sign In</h1>
        <form id="loginForm" method="POST" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="signin-input-field">
              <i><FaUser size="16px" /></i>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="signin-input-field">
              <i><FaLock size="16px" /></i>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="signin-btn-field">
          <button type="submit" id="loginBtn" disabled={loading}>
            {loading ? (
              <>
                Signing in... <span className="loader"></span>
              </>
            ) : (
              "Login"
            )}
          </button>
          </div>
        </form>
        <p>
          Don't have an account?<Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
