"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../api/auth"
import "../styles/teacherResource.css"
import { TabBar } from "./tabBar"
import ScrollHeader from "./Header/ScrollHeader"
import { useAuth } from "../context/AuthContext"

export const TeacherResource = () => {
  const [curriculumList, setCurriculumList] = useState([])
  const [gradeList, setGradeList] = useState([])
  const [lessons, setLessons] = useState([])
  const [selectedCurriculum, setSelectedCurriculum] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [showGradeDropdown, setShowGradeDropdown] = useState(false)
  const [showCurriculumDropdown, setShowCurriculumDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true)
        const [curriculaRes, gradesRes] = await Promise.all([
          axios.get("https://backend-844313246496.europe-west1.run.app/v1/teacherResource/curricula"),
          axios.get("https://backend-844313246496.europe-west1.run.app/v1/teacherResource/grades"),
        ])
        setCurriculumList(curriculaRes.data)
        setGradeList(gradesRes.data.grades)
      } catch (error) {
        console.error("Error fetching dropdown data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFilters()
  }, [])

  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedCurriculum || !selectedGrade) return
      try {
        setLoading(true)
        const res = await axios.get("https://backend-844313246496.europe-west1.run.app/v1/teacherResource/lessons", {
          params: { curriculum: selectedCurriculum, grade: selectedGrade },
        })
        setLessons(res.data.lessons)
      } catch (error) {
        console.error("Error fetching lessons:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLessons()
  }, [selectedCurriculum, selectedGrade])

  const filteredLessons = lessons.filter((lesson) => lesson.LNAME.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="modern-teacher-resource">
      <ScrollHeader />

      {/* Fixed Header Section - Clean and Professional */}
      <div className="resource-fixed-header">
        {/* Hero Section - Single clean line */}
        <div className="resource-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Hi, <span className="highlight">{user?.displayName || "User"}</span>!
              </h1>
              <p className="hero-subtitle">Discover teaching resources tailored for you</p>
            </div>
            {/* Tab Navigation moved here */}
            <div className="tab-navigation-inline">
              <TabBar className="modern-tab-bar" activePage="teacher-resources" onNavigate={navigate} />
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">{curriculumList.length}</span>
                <span className="stat-label">Curricula</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">{gradeList.length}</span>
                <span className="stat-label">Grades</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">{lessons.length}</span>
                <span className="stat-label">Lessons</span>
              </div>
            </div>

            

            
          </div>
        </div>

        {/* Remove the separate Tab Navigation Section since it's now in hero-content */}

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-single-line">
            <div className="section-header-inline">
              <h2 className="section-title">Teaching Resources</h2>
              <p className="section-subtitle">Find the perfect materials for your curriculum</p>
            </div>

            <div className="search-container-inline">
              <div className="search-wrapper">
                <div className="search-icon">🔍</div>
                <input
                  type="text"
                  placeholder="Search lessons and resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="clear-search" onClick={() => setSearchQuery("")}>
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="dropdown-filters-inline">
              <div className="dropdown-container">
                <div
                  className={`dropdown-select ${showGradeDropdown ? "active" : ""}`}
                  onClick={() => setShowGradeDropdown(!showGradeDropdown)}
                >
                  <div className="dropdown-content">
                    <span className="dropdown-label">Grade</span>
                    <span className="dropdown-value">{selectedGrade || "Select Grade"}</span>
                  </div>
                  <div className={`dropdown-arrow ${showGradeDropdown ? "rotated" : ""}`}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {showGradeDropdown && (
                  <div className="dropdown-menu">
                    {gradeList.map((grade, idx) => (
                      <div
                        key={idx}
                        className={`dropdown-item ${selectedGrade === grade ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedGrade(grade)
                          setShowGradeDropdown(false)
                        }}
                      >
                        {grade}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="dropdown-container">
                <div
                  className={`dropdown-select ${showCurriculumDropdown ? "active" : ""}`}
                  onClick={() => setShowCurriculumDropdown(!showCurriculumDropdown)}
                >
                  <div className="dropdown-content">
                    <span className="dropdown-label">Curriculum</span>
                    <span className="dropdown-value">{selectedCurriculum || "Select Curriculum"}</span>
                  </div>
                  <div className={`dropdown-arrow ${showCurriculumDropdown ? "rotated" : ""}`}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {showCurriculumDropdown && (
                  <div className="dropdown-menu">
                    {curriculumList.map((c) => (
                      <div
                        key={c.CID}
                        className={`dropdown-item ${selectedCurriculum === c.CNAME ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedCurriculum(c.CNAME)
                          setShowCurriculumDropdown(false)
                        }}
                      >
                        {c.CNAME}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - COMPLETELY SEPARATE */}
      <div className="resource-main-content">
        <div className="lessons-container-fixed">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading resources...</p>
            </div>
          ) : filteredLessons.length > 0 ? (
            <div className="lessons-grid">
              {filteredLessons.map((lesson, index) => (
                <div
                  key={lesson.LID}
                  className="lesson-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() =>
                    navigate(
                      `/topics?query=${encodeURIComponent(lesson.LNAME)}&grade=${encodeURIComponent(selectedGrade)}&curriculum=${encodeURIComponent(selectedCurriculum)}`,
                    )
                  }
                >
                  <div className="lesson-header">
                    <div className="lesson-icon">📖</div>
                    <div className="lesson-badge">Lesson</div>
                  </div>
                  <div className="lesson-content">
                    <h3 className="lesson-title">{lesson.LNAME}</h3>
                    <p className="lesson-meta">
                      {selectedGrade} • {selectedCurriculum}
                    </p>
                  </div>
                  <div className="lesson-footer">
                    <span className="explore-text">Explore Topics</span>
                    <div className="arrow-icon">→</div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedCurriculum && selectedGrade ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No lessons found</h3>
              <p>No lessons available for the selected grade and curriculum.</p>
              <button
                className="reset-filters-btn"
                onClick={() => {
                  setSelectedGrade("")
                  setSelectedCurriculum("")
                  setSearchQuery("")
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="selection-prompt">
              <div className="prompt-icon">🎯</div>
              <h3>Get Started</h3>
              <p>Please select both grade and curriculum to discover amazing lessons.</p>
              <div className="prompt-steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <span>Choose your grade level</span>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <span>Select curriculum type</span>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <span>Explore available lessons</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
