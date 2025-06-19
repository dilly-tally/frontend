import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/auth";
import "../styles/topic.css";

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
    <div className="TR">
      <div className="group-wrapper">
        <div className="group">
          <div className="on-boarding-screen">
            <div className="div">
              <img
                className="logo"
                alt="Logo"
                src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/682bf5f2f8d416f983b09342/img/logo.png"
              />
              <p className="simplify-teaching">
                <span className="text-wrapper">Simplify </span>
                <span className="span">Teaching</span>
                <span className="text-wrapper">, Inspiring </span>
                <span className="text-wrapper-2">Learning</span>
              </p>
              <img
                className="ellipse"
                alt="Ellipse"
                src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/683696b2c18780b4fd4523be/img/ellipse-35.svg"
              />
            </div>
            <div className="text-wrapper-3">Hi, Uzma</div>
            <div className="text-wrapper-4">Teacher Resource</div>
            <div className="frame-2">
              <div className="frame-3">
                <div className="text-wrapper-5">Search resource...</div>
                <img
                  className="img"
                  alt="Search"
                  src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/683696b2c18780b4fd4523be/img/iconamoon-search-light.svg"
                />
              </div>
              <div className="frame-4">
                <div className="text-wrapper-6">{grade}</div>
                <img
                  className="img"
                  alt="Dropdown"
                  src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/67e5c9b051a2e376383e85e2/img/ri-arrow-drop-down-line-1.svg"
                />
              </div>
              <div className="frame-5">
                <div className="text-wrapper-6">{curriculum}</div>
                <img
                  className="img"
                  alt="Dropdown"
                  src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/67e5c9b051a2e376383e85e2/img/ri-arrow-drop-down-line-1.svg"
                />
              </div>
            </div>
            <div className="algebra-sub-topics-wrapper">
              <p className="algebra-sub-topics">
                <span className="text-wrapper-7">{query}</span>
                <span className="text-wrapper-8"> - Sub topics</span>
              </p>
            </div>
            <div className="frame-6">
              {topics.map((topic, index) => (
                <div key={index} className="frame-wrapper">
                  <div className="frame-7">
                    <div className="frame-327" text={topic.TNAME} />
                    <div className="div-wrapper">
                      <p className="p">Short description or summary</p>
                    </div>
                    <div className="frame-8" onClick={() => navigate(`/viewpdf/${topic.TID}`)} style={{ cursor: "pointer" }}>
                      <div className="text-wrapper-9">View more</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonTopics;
