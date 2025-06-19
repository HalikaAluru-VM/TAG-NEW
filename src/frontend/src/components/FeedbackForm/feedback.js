import React, { useState, useEffect } from 'react';
import './feedback.css';
import { PublicClientApplication } from '@azure/msal-browser';
import html2pdf from 'html2pdf.js';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    candidateEmail: '',
    imochaScore: 'N/A',
    rrfId: '',
    position: '',
    candidateName: '',
    interviewDate: '',
    interviewerName: '',
    hrEmail: '',
    detailedFeedback: '',
    result: ''
  });
  const [roundDetails, setRoundDetails] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const msalConfig = {
    auth: {
      clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
      authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
      redirectUri: "http://localhost:3000",
    }
  };
  const msalInstance = new PublicClientApplication(msalConfig);

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const candidateEmail = urlParams.get('candidateEmail');
      const roundDetails = localStorage.getItem('roundDetails');
      setRoundDetails(roundDetails);

      if (!candidateEmail || !roundDetails) {
        showToast("Candidate email or round details missing.", "error");
        return;
      }

      try {
        // First try to fetch existing feedback data
        const feedbackResponse = await fetch(
          `http://localhost:3000/api/get-feedbackform?candidateEmail=${candidateEmail}&roundDetails=${roundDetails}`
        );
        const feedbackData = await feedbackResponse.json();

        if (feedbackData.error) {
          // If no feedback exists, fetch candidate data
          const candidateResponse = await fetch(
            `http://localhost:3000/api/getCandidateData?candidateEmail=${candidateEmail}`
          );
          const candidateData = await candidateResponse.json();

          if (candidateData.error) {
            showToast(candidateData.error, "error");
          } else {
            setFormData({
              ...formData,
              candidateEmail,
              imochaScore: candidateData.l_1_score || 'N/A',
              rrfId: candidateData.rrf_id || '',
              position: candidateData.role || '',
              candidateName: candidateData.candidate_name || '',
              interviewDate: candidateData.l_2_interviewdate || '',
              interviewerName: candidateData.panel_name || '',
              hrEmail: candidateData.hr_email || ''
            });
          }
        } else {
          // If feedback exists, populate form with that data
          setFormData({
            ...formData,
            candidateEmail,
            imochaScore: feedbackData.imocha_score || 'N/A',
            rrfId: feedbackData.rrf_id || '',
            position: feedbackData.position || '',
            candidateName: feedbackData.candidate_name || '',
            interviewDate: feedbackData.interview_date || '',
            interviewerName: feedbackData.interviewer_name || '',
            hrEmail: feedbackData.hr_email || '',
            detailedFeedback: feedbackData.detailed_feedback || '',
            result: feedbackData.result || ''
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast("Failed to load data.", "error");
      }
    };

    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.detailedFeedback || !formData.result) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/submitFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formData, roundDetails })
      });
      const data = await response.json();

      if (data.success) {
        showToast('Feedback submitted successfully', 'success');
        await sendEmailWithPDF(formData.hrEmail, roundDetails);
      } else {
        showToast('Error submitting feedback', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error submitting feedback', 'error');
    }
  };

  const sendEmailWithPDF = async (hrEmail, roundDetails) => {
    try {
      let account = msalInstance.getAllAccounts()[0];

      if (!account) {
        console.log("No active account found. Attempting to log in...");
        await msalInstance.loginPopup({ scopes: ["Mail.Send"] });
        account = msalInstance.getAllAccounts()[0];

        if (!account) {
          showToast("Login required to send email", "error");
          return;
        }
      }

      msalInstance.setActiveAccount(account);

      const request = {
        account: account,
        scopes: ["Mail.Send"]
      };

      const response = await msalInstance.acquireTokenSilent(request);
      const accessToken = response.accessToken;

      if (!accessToken) {
        showToast("Failed to get access token", "error");
        return;
      }

      const formContainer = document.querySelector('.form-container');
      const pdfBlob = await html2pdf().from(formContainer).outputPdf("blob");

      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async function () {
        const base64PDF = reader.result.split(',')[1];

        const emailData = {
          message: {
            subject: `Interview Feedback - ${roundDetails}`,
            body: {
              contentType: "Text",
              content: "Please find the attached interview feedback form."
            },
            toRecipients: [{ emailAddress: { address: hrEmail } }],
            attachments: [
              {
                "@odata.type": "#microsoft.graph.fileAttachment",
                name: "Interview_Feedback_Form.pdf",
                contentBytes: base64PDF
              }
            ]
          },
          saveToSentItems: "true"
        };

        const emailResponse = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(emailData)
        });

        if (emailResponse.ok) {
          showToast("Email sent successfully", "success");
        } else {
          const errorData = await emailResponse.json();
          console.error("Error sending email:", errorData);
          showToast("Failed to send email", "error");
        }
      };
    } catch (error) {
      console.error("Error:", error);
      showToast("Error sending email", "error");
    }
  };

  return (
    <div className="form-container" id="form-container">
      <div style={{ color: '#000000' }}>
        <p>Round Details: <span id="round-details">{roundDetails}</span></p>
        <p>Email: <span id="candidate-email">{formData.candidateEmail}</span></p>
        <p>iMocha Score: <span id="imocha-score">{formData.imochaScore}</span></p>
      </div>
      <br />

      {/* Header Section */}
      <div style={{ maxWidth: '50%' }}>
        <table>
          <tbody>
            <tr>
              <td     >RRF ID</td>
              <td>
                <input 
                  type="text" 
                  id="rrfId" 
                  value={formData.rrfId}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td     >Job Designation</td>
              <td>
                <input 
                  type="text" 
                  id="position" 
                  value={formData.position} 
                  readOnly 
                />
              </td>
            </tr>
            <tr>
              <td     >Name of the Candidate</td>
              <td>
                <input 
                  type="text" 
                  id="candidateName" 
                  value={formData.candidateName} 
                  readOnly 
                />
              </td>
            </tr>
            <tr>
              <td>Date of Interview</td>
              <td>
                <input 
                  type="text" 
                  id="interviewDate" 
                  value={formData.interviewDate} 
                  readOnly 
                />
              </td>
            </tr>
            <tr>
              <td     >Interviewer Mail</td>
              <td>
                <input 
                  type="text" 
                  id="interviewerName" 
                  value={formData.interviewerName} 
                  readOnly 
                />
              </td>
            </tr>
            <tr>
              <td     >TAG Team Member</td>
              <td>
                <input 
                  type="text" 
                  id="hrEmail" 
                  value={formData.hrEmail} 
                  readOnly 
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Feedback Section */}
      <div className="feedback-section">
        <label htmlFor="detailedFeedback">Detailed Feedback: *</label>
        <textarea 
          id="detailedFeedback" 
          className="feedback-section-text"
          placeholder="Enter your detailed feedback here..." 
          required
          value={formData.detailedFeedback}
          onChange={handleInputChange}
        />
      </div>

      {/* Result Section */}
      <div className="result-section">
        <label htmlFor="result">Shortlisted for next round</label>
        <select 
          id="result" 
          className="result-select" 
          required
          value={formData.result}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="Recommended">Shortlisted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          id="submit-button"
          style={{ 
            backgroundColor: '#1f4e79', 
            color: '#ffffff', 
            height: '25px', 
            width: '200px', 
            borderRadius: '5px',
            margin: '20px 0'
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {/* Toast Notification */}
      <div id="toast" className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        {toast.message}
      </div>
    </div>
  );
};

export default FeedbackForm;