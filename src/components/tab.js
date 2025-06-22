import React from "react";
import "../styles/tab.css";

export const Tab = ({ className, text = "Dashboard", divClassName, isActive = false }) => {
  return (
    <div className={`tab ${className} ${isActive ? 'active' : ''}`}>
      <div className={`dashboard ${divClassName} ${isActive ? 'active-text' : ''}`}>{text}</div>
      {isActive && <div className="active-underline" />}
    </div>
  );
};