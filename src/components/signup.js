import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/auth";
import "../styles/signup.css"; 
import Calendar from "../components/calendar";

const SignUp = () => {
  const [userData, setUserData] = useState({
    email: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      console.log("hai")
      await axios.post("https://backend-937324960970.us-central1.run.app/v1/user/signup", { email: userData.email });
      localStorage.setItem("user", userData.email);
      navigate("/onboarding"); // Redirect to onboarding
    } catch (error) {
      setMessage("Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-container">
      {/* Header Section */}
      <header className="signup-header">
        <span className="logo">📷 photo</span>
        <nav>
          <a href="#">Profile</a>
          <a href="#">Pricing</a>
          <a href="#">Community</a>
          <a href="#">Setting</a>
        </nav>
        <button className="login-btn">Log in</button>
      </header>

      {/* Main Content Section */}
      <div className="signup-content">
        <h1>More Time <span className="thighlight">Teaching</span>, Less Time <span className="thighlight">Managing</span></h1>

        {/* Feature Cards */}
        <div className="signup-features">
          <Calendar />
          <div className="feature-box">
            <div className="feature-placeholder">📚</div>
            <p className="feature-title">Teacher Resource</p>
          </div>
          <div className="feature-box">
            <div className="feature-placeholder">📖</div>
            <p className="feature-title">Student Task</p>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignUp} className="signup-form">
          <input type="email" name="email" placeholder="Enter your email ID" value={userData.email} onChange={handleChange} required />
          <button type="submit">Get Started ➜</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
