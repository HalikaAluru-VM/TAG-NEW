import React, { useState } from "react";
import "./EcSelection.css";

const EcSelection = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const navigateTo = (url) => {
    window.location.href = url;
  };

  return (
    <div>
      <button id="toggle-sidebar-btn" onClick={toggleSidebar}>
        ☰Menu
      </button>

      {/* Sidebar */}
      <div className={`sidebar-menu ${sidebarVisible ? "show" : ""}`}>
        <div
          className="sidebar-option active"
          onClick={() => navigateTo("Dashboard.html")}
        >
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </div>
        <div
          className="sidebar-option"
          onClick={() => navigateTo("ECselection.html")}
        >
          <i className="fas fa-users"></i>
          <span>Recruit</span>
        </div>
        <div
          className="sidebar-option"
          onClick={() => navigateTo("candidatespage.html")}
        >
          <i className="fas fa-tasks"></i>
          <span>RRF Tracking</span>
        </div>
        <div
          className="sidebar-option"
          onClick={() => navigateTo("GTPrescreening.html")}
        >
          <i className="fas fa-tasks"></i>
          <span>GT's Prescreening</span>
        </div>
        <div
          className="sidebar-option logout-option"
          onClick={() => navigateTo("index.html")}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </div>
      </div>

      <div className="backbutton" onClick={() => navigateTo("index.html")}>
        <i className="fas fa-arrow-left"></i>
      </div>

      {/* Cards Section */}
      <div className="card-container">
        <div
          className="card"
          onClick={() => navigateTo("cloudrecruit.html", "Cloud EC")}
        >
          <i className="fas fa-cloud card-icon"></i>
          <div className="card-title">Cloud EC</div>
        </div>
        <div
          className="card"
          onClick={() => navigateTo("app-recruit", "App EC")}
        >
          <i className="fas fa-cogs card-icon"></i>
          <div className="card-title">App EC test</div>
        </div>
        <div
          className="card"
          onClick={() => navigateTo("datarecruit.html", "Data EC")}
        >
          <i className="fas fa-database card-icon"></i>
          <div className="card-title">Data EC</div>
        </div>
        <div
          className="card"
          onClick={() => navigateTo("corerecruit.html", "Core EC")}
        >
          <i className="fas fa-microchip card-icon"></i>
          <div className="card-title">Core EC</div>
        </div>
      </div>
    </div>
  );
};

export default EcSelection;