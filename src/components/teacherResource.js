import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/auth";
import "../styles/teacherResource.css";
import { StateHoverWrapper } from "./stateHoverWrapper";
import { TabBar } from "./tabBar";

export const TeacherResource = () => {
  const [curriculumList, setCurriculumList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showCurriculumDropdown, setShowCurriculumDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [curriculaRes, gradesRes] = await Promise.all([
          axios.get("https://backend-937324960970.us-central1.run.app/v1/teacherResource/curricula"),
          axios.get("https://backend-937324960970.us-central1.run.app/v1/teacherResource/grades"),
        ]);
        setCurriculumList(curriculaRes.data);
        setGradeList(gradesRes.data.grades);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedCurriculum || !selectedGrade) return;
      try {
        const res = await axios.get("https://backend-937324960970.us-central1.run.app/v1/teacherResource/lessons", {
          params: { curriculum: selectedCurriculum, grade: selectedGrade },
        });
        setLessons(res.data.lessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };
    fetchLessons();
  }, [selectedCurriculum, selectedGrade]);

  return (
    <div className="teacher-resource-container">
      <div className="box" data-model-id="114:113-frame">
        <div className="group">
          <div className="on-boarding-screen">
            <div className="frame">
              <img className="logo" alt="Logo" src="https://c.animaapp.com/wFl7rcHz/img/logo@2x.png" />
              <div className="simplify-teaching">
                <span className="text-wrapper">Simplify </span>
                <span className="span">Teaching</span>
                <span className="text-wrapper">, Inspiring </span>
                <span className="span"> Learning</span>
              </div>
              <img className="ellipse" alt="Ellipse" src="https://c.animaapp.com/wFl7rcHz/img/ellipse-35.svg" />
            </div>

            <div className="content-section">
              <h1 className="greeting">Hi, Uzma</h1>
              <TabBar
                className="tab-bar-instance1"
                activePage="teacher-resources"
                onNavigate={navigate}
              />

              {/* Teacher Resource Section */}
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
                    <div 
                      className="dropdown-text"
                      onClick={() => setShowGradeDropdown(!showGradeDropdown)}
                    >
                      {selectedGrade || "Select Grade"}
                    </div>
                    <img
                      className="search-img"
                      alt="Dropdown"
                      src="https://c.animaapp.com/q996k3pa/img/ri-arrow-drop-down-line-1.svg"
                      onClick={() => setShowGradeDropdown(!showGradeDropdown)}
                    />
                    {showGradeDropdown && (
                      <div className="dropdown-menu">
                        {gradeList.map((grade, idx) => (
                          <div
                            key={idx}
                            className="dropdown-item"
                            onClick={() => {
                              setSelectedGrade(grade);
                              setShowGradeDropdown(false);
                            }}
                          >
                            {grade}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="curriculum-frame">
                    <div 
                      className="dropdown-text"
                      onClick={() => setShowCurriculumDropdown(!showCurriculumDropdown)}
                    >
                      {selectedCurriculum || "Select Curriculum"}
                    </div>
                    <img
                      className="search-img"
                      alt="Dropdown"
                      src="https://c.animaapp.com/q996k3pa/img/ri-arrow-drop-down-line-1.svg"
                      onClick={() => setShowCurriculumDropdown(!showCurriculumDropdown)}
                    />
                    {showCurriculumDropdown && (
                      <div className="dropdown-menu">
                        {curriculumList.map((c) => (
                          <div
                            key={c.CID}
                            className="dropdown-item"
                            onClick={() => {
                              setSelectedCurriculum(c.CNAME);
                              setShowCurriculumDropdown(false);
                            }}
                          >
                            {c.CNAME}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lessons-grid">
                  {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                      <div
                        key={lesson.LID}
                        className="lesson-card"
                        onClick={() =>
                          navigate(
                            `/topics?query=${encodeURIComponent(lesson.LNAME)}&grade=${encodeURIComponent(selectedGrade)}&curriculum=${encodeURIComponent(selectedCurriculum)}`
                          )
                        }
                      >
                        {lesson.LNAME}
                      </div>
                    ))
                  ) : (
                    <p className="no-lessons-text">No lessons available for this selection.</p>
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