import React from "react";
import "./Sidebar.css"; // Ensure the CSS for the sidebar is included

const Sidebar = ({ onNavigate }) => {
  return (
    <div id="sidebar" className="sidebar-menu">
      <div
        className="sidebar-option active"
        data-target="dashboard"
        data-tooltip="Dashboard"
        onClick={() => onNavigate("Dashboard")}
      >
        <i className="fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </div>
      <div
        className="sidebar-option"
        data-target="interviews"
        data-tooltip="Interviews"
        onClick={() => onNavigate("ECselection")}
      >
        <i className="fas fa-users"></i>
        <span>Recruit</span>
      </div>
      <div
        className="sidebar-option"
        data-target="candidateInfo"
        data-tooltip="candidateInfo"
        onClick={() => onNavigate("candidatespage")}
      >
        <i className="fas fa-tasks"></i>
        <span>RRF Tracking</span>
      </div>
      <div
        className="sidebar-option"
        data-target="candidateInfo"
        data-tooltip="candidateInfo"
        onClick={() => onNavigate("GTPrescreening")}
      >
        <i className="fas fa-tasks"></i>
        <span>GT's Prescreening</span>
      </div>
      <div
        className="sidebar-option"
        data-target="candidateInfo"
        data-tooltip="candidateInfo"
        onClick={() => onNavigate("interview-schedule")}
      >
        <i className="fas fa-users"></i>
        <span>My Interviews</span>
      </div>
      <div
        className="sidebar-option logout-option"
        data-tooltip="Logout"
        onClick={() => onNavigate("index")}
      >
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;