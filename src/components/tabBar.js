"use client"
import "../styles/tabBar.css"

export const TabBar = ({ className, activePage = "dashboard", onNavigate }) => {
  const handleTabClick = (route, pageName) => {
    if (onNavigate) {
      onNavigate(route)
    }
  }

  return (
    <div className={`modern-tab-bar ${className}`}>
      <div className="tab-container">
        <div
          className={`modern-tab ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => handleTabClick("/dashboard", "dashboard")}
        >
          <span className="tab-icon">🏠</span>
          <span className="tab-text">Dashboard</span>
        </div>

        <div
          className={`modern-tab ${activePage === "calendar" ? "active" : ""}`}
          onClick={() => handleTabClick("/calendar", "calendar")}
        >
          <span className="tab-icon">📅</span>
          <span className="tab-text">Calendar</span>
        </div>

        <div
          className={`modern-tab ${activePage === "teacher-resources" ? "active" : ""}`}
          onClick={() => handleTabClick("/teacherResource", "teacher-resources")}
        >
          <span className="tab-icon">📚</span>
          <span className="tab-text">Resources</span>
        </div>

        <div
          className={`modern-tab ${activePage === "student-task" ? "active" : ""}`}
          onClick={() => handleTabClick("/student-task", "student-task")}
        >
          <span className="tab-icon">✏️</span>
          <span className="tab-text">Student Task</span>
        </div>
      </div>
    </div>
  )
}
