import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/auth";
import "../styles/onboarding.css";

const Onboarding = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    location: "",
  });

  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Retrieve email from localStorage
    const storedEmail = localStorage.getItem("user");
    if (!storedEmail) {
      console.error("Error: Email not found in localStorage");
      setMessage("Session expired. Please sign up again.");
      navigate("/signup");
    } else {
      console.log("Email found in localStorage:", storedEmail);
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (!email) {
        throw new Error("Email not found in localStorage");
      }

      console.log("Sending onboarding data:", {
        email,
        fullName: userData.fullName,
        location: userData.location,
      });

      const response = await axios.post("https://backend-937324960970.us-central1.run.app/v1/user/onboarding", {
        email,
        fullName: userData.fullName,
        location: userData.location,
      });

      console.log("Onboarding successful:", response.data);
      navigate("/onboarding2"); // Redirect to the next step
    } catch (error) {
      console.error("Error submitting onboarding data:", error);
      setMessage("Onboarding failed. Please try again.");
    }
  };

  return (
    <div className="onboarding-container">
      <h2>Personal Information</h2>
      {message && <p className="message">{message}</p>} 
      <form onSubmit={handleSubmit} className="onboarding-form">
        
        
        <label>Full Name:</label>
        <input type="text" name="fullName" placeholder="Enter full name" value={userData.fullName} onChange={handleChange} required />

        <label>City & Country:</label>
        <input type="text" name="location" placeholder="Enter city & country" value={userData.location} onChange={handleChange} required />

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default Onboarding;
