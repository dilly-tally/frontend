import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/auth";
import "../styles/onboarding2.css";

const Onboarding3 = () => {
  //const navigate = useNavigate();
  const [userData, setUserData] = useState({
    teachingExperience: "",
    whereDoYouTeach: "",
  });

  //const email = localStorage.getItem("userEmail"); // Retrieve email stored during signup
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
            console.error("Email not found in localStorage");
            return;
          }
          console.log(" Sending onboarding3 data:", {
            email,
            teachingExperience: userData.teachingExperience,
            whereDoYouTeach: userData.whereDoYouTeach,
          });
          const response = await axios.post("https://backend-937324960970.us-central1.run.app/v1/user/onboarding3", {
        email,
        teachingExperience: userData.teachingExperience,
        whereDoYouTeach: userData.whereDoYouTeach,
      });
      navigate("/onboarding4"); // Navigate to next onboarding step
    } catch (error) {
      console.error(" Error submitting onboarding3 data:", error);
    }
  };

  return (
    <div className="onboarding-container">
      <h2>Experience & Preference</h2>
      <form onSubmit={handleSubmit} className="onboarding-form">
        {/* Teaching Experience */}
        <label>Teaching Experience:</label>
        <input
          type="text"
          name="teachingExperience"
          placeholder="Less than 2 Years"
          value={userData.teachingExperience}
          onChange={handleChange}
          required
        />

        {/* Where do you teach? */}
        <label>Where do you teach?</label>
        <input
          type="text"
          name="whereDoYouTeach"
          placeholder="At a School"
          value={userData.whereDoYouTeach}
          onChange={handleChange}
          required
        />

        {/* Buttons */}
        <div className="button-group">
          <button type="button" className="back-btn" onClick={() => navigate("/onboarding2")}>
            Back
          </button>
          <button type="submit" className="next-btn">Next</button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding3;
