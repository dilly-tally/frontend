"use client"
import { useNavigate } from "react-router-dom"
import "../styles/dashboard.css"
import { TabBar } from "./tabBar"
import ScrollHeader from "./Header/ScrollHeader"
import { useAuth } from "../context/AuthContext"

export const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="modern-dashboard">
      <ScrollHeader />

      {/* Fixed Header Section */}
      <div className="dashboard-fixed-header">
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1 style={{ color: "black" }} className="hero-title">
              Hi,{" "}
              <span style={{ color: "#4CAF50" }} className="highlight">
                {user?.displayName || "User"}
              </span>
            </h1>
            <p style={{ color: "#4CAF50" }} className="hero-subtitle">
              Welcome back to your teaching dashboard
            </p>
          </div>
          <div className="hero-decoration">
            <div className="floating-icon">📚</div>
            <div className="floating-icon">✨</div>
            <div className="floating-icon">🎯</div>
          </div>
        </div>

        <div className="navigation-section">
          <TabBar className="modern-tab-bar" activePage="dashboard" onNavigate={navigate} />
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>12</h3>
              <p>Active Lessons</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>156</h3>
              <p>Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>89%</h3>
              <p>Completion Rate</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>4.8</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="dashboard-scrollable-content">
        <div className="main-grid">
          <div className="primary-cards">
            <div className="dashboard-card today-tasks">
              <div className="card-header">
                <div className="card-title">
                  <h3>Today's Tasks</h3>
                  <span className="task-count">3</span>
                </div>
                <div className="card-icon">📋</div>
              </div>
              <div className="card-content">
                <div className="task-item">
                  <div className="task-dot algebra"></div>
                  <div className="task-details">
                    <h4>Algebra Basics</h4>
                    <p>Grade 8 • Due in 2 hours</p>
                  </div>
                  <div className="task-status pending">Pending</div>
                </div>
                <div className="task-item">
                  <div className="task-dot geometry"></div>
                  <div className="task-details">
                    <h4>Geometry Quiz</h4>
                    <p>Grade 9 • Due tomorrow</p>
                  </div>
                  <div className="task-status completed">Completed</div>
                </div>
                <div className="task-item">
                  <div className="task-dot calculus"></div>
                  <div className="task-details">
                    <h4>Calculus Review</h4>
                    <p>Grade 12 • Due in 3 days</p>
                  </div>
                  <div className="task-status in-progress">In Progress</div>
                </div>
              </div>
            </div>

            <div className="dashboard-card upcoming-week">
              <div className="card-header">
                <div className="card-title">
                  <h3>This Week</h3>
                </div>
                <div className="card-icon">📅</div>
              </div>
              <div className="card-content">
                <div className="week-overview">
                  <div className="week-day">
                    <span className="day">Mon</span>
                    <div className="day-indicator active"></div>
                  </div>
                  <div className="week-day">
                    <span className="day">Tue</span>
                    <div className="day-indicator"></div>
                  </div>
                  <div className="week-day">
                    <span className="day">Wed</span>
                    <div className="day-indicator active"></div>
                  </div>
                  <div className="week-day">
                    <span className="day">Thu</span>
                    <div className="day-indicator"></div>
                  </div>
                  <div className="week-day">
                    <span className="day">Fri</span>
                    <div className="day-indicator active"></div>
                  </div>
                </div>
                <div className="upcoming-events">
                  <div className="event-item">
                    <div className="event-time">10:00 AM</div>
                    <div className="event-title">Math Test - Grade 8</div>
                  </div>
                  <div className="event-item">
                    <div className="event-time">2:00 PM</div>
                    <div className="event-title">Parent Meeting</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="secondary-cards">
            <div className="dashboard-card student-progress">
              <div className="card-header">
                <div className="card-title">
                  <h3>Student Progress</h3>
                </div>
                <div className="card-icon">📈</div>
              </div>
              <div className="card-content">
                <div className="progress-chart">
                  <div className="chart-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "85%" }}></div>
                    </div>
                    <span className="progress-label">Overall Progress: 85%</span>
                  </div>
                  <div className="progress-details">
                    <div className="progress-item">
                      <span className="subject">Mathematics</span>
                      <div className="mini-progress">
                        <div className="mini-fill" style={{ width: "92%" }}></div>
                      </div>
                      <span className="percentage">92%</span>
                    </div>
                    <div className="progress-item">
                      <span className="subject">Science</span>
                      <div className="mini-progress">
                        <div className="mini-fill" style={{ width: "78%" }}></div>
                      </div>
                      <span className="percentage">78%</span>
                    </div>
                    <div className="progress-item">
                      <span className="subject">English</span>
                      <div className="mini-progress">
                        <div className="mini-fill" style={{ width: "85%" }}></div>
                      </div>
                      <span className="percentage">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card quick-actions">
              <div className="card-header">
                <div className="card-title">
                  <h3>Quick Actions</h3>
                </div>
                <div className="card-icon">⚡</div>
              </div>
              <div className="card-content">
                <div className="action-buttons">
                  <button className="action-btn primary" onClick={() => navigate("/teacherResource")}>
                    <span className="btn-icon">📚</span>
                    <span>Browse Resources</span>
                  </button>
                  <button className="action-btn secondary">
                    <span className="btn-icon">➕</span>
                    <span>Create Assignment</span>
                  </button>
                  <button className="action-btn tertiary">
                    <span className="btn-icon">📊</span>
                    <span>View Reports</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
