import React from "react";
import { replace, useNavigate} from 'react-router-dom'
import '../Home/Home.css'
import { useState } from "react";
import { Link } from "react-router-dom";
import { useFlash } from "../../context/FlashContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faHospital, faBriefcase, faTrophy, faHeartbeat, faUserMd, faLaptop } from "@fortawesome/free-solid-svg-icons";
const url="https://res.cloudinary.com/dcslhsano/image/upload/"
const images={
  hero_image:"v1743535932/n7xzhsu5fuyeoeryquh0.png",
  avatar1:"v1743536239/gbjda07sjxk0oumygck4.jpg",
  avatar2:"v1743564219/ornc0hyiton6bqgfhdum.jpg",
  avatar3:"v1743536326/lxyotfms3x5wd4yyd0ok.jpg",
  avatar4:"v1743536352/psrgbgmv4vm0degtbqch.jpg"
}

const Home=()=>{
    const navigate=useNavigate()

    const [subscribed, setSubscribed] = useState(false);
    const { setFlashMessage } = useFlash();
  const handleSubscribe = (event) => {
    event.preventDefault();
    setFlashMessage("🎉 Thank you for subscribing! 🎉","success");
    setSubscribed(true);
  };
    return (
    <>
    <div className="hero">
      <div className="hero-content">
        <h1>Find Your Dream Medical Career</h1>
        <p>
          We connect healthcare professionals with leading employers in the
          industry, helping you advance your career while ensuring organizations
          have access to the best talent. Join us and unlock a world of
          opportunities tailored to your skills and ambitions.
        </p>
        <button onClick={()=>navigate('/job-listings',{replace:true})} className="cta-button">Get Started</button>
      </div>
      <div className="hero-image">
       <img src={`${url}${images["hero_image"]}`} alt="Healthcare Professional" />
      </div>
    </div>
    
    <div className="search-bar">
      <form>
        <div className="search-field">
          <input type="text" placeholder="Job Title" />
        </div>
        <div className="search-field">
          <input type="text" placeholder="Location" />
        </div>
        <div className="search-field">
          <select>
            <option value="">Select Specialization</option>
            <option value="DMLT">
              Diploma in Medical Laboratory Technology (DMLT)
            </option>
            <option value="DMIT">
              Diploma in Medical Imaging Technology (DMIT)
            </option>
            <option value="DHI">Diploma in Health Inspector (DHI)</option>
            <option value="DMRT">
              Diploma in Medical Records Technology (DMRT)
            </option>
            <option value="DOTAT">
              Diploma in Operation Theatre and Anaesthesia Technology (DOT & AT)
            </option>
            <option value="DDT">Diploma in Dialysis Technology (DDT)</option>
            <option value="DOT">Diploma in Ophthalmic Technology (DOT)</option>
            <option value="DDM">Diploma in Dental Mechanics (DDM)</option>
            <option value="DDH">Diploma in Dental Hygiene (DDH)</option>
          </select>
        </div>
        <button type="submit">Search</button>
      </form>
    </div>

    <section className="impact">
      <h1>Our Impact</h1>
      <div className="container">
        <div className="stat-card">
         <i> <FontAwesomeIcon icon={faUsers}/></i>
          <h2>10,000+</h2>
          <p>Healthcare Professionals</p>
        </div>
        <div className="stat-card">
         <i> <FontAwesomeIcon icon={faHospital} /></i>
          <h2>500+</h2>
          <p>Healthcare Facilities</p>
        </div>
        <div className="stat-card">
         <i> <FontAwesomeIcon icon={faBriefcase} /></i>
          <h2>250+</h2>
          <p>Job Listings</p>
        </div>
        <div className="stat-card">
         <i> <FontAwesomeIcon icon={faTrophy} /></i>
          <h2>98%</h2>
          <p>Success Rate</p>
        </div>
      </div>
    </section>
    
    <section className="why-choose">
      <h1>Why Choose MedJobHub?</h1>
      <div className="benefits">
        <div className="benefit-item">
          <div className="icon-wrapper">
            <i><FontAwesomeIcon icon={faHeartbeat}/></i>
          </div>
          <h3>Healthcare Focused</h3>
          <p>
            We specialize in connecting healthcare professionals with the right
            employers, ensuring the best fit for both parties.
          </p>
        </div>
        <div className="benefit-item">
          <div className="icon-wrapper">
            <i><FontAwesomeIcon icon={faUserMd}/></i>
          </div>
          <h3>Experienced Professionals</h3>
          <p>
            Partner with top medical experts who understand the unique demands
            of the healthcare industry.
          </p>
        </div>
        <div className="benefit-item">
          <div className="icon-wrapper">
            <i><FontAwesomeIcon icon={faLaptop}/></i>
          </div>
          <h3>Online Job Portal</h3>
          <p>
            Enjoy a seamless experience on our easy-to-use platform designed for
            job seekers and employers alike.
          </p>
        </div>
      </div>
    </section>

    <section className="featured-jobs">
      <h1>Featured Jobs</h1>
      <div className="home-jobs-container">
        <div className="home-job-card">
          <h3>Medical Officer</h3>
          <p><strong>Location:</strong> New York</p>
          <p><strong>Experience:</strong> 5+ years</p>
          <p><strong>Job Type:</strong> Full-Time</p>
          <p><strong>Salary:</strong> $100,000 - $120,000/year</p>
          <p>
            A challenging role for experienced medical officers to provide
            quality care in a fast-paced hospital environment.
          </p>
          <Link to="/job-listings" className="apply-button">Apply Now</Link>
        </div>
        <div className="home-job-card">
          <h3>Laboratory Technician</h3>
          <p><strong>Location:</strong> California</p>
          <p><strong>Experience:</strong> 3+ years</p>
          <p><strong>Job Type:</strong> Contract</p>
          <p><strong>Salary:</strong> $60,000 - $75,000/year</p>
          <p>
            Join a cutting-edge lab to perform critical tests and contribute to
            groundbreaking healthcare innovations.
          </p>
          <Link to="/job-listings" className="apply-button">Apply Now</Link>
        </div>
        <div className="home-job-card">
          <h3>Health Inspector</h3>
          <p><strong>Location:</strong> Texas</p>
          <p><strong>Experience:</strong> 2+ years</p>
          <p><strong>Job Type:</strong> Part-Time</p>
          <p><strong>Salary:</strong> $40,000 - $50,000/year</p>
          <p>
            Inspect and ensure healthcare facilities meet regulatory standards
            while maintaining public safety.
          </p>
          <Link to="/job-listings" className="apply-button">Apply Now</Link>
        </div>
        <div className="home-job-card">
          <h3>Lab Technician</h3>
          <p><strong>Location:</strong> Dallas</p>
          <p><strong>Experience:</strong> 1+ years</p>
          <p><strong>Job Type:</strong> Internship</p>
          <p><strong>Salary:</strong> $20,000 - $25,000/year</p>
          <p>
            Great opportunity for recent graduates to gain hands-on experience
            in laboratory procedures and technologies.
          </p>
          <Link to="/job-listings" className="apply-button">Apply Now</Link>
        </div>
      </div>
    </section>

    <section className="user-stories">
      <h1>What Healthcare Professionals Say</h1>
      <div className="story-cards">
        <div className="story-card">
          <img src={`${url}${images["avatar1"]}`} alt="John D." className="user-photo" />
          <div className="card-content">
            <p className="quote">
              "I found my dream job in just two weeks! The platform is easy to
              use, and I loved how quickly I could apply to top companies."
            </p>
            <div className="rating">★★★★☆</div>
            <h4>John D.</h4>
            <p className="user-role">Cardiologist</p>
          </div>
        </div>
        <div className="story-card">
          <img src={`${url}${images["avatar2"]}`} alt="Sarah M." className="user-photo" />
          <div className="card-content">
            <p className="quote">
              "This site helped me land a job in marketing at a leading firm.
              The job search experience was smooth and professional."
            </p>
            <div className="rating">★★★★★</div>
            <h4>Sarah M.</h4>
            <p className="user-role">Medical Marketing Manager</p>
          </div>
        </div>
        <div className="story-card">
          <img src={`${url}${images["avatar3"]}`} alt="Emily T." className="user-photo" />
          <div className="card-content">
            <p className="quote">
              "I never thought I'd find such a great role in a city I love.
              Thanks to this portal, I now work at an amazing tech company."
            </p>
            <div className="rating">★★★★☆</div>
            <h4>Emily T.</h4>
            <p className="user-role">Medical Data Analyst</p>
          </div>
        </div>
        <div className="story-card">
          <img src={`${url}${images["avatar4"]}`} alt="Sarah" className="user-photo" />
          <div className="card-content">
            <p className="quote">
              "MedJob made it easy to find what I was looking for and helped me
              connect with employers who truly appreciated my skills."
            </p>
            <div className="rating">★★★★☆</div>
            <h4>Sarah</h4>
            <p className="user-role">Medical Lab Technician</p>
          </div>
        </div>
      </div>
    </section>
   
    <div className="content-wrapper">
      <div className="video-container">
        <iframe
          src="https://www.youtube.com/embed/HXkIBRMCrW8" 
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen>
          </iframe>
      </div>
    <div className="subscription-box">
      <h2>Stay Connected</h2>
      <p>Subscribe to receive newsletters, magazines, and notifications.</p>

      <form onSubmit={handleSubscribe}>
          <input type="text" placeholder="Enter Your Name" required />
          <input type="email" placeholder="Enter Your Email" required />
          <input type="tel" placeholder="Enter Your Phone Number" required />
          {subscribed ? (
          <button disabled >Subscribed</button>
      ) : (
        <button type="submit">Subscribe</button>
      )}
        </form>
    </div>
    </div>
    </>
  );
};

export default Home;