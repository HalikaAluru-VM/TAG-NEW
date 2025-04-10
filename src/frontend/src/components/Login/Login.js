import React, { useState, useEffect } from "react";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const msalConfig = {
  auth: {
    clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
    authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
    redirectUri: "http://localhost:3000",
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const Login = () => {
  const [isMsalInitialized, setIsMsalInitialized] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const navigate = useNavigate();

  // Initialize MSAL instance
  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();
        console.log("MSAL initialized successfully");
        setIsMsalInitialized(true);
      } catch (error) {
        console.error("MSAL initialization failed:", error);
      }
    };

    initializeMsal();
  }, []);

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleLoginClick = async () => {
    if (!isMsalInitialized) {
      alert("MSAL is not initialized. Please try again later.");
      return;
    }

    if (!selectedTeam) {
      alert("Please select a team.");
      return;
    }

    if (selectedTeam === "admin-Login") {
      const username = document.getElementById("admin-username").value;
      const password = document.getElementById("admin-password").value;
      if (username === "admin" && password === "admin") {
        setUserName("Admin");
        setWelcomeModalOpen(true);
        setTimeout(() => {
          navigate("/admin");
        }, 3000);
      } else {
        alert("Invalid admin credentials.");
      }
    } else {
      try {
        const loginRequest = {
          scopes: ["openid", "profile", "user.read", "Mail.Send"],
        };
        const loginResponse = await msalInstance.loginPopup(loginRequest);
        const account = loginResponse.account;

        if (account) {
          const email = account.username;
          setUserName(account.name || email);
          setWelcomeModalOpen(true);

          const backendPort = process.env.REACT_APP_BACKEND_PORT || 8000;
          const apiUrl = `http://localhost:${backendPort}/api/auth/check-admin`;

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || "Error checking admin access.");
            return;
          }

          const { ec_mapping } = await response.json();

          setTimeout(() => {
            if (["tag", "app-ec", "data-ec", "cloud-ec"].includes(selectedTeam)) {
              navigate(`/dashboard?ec_mapping=${encodeURIComponent(ec_mapping)}`);
            } else if (selectedTeam === "panel") {
              navigate(`/panelpage?ec_mapping=${encodeURIComponent(ec_mapping)}`);
            }
          }, 3000);
        }
      } catch (error) {
        console.error("Login failed:", error);
        if (error instanceof InteractionRequiredAuthError) {
          alert("Interaction required for login. Please try again.");
        } else {
          alert("Authentication failed. Please check your network or contact support.");
        }
      }
    }
  };

  return (
    <div className="login-page">
      {/* Logo Section */}
      <div className="login-image">
        <img src="/logo.png" alt="Logo" />
      </div>

      {/* Login Form Section */}
      <div id="login-container">
        <h1 className="login-heading">
          Welcome To ValueMomentum Hire Assist Portal
        </h1>
        <form id="login-form" className="login-form-container">
          <label htmlFor="team-select" className="team-select-label">
            Select Your Team:
          </label>
          <select
            id="team-select"
            required
            value={selectedTeam}
            onChange={handleTeamChange}
            className="team-select-dropdown"
          >
            <option value="">Select Your Team</option>
            <option value="tag">TAG Team</option>
            <option value="panel">Panel Login</option>
            <option value="app-ec">App EC</option>
            <option value="data-ec">Data EC</option>
            <option value="cloud-ec">Cloud EC</option>
            <option value="admin-Login">Admin</option>
          </select>

          {selectedTeam === "admin-Login" && (
            <div id="admin-credentials" className="admin-credentials">
              <div className="credential-field">
                <label htmlFor="admin-username">Username:</label>
                <input
                  type="text"
                  id="admin-username"
                  placeholder="Enter Username"
                />
              </div>
              <div className="credential-field">
                <label htmlFor="admin-password">Password:</label>
                <input
                  type="password"
                  id="admin-password"
                  placeholder="Enter Password"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            id="msal-login-button"
            onClick={handleLoginClick}
            className="login-button"
          >
            Login
          </button>
        </form>
      </div>

      {/* Welcome Modal */}
      {welcomeModalOpen && (
        <div className="welcome-modal-overlay">
          <div className="welcome-modal-content">
            <span
              className="close-modal-icon"
              onClick={() => {
                setWelcomeModalOpen(false);
                if (selectedTeam) {
                  navigate(`/dashboard?ec_mapping=${encodeURIComponent(selectedTeam)}`);
                } else {
                  alert("No team selected. Please try again.");
                }
              }}
            >
              &times;
            </span>
            <div className="welcome-user">Welcome, {userName}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;