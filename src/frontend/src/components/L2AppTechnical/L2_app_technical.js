import React, { useState, useEffect } from 'react';
import './L2_app_technical.css';

const L2AppTechnical = () => {
  const [candidateData, setCandidateData] = useState({
    email: '',
    l_1_score: 'N/A',
    rrf_id: 'N/A',
    role: 'N/A',
    candidate_name: 'N/A',
    l_2_interviewdate: 'N/A',
    panel_name: 'N/A',
    hr_email: 'N/A'
  });
  const [questions, setQuestions] = useState([]);
  const [detailedFeedback, setDetailedFeedback] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching candidate data
        const urlParams = new URLSearchParams(window.location.search);
        const candidateEmail = urlParams.get('candidateEmail');
        
        if (!candidateEmail) {
          showToast("Candidate email is missing in the URL.", "error");
          return;
        }

        // Mock API calls - replace with actual API calls
        const mockCandidateData = {
          email: candidateEmail,
          l_1_score: "85%",
          rrf_id: "RRF-2023-001",
          role: "Senior Developer",
          candidate_name: "John Doe",
          l_2_interviewdate: "2023-11-15",
          panel_name: "interviewer@example.com",
          hr_email: "hr@example.com"
        };
        setCandidateData(mockCandidateData);

        const mockQuestions = [
          {
            id: 1,
            skill_category: "JavaScript",
            skill_description: "Core JavaScript concepts",
            is_top_skill: true
          },
          {
            id: 2,
            skill_category: "React",
            skill_description: "React framework knowledge",
            is_top_skill: true
          },
          {
            id: 3,
            skill_category: "Node.js",
            skill_description: "Backend development",
            is_top_skill: false
          }
        ];
        setQuestions(mockQuestions);

      } catch (error) {
        console.error("Error loading data:", error);
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

  const generateFeedback = async () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsLoading(false);
      setDetailedFeedback("Generated feedback summary based on the ratings provided. The candidate shows strong skills in JavaScript and React, with good deployment knowledge. Areas for improvement include deeper understanding of Node.js backend concepts and better troubleshooting skills. Overall, the candidate demonstrates potential for the role with some additional training in backend technologies.");
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!detailedFeedback || !result) {
      showToast("Please fill all required fields", "error");
      return;
    }

    // Simulate form submission
    showToast("Feedback submitted successfully!", "success");
    
    setTimeout(() => {
      if (window.opener) {
        window.close();
      } else if (window.parent && window.parent.closeFeedbackModal) {
        window.parent.closeFeedbackModal();
      } else {
        window.location.href = "L2_App_Technical.html?success=true";
      }
    }, 1500);
  };

  return (
    <div className="form-container" id="form-container">
      <div style={{ color: '#000000' }}>
        <p>Email: <span id="candidate-email">{candidateData.email}</span></p>
        <p>iMocha Score: <span id="imocha-score">{candidateData.l_1_score}</span></p>
      </div>
      <br />
      
      {/* Header Section */}
      <div style={{ maxWidth: '50%' }}>
        <table>
          <tbody>
            <tr>
              <td   >RRF ID</td>
              <td><input type="text" id="rrf-id" placeholder="" value={candidateData.rrf_id} readOnly /></td>
            </tr>
            <tr>
              <td   >Job Designation</td>
              <td><input type="text" id="position" placeholder="" value={candidateData.role} readOnly /></td>
            </tr>
            <tr>
              <td   >Name of the Candidate</td>
              <td><input type="text" id="candidate-name" placeholder="" value={candidateData.candidate_name} readOnly /></td>
            </tr>
            <tr>
              <td   >Date of Interview</td>
              <td><input type="text" id="interview-date" value={candidateData.l_2_interviewdate} readOnly /></td>
            </tr>
            <tr>
              <td   >Interviewer Mail</td>
              <td><input type="text" id="interviewer-name" placeholder="" value={candidateData.panel_name} readOnly /></td>
            </tr>
            <tr>
              <td   >TAG Team Member</td>
              <td><input type="text" id="hr-email" placeholder="" value={candidateData.hr_email} readOnly /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Skills Table */}
      <table id="skills-table">
        <thead>
          <tr style={{ fontWeight: 'bold', backgroundColor: 'rgb(187, 187, 187)' }}>
            <td>Skills</td>
            <td>Description</td>
            <td>Top Skills</td>
            <td>Deployment</td>
            <td>Configuration</td>
            <td>Troubleshooting</td>
            <td>Justification</td>
            <td>Improvements</td>
          </tr>
        </thead>
        <tbody id="skills-table-body">
          {questions.map(question => (
            <tr key={question.id}>
              <td>{question.skill_category}</td>
              <td>{question.skill_description}</td>
              <td>{question.is_top_skill ? 'Yes' : 'No'}</td>
              <td>
                <select id={`deployment-${question.id}`} required>
                  <option value="Poor">Poor</option>
                  <option value="Average">Average</option>
                  <option value="Good">Good</option>
                </select>
              </td>
              <td>
                <select id={`configuration-${question.id}`} required>
                  <option value="Poor">Poor</option>
                  <option value="Average">Average</option>
                  <option value="Good">Good</option>
                </select>
              </td>
              <td>
                <select id={`troubleshooting-${question.id}`} required>
                  <option value="Poor">Poor</option>
                  <option value="Average">Average</option>
                  <option value="Good">Good</option>
                </select>
              </td>
              <td><textarea id={`justification-${question.id}`} required></textarea></td>
              <td><textarea id={`improvements-${question.id}`} required></textarea></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Feedback Section */}
      <div className="feedback-section">
        <label htmlFor="detailed-feedback">Detailed Feedback: *</label>
        <h3>
          <div id="loading-message" style={{ display: isLoading ? 'block' : 'none', fontStyle: 'italic', color: '#00d9ff' }}>
            Please wait while analyzing the feedback based on given inputs...
          </div>
        </h3>
        <textarea 
          id="detailed-feedback" 
          className="feedback-section-text"
          placeholder="Enter your detailed feedback here..." 
          required
          value={detailedFeedback}
          onChange={(e) => setDetailedFeedback(e.target.value)}
        />
        <button id="generate-summary" onClick={generateFeedback}>Generate Feedback</button>
      </div>

      {/* Result Section */}
      <div className="result-section">
        <label htmlFor="result">Shortlisted for next round</label>
        <select 
          id="result" 
          className="result-select" 
          required
          value={result}
          onChange={(e) => setResult(e.target.value)}
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

export default L2AppTechnical;