import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/auth";
import "../styles/onboarding2.css";

const Onboarding4 = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // ✅ Fix: Add message state

  const [formData, setFormData] = useState({
    preferredResource: "",
    collaborationPreference: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // ✅ Fix: Now this function exists

    const email = localStorage.getItem("user");
    console.log("Retrieved email from localStorage:", email);
    if (!email) {
      console.error("Email not found in localStorage");
      setMessage("Session expired. Please sign up again."); // ✅ Display error message
      return;
    }

    try {
      await axios.post("http://localhost:3000/v1/user/onboarding4", {
        email,
        preferredResource: formData.preferredResource,
        collaborationPreference: formData.collaborationPreference,
      });

      console.log("✅ Onboarding4 successful");
      navigate("/dashboard"); // ✅ Navigate to Dashboard
    } catch (error) {
      console.error("❌ Error submitting onboarding data:", error);
      setMessage("Onboarding failed. Please try again."); // ✅ Show error message
    }
  };

  return (
    <div className="onboarding-container">
      <h2>Additional Preference</h2>
      {message && <p className="error-message">{message}</p>} {/* ✅ Display error messages */}
      <form onSubmit={handleSubmit} className="onboarding-form">
        <label>Preferred Resource:</label>
        <input
          type="text"
          name="preferredResource"
          placeholder="Ready to use"
          value={formData.preferredResource}
          onChange={handleChange}
          required
        />

        <label>Collaboration with Other Teachers:</label>
        <input
          type="text"
          name="collaborationPreference"
          placeholder="Yes, I'd love to"
          value={formData.collaborationPreference}
          onChange={handleChange}
          required
        />

        <div className="button-group">
          <button type="button" className="back-btn" onClick={() => navigate("/onboarding3")}>
            Back
          </button>
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding4;
