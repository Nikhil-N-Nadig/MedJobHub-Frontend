import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaKey } from "react-icons/fa";
import backendService from "../../Flask_service/flask";
import "../SignIn/SignIn.css";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../store/authSlice";
import { useFlash } from "../../context/FlashContext";

const Verifyotp = () => {
    const { setFlashMessage } = useFlash();
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // Extract username from URL query params
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get("username");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await backendService.verifyOtp({ username, otp });

            if (response.success) {
                const user= response.user;
                localStorage.setItem("authToken", user.auth_token);
                localStorage.setItem("userData", JSON.stringify(user));

                dispatch(authLogin({ userData: user }));

                setFlashMessage("OTP Verified Successfully!", "success");
                navigate("/");
            } else {
                setFlashMessage(response.message || "OTP verification failed!", "error");
            }
        } catch (err) {
            console.log("Verify otp error :",err)
            setFlashMessage("OTP verification failed at Backend service! Try Again.", "error");
        }
    };

    return (
        <div className="signin-container1">
            <div className="signin-form-box">
                <h1 id="signin-title">Sign In</h1>
                <h2 id="signin-otpTitle">Enter OTP</h2>
                <form id="signin-otpForm" onSubmit={handleSubmit}>
                    <div className="signin-input-group">
                        <div className="signin-input-field">
                            <FaKey />
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                id="signin-otpInput"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="signin-btn-field">
                        <button type="submit" id="signin-verifyOtpBtn">Verify OTP</button>
                    </div>
                </form>
                <p>
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Verifyotp;
