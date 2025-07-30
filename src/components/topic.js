"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "../api/auth"
import "../styles/topic.css"
import { TabBar } from "./tabBar"
import ScrollHeader from "./Header/ScrollHeader"

export const LessonTopics = () => {
  const [topics, setTopics] = useState([])
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const lid = searchParams.get("lid")
  const query = searchParams.get("query") // lesson name
  const grade = searchParams.get("grade") || "Grade"
  const curriculum = searchParams.get("curriculum") || "Curriculum"

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = "https://backend-844313246496.europe-west1.run.app/v1/teacherResource/topics/search"
        let params = {}

        if (lid) {
          // If we have lesson ID, use it directly
          params = { lid }
        } else if (query && grade && curriculum) {
          // If we have lesson name, first get lesson ID
          const lessonRes = await axios.get(
            "https://backend-844313246496.europe-west1.run.app/v1/teacherResource/lessons",
            {
              params: { grade, curriculum },
            },
          )

          const lessons = lessonRes.data.lessons || []
          const matchedLesson = lessons.find((lesson) => lesson.LNAME === query)

          if (!matchedLesson) {
            throw new Error(`Lesson "${query}" not found`)
          }

          params = { lid: matchedLesson.LID }
        } else {
          throw new Error("Either lesson ID (lid) or lesson name (query) with grade and curriculum is required")
        }

        const res = await axios.get(apiUrl, { params })
        setTopics(res.data.topics || [])
        setLesson(res.data.lesson || null)
      } catch (err) {
        console.error("Error fetching topics:", err)
        setError(err.message || "Failed to fetch topics")
      } finally {
        setLoading(false)
      }
    }

    if (lid || (query && grade && curriculum)) {
      fetchTopics()
    } else {
      setError("Lesson ID or lesson name with grade and curriculum is required")
      setLoading(false)
    }
  }, [lid, query, grade, curriculum])

  const filteredTopics = topics.filter((topic) => topic.TNAME.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleBackClick = () => {
    navigate("/teacherResource")
  }

  if (loading)
    return (
      <div className="modern-topics">
        <ScrollHeader />
        <div className="topics-main-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading topics...</p>
          </div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="modern-topics">
        <ScrollHeader />
        <div className="topics-main-content">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Topics</h3>
            <p>{error}</p>
            <button className="back-btn" onClick={handleBackClick}>
              Back to Resources
            </button>
          </div>
        </div>
      </div>
    )

  return (
    <div className="modern-topics">
      <ScrollHeader />

      {/* Fixed Header Section - Clean and Professional */}
      <div className="topics-fixed-header">
        {/* Hero Section */}
        <div className="topics-hero">
          <div className="hero-content">
            <div className="hero-text">
              <div className="breadcrumb">
                <button className="back-btn" onClick={handleBackClick}>
                  ← Back to Resources
                </button>
              </div>
              <h1 className="hero-title">
                <span className="lesson-name">{lesson?.LNAME || query || "Lesson"}</span> - Sub topics
              </h1>
              <p className="hero-subtitle">
                {grade} • {curriculum}
              </p>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">{topics.length}</span>
                <span className="stat-label">Topics Available</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">{filteredTopics.length}</span>
                <span className="stat-label">Filtered Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Section */}
        <div className="tab-navigation-section">
          <div className="tab-navigation-inline">
            <TabBar className="modern-tab-bar" activePage="teacher-resources" onNavigate={navigate} />
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section-inline">
          <div className="search-content">
            <div className="section-header-inline">
              <h2 className="section-title">Available Topics</h2>
              <p className="section-subtitle">Select a topic to view detailed resources and materials</p>
            </div>

            <div className="search-container-inline">
              <div className="search-wrapper">
                <div className="search-icon">🔍</div>
                <input
                  type="text"
                  placeholder="Search topics..."
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
          </div>
        </div>
      </div>

      {/* Main Content Area - COMPLETELY SEPARATE */}
      <div className="topics-main-content">
        <div className="topics-container-fixed">
          {filteredTopics.length > 0 ? (
            <div className="topics-grid">
              {filteredTopics.map((topic, index) => (
                <div
                  key={topic.TID || index}
                  className="topic-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/viewpdf/${topic.TID}`)}
                >
                  <div className="topic-header">
                    <div className="topic-icon">📄</div>
                    <div className="topic-badge">PDF Resource</div>
                  </div>
                  <div className="topic-content">
                    <h3 className="topic-title">{topic.TNAME}</h3>
                    <p className="topic-description">{topic.TDESC || "No description available."}</p>
                    <p className="topic-meta">
                      {grade} • {curriculum}
                    </p>
                  </div>
                  <div className="topic-footer">
                    <span className="view-text">View Resource</span>
                    <div className="arrow-icon">→</div>
                  </div>
                </div>
              ))}
            </div>
          ) : topics.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No topics found</h3>
              <p>No topics available for this lesson. Please try a different lesson or check back later.</p>
              <button className="back-to-resources-btn" onClick={handleBackClick}>
                Back to Resources
              </button>
            </div>
          ) : (
            <div className="no-results-state">
              <div className="no-results-icon">🔍</div>
              <h3>No matching topics</h3>
              <p>No topics match your search criteria. Try adjusting your search terms.</p>
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
