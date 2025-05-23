import React, { useState } from "react";
import "./ContactUs.css";
import { useFlash } from "../../context/FlashContext";
import backendService from "../../Flask_service/flask";
const images = {
  contact_image: "https://res.cloudinary.com/dcslhsano/image/upload/v1743564341/ctb5ambevqxl1y3fdkkz.jpg",
};


const ContactUs = () => {
    const { setFlashMessage } = useFlash();
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
        setFlashMessage("Please enter a valid email address.", "info");
        setLoading(false);
        return;
    }

    try {
        const response = await backendService.contact_us(formData)

        if (response.success) {
            setFlashMessage(response.message || "Thank you for contacting us! We will get back to you soon.", "success");
            setFormData({ name: "", email: "", phone: "", message: "" });
        } else {
            setFlashMessage(response.message || "Something went wrong. Please try again.", "error");
        }
    } catch (error) {
        setFlashMessage("Server error. Please try again later.", "error");
    } finally {
        setLoading(false);
    }
};


  return (
    <section className="contact-us">
      <div className="contact-container">
        {/* Contact Form Section */}
        <div className="contact-form">
          <h1 className="contact-title">Contact Us</h1>
          <p className="subtitle">Any questions or remarks? Just write us a message!</p>
          
          <form id="contactForm" onSubmit={handleSubmit} noValidate>
            <label>Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-label="Enter your full name"
            />

            <label>Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-label="Enter your email address"
            />

            <label>Phone Number*</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              aria-label="Enter your phone number"
            />

           <label>Message</label>
                <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              aria-label="Enter your message"
                ></textarea>

            {/* Submit Button */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Contact Image Section */}
        <div className="contact-image">
          <img src={images.contact_image} alt="Contact Us" />
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
