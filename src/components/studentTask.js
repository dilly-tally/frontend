"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/studentTask.css"
import { TabBar } from "./tabBar"
import ScrollHeader from "./Header/ScrollHeader"
import { useAuth } from "../context/AuthContext"
import { Classes } from "./classes"

export const StudentTask = () => {
  const [activeSection, setActiveSection] = useState("overview")
  const { user, userLoginId } = useAuth()
  const navigate = useNavigate()

  const renderOverview = () => (
    <div className="student-task-overview">
      <div className="task-buttons-grid">
        <button className="task-button classes-btn" onClick={() => setActiveSection("classes")}>
          <div className="task-icon">🏫</div>
          <div className="task-content">
            <h3>CLASSES</h3>
            <p>(create new class, add to existing class, assign students to class)</p>
          </div>
        </button>

        <button className="task-button library-btn">
          <div className="task-icon">📚</div>
          <div className="task-content">
            <h3>TASK LIBRARY</h3>
            <p>
              (view all tasks, create new task i.e. assign task to existing class, track assigned task, reassign/modify
              task)
            </p>
          </div>
        </button>

        <button className="task-button record-btn">
          <div className="task-icon">📊</div>
          <div className="task-content">
            <h3>STUDENT RECORD</h3>
            <p>(student view, reports→ option to download student reports)</p>
          </div>
        </button>

        <button className="task-button scorebook-btn">
          <div className="task-icon">📈</div>
          <div className="task-content">
            <h3>SCOREBOOK</h3>
            <p>(marks, completion i.e. progress report)</p>
          </div>
        </button>

        <button className="task-button settings-btn">
          <div className="task-icon">⚙️</div>
          <div className="task-content">
            <h3>SETTINGS</h3>
            <p>(change username password, download class data)</p>
          </div>
        </button>
      </div>
    </div>
  )

  return (
    <div className="modern-student-task">
      <ScrollHeader />

      {/* Fixed Header Section */}
      <div className="student-task-fixed-header">
        <div className="student-task-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Hi, <span className="highlight">{user?.displayName || "User"}</span>
            </h1>
            <p className="hero-subtitle">Manage your student tasks and classes</p>
          </div>
        </div>

        <div className="navigation-section">
          <TabBar className="modern-tab-bar" activePage="student-task" onNavigate={navigate} />
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="student-task-scrollable-contentt">
        {activeSection === "overview" && renderOverview()}
        {activeSection === "classes" && <Classes onBack={() => setActiveSection("overview")} />}
      </div>
    </div>
  )
}
