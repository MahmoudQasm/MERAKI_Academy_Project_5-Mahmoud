import React, { useState } from "react";
import "./ContactUs.css";
import Swal from "sweetalert2";

const ContactAndAbout = () => {
  const [activeTab, setActiveTab] = useState("contact");

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Sent Successfully!",
      text: "Thank you for reaching out. The Bretix team will contact you shortly.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#1a3c34",

    });
    
  };

  return (
    <div className="contact-page">
    
      <div className="tab-wrapper">
        <div className="glass-tabs">
          <button 
            className={`modern-tab ${activeTab === "contact" ? "active" : ""}`} 
            onClick={() => setActiveTab("contact")}
          >
            <span className="tab-icon">✉️</span> Contact Us
          </button>
          <button 
            className={`modern-tab ${activeTab === "about" ? "active" : ""}`} 
            onClick={() => setActiveTab("about")}
          >
            <span className="tab-icon">🌿</span> About Us
          </button>
          
          <div className={`tab-indicator ${activeTab}`}></div>
        </div>
      </div>

      <div className="contact-container main-card-anim">
    
        <div className="contact-info-section">
          <div className="info-content fade-in-left">
            <span className="info-subtitle">BRETIX ECO-SYSTEM</span>
            <h2 className="info-title">
              {activeTab === "contact" ? "Let's Connect" : "Discover Us"}
            </h2>
            <p className="info-description">
              {activeTab === "contact" 
                ? "Have a question or a project in mind? Our team is ready to assist you."
                : "Committed to quality and sustainability, we bring you the best eco-friendly tech accessories."}
            </p>
          </div>
        </div>

      
        <div className="content-display-section">
          {activeTab === "contact" ? (
            <form onSubmit={handleSubmit} className="contact-form slide-up">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@bretix.com" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="4" placeholder="How can we help?" required></textarea>
              </div>
              <button type="submit" className="submit-btn-glow">Send Message</button>
            </form>
          ) : (
            <div className="about-content slide-up">
              <h3 className="about-heading">Our Mission</h3>
              <p>At Bretix, we merge cutting-edge technology with environmental responsibility.</p>
              <div className="about-stats-modern">
                <div className="stat-item"><strong>98%</strong><p>Recycled Materials</p></div>
                <div className="stat-item"><strong>24/7</strong><p>Global Support</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactAndAbout;