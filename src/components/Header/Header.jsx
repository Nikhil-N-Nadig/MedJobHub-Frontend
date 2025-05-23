import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "../Logout/Logout";
import "../Header/Header.css";

const images = {
  header_img: "https://res.cloudinary.com/dcslhsano/image/upload/v1743537217/z67scxkigrn9si4mgzv1.png"
};

function Header() {
  const location = useLocation();
  const user = useSelector((state) => state.auth.userData);
  const role = user?.role;

  // State to control mobile menu visibility
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="home-header">
      <div className="head-container">
        <div className="logo-title">
          <img src={images.header_img} alt="MedJobHub Logo" className="stethoscope-img no-select" />
          <h1 className="no-select">MedJobHub</h1>
        </div>

        {/* 🍔 Hamburger Button */}
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </button>

        {/* 📱 Mobile Navigation */}
        <div className={`mobile-nav ${menuOpen ? "show" : ""}`}>
          <ul>
            <li><Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/about" className={location.pathname === "/about" ? "active" : ""} onClick={toggleMenu}>About</Link></li>
            <li><Link to="/jobs" className={location.pathname.startsWith("/jobs") ? "active" : ""} onClick={toggleMenu}>Jobs</Link></li>
            <li><Link to="/contact-us" className={location.pathname === "/contact-us" ? "active" : ""} onClick={toggleMenu}>Contact</Link></li>

            {user ? (
              <>
                {role === "employer" && (
                  <>
                    <li><Link to="/job-listings" className={location.pathname === "/job-listings" ? "active" : ""} onClick={toggleMenu}>My Jobs</Link></li>
                    <li><Link to="/job-applications" className={location.pathname === "/job-applications" ? "active" : ""} onClick={toggleMenu}>Applications</Link></li>
                  </>
                )}
                {role === "job_seeker" && (
                  <>
                    <li><Link to="/job-listings" className={location.pathname === "/job-listings" ? "active" : ""} onClick={toggleMenu}>Find Jobs</Link></li>
                    <li><Link to="/job-applications" className={location.pathname === "/job-applications" ? "active" : ""} onClick={toggleMenu}>Applied Jobs</Link></li>
                  </>
                )}
                <li><Link to="/profile" className={location.pathname === "/profile" ? "active" : ""} onClick={toggleMenu}>Profile</Link></li>
                <li><Logout /></li>
              </>
            ) : (
              <>
                {location.pathname === "/signin" ? (
                  <li><Link to="/signup" className="active" onClick={toggleMenu}>Sign Up</Link></li>
                ) : location.pathname === "/signup" ? (
                  <li><Link to="/signin" className="active" onClick={toggleMenu}>Sign In</Link></li>
                ) : (
                  <li><Link to="/signin" className={location.pathname === "/signin" ? "active" : ""} onClick={toggleMenu}>Sign In</Link></li>
                )}
              </>
            )}
          </ul>
        </div>

        {/* 🌐 Desktop Navigation (Hidden on Small Screens) */}
        <nav>
          <ul>
            <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link></li>
            <li><Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link></li>
            <li><Link to="/jobs" className={location.pathname.startsWith("/jobs") ? "active" : ""}>Jobs</Link></li>
            <li><Link to="/contact-us" className={location.pathname === "/contact-us" ? "active" : ""}>Contact</Link></li>

            {user ? (
              <>
                {role === "employer" && (
                  <>
                    <li><Link to="/job-listings" className={location.pathname === "/job-listings" ? "active" : ""}>My Jobs</Link></li>
                    <li><Link to="/job-applications" className={location.pathname === "/job-applications" ? "active" : ""}>Applications</Link></li>
                  </>
                )}
                {role === "job_seeker" && (
                  <>
                    <li><Link to="/job-listings" className={location.pathname === "/job-listings" ? "active" : ""}>Find Jobs</Link></li>
                    <li><Link to="/job-applications" className={location.pathname === "/job-applications" ? "active" : ""}>Applied Jobs</Link></li>
                  </>
                )}
                <li><Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>Profile</Link></li>
                <li><Logout /></li>
              </>
            ) : (
              <>
                <li><Link to="/signin" className={location.pathname === "/signin" ? "active" : ""}>Sign In</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
