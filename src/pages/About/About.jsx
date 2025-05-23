import React from "react";
import '../About/About.css'
import { useFlash } from "../../context/FlashContext";
import { useState } from "react";
import { 
  FaHandshake, FaCogs, FaBolt, FaCheckCircle, 
  FaNetworkWired, FaHeadset, FaBriefcase, 
  FaHospital, FaUserMd 
} from "react-icons/fa";
const images={
  hero_image:"https://res.cloudinary.com/dcslhsano/image/upload/v1743536741/ook08x8rqseeuzxjkrbn.jpg"
}


const About = () => {
  const [subscribed, setSubscribed] = useState(false);
      const { setFlashMessage } = useFlash();
    const handleSubscribe = (event) => {
      event.preventDefault();
      setFlashMessage("🎉 Thank you for subscribing! 🎉","success");
      setSubscribed(true);
    };
  return (
    <>
    <div className="about">
      {/* Hero Section */}
      <header className="about-hero">
        <div className="about-hero-content">
          <h1>About MedJobHub</h1>
          <p>
            Welcome to MedJobHub, where we connect passion with purpose. Our platform 
            is designed to create a seamless bridge between healthcare professionals 
            and institutions, ensuring that every opportunity meets its perfect match.
            We’re redefining healthcare recruitment for a better tomorrow.
          </p>
        </div>
        <img src={images['hero_image']} alt="Healthcare professionals" className="about-hero-image" />
      </header>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="content-container">
          <h2>Our Mission</h2>
          <div className="card">
            <div className="card-icon">🎯</div>
            <p>
              To empower medical professionals and healthcare institutions by offering 
              a transparent, accessible, and innovative recruitment platform.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">💡</div>
            <p>
              To simplify job opportunities and workforce management with technology-driven 
              solutions, fostering trust and meaningful connections.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">🤝</div>
            <p>
              To address staffing challenges, ensuring healthcare providers deliver exceptional care 
              across urban and rural communities.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="content-container">
          <h2>Our Vision</h2>
          <div className="card">
            <div className="card-icon">🌍</div>
            <p>
              To become India’s most trusted healthcare recruitment platform, improving 
              workforce distribution and healthcare accessibility nationwide.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">📈</div>
            <p>
              To elevate healthcare standards by bridging the gap between urban and rural 
              systems, enabling equitable access to quality care.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">✨</div>
            <p>
              To create a sustainable impact on communities by connecting the right 
              talent with the right opportunities, fostering excellence and inclusivity.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="value-cards-container">
          <div className="value-card">
            <i className="fa-handshake"> <FaHandshake /> </i>
            <h4>Integrity</h4>
            <p>We operate with honesty and transparency, building trust with both job seekers and employers.</p>
          </div>
          <div className="value-card">
           <i className="fa-cogs"> <FaCogs /> </i>
            <h4>Innovation</h4>
            <p>Our platform leverages the latest technology to provide efficient and accessible recruitment solutions.</p>
          </div>
          <div className="value-card">
          <i className="fa-bolt">  <FaBolt /></i>
            <h4>Impact</h4>
            <p>We focus on making a meaningful difference in the healthcare sector by addressing critical staffing gaps.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-us-section">
        <div className="why-container">
          <h2>Why Choose MedJobHub?</h2>
          <div className="reasons">
            <div className="reason">
             <i > <FaCheckCircle /> </i>
              <div className="line"></div>
              <div className="reason-text">
                <h3>Streamlined Recruitment</h3>
                <p>Our user-friendly platform ensures a hassle-free experience for both job seekers and recruiters.</p>
              </div>
            </div>
            <div className="reason">
             <i > <FaNetworkWired /> </i>
              <div className="line"></div>
              <div className="reason-text">
                <h3>Pan-India Network</h3>
                <p>We connect professionals and institutions from urban hubs to remote rural areas, bridging healthcare gaps.</p>
              </div>
            </div>
            <div className="reason">
             <i > <FaHeadset /> </i>
              <div className="line"></div>
              <div className="reason-text">
                <h3>Dedicated Support</h3>
                <p>Our dedicated team is always ready to assist with personalized recruitment solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <h2>Our Impact</h2>
        <div className="impact-cards-container">
          <div className="impact-card">
           <i className="fa-briefcase"> <FaBriefcase /> </i>
            <h4>5,000+ Jobs Filled Nationwide</h4>
            <p>Connecting medical professionals with job opportunities across India, helping to fill critical healthcare positions.</p>
          </div>
          <div className="impact-card">
           <i className="fa-hospital"> <FaHospital /> </i>
            <h4>1,000+ Hospitals and Clinics Served</h4>
            <p>Serving healthcare institutions with a diverse range of qualified professionals to support patient care and operations.</p>
          </div>
          <div className="impact-card">
           <i className="fa-user-md"> <FaUserMd /> </i>
            <h4>10,000+ Healthcare Professionals Connected</h4>
            <p>Helping thousands of healthcare workers find meaningful roles in hospitals, clinics, and care centers across the nation.</p>
          </div>
        </div>
      </section>
    </div>
    {/* Video Section */}
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

export default About;
