import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/auth";
import "../styles/teacherResource.css";

const TeacherResource = () => {
  const [curriculumList, setCurriculumList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  // Fetch available curricula and grades on mount
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

  const navigate = useNavigate();
  // Fetch lessons based on selected curriculum and grade
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
      <h2>Teacher Resource</h2>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Search resource..."
          disabled // Will be enabled when integrating search functionality
        />

        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="">Select Grade</option>
          {gradeList.map((grade, idx) => (
            <option key={idx} value={grade}>{grade}</option>
          ))}
        </select>

        <select
          value={selectedCurriculum}
          onChange={(e) => setSelectedCurriculum(e.target.value)}
        >
          <option value="">Select Curriculum</option>
          {curriculumList.map((c) => (
            <option key={c.CID} value={c.CNAME}>{c.CNAME}</option>
          ))}
        </select>
      </div>

      <div className="lessons-grid">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div key={lesson.LID} className="lesson-card" onClick={() =>
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
  );
};

export default TeacherResource;
