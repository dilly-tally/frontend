import React from "react";
import { Tab } from "./tab";
import "../styles/tabBar.css";

export const TabBar = ({
  className,
  override = <Tab className="tab-2" text="Teacher Resources" />,
}) => {
  return (
    <div className={`tab-bar ${className}`}>
      <div className="frame">
        <Tab className="tab-instance" text="Dashboard" />
        <Tab className="tab-instance" text="Calendar" />
        {override}
        <Tab
          className="tab-instance"
          divClassName="design-component-instance-node"
          text="Student Task"
        />
      </div>
    </div>
  );
};
