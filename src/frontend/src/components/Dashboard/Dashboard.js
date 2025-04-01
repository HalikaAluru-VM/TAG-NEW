
import React, { useState, useEffect } from "react";
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

// Chart Component
const Chart = ({ title, canvasId, hidden }) => {
  useEffect(() => {
    // Initialize chart logic here if needed
  }, []);

  return (
    <div className={`dashboard-chart ${hidden ? "hidden" : ""}`}>
      <h3>{title}</h3>
      <div className="chart-containers">
        <canvas id={canvasId} style={{ maxHeight: "148px" }}></canvas>
      </div>
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

// RoleCard Component
const RoleCard = ({ title, icon, tag1, tag2, applicantsCount }) => {
  const iconMap = {
    "software": "</>",
    "design": "✏️",
    "sales": "📈",
    "hr": "👤",
    "database": "🗄️",
    "chart": "📊",
    "analysis": "📈",
    "model": "🔢",
    "backend": "🖥️",
    "frontend": "🎨",
    "lcnc": "🔧",
    "integration": "🔗"
  };

  return (
    <div className="cardss">
      <div className={`icon ${icon}-icon`}>{iconMap[icon] || "👤"}</div>
      <div className="job-title">
        {title}
        <span className="more-icon">...</span>
      </div>
      <div className="tags">
        <span className="tag">{tag1}</span>
        <span className="tag">{tag2}</span>
      </div>
      <div className="details">
        <div className="applicants">{applicantsCount || "Loading..."}</div>
      </div>
    </div>
  );
};

// PopupModal Component
const PopupModal = ({ isVisible, title, tableId, onClose, children, showFilters, loading }) => {
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
            {loading && (
              <thead style={{ backgroundColor: "#f4f4f4" }}>
                <tr>
                  <th colSpan="4" style={{ padding: "12px", textAlign: "center" }}>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        border: "4px solid #f3f3f3",
                        borderTop: "4px solid #3498db",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto",
                      }}
                    />
                  </th>
                </tr>
              </thead>
            )}
            {showFilters && (
              <thead style={{ backgroundColor: "#f4f4f4" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold", borderBottom: "2px solid #ddd" }}>
                    RRF ID
                    <input
                      type="text"
                      placeholder="Search by RRF"
                      style={{ width: "100%", marginTop: "5px" }}
                    />
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold", borderBottom: "2px solid #ddd" }}>
                    Candidate Name
                    <input
                      type="text"
                      placeholder="Search by name"
                      style={{ width: "100%", marginTop: "5px" }}
                    />
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold", borderBottom: "2px solid #ddd" }}>
                    Candidate Email
                    <input
                      type="text"
                      placeholder="Search by email"
                      style={{ width: "100%", marginTop: "5px" }}
                    />
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold", borderBottom: "2px solid #ddd" }}>
                    Status
                    <input
                      type="text"
                      placeholder="Search by status"
                      style={{ width: "100%", marginTop: "5px" }}
                    />
                  </th>
                </tr>
              </thead>
            )}
            {!loading && children}
          </table>
        </div>
        {showFilters && (
          <div id="pagination" style={{ marginTop: "20px", textAlign: "center" }}></div>
        )}
      </div>
    </div>
  );
};

// RightPanel Component
const RightPanel = () => {
  const [rrfCount, setRrfCount] = useState(0);
  const [imochaResults, setImochaResults] = useState({
    total: 1,
    app: 0,
    cloud: 0,
    data: 0
  });
  const [candidateStatus, setCandidateStatus] = useState([
    { name: "Resume Screening", progress: 0, type: "Evaluation" },
    { name: "L1 Imocha(online)", progress: 10, type: "Engagement" },
    { name: "L2 Interview", progress: 30, type: "Relationship" },
    { name: "Fitment Round", progress: 0, type: "Selection" }
  ]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      padding: "10px",
      width: "300px"
    }}>
      {/* Total RRF Count */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "15px",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <div style={{ color: "black", marginBottom: "10px", fontWeight: "bold" }}>Total RRF Count</div>
        <div style={{
          position: "relative",
          width: "150px",
          height: "150px",
          margin: "0 auto"
        }}>
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "10px solid #e0e0e0",
            clipPath: "circle(50% at 50% 50%)"
          }}></div>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{rrfCount}</p>
            <span style={{ fontSize: "12px" }}>Total Applicants</span>
          </div>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginTop: "15px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#FF6384"
            }}></div>
            <div>
              <span style={{ fontWeight: "bold" }}>0</span>
              <span style={{ fontSize: "12px", marginLeft: "5px" }}>App</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#36A2EB"
            }}></div>
            <div>
              <span style={{ fontWeight: "bold" }}>0</span>
              <span style={{ fontSize: "12px", marginLeft: "5px" }}>Cloud</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#FFCE56"
            }}></div>
            <div>
              <span style={{ fontWeight: "bold" }}>0</span>
              <span style={{ fontSize: "12px", marginLeft: "5px" }}>Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* L1 iMocha Results */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "15px",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <div style={{ color: "black", marginBottom: "10px", fontWeight: "bold" }}>L1 iMocha Results</div>
        <div style={{
          position: "relative",
          width: "150px",
          height: "150px",
          margin: "0 auto"
        }}>
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "10px solid #e0e0e0",
            clipPath: "circle(50% at 50% 50%)"
          }}></div>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{imochaResults.total}</p>
            <span style={{ fontSize: "12px" }}>Total Applicants</span>
          </div>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginTop: "15px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#FF6384"
            }}></div>
            <div>
              <span style={{ fontWeight: "bold" }}>{imochaResults.app}</span>
              <span style={{ fontSize: "12px", marginLeft: "5px" }}>App</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#36A2EB"
            }}></div>
            <div>
              <span style={{ fontWeight: "bold" }}>{imochaResults.cloud}</span>
              <span style={{ fontSize: "12px", marginLeft: "5px" }}>Cloud</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#FFCE56"
            }}></div>
            <div>
              <span style={{ fontWeight: "bold" }}>{imochaResults.data}</span>
              <span style={{ fontSize: "12px", marginLeft: "5px" }}>Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Status */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "15px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <header style={{ textAlign: "center", width: "100%", marginBottom: "10px" }}>
          <h1 style={{ fontSize: "18px", margin: 0 }}>Candidates Status</h1>
        </header>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {candidateStatus.map((status, index) => (
            <div key={index} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <div style={{
                position: "relative",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: `conic-gradient(#4CAF50 ${status.progress}%, #e0e0e0 ${status.progress}% 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{
                  position: "absolute",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "white"
                }}></div>
                <span style={{ fontSize: "10px", zIndex: 1 }}>{status.progress}%</span>
              </div>
              <div>
                <h2 style={{ fontSize: "14px", margin: 0 }}>{status.name}</h2>
                <div style={{ display: "flex", gap: "5px", fontSize: "12px" }}>
                  <span>{status.type}</span>
                </div>
              </div>
            </div>
          ))}
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
  const [loading, setLoading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [roleCounts, setRoleCounts] = useState({});

  const handlePopupClose = () => setIsPopupVisible(false);
  const handleShortlistedPopupClose = () => setIsShortlistedPopupVisible(false);
  const handleRejectedPopupClose = () => setIsRejectedPopupVisible(false);

  // Simulate loading role counts
  useEffect(() => {
    const timer = setTimeout(() => {
      setRoleCounts({
        devops: 12,
        platform: 8,
        site: 5,
        cloudops: 7,
        dataEngineer: 15,
        biVisualization: 9,
        dataAnalyst: 11,
        dataModeller: 6,
        cloudNativeBackend: 14,
        cloudNativeFrontend: 10,
        lcncPlatformEngineer: 4,
        integrationEngineer: 8
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="content" style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <div className="dashboard-container">
          <Card
            id="card"
            count={uploadCount}
            label="Applications"
            onClick={() => {
              setIsPopupVisible(true);
              setLoading(true);
              setTimeout(() => setLoading(false), 1000);
            }}
          />
          <PopupModal
            isVisible={isPopupVisible}
            title="Candidate Applications"
            tableId="applicationsTable"
            onClose={handlePopupClose}
            showFilters={true}
            loading={loading}
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
            count={shortlistedCount}
            label="Shortlisted"
            onClick={() => {
              setIsShortlistedPopupVisible(true);
              setLoading(true);
              setTimeout(() => setLoading(false), 1000);
            }}
          />
          <PopupModal
            isVisible={isShortlistedPopupVisible}
            title="Shortlisted Candidates"
            tableId="shortlistedTable"
            onClose={handleShortlistedPopupClose}
            showFilters={true}
            loading={loading}
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
            count={rejectedCount}
            label="Rejected"
            onClick={() => {
              setIsRejectedPopupVisible(true);
              setLoading(true);
              setTimeout(() => setLoading(false), 1000);
            }}
          />
          <PopupModal
            isVisible={isRejectedPopupVisible}
            title="Rejected Candidates"
            tableId="rejectedTable"
            onClose={handleRejectedPopupClose}
            showFilters={true}
            loading={loading}
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

        {/* HR Selection Details */}
        <div className="hrcardnew">
          <div className="hrcard">
            <h3 style={{ color: "black", marginTop: "5px" }}>HR Selection Details</h3>
            <canvas id="hrChart"></canvas>
          </div>
        </div>

        {/* By Role Section */}
        <h4 style={{ color: "black", paddingLeft: "200px" }}>By Role</h4>
        <div className="wrapper">
          <div className="containerss">
            <div className="grid">
              <RoleCard 
                title="DevOps" 
                icon="software" 
                tag1="Full-time" 
                tag2="Remote" 
                applicantsCount={roleCounts.devops} 
              />
              <RoleCard 
                title="Platform" 
                icon="design" 
                tag1="Part-time" 
                tag2="Hybrid" 
                applicantsCount={roleCounts.platform} 
              />
              <RoleCard 
                title="Migration" 
                icon="sales" 
                tag1="Full-time" 
                tag2="On-site" 
                applicantsCount={roleCounts.site} 
              />
              <RoleCard 
                title="CloudOps" 
                icon="hr" 
                tag1="Contract" 
                tag2="Remote" 
                applicantsCount={roleCounts.cloudops} 
              />
              <RoleCard 
                title="Data Engineer" 
                icon="database" 
                tag1="Full-time" 
                tag2="Remote" 
                applicantsCount={roleCounts.dataEngineer} 
              />
              <RoleCard 
                title="Data – BI Visualization Engineer" 
                icon="chart" 
                tag1="Part-time" 
                tag2="Hybrid" 
                applicantsCount={roleCounts.biVisualization} 
              />
              <RoleCard 
                title="Data Analyst" 
                icon="analysis" 
                tag1="Full-time" 
                tag2="On-site" 
                applicantsCount={roleCounts.dataAnalyst} 
              />
              <RoleCard 
                title="Data Modeller" 
                icon="model" 
                tag1="Contract" 
                tag2="Remote" 
                applicantsCount={roleCounts.dataModeller} 
              />
              <RoleCard 
                title="Cloud Native Application Engineer - Backend" 
                icon="backend" 
                tag1="Full-time" 
                tag2="Remote" 
                applicantsCount={roleCounts.cloudNativeBackend} 
              />
              <RoleCard 
                title="Cloud Native Application Engineer - Frontend" 
                icon="frontend" 
                tag1="Full-time" 
                tag2="Remote" 
                applicantsCount={roleCounts.cloudNativeFrontend} 
              />
              <RoleCard 
                title="LCNC Platform Engineer" 
                icon="lcnc" 
                tag1="Contract" 
                tag2="Hybrid" 
                applicantsCount={roleCounts.lcncPlatformEngineer} 
              />
              <RoleCard 
                title="Integration Engineer" 
                icon="integration" 
                tag1="Full-time" 
                tag2="Remote" 
                applicantsCount={roleCounts.integrationEngineer} 
              />
            </div>
          </div>
        </div>

        <div className="dashboard-charts">
          <Chart title="EC Overview" canvasId="departmentChart" />
          <Chart title="Applicants per EC" canvasId="departmentRoleChart" />
        </div>

        <div className="dashboard-charts">
          <Chart title="Cloud EC Overview" canvasId="statusChart" hidden />
          <Chart title="Cloud EC Job Roles" canvasId="roleChart" hidden />
        </div>

        <div className="dashboard-charts">
          <Chart title="App EC Overview" canvasId="newStatusChart" hidden />
          <Chart title="App EC Job Roles" canvasId="newRoleChart" hidden />
        </div>

        <div className="dashboard-charts">
          <Chart title="Data EC Overview" canvasId="secondStatusChart" hidden />
          <Chart title="Data EC Job Roles" canvasId="secondRoleChart" hidden />
        </div>
      </div>

      <RightPanel />
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