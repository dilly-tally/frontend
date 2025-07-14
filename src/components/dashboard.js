// import React from "react";
// import { useNavigate, Link } from "react-router-dom";
// import "../styles/dashboard.css"; 

// const Dashboard = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="dashboard-container">
//       {/* Header */}
//       <header className="dashboard-header">
//         <span className="logo">📷 photo</span>
//         <nav>
//           <a href="#">Profile</a>
//           <a href="#">Pricing</a>
//           <a href="#">Community</a>
//           <a href="#">Setting</a>
//         </nav>
//         <button className="logout-btn">🔄 Logout</button>
//       </header>

//       {/* Navigation Tabs */}
//       <nav className="nav-bar">
//         <Link to="/dashboard">Dashboard</Link>
//         <Link to="/calendar">Calendar</Link>
//         <Link to="/teacherResource">Teacher resource</Link> {/* This one */}
//         <Link to="/student-task">Student task</Link>
//       </nav>

//       {/* Main Content */}
//       <div className="dashboard-content">
//         {/* Task Boxes */}
//         <div className="task-section">
//           <div className="task-box">
//             <h3>Today Task</h3>
//             <p>Check your daily task</p>
//             <p><strong>Topic:</strong> <span className="topic-button">Algebra</span></p>
//             <div className="task-image">[Image Placeholder]</div>
//           </div>

//           <div className="task-box">
//             <h3>Upcoming This Week</h3>
//             <p>This Week’s Update</p>
//             <p><strong>Topic:</strong> <span className="topic-button">Algebra Test</span></p>
//             <div className="task-calendar">[Calendar Placeholder]</div>
//           </div>
//         </div>

//         {/* Student Task Status (Chart) */}
//         <div className="chart-section">
//           <h3>Student Task Status</h3>
//           <div className="chart-placeholder">[Chart Placeholder]</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { StateHoverWrapper } from "./stateHoverWrapper";
import { TabBar } from "./tabBar";
import ScrollHeader from "./Header/ScrollHeader";
export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard" data-model-id="171:489">
      <ScrollHeader/>
      <div className="group-wrapper">
        <div className="group">
          <div className="on-boarding-screen">
            {/* Header Section */}
            <div className="frame">
              <img 
                className="logo" 
                alt="Logo" 
                src="https://c.animaapp.com/hKY3t9j7/img/logo@2x.png" 
              />
              <div className="simplify-teaching">
                <span className="text-wrapper">Simplify </span>
                <span className="span">Teaching</span>
                <span className="text-wrapper">, Inspiring </span>
                <span className="span">Learning</span>
              </div>
              <img 
                className="ellipse" 
                alt="Ellipse" 
                src="https://c.animaapp.com/hKY3t9j7/img/ellipse-35.svg" 
              />
            </div>
            
            <img 
              className="line" 
              alt="Line" 
              src="https://c.animaapp.com/hKY3t9j7/img/line-71.svg" 
            />
            
            <div className="content-section">
              <h1 className="greeting">Hi, Uzma</h1>
              <TabBar 
                className="tab-bar-instance1" 
                activePage="dashboard"
                onNavigate={navigate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};