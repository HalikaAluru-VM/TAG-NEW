import React, { useState, useEffect } from 'react';
import './imocha.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const IMocha = () => {
  const [showPopupForm, setShowPopupForm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [globalRrfId, setGlobalRrfId] = useState(null);
  const [steps, setSteps] = useState([
    { id: 1, title: 'Resume Pre-screen', active: true },
    { id: 2, title: 'Online iMocha', active: true },
    { id: 3, title: 'L2 Technical', active: false },
    { id: 4, title: 'Fitment', active: false }
  ]);
  const [newStep, setNewStep] = useState({
    name: '',
    position: ''
  });

  const navigateBack = () => {
    window.location.href = "cloudrecruit.html";
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  const fetchHRDetails = async () => {
    const hrId = document.getElementById("hr-id-dropdown")?.value;
    if (hrId) {
      try {
        const response = await fetch(`https://demotag.vercel.app/api/hr/${hrId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch HR details");
        }
        const data = await response.json();
        // Update HR details in the UI
      } catch (error) {
        showToast(error.message, "error");
      }
    }
  };

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem("candidateDetails"));
    if (details) {
      setCandidateDetails(details);
      setGlobalRrfId(details.globalRrfId);
      console.log("Global RRF ID:", details.globalRrfId);
    }
    fetchRoundsFromDB(details?.globalRrfId);
  }, []);

  const sendEmailInvite = async () => {
    saveRoundsToDB();
    const sendButton = document.querySelector(".send-email-btn");
    sendButton.textContent = "Sending...";
    sendButton.disabled = true;

    if (!candidateDetails) {
      showToast("No candidate details found.", "error");
      sendButton.textContent = "Send Exam Invite";
      sendButton.disabled = false;
      return;
    }

    const { candidateName, candidateEmail, role, globalHrEmail } = candidateDetails;

    const roleToInviteIdMap = {
      "Junior Azure DevOps Engineer": 1292765,
      "Senior Azure DevOps Engineer": 1292976,
      "Junior AWS DevOps Engineer": 1292733,
      "Senior AWS DevOps Engineer": 1292950,
      "Junior Azure Platform Engineer": 1292775,
      "Junior AWS Platform Engineer": 1292769,
      "Senior AWS Platform Engineer": 1292990,
      "Lead AWS Platform Engineer": 1295883,
      "Junior Azure Cloudops Engineer": 1292781,
      "Junior AWS Cloudops Engineer": 1292779,
      "AWS Data Engineer": 1303946,
      "Azure Data Engineer": 1293813,
      "Databricks Data Engineer": 1293971,
      "Hadoop Data Engineer": 1263132,
      "DataStage Data Engineer": 1304065,
      "IBM MDM Data Engineer": 1233151,
      "ETL Data Engineer": 1294495,
      "Oracle Data Engineer": 1302835,
      "IDMC Data Engineer": 1294495,
      "Marklogic Data Engineer": 1304066,
      "SQL Data Engineer": 1304100,
      "Snowflake Data Engineer": 1292173,
      "SSIS Data Engineer": 1293822,
      "Power BI Data – BI Visualization Engineer": 1303985,
      "Tableau Data – BI Visualization Engineer": 1303999,
      "WebFOCUS Data – BI Visualization Engineer": 1304109,
      DataAnalyst: 1304111,
      "Data Modeller": 1304149,
      "Junior .Net Cloud Native Application Engineer - Backend": 1304441,
      "Senior .Net Cloud Native Application Engineer - Backend": 1228695,
      "Junior Java Cloud Native Application Engineer - Backend": 1302022,
      "Senior Java Cloud Native Application Engineer - Backend": 1228712,
      "Junior Angular Cloud Native Application Engineer - Frontend": 1228715,
      "Senior Angular Cloud Native Application Engineer - Frontend": 1228781,
      "Junior React Cloud Native Application Engineer - Frontend": 1288123,
      "Senior React Cloud Native Application Engineer - Frontend": 1228853,
      "Junior Mendix LCNC Platform Engineer": 1229987,
      "Senior Mendix LCNC Platform Engineer": 1229987,
    };

    const inviteId = roleToInviteIdMap[role];
    if (!inviteId) {
      showToast("Invalid role selected. Please check the role.", "error");
      sendButton.textContent = "Send Exam Invite";
      sendButton.disabled = false;
      return;
    }

    const targetUrl = `https://demotag.vercel.app/api/invite-candidate`;
    const requestData = {
      email: candidateEmail,
      name: candidateName,
      sendEmail: "yes",
      callbackURL: "https://www.imocha.io/",
      redirectURL: "https://www.imocha.io/",
      disableMandatoryFields: 0,
      hideInstruction: 0,
      ccEmail: globalHrEmail,
    };

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requestData,
          inviteId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      showToast("Invite sent successfully.", "success");
      sendButton.textContent = "Invite Sent";
      setTimeout(() => {
        window.location.href = "candidatespage.html";
      }, 3000);
    } catch (error) {
      showToast("Failed to send invite request. Please try again.", "error");
      sendButton.textContent = "Send Exam Invite";
      sendButton.disabled = false;
    }
  };

  const skipEmailInvite = () => {
    saveRoundsToDB();
    const recruitmentPhase = "No iMocha Exam";

    fetch('https://demotag.vercel.app/api/update-candidate-recruitment-phase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: localStorage.getItem("candidateId"),
        recruitment_phase: recruitmentPhase
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log("Recruitment phase updated to 'No iMocha Exam'");
      } else {
        console.log("Error updating recruitment phase");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      console.log("Error updating recruitment phase");
    });

    setTimeout(() => {
      showToast("Skipping iMocha exam", "success");
    }, 0);

    setTimeout(() => {
      window.location.href = "candidatespage.html";
    }, 3000);
  };

  const saveRoundsToDB = () => {
    const rrf_id = globalRrfId;
    const rounds = steps.map(step => ({ rrf_id, recruitment_rounds: step.title }));

    fetch("https://demotag.vercel.app/api/saveRounds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rounds }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showToast("New rounds saved successfully!", "success");
        } else {
          showToast("No new rounds added. Duplicates were ignored.", "error");
        }
      })
      .catch(error => {
        console.error("Error saving rounds:", error);
      });
  };

  const fetchRoundsFromDB = (rrfId) => {
    if (!rrfId) return;
    
    fetch(`https://demotag.vercel.app/api/getRounds?rrf_id=${rrfId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.rounds.length > 0) {
          displayRounds(data.rounds);
        } else {
          console.warn("No rounds found for this RRF ID.");
        }
      })
      .catch((error) => {
        console.error("Error fetching rounds:", error);
      });
  };

  const displayRounds = (rounds) => {
    const sortedRounds = rounds.sort((a, b) => a.round_order - b.round_order);
    const newSteps = sortedRounds.map((round, index) => ({
      id: index + 1,
      title: round.recruitment_rounds,
      active: index < 2 // First two steps active by default
    }));
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setShowPopupForm(true);
  };

  const handleSaveStep = () => {
    if (newStep.name && newStep.position) {
      const newStepObj = {
        id: steps.length + 1,
        title: newStep.name,
        active: false
      };

      let newSteps;
      if (newStep.position === "before") {
        const fitmentIndex = steps.findIndex(step => step.title === "Fitment");
        newSteps = [...steps];
        newSteps.splice(fitmentIndex, 0, newStepObj);
      } else {
        newSteps = [...steps, newStepObj];
      }

      setSteps(newSteps);
      setShowPopupForm(false);
      setNewStep({ name: '', position: '' });
    }
  };

  const openFeedbackFormPopup = (round) => {
    // Implementation for feedback form popup
    console.log("Opening feedback form for:", round);
  };

  if (!candidateDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button className="back-button" onClick={navigateBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <div className="progress-steps">
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={step.id} className={`step ${step.active ? 'active' : ''}`}>
              <div className="step-circle">{step.id}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>
        <div className="add-step-button">
          <button id="addStepButton" onClick={handleAddStep}>+</button>
        </div>
      </div>

      {showPopupForm && (
        <div id="popupForm" className="popup-form" style={{ display: 'flex' }}>
          <div className="popup-content">
            <h3>Add New Step</h3>

            <label htmlFor="name">Select Step:</label>
            <select 
              id="name" 
              value={newStep.name}
              onChange={(e) => setNewStep({...newStep, name: e.target.value})}
            >
              <option value="">Select</option>
              <option value="EC Fitment">EC Fitment</option>
              <option value="Project Fitment">Project Fitment</option>
              <option value="Client Fitment">Client Fitment</option>
            </select>

            <label htmlFor="position">Position:</label>
            <select 
              id="position" 
              value={newStep.position}
              onChange={(e) => setNewStep({...newStep, position: e.target.value})}
            >
              <option value="">Select</option>
              <option value="before">Before Fitment Round</option>
              <option value="after">After Fitment Round</option>
            </select>

            <button id="saveButton" onClick={handleSaveStep}>Save</button>
            <button id="closeButton" onClick={() => setShowPopupForm(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="container">
        <div className="header">
          <div className="profile-info">
            <div className="profile-img">
              <img src="vam.png" alt="Profile Picture" />
            </div>
            <div className="profile-details">
              <h2 className="candidateName">{candidateDetails.candidateName}</h2>
              <div>
                <span>Resume Score:</span>
                <span className="suitabilityPercentage">{candidateDetails.suitabilityPercentage}%</span>
              </div>
            </div>
          </div>
          <div className="buttons">
            <button className="send-email-btn" onClick={sendEmailInvite}>Send Exam Invite</button>
            <button className="skip-email-btn" onClick={skipEmailInvite}>Skip iMocha Exam</button>
          </div>
        </div>

        <div className="main-content">
          <div className="left-panel">
            <div className="interview-card">
              <div>
                <h4>Candidate Summary</h4>
                <p><span id="finalSummary" style={{ color: '#343a40' }}>{candidateDetails.finalSummary}</span></p>
              </div>
            </div>
            <div className="interview-card">
              <div>
                <h4>HR Details</h4>
                <p style={{ marginBottom: '5px', marginTop: '10px' }}>
                  <span style={{ color: '#343a40' }}>Hr Email:</span>
                  <span id="globalHrEmail" style={{ color: '#343a40' }}>{candidateDetails.globalHrEmail}</span>
                </p>
                <p>
                  <span style={{ color: '#343a40' }}>RRF ID:</span>
                  <span id="globalRrfId" style={{ color: '#343a40' }}>{candidateDetails.globalRrfId}</span>
                </p>
              </div>
            </div>
            <div className="interview-card-candidate">
              <div>
                <h4>Edit Candidate Details</h4>
                <div className="edit-candidate">
                  <label htmlFor="name">Name:</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="candidateName candidate-details" 
                    value={candidateDetails.candidateName} 
                    onChange={(e) => setCandidateDetails({...candidateDetails, candidateName: e.target.value})}
                  />

                  <label htmlFor="email">Email:</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="candidateEmail candidate-details" 
                    value={candidateDetails.candidateEmail} 
                    onChange={(e) => setCandidateDetails({...candidateDetails, candidateEmail: e.target.value})}
                  />

                  <label htmlFor="phone">Phone Number:</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="candidatePhoneNumber candidate-details" 
                    value={candidateDetails.candidatePhoneNumber} 
                    onChange={(e) => setCandidateDetails({...candidateDetails, candidatePhoneNumber: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="right-panel">
            <div className="sidebar-section">
              <h4>Candidate Details</h4>
              <ul>
                <li><span>Name:</span> <span className="candidateName">{candidateDetails.candidateName}</span></li>
                <li><span>Email:</span> <span className="candidateEmail">{candidateDetails.candidateEmail}</span></li>
                <li><span>Status:</span> <span id="statusText">{candidateDetails.statusText}</span></li>
                <li><span>Role:</span> <span id="role">{candidateDetails.role}</span></li>
                <li>
                  <span>Phone:</span> <span className="candidatePhoneNumber">{candidateDetails.candidatePhoneNumber}</span>
                </li>
                <li>
                  <span>Percentage:</span><span className="suitabilityPercentage">{candidateDetails.suitabilityPercentage}%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {toast.show && (
          <div id="toast" className={`toast ${toast.type}`} style={{ display: 'block' }}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default IMocha;