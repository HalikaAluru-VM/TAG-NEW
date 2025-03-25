import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Dashboard.css";

// Sidebar Component
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

// Filter Container Component
const FilterContainer = () => {
  const [filter, setFilter] = useState("24_hours");
  const [customRangeVisible, setCustomRangeVisible] = useState(false);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    setCustomRangeVisible(value === "custom_range");
  };

  const applyFilter = () => {
    console.log("Filter applied:", filter);
  };

  return (
    <div className="filter-container">
      <h2>Filter Candidates by Date</h2>
      <select id="filterSelect" value={filter} onChange={handleFilterChange}>
        <option value="24_hours">Last 24 Hours</option>
        <option value="last_week">Last 1 Week</option>
        <option value="last_15_days">Last 15 Days</option>
        <option value="custom_range">Custom Range</option>
      </select>

      {customRangeVisible && (
        <div id="customDateRange" style={{ color: "black" }}>
          <label htmlFor="startDate">Start Date:</label>
          <input type="date" id="startDate" />
          <label htmlFor="endDate">End Date:</label>
          <input type="date" id="endDate" />
        </div>
      )}

      <button onClick={applyFilter}>Apply Filter</button>
    </div>
  );
};

// Card Component
const Card = ({ id, count, label, onClick }) => {
  return (
    <div className="cards" id={id} onClick={onClick}>
      <h2>{count}</h2>
      <p>{label}</p>
    </div>
  );
};

// Popup Modal Component
const PopupModal = ({ isVisible, title, tableId, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="popup">
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "80%",
          maxWidth: "800px",
          position: "relative",
          marginTop: "88px",
        }}
      >
        <span
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          &times;
        </span>
        <h2 style={{ marginLeft: "258px", color: "black" }}>{title}</h2>
        <div style={{ maxWidth: "100%" }}>
          <table
            id={tableId}
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {children}
          </table>
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isShortlistedPopupVisible, setIsShortlistedPopupVisible] = useState(false);
  const [isRejectedPopupVisible, setIsRejectedPopupVisible] = useState(false);

  const handlePopupClose = () => setIsPopupVisible(false);
  const handleShortlistedPopupClose = () => setIsShortlistedPopupVisible(false);
  const handleRejectedPopupClose = () => setIsRejectedPopupVisible(false);

  return (
    <div id="content">
      <div className="dashboard-container">
        <Card
          id="card"
          count={0}
          label="Applications"
          onClick={() => setIsPopupVisible(true)}
        />
        <PopupModal
          isVisible={isPopupVisible}
          title="Candidate Applications"
          tableId="applicationsTable"
          onClose={handlePopupClose}
        >
          <thead style={{ backgroundColor: "#f4f4f4" }}>
            <tr>
              <th>RRF ID</th>
              <th>Candidate Name</th>
              <th>Candidate Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamically loaded data will be inserted here */}
          </tbody>
        </PopupModal>

        <Card
          id="shortlistedCard"
          count={0}
          label="Shortlisted"
          onClick={() => setIsShortlistedPopupVisible(true)}
        />
        <PopupModal
          isVisible={isShortlistedPopupVisible}
          title="Shortlisted Candidates"
          tableId="shortlistedTable"
          onClose={handleShortlistedPopupClose}
        >
          <thead style={{ backgroundColor: "#f4f4f4" }}>
            <tr>
              <th>RRF ID</th>
              <th>Candidate Name</th>
              <th>Candidate Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamically loaded data will be inserted here */}
          </tbody>
        </PopupModal>

        <Card
          id="rejectedCard"
          count={0}
          label="Rejected"
          onClick={() => setIsRejectedPopupVisible(true)}
        />
        <PopupModal
          isVisible={isRejectedPopupVisible}
          title="Rejected Candidates"
          tableId="rejectedTable"
          onClose={handleRejectedPopupClose}
        >
          <thead style={{ backgroundColor: "#f4f4f4" }}>
            <tr>
              <th>RRF ID</th>
              <th>Candidate Name</th>
              <th>Candidate Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamically loaded data will be inserted here */}
          </tbody>
        </PopupModal>

        <Card id="imochaInviteCard" count="Loading..." label="Imocha Invite" />
        <Card id="imochaCompletedCard" count="Loading..." label="Imocha Completed" />
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const ecMapping = searchParams.get("ec_mapping");

  const handleNavigate = (page) => {
    console.log("Navigating to:", page);
    // Implement navigation logic here
  };

  return (
    <div>
      <button id="toggle-sidebar-btn" onClick={() => console.log("Toggle Sidebar")}>
        ☰Menu
      </button>
      <Sidebar onNavigate={handleNavigate} />
      <FilterContainer />
      
      <DashboardContent />
    </div>
  );
};

export default Dashboard;