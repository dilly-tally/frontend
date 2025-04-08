import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/dashboard.css"; 

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <span className="logo">📷 photo</span>
        <nav>
          <a href="#">Profile</a>
          <a href="#">Pricing</a>
          <a href="#">Community</a>
          <a href="#">Setting</a>
        </nav>
        <button className="logout-btn">🔄 Logout</button>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-bar">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/teacherResource">Teacher resource</Link> {/* This one */}
        <Link to="/student-task">Student task</Link>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Task Boxes */}
        <div className="task-section">
          <div className="task-box">
            <h3>Today Task</h3>
            <p>Check your daily task</p>
            <p><strong>Topic:</strong> <span className="topic-button">Algebra</span></p>
            <div className="task-image">[Image Placeholder]</div>
          </div>

          <div className="task-box">
            <h3>Upcoming This Week</h3>
            <p>This Week’s Update</p>
            <p><strong>Topic:</strong> <span className="topic-button">Algebra Test</span></p>
            <div className="task-calendar">[Calendar Placeholder]</div>
          </div>
        </div>

        {/* Student Task Status (Chart) */}
        <div className="chart-section">
          <h3>Student Task Status</h3>
          <div className="chart-placeholder">[Chart Placeholder]</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
