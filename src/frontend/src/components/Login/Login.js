import React, { useState, useEffect } from "react";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const msalConfig = {
  auth: {
    clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673", // Replace with your Azure AD app client ID
    authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323", // Replace with your tenant ID
    redirectUri: "http://localhost:3000", // Ensure this matches Azure AD's redirect URI
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const Login = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isMsalInitialized, setIsMsalInitialized] = useState(false); // Track MSAL initialization
  const navigate = useNavigate();

  // Initialize MSAL instance
  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();
        console.log("MSAL initialized successfully");
        setIsMsalInitialized(true); // Mark MSAL as initialized
      } catch (error) {
        console.error("MSAL initialization failed:", error);
      }
    };

    initializeMsal();
  }, []);

  // Fetch the HTML content from Login.html
  useEffect(() => {
    fetch("/Login.html")
      .then((response) => response.text())
      .then((html) => {
        console.log("Fetched HTML:", html); // Log the fetched HTML
        setHtmlContent(html);
      })
      .catch((error) => console.error("Error loading HTML:", error));
  }, []);

  // Add event listeners after the HTML content is injected
  useEffect(() => {
    if (htmlContent) {
      const teamSelect = document.getElementById("team-select");
      const adminCredentials = document.getElementById("admin-credentials");
      const loginButton = document.getElementById("msal-login-button");
      const modal = document.getElementById("myModal");
      const modalText = document.getElementById("modal-text");
      const closeModal = document.querySelector(".close");

      if (!teamSelect || !loginButton || !modal || !modalText) {
        console.error("Required elements not found in the DOM.");
        return;
      }

      // Function to show the modal
      const showModal = (message) => {
        modalText.textContent = message;
        modal.style.display = "block";
      };

      // Function to hide the modal
      const hideModal = () => {
        modal.style.display = "none";
      };

      // Close the modal when clicking the close button
      closeModal.addEventListener("click", hideModal);

      // Close the modal when clicking outside of it
      window.addEventListener("click", (event) => {
        if (event.target === modal) {
          hideModal();
        }
      });

      // Handle team selection
      const handleTeamChange = (event) => {
        if (event.target.value === "admin-Login") {
          adminCredentials.style.display = "flex";
        } else {
          adminCredentials.style.display = "none";
        }
      };

      // Handle login button click
      const handleLoginClick = async () => {
        if (!isMsalInitialized) {
          alert("MSAL is not initialized. Please try again later.");
          return;
        }

        const selectedTeam = teamSelect.value;
        if (!selectedTeam) {
          showModal("Please select a team.");
          return;
        }

        if (selectedTeam === "admin-Login") {
          const username = document.getElementById("admin-username").value;
          const password = document.getElementById("admin-password").value;
          if (username === "admin" && password === "admin") {
            showModal("Welcome Admin!");
          } else {
            showModal("Invalid admin credentials.");
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
              localStorage.setItem("userEmail", email);
              console.log("Logged in email:", email);

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
                showModal(errorData.error || "Error checking admin access.");
                return;
              }

              const { ec_mapping } = await response.json();
              if (["tag", "app-ec", "data-ec", "cloud-ec"].includes(selectedTeam)) {
                navigate(`/dashboard?ec_mapping=${encodeURIComponent(ec_mapping)}`);
              } else if (selectedTeam === "panel") {
                navigate(`/panelpage?ec_mapping=${encodeURIComponent(ec_mapping)}`);
              }

              // Show modal with welcome message and email
              showModal(`Welcome! Logged in as ${email}`);
            }
          } catch (error) {
            console.error("Login failed:", error);
            if (error instanceof InteractionRequiredAuthError) {
              showModal("Interaction required for login. Please try again.");
            } else {
              showModal(
                error.message || "Authentication failed. Please check your network or contact support."
              );
            }
          }
        }
      };

      // Add event listeners
      teamSelect.addEventListener("change", handleTeamChange);
      loginButton.addEventListener("click", handleLoginClick);

      // Cleanup event listeners on unmount
      return () => {
        teamSelect.removeEventListener("change", handleTeamChange);
        loginButton.removeEventListener("click", handleLoginClick);
        closeModal.removeEventListener("click", hideModal);
        window.removeEventListener("click", hideModal);
      };
    }
  }, [htmlContent, isMsalInitialized, navigate]);

  return (
    <div>
      {/* Login Form Section */}
      <div
        className="login-container"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      ></div>
    </div>
  );
};

export default Login;