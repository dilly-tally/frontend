import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/auth";
import "../styles/topic.css";

export const LessonTopics = () => {
  const [topics, setTopics] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const lid = searchParams.get("lid");
  const query = searchParams.get("query"); // lesson name
  const grade = searchParams.get("grade") || "Grade";
  const curriculum = searchParams.get("curriculum") || "Curriculum";

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null);

        let apiUrl = "https://backend-937324960970.us-central1.run.app/v1/teacherResource/topics/search";
        let params = {};

        if (lid) {
          // If we have lesson ID, use it directly
          params = { lid };
        } else if (query && grade && curriculum) {
          // If we have lesson name, first get lesson ID
          const lessonRes = await axios.get(
            "https://backend-937324960970.us-central1.run.app/v1/teacherResource/lessons",
            {
              params: { grade, curriculum }
            }
          );
          
          const lessons = lessonRes.data.lessons || [];
          const matchedLesson = lessons.find(lesson => lesson.LNAME === query);
          
          if (!matchedLesson) {
            throw new Error(`Lesson "${query}" not found`);
          }
          
          params = { lid: matchedLesson.LID };
        } else {
          throw new Error("Either lesson ID (lid) or lesson name (query) with grade and curriculum is required");
        }

        const res = await axios.get(apiUrl, { params });
        setTopics(res.data.topics || []);
        setLesson(res.data.lesson || null);
      } catch (err) {
        console.error("Error fetching topics:", err);
        setError(err.message || "Failed to fetch topics");
      } finally {
        setLoading(false);
      }
    };

    if (lid || (query && grade && curriculum)) {
      fetchTopics();
    } else {
      setError("Lesson ID or lesson name with grade and curriculum is required");
      setLoading(false);
    }
  }, [lid, query, grade, curriculum]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error || !Array.isArray(topics))
    return <div className="error">Error: {error || "Invalid topics data"}</div>;

  return (
    <div className="teacher-resource-container">
      <div className="box" data-model-id="114:113-frame">
        <div className="group">
          <div className="on-boarding-screen">
            <div className="frame">
              <img
                className="logo"
                alt="Logo"
                src="https://c.animaapp.com/wFl7rcHz/img/logo@2x.png"
              />
              <div className="simplify-teaching">
                <span className="text-wrapper">Simplify </span>
                <span className="span">Teaching</span>
                <span className="text-wrapper">, Inspiring </span>
                <span className="span"> Learning</span>
              </div>
              <img
                className="ellipse"
                alt="Ellipse"
                src="https://c.animaapp.com/wFl7rcHz/img/ellipse-35.svg"
              />
            </div>

            <div className="content-section">
              <h1 className="greeting">Hi, Uzma</h1>

              <div className="teacher-resource-section">
                <div className="resource-title">Teacher Resource</div>
                <div className="resource-frame">
                  <div className="search-div">
                    <div className="search-text">Search resource...</div>
                    <img
                      className="search-img"
                      alt="Search"
                      src="https://c.animaapp.com/q996k3pa/img/iconamoon-search-light.svg"
                    />
                  </div>
                  <div className="grade-frame">
                    <div className="dropdown-text">{grade}</div>
                    <img
                      className="search-img"
                      alt="Dropdown"
                      src="https://c.animaapp.com/q996k3pa/img/ri-arrow-drop-down-line-1.svg"
                    />
                  </div>
                  <div className="curriculum-frame">
                    <div className="dropdown-text">{curriculum}</div>
                    <img
                      className="search-img"
                      alt="Dropdown"
                      src="https://c.animaapp.com/q996k3pa/img/ri-arrow-drop-down-line-1.svg"
                    />
                  </div>
                </div>
              </div>

              <div className="lesson-section">
                <div className="lesson-frame">
                  <p className="lesson-sub-topics">
                    <span className="lesson-text-wrapper">
                      {lesson?.LNAME || query || "Lesson"}
                    </span>
                    <span className="lesson-span"> - Sub topics</span>
                  </p>
                </div>
              </div>

              <div className="topics-container">
                <div className="topics-grid">
                  {topics.length > 0 ? (
                    topics.map((topic, index) => (
                      <div key={topic.TID || index} className="topic-card">
                        <div className="topic-title-frame">
                          <div className="topic-title">{topic.TNAME}</div>
                        </div>
                        <div className="topic-description">
                          <p className="description-text">
                            {topic.TDESC || "No description available."}
                          </p>
                        </div>
                        <div
                          className="view-more-frame"
                          onClick={() => navigate(`/viewpdf/${topic.TID}`)}
                        >
                          <div className="view-more-text">View more</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-lessons-text">
                      No topics found for this lesson.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <img className="line" alt="Line" src="/img/line-71.svg" />
          </div>
        </div>
      </div>
    </div>
  );
};