import React from "react";
import "../styles/tab.css";

export const Tab = ({ className, text = "Dashboard", divClassName }) => {
  return (
    <div className={`tab ${className}`}>
      <div className={`dashboard ${divClassName}`}>{text}</div>
    </div>
  );
};
