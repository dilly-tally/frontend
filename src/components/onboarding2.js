import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/auth";
import "../styles/onboarding2.css"; 

const Onboarding2 = () => {
  const [userData, setUserData] = useState({
    subjects: "",
    yearGroups: "",
    curriculum: "",
  });

  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("user");
    if (!storedEmail) {
      console.error("Error: Email not found in localStorage");
      setMessage("Session expired. Please sign up again.");
      navigate("/signup");
    } else {
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

      console.log("Sending onboarding2 data:", {
        email,
        subjects: userData.subjects,
        yearGroups: userData.yearGroups,
        curriculum: userData.curriculum,
      });

      const response = await axios.post("https://backend-937324960970.us-central1.run.app/v1/user/onboarding2", {
        email,
        subjects: userData.subjects,
        yearGroups: userData.yearGroups,
        curriculum: userData.curriculum,
      });

      console.log("Onboarding2 successful:", response.data);
      navigate("/onboarding3"); // Redirect to the next step
    } catch (error) {
      console.error(" Error submitting onboarding2 data:", error);
      setMessage("Onboarding failed. Please try again.");
    }
  };

  return (
    <div className="onboarding-container">
      <h2>Teaching Information</h2>
      {message && <p className="message">{message}</p>} 
      <form onSubmit={handleSubmit} className="onboarding-form">
        <label>Subjects You Teach:</label>
        <input type="text" name="subjects" placeholder="Enter subjects" value={userData.subjects} onChange={handleChange} required />

        <label>Year Groups:</label>
        <input type="text" name="yearGroups" placeholder="Enter year groups" value={userData.yearGroups} onChange={handleChange} required />

        <label>Curriculum of Interest:</label>
        <input type="text" name="curriculum" placeholder="Enter curriculum" value={userData.curriculum} onChange={handleChange} required />

        <div className="button-group">
          <button type="button" className="back-btn" onClick={() => navigate("/onboarding")}>
            Back
          </button>
          <button type="submit" className="next-btn">Next</button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding2;
