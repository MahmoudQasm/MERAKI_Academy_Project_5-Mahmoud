import React, { useState } from "react";
import "./ContactUs.css";
import Swal from "sweetalert2";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    
    Swal.fire({
      title: "Sent Successfully!",
      text: "Thank you for reaching out. The Bretix team will contact you shortly.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#1a3c34",
      customClass: {
        popup: 'my-swal-popup' 
      }
    });


    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        
      
        <div className="contact-info-section">
          <div className="info-content">
            <span className="info-subtitle">Get in Touch</span>
            <h2 className="info-title">Contact Us</h2>
            <p className="info-description">
              We are here to help. Whether you have a question about a product or want to provide feedback, feel free to message us.
            </p>

            <div className="contact-details">
              <div className="detail-item">
                <div className="detail-icon">📍</div>
                <div>
                  <h4>Our Location</h4>
                  <p>Amman, Jordan - Mecca St.</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">📞</div>
                <div>
                  <h4>Call Us</h4>
                  <p>+962 000 000 000</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">✉️</div>
                <div>
                  <h4>Email Address</h4>
                  <p>support@bretix-eco.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

    
        <div className="contact-form-section">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="How can we help you?"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Your Message</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;