import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import backendService from "../../Flask_service/flask";
import { logout as authlogout } from "../../store/authSlice";
import { useFlash } from "../../context/FlashContext";
import ConfirmModal from "../ConfirmModel/ConfirmModel";
import { useState } from "react";
const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setFlashMessage } = useFlash();
  
    const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };

    const handleLogout = async () => {
      try {
          const token = localStorage.getItem("authToken");

          if (token) {
              const response = await backendService.logout();
              if (response.success) {
                  localStorage.removeItem("userData");
                  localStorage.removeItem("authToken");
                  dispatch(authlogout());

                  setFlashMessage(response.message, "success");
                  navigate("/signin");
                  return;
              }
          }

          //If cant get token then logout in state
          localStorage.removeItem("userData");
          localStorage.removeItem("authToken");
          dispatch(authlogout());
          navigate("/signin");

      } catch (error) {
          setFlashMessage("Error logging out: Try Again", "error");
      }
  };

  
    return (
        <>
            <button className="logout-btn" onClick={openModal}>Logout</button>

            {isModalOpen && (
        <ConfirmModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onConfirm={handleLogout} 
          message="Are you sure you want to log out?"
        />
      )}
        </>
    )
  };

  export default Logout;