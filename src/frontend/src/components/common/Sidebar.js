import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <>
      <button id="toggle-sidebar-btn" onClick={toggleSidebar}>
        ☰Menu
      </button>
      <div className={`sidebar-menu ${sidebarVisible ? "show" : ""}`}>
        <div
          className="sidebar-option active"
          onClick={() => navigateTo("/dashboard")}
        >
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </div>
        <div
          className="sidebar-option"
          onClick={() => navigateTo("/ec-selection")}
        >
          <i className="fas fa-users"></i>
          <span>Recruit</span>
        </div>
        <div
          className="sidebar-option"
          onClick={() => navigateTo("/app-recruit")}
        >
          <i className="fas fa-tasks"></i>
          <span>App Recruit</span>
        </div>
        <div
          className="sidebar-option logout-option"
          onClick={() => navigateTo("/")}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;