import React from "react";
import { Tab } from "./tab";
import "../styles/tabBar.css";

export const TabBar = ({
  className,
  activePage = "dashboard", // Add prop to know which page is active
  onNavigate, // Add navigation handler prop
}) => {
  const handleTabClick = (route, pageName) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  return (
    <div className={`tab-bar ${className}`}>
      <div className="frame">
        <div onClick={() => handleTabClick('/dashboard', 'dashboard')}>
          <Tab 
            className="tab-instance" 
            text="Dashboard" 
            isActive={activePage === "dashboard"}
          />
        </div>
        
        <div onClick={() => handleTabClick('/calendar', 'calendar')}>
          <Tab 
            className="tab-instance" 
            text="Calendar" 
            isActive={activePage === "calendar"}
          />
        </div>
        
        <div onClick={() => handleTabClick('/teacherResource', 'teacher-resources')}>
          <Tab 
            className="tab-instance tab-2" 
            text="Teacher Resources" 
            isActive={activePage === "teacher-resources"}
          />
        </div>
        
        <div onClick={() => handleTabClick('/student-task', 'student-task')}>
          <Tab
            className="tab-instance"
            divClassName="design-component-instance-node"
            text="Student Task"
            isActive={activePage === "student-task"}
          />
        </div>
      </div>
    </div>
  );
};