import React, { useState, useEffect } from 'react';
import './Finalfeedbackform.css';

const Finalfeedbackform = () => {
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [candidateEmails, setCandidateEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [candidateData, setCandidateData] = useState({
    rrf_id: '',
    hr_email: '',
    candidate_name: '',
    role: '',
    panel_name: '',
    l_2_interviewdate: '',
    l_1_score: '',
    eng_center: ''
  });
  const [feedbackData, setFeedbackData] = useState({
    prescreening: {},
    l2Technical: {},
    feedback: []
  });

  // Function to show toast notifications
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  // Extract candidate_email from URL (for auto-selection in iframe)
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const candidateEmailFromURL = getQueryParam("email");

    // Fetch all candidate emails from the server
    fetch("http://localhost:3000/api/getAllCandidateEmails")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showToast(data.error, "error");
        } else {
          setCandidateEmails(data.emails);
          
          // Auto-select candidateEmail from URL if available
          if (candidateEmailFromURL) {
            setSelectedEmail(candidateEmailFromURL);
            handleEmailChange(candidateEmailFromURL);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching candidate emails:", error);
        showToast("Failed to load candidate emails.", "error");
      });
  }, []);

  const handleEmailChange = (email) => {
    setSelectedEmail(email);
    if (email) {
      // Fetch candidate data based on the selected email
      let imochaScore = null;
      let l2Result = "";

      // === Step 1: Fetch candidate basic data (getCandidateData) ===
      fetch(`http://localhost:3000/api/getCandidateData?candidateEmail=${email}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            showToast(data.error, "error");
          } else {
            setCandidateData({
              rrf_id: data.rrf_id,
              hr_email: data.hr_email,
              candidate_name: data.candidate_name,
              role: data.role,
              panel_name: data.panel_name,
              l_2_interviewdate: data.l_2_interviewdate,
              l_1_score: data.l_1_score,
              eng_center: data.eng_center
            });
            imochaScore = data.l_1_score; // Save iMocha score for later use
            showToast("Candidate details fetched successfully!", "success");
          }
        })
        .catch((error) => {
          console.error("Error fetching candidate data:", error);
          showToast("Failed to load candidate data.", "error");
        });

      // === Step 2: Fetch prescreening & feedback (final-prescreening) ===
      fetch(`http://localhost:3000/api/final-prescreening?candidateEmail=${email}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            showToast(data.message, "error");
          } else {
            setFeedbackData(data);

            // === ✅ iMocha Status Logic (only after L2 result is available) ===
            const imochaStatusField = document.getElementById("imocha-status");
            if (imochaScore != null && imochaScore !== "") {
              if (imochaScore >= 18) {
                imochaStatusField.value = "Shortlisted";
                imochaStatusField.style.backgroundColor = "lightgreen";
              } else {
                imochaStatusField.value = "Rejected";
                imochaStatusField.style.backgroundColor = "lightcoral";
              }
            } else {
              if (data.l2Technical?.result) {
                imochaStatusField.value = "iMocha Skipped";
                imochaStatusField.style.backgroundColor = "#f0f0f0"; // neutral gray
              } else {
                imochaStatusField.value = "Waiting for iMocha";
                imochaStatusField.style.backgroundColor = "#fffacd"; // light yellow
              }
            }

            showToast("Prescreening details fetched successfully!", "success");
          }
        })
        .catch((error) => {
          console.error("Error fetching prescreening details:", error);
          showToast("Failed to load prescreening details.", "error");
        });
    }
  };

  return (
    <div>
      <div className="form-container">
        <center>
          <h1><strong>Final Feedback</strong></h1>
        </center>
        <div style={{ color: '#000000', width: '60%' }}>
          <select 
            id="candidate-email-dropdown" 
            className="styled-dropdown"
            value={selectedEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
          >
            <option value="">Select a Candidate Email</option>
            {candidateEmails.map((email) => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        </div>
        <br />

        {/* Candidate Details */}
        <div>
          <table style={{ width: '60%' }}>
            <tr>
              <td className="header-cell">RRF ID</td>
              <td><input type="text" id="rrf-id" value={candidateData.rrf_id} readOnly /></td>
            </tr>
            <tr>
              <td className="header-cell">Account</td>
              <td><input type="text" id="account" value={candidateData.eng_center} readOnly /></td>
            </tr>
            <tr>
              <td className="header-cell">Job Designation</td>
              <td><input type="text" id="position" value={candidateData.role} readOnly /></td>
            </tr>
            <tr>
              <td className="header-cell">Name of the Candidate</td>
              <td>
                <input type="text" id="candidate-name" value={candidateData.candidate_name} readOnly />
              </td>
            </tr>
            <tr>
              <td className="header-cell">Date of Interview</td>
              <td>
                <input type="text" id="interview-date" value={candidateData.l_2_interviewdate} readOnly />
              </td>
            </tr>
            <tr hidden>
              <td className="header-cell">L2 Interview Panel</td>
              <td>
                <input
                  type="text"
                  id="interviewer-name"
                  value={candidateData.panel_name}
                  readOnly
                />
              </td>
            </tr>
            <tr hidden>
              <td className="header-cell">HR Interview Panel</td>
              <td>
                <input
                  type="text"
                  id="interviewer-name"
                  value={candidateData.panel_name}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td className="header-cell">TAG Team Member</td>
              <td><input type="text" id="hr-email" value={candidateData.hr_email} readOnly /></td>
            </tr>
          </table>
        </div>

        <table>
          <tr>
            <th></th>
            <th>Panel Member</th>
            <th>Final Rating</th>
            <th>Feedback</th>
          </tr>
          <tr>
            <td className="header-cell">Prescreening</td>
            <td><input type="text" id="prescreening-feedback" value={feedbackData.prescreening?.hr_email || ''} readOnly /></td>
            <td><input type="text" id="prescreening-status" value={feedbackData.prescreening?.status || ''} readOnly /></td>
            <td><textarea id="prescreening-summary" value={feedbackData.prescreening?.summary || ''} readOnly></textarea></td>
          </tr>
          <tr>
            <td className="header-cell">L1 or iMocha</td>
            <td>
              <input type="text" id="hr-email" value={candidateData.hr_email} readOnly />
            </td>
            <td>
              <input type="text" id="imocha-status" value="" readOnly />
            </td>
            <td>
              <input type="text" id="imocha-score" value={candidateData.l_1_score} readOnly />
            </td>
          </tr>
          <tr>
            <td className="header-cell">L2 Technical</td>
            <td>
              <input
                type="text"
                id="l2-technical-summary"
                value={feedbackData.l2Technical?.interviewer_name || ''}
                readOnly
              />
            </td>
            <td>
              <input
                type="text"
                id="l2-technical-result"
                value={feedbackData.l2Technical?.result || ''}
                readOnly
              />
            </td>
            <td>
              <input
                type="text"
                id="l2-technical-feedback"
                value={feedbackData.l2Technical?.detailed_feedback || ''}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td className="header-cell">EC Fitment</td>
            <td>
              <input
                type="text"
                id="ec-fitment-summary"
                value={feedbackData.feedback.find(f => f.round_details === 'EC Fitment Round')?.interviewer_name || ''}
                readOnly
              />
            </td>
            <td>
              <input type="text" id="ec-fitment-result" value={feedbackData.feedback.find(f => f.round_details === 'EC Fitment Round')?.result || ''} readOnly />
            </td>
            <td>
              <input
                type="text"
                id="ec-fitment-feedback"
                value={feedbackData.feedback.find(f => f.round_details === 'EC Fitment Round')?.detailed_feedback || ''}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td className="header-cell">Project Fitment</td>
            <td>
              <input
                type="text"
                id="project-fitment-summary"
                value={feedbackData.feedback.find(f => f.round_details === 'Project Fitment Round')?.interviewer_name || ''}
                readOnly
              />
            </td>
            <td>
              <input
                type="text"
                id="project-fitment-result"
                value={feedbackData.feedback.find(f => f.round_details === 'Project Fitment Round')?.result || ''}
                readOnly
              />
            </td>
            <td>
              <input
                type="text"
                id="project-fitment-feedback"
                value={feedbackData.feedback.find(f => f.round_details === 'Project Fitment Round')?.detailed_feedback || ''}
                readOnly
              />
            </td>
          </tr>

          <tr>
            <td className="header-cell">Client Fitment</td>
            <td>
              <input
                type="text"
                id="client-fitment-summary"
                value={feedbackData.feedback.find(f => f.round_details === 'Client Fitment Round')?.interviewer_name || ''}
                readOnly
              />
            </td>
            <td>
              <input
                type="text"
                id="client-fitment-result"
                value={feedbackData.feedback.find(f => f.round_details === 'Client Fitment Round')?.result || ''}
                readOnly
              />
            </td>
            <td>
              <input
                type="text"
                id="client-fitment-feedback"
                value={feedbackData.feedback.find(f => f.round_details === 'Client Fitment Round')?.detailed_feedback || ''}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td className="header-cell">Fitment</td>
            <td>
              <input type="text" id="fitment-summary" value={feedbackData.feedback.find(f => f.round_details === 'Fitment Round')?.interviewer_name || ''} readOnly />
            </td>
            <td>
              <input type="text" id="fitment-result" value={feedbackData.feedback.find(f => f.round_details === 'Fitment Round')?.result || ''} readOnly />
            </td>
            <td>
              <input type="text" id="fitment-feedback" value={feedbackData.feedback.find(f => f.round_details === 'Fitment Round')?.detailed_feedback || ''} readOnly />
            </td>
          </tr>
        </table>
      </div>

      <div id="toast" className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        {toast.message}
      </div>
      <br />
    </div>
  );
};

export default Finalfeedbackform;