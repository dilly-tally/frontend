import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/auth";
import "../styles/topic.css"; // Make sure this holds your styles

const LessonTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");
  const grade = searchParams.get("grade");
  const curriculum = searchParams.get("curriculum");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get("https://backend-937324960970.us-central1.run.app/v1/teacherResource/topics/search", {
          params: { query, grade, curriculum },
        });
        console.log("Fetched topics:", res.data.topics); // ✅ Log full topic data
        setTopics(res.data.topics || []);
      } catch (error) {
        setError("Failed to fetch topics");
      } finally {
        setLoading(false);
      }
    };

    if (query && grade && curriculum) {
      fetchTopics();
    } else {
      setLoading(false);
    }
  }, [query, grade, curriculum]);

  if (loading) return <div>Loading...</div>;
  if (error || !Array.isArray(topics)) return <div>Error: {error || "Invalid topics data"}</div>;

  return (
    <div className="teacher-resource">
      <div className="div">
        <div className="frame">
          <div className="frame-2">
            <div className="text-wrapper">Teacher Resource</div>
            <img
              className="ri-arrow-drop-down"
              alt="Dropdown"
              src="https://c.animaapp.com/bTKlm0Tx/img/ri-arrow-drop-down-line.svg"
            />
          </div>
        </div>

        <div className="frame-3">
          <div className="div-wrapper">
            <div className="text-wrapper-2">Search resource...</div>
          </div>
          <div className="frame-4">
            <div className="text-wrapper-3">{grade}</div>
          </div>
          <div className="frame-5">
            <div className="text-wrapper-3">{curriculum}</div>
          </div>
        </div>

        <div className="fractions-sub-topics-wrapper">
          <p className="fractions-sub-topics">
            <span className="span">{query}</span>
            <span className="text-wrapper-4"> - Sub topics</span>
          </p>
        </div>

        <div className="topics-container">
          {topics.map((topic, index) => {
            console.log("Topic ID:", topic.TID); //  Logging topic ID
            return (
              <div key={index} className="topic-card">
                <div className="card-content">
                  <div className="text-wrapper-5">{topic.TNAME}</div>
                  <div className="group-2">
                    <p className="p">Short description or summary</p>
                  </div>
                  <div
                    className="frame-7"
                    onClick={() => navigate(`/viewpdf/${topic.TID}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="text-wrapper-6">View more</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LessonTopics;
