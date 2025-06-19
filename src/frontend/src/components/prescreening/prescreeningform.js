import React, { useState, useEffect, useRef } from 'react';
import './prescreeningform.css';

const PrescreeningForm = () => {
  const [candidateDetails, setCandidateDetails] = useState(JSON.parse(localStorage.getItem('candidateDetails')) || null);
  const [candidateEmails, setCandidateEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(candidateDetails?.candidateEmail || '');
  const [rrfId, setRrfId] = useState('');
  const [position, setPosition] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [uanNumber, setUanNumber] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [introductionValueMomentum, setIntroductionValueMomentum] = useState('');
  const [introductionCloudApp, setIntroductionCloudApp] = useState('');
  const [rolesResponsibilities, setRolesResponsibilities] = useState('');
  const [preScreening, setPreScreening] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState('shortlisted');
  const [summary, setSummary] = useState(candidateDetails?.finalSummary || '');
  const [ecSelect, setEcSelect] = useState('');
  const [azureExperience, setAzureExperience] = useState('');
  const [azureWellArchitectedFramework, setAzureWellArchitectedFramework] = useState('');
  const [azureZeroTrustSecurity, setAzureZeroTrustSecurity] = useState('');
  const [awsExperience, setAwsExperience] = useState('');
  const [awsWellArchitectedFramework, setAwsWellArchitectedFramework] = useState('');
  const [awsZeroTrustSecurity, setAwsZeroTrustSecurity] = useState('');
  const [asIsMigration, setAsIsMigration] = useState('');
  const [paasMigration, setPaasMigration] = useState('');
  const [databaseMigration, setDatabaseMigration] = useState('');
  const [proposalsWorked, setProposalsWorked] = useState('');
  const [proposalsWorkedEndToEnd, setProposalsWorkedEndToEnd] = useState('');
  const [effortsCalculations, setEffortsCalculations] = useState('');
  const [effortsCalculationsEndToEnd, setEffortsCalculationsEndToEnd] = useState('');
  const [devopsMaturityModel, setDevopsMaturityModel] = useState('');
  const [devopsMaturityModelProjects, setDevopsMaturityModelProjects] = useState('');
  const [doraMetrics, setDoraMetrics] = useState('');
  const [doraMetricsProjects, setDoraMetricsProjects] = useState('');
  const [buildReleaseSolutioning, setBuildReleaseSolutioning] = useState('');
  const [buildReleaseSolutioningProjects, setBuildReleaseSolutioningProjects] = useState('');
  const [observabilityKnowledge, setObservabilityKnowledge] = useState('');
  const [observabilityKnowledgeProjects, setObservabilityKnowledgeProjects] = useState('');
  const [containerizationKnowledge, setContainerizationKnowledge] = useState('');
  const [containerizationKnowledgeProjects, setContainerizationKnowledgeProjects] = useState('');
  const [dataEngineeringExperience, setDataEngineeringExperience] = useState('');
  const [dataEngineeringProjects, setDataEngineeringProjects] = useState('');
  const [sqlExperience, setSqlExperience] = useState('');
  const [sqlProjects, setSqlProjects] = useState('');
  const [nosqlExperience, setNosqlExperience] = useState('');
  const [nosqlProjects, setNosqlProjects] = useState('');
  const [etlExperience, setEtlExperience] = useState('');
  const [etlProjects, setEtlProjects] = useState('');
  const [bigdataExperience, setBigdataExperience] = useState('');
  const [bigdataProjects, setBigdataProjects] = useState('');
  const [dataWarehousingExperience, setDataWarehousingExperience] = useState('');
  const [dataWarehousingProjects, setDataWarehousingProjects] = useState('');
  const [dataPipelinesExperience, setDataPipelinesExperience] = useState('');
  const [dataPipelinesProjects, setDataPipelinesProjects] = useState('');
  const [dataAnalyticsExperience, setDataAnalyticsExperience] = useState('');
  const [dataAnalyticsProjects, setDataAnalyticsProjects] = useState('');
  const [detailedFeedback, setDetailedFeedback] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const imageUploadRef = useRef(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    const summaryBox = document.getElementById("status-dropdown");
    if (summaryBox) {
      summaryBox.classList.remove("green-background", "red-background");
      if (statusDropdown === "shortlisted") {
        summaryBox.classList.add("green-background");
      } else if (statusDropdown === "not-shortlisted") {
        summaryBox.classList.add("red-background");
      }
    }
  }, [statusDropdown]);

  const handleStatusChange = (e) => {
    setStatusDropdown(e.target.value);
  };

  const handleImageClick = () => {
    imageUploadRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        showToast('Image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    const fetchCandidateEmails = async () => {
      try {
        const response = await fetch('https://demotag.vercel.app/api/getAllCandidateEmails');
        const data = await response.json();
        if (data.error) {
          showToast(data.error, 'error');
        } else {
          setCandidateEmails(data.emails);
        }
      } catch (error) {
        console.error('Error fetching candidate emails:', error);
        showToast('Failed to load candidate emails.', 'error');
      }
    };

    fetchCandidateEmails();
  }, []);

  useEffect(() => {
    if (selectedEmail) {
      fetchCandidateData(selectedEmail);
    }
  }, [selectedEmail]);


  const fetchCandidateData = async (email) => {
    try {
      const response = await fetch(`https://demotag.vercel.app/api/getCandidateData?candidateEmail=${email}`);
      const data = await response.json();
      if (data.error) {
        showToast(data.error, 'error');
      } else {
        setCandidateName(data.candidate_name);
        setPosition(data.role);
        setRrfId(data.rrf_id);
        setHrEmail(data.hr_email);

        const appRolesJava = [
          "Junior Java Cloud Native Application Engineer - Backend",
          "Senior Java Cloud Native Application Engineer - Backend",
        ];

        const appRolesDotNet = [
          "Junior .Net Cloud Native Application Engineer - Backend",
          "Senior .Net Cloud Native Application Engineer - Backend",
        ];

        if ([...appRolesJava, ...appRolesDotNet].includes(data.role)) {
          setEcSelect("App");

          if (appRolesJava.includes(data.role)) {
            document.getElementById("dotnet-section").style.display =
              "none";
            document.getElementById("java-section").style.display =
              "block";
          } else if (appRolesDotNet.includes(data.role)) {
            document.getElementById("java-section").style.display =
              "none";
            document.getElementById("dotnet-section").style.display =
              "block";
          }
        }
      }
    } catch (error) {
      console.error('Error fetching candidate data:', error);
      showToast('Failed to load candidate data.', 'error');
    }
  };


  const handleEcSelectChange = (e) => {
    setEcSelect(e.target.value);
  };

  useEffect(() => {
    if (ecSelect === 'Cloud') {
      document.getElementById('cloud-section').style.display = 'block';
      document.getElementById('app-section').style.display = 'none';
      document.getElementById('data-section').style.display = 'none';
    } else if (ecSelect === 'App') {
      document.getElementById('app-section').style.display = 'block';
      document.getElementById('cloud-section').style.display = 'none';
      document.getElementById('data-section').style.display = 'none';
    } else if (ecSelect === 'Data') {
      document.getElementById('data-section').style.display = 'block';
      document.getElementById('cloud-section').style.display = 'none';
      document.getElementById('app-section').style.display = 'none';
    } else {
      document.getElementById('cloud-section').style.display = 'none';
      document.getElementById('app-section').style.display = 'none';
      document.getElementById('data-section').style.display = 'none';
    }
  }, [ecSelect]);


  const validateWordCount = (feedback) => {
    const wordCount = feedback.trim().split(/\s+/).filter(Boolean).length;
    return wordCount >= 100;
  };

  const handleSubmit = async () => {
    if (!selectedEmail || !position) {
      alert('Please select role and enter candidate email.');
      return;
    }

    let tableSelector = '';
    let apiEndpoint = '';

    if (position.toLowerCase().includes('java')) {
      tableSelector = '#java-table-body tr';
      apiEndpoint = '/api/java_ec_submit-feedback';
    } else if (position.toLowerCase().includes('.net')) {
      tableSelector = '#dotnet-table-body tr';
      apiEndpoint = '/api/dotnet_ec_submit-feedback';
    } else {
      alert('Selected role not supported.');
      return;
    }

    const rows = document.querySelectorAll(tableSelector);
    const number_of_years_or_months = [];

    rows.forEach((row) => {
      const skill = row.children[0].innerText;
      const input = row.children[1].querySelector('input');
      const experience = input ? input.value : '';
      number_of_years_or_months.push({ skill, experience });
    });

    const payload = {
      candidateEmail: selectedEmail,
      number_of_years_or_months,
      detailed_feedback: detailedFeedback,
      status: statusDropdown,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        showToast('✅ Feedback submitted successfully!', 'success');
        window.location.href = 'l1-imocha.html';
      } else {
        showToast(`❌ Error: ${result.error || 'Something went wrong.'}`, 'error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('❌ Failed to submit feedback. See console for details.', 'error');
    }
  };

  useEffect(() => {
    loadQuestions('/api/java_ec_questions', 'java-table-body', 'java_experience_');
    loadQuestions('/api/dotnet_ec_questions', 'dotnet-table-body', 'dotnet_experience_');
  }, []);

  const loadQuestions = async (apiUrl, tbodyId, prefixToRemove = '') => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const tbody = document.getElementById(tbodyId);
      tbody.innerHTML = '';

      data.forEach((q) => {
        const label = formatLabel(q.question_text, prefixToRemove);
        const inputId = q.question_text;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${label}</td>
          <td><input type="text" id="${inputId}" placeholder="Enter total experience in Years/Months" /></td>
          <td>${q.mandatory_for_candidates}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const formatLabel = (text, prefix) => {
    return text
      .replace(prefix, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const generateFeedbackWithGemini = async (candidateEmail, selectedRole, skills) => {
    try {
      const geminiPrompt = `
        Please generate a detailed prescreening evaluation feedback for the following candidate:
        - Email: ${candidateEmail}
        - Role: ${selectedRole}
        - Skills & experience: ${skills.map((s) => `${s.skill}: ${s.experience}`).join(', ')}
        Feedback should be professional, actionable, and at least 100 words.
      `;

      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY",  // Replace with your actual API key
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }] }],
          }),
        }
      );

      const geminiData = await geminiResponse.json();
      const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return generatedText.trim();
    } catch (error) {
      console.error("Error generating feedback with Gemini:", error);
      return "";
    }
  };

  const handleGenerateFeedback = async () => {
    if (!selectedEmail || !position) {
      alert('Please select a candidate email and role.');
      return;
    }

    let tableSelector = '';
    if (position.toLowerCase().includes('java')) {
      tableSelector = '#java-table-body tr';
    } else if (position.toLowerCase().includes('.net')) {
      tableSelector = '#dotnet-table-body tr';
    } else {
      alert('Selected role not supported for feedback generation.');
      return;
    }

    const rows = document.querySelectorAll(tableSelector);
    const skills = [];
    rows.forEach((row) => {
      const skill = row.children[0].innerText;
      const input = row.children[1].querySelector('input');
      const experience = input ? input.value : '';
      skills.push({ skill, experience });
    });

    showToast('Generating feedback... please wait.', 'success');

    const generatedFeedback = await generateFeedbackWithGemini(selectedEmail, position, skills);

    if (generatedFeedback && validateWordCount(generatedFeedback)) {
      setDetailedFeedback(generatedFeedback);
      showToast('✅ Feedback generated!', 'success');
    } else {
      showToast('⚠️ Feedback generation incomplete or too short. Please review.', 'error');
      setDetailedFeedback(generatedFeedback || '');
    }
  };

  return (
    <div className="form-container">
      <center>
        <h1>
          <strong>TAG Team Prescreening Form</strong>
        </h1>
      </center>
      <div style={{ color: '#000000', width: '60%' }}>
        <select
          id="candidate-email-dropdown"
          className="styled-dropdown"
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
        >
          <option value="">Select a Candidate Email</option>
          {candidateEmails.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>
      </div>
      <br />

      <div className="header">
        <div className="candidate-container">
          <div className="candidate-info">
            <table>
              <tbody>
                <tr>
                  <td  >RRF ID</td>
                  <td >
                    <input type="text" id="rrf-id" value={rrfId} readOnly />
                  </td>
                </tr>
                <tr>
                  <td  >Job Designation</td>
                  <td>
                    <input type="text" id="position" value={position} readOnly />
                  </td>
                </tr>
                <tr>
                  <td  >Name of the Candidate</td>
                  <td>
                    <input type="text" id="candidate-name" value={candidateName} readOnly />
                  </td>
                </tr>
                <tr>
                  <td  >UAN Number</td>
                  <td >
                    <input 
                      type="text"
                      id="uan-number"
                      placeholder="Enter UAN Number"
                      minLength="0"
                      maxLength="12"
                      onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                      value={uanNumber}
                      onChange={(e) => setUanNumber(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td   >Date of Interview</td>
                  <td>
                    <input 
                      type="date"
                      id="interview-date"
                      onClick={(e) => e.target.showPicker()}
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td  >TAG Team Member</td>
                  <td>
                    <input  type="text" id="hr-email" value={hrEmail} readOnly />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="introduction-tables">
            <table>
              <tbody>
                <tr>
                  <td>Introduction of ValueMomentum</td>
                  <td>
                    <select
                      id="introduction-value-momentum"
                      value={introductionValueMomentum}
                      onChange={(e) => setIntroductionValueMomentum(e.target.value)}
                    >
                      <option value="" selected>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Introduction of Cloud/App Engineering</td>
                  <td>
                    <select
                      id="introduction-cloud-app"
                      value={introductionCloudApp}
                      onChange={(e) => setIntroductionCloudApp(e.target.value)}
                    >
                      <option value="" selected>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Introduction to Roles & Responsibilities</td>
                  <td>
                    <select
                      id="roles-responsibilities"
                      value={rolesResponsibilities}
                      onChange={(e) => setRolesResponsibilities(e.target.value)}
                    >
                      <option value="" selected>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Did Candidate qualify using pre-screening Q&apos;s</td>
                  <td>
                    <select
                      id="pre-screening"
                      value={preScreening}
                      onChange={(e) => setPreScreening(e.target.value)}
                    >
                      <option value="" selected>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="candidate-photo">
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            style={{ display: 'none' }}
            ref={imageUploadRef}
            onChange={handleImageChange}
          />
          <div className="image-container" id="imageContainer" onClick={handleImageClick}>
            <label htmlFor="imageUpload" id="uploadLabel" className="upload-label">
              <center>Upload</center>
              <br />
              Candidate Image
            </label>
            {imagePreview && <img id="imagePreview" src={imagePreview} style={{ display: 'block' }} alt="Preview" />}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <table>
          <tbody>
            <tr>
              <th className="pre-screening">Pre-screening Q&apos;s</th>
              <th>Summary</th>
            </tr>
            <tr>
              <td>
                <select
                  id="status-dropdown"
                  style={{ fontWeight: 'bold' }}
                  value={statusDropdown}
                  onChange={handleStatusChange}
                >
                  <option value="shortlisted">Shortlisted</option>
                  <option value="not-shortlisted">Not Shortlisted</option>
                </select>
              </td>
              <td>
                <textarea
                  id="summary"
                  style={{ height: '100px', width: '100%', fontFamily: 'Arial, sans-serif' }}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Dropdown on the right side */}
        <div style={{ marginLeft: '50px' }}>
          <label htmlFor="ec-select">Select the EC</label>
          <select
            id="ec-select"
            style={{ width: '150px' }}
            value={ecSelect}
            onChange={handleEcSelectChange}
          >
            <option value="" selected>Select an option</option>
            <option value="Cloud">Cloud EC</option>
            <option value="App">App EC</option>
            <option value="Data">Data EC</option>
          </select>
        </div>
      </div>

      <div id="cloud-section" style={{ display: 'none' }}>
        <div className="section">
          <table className="experience-table">
            <thead>
              <tr>
                <th>Cloud Experience</th>
                <th>Number of years or Months</th>
                <th>Please ask did he/she worked on Well-Architected Framework</th>
                <th>Please ask did he/she worked on Zero-trust security</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Experience in Azure Cloud from overall experience?</td>
                <td>
                  <input
                    type="text"
                    id="azure-experience"
                    placeholder="Enter total experience in Years/Months"
                    value={azureExperience}
                    onChange={(e) => setAzureExperience(e.target.value)}
                  />
                </td>
                <td>
                  <select
                    id="azure-well-architected-framework"
                    value={azureWellArchitectedFramework}
                    onChange={(e) => setAzureWellArchitectedFramework(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>
                  <select
                    id="azure-zero-trust-security"
                    value={azureZeroTrustSecurity}
                    onChange={(e) => setAzureZeroTrustSecurity(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Total Experience in AWS Cloud ?</td>
                <td>
                  <input
                    type="text"
                    id="aws-experience"
                    placeholder="Enter total experience in Years/Months"
                    value={awsExperience}
                    onChange={(e) => setAwsExperience(e.target.value)}
                  />
                </td>
                <td>
                  <select
                    id="aws-well-architected-framework"
                    value={awsWellArchitectedFramework}
                    onChange={(e) => setAwsWellArchitectedFramework(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>
                  <select
                    id="aws-zero-trust-security"
                    value={awsZeroTrustSecurity}
                    onChange={(e) => setAwsZeroTrustSecurity(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Migration Experience */}
        <div className="section">
          <table>
            <thead>
              <tr>
                <th>Migration Experience - Onpremise to Cloud</th>
                <th>Number of Projects handled</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>As-Is Migration</td>
                <td>
                  <input
                    type="text"
                    id="as-is-migration"
                    placeholder="Enter number of projects handled"
                    value={asIsMigration}
                    onChange={(e) => setAsIsMigration(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>PaaS migration to WebApp services</td>
                <td>
                  <input
                    type="text"
                    id="paas-migration"
                    placeholder="Enter number of projects handled"
                    value={paasMigration}
                    onChange={(e) => setPaasMigration(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Database migration</td>
                <td>
                  <input
                    type="text"
                    id="database-migration"
                    placeholder="Enter number of projects handled"
                    value={databaseMigration}
                    onChange={(e) => setDatabaseMigration(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pre-sales Experience */}
        <div className="section">
          <table>
            <thead>
              <tr>
                <th>Pre-sales experience</th>
                <th>Number of Proposals</th>
                <th className="centered-text">
                  If candidate says, worked on proposals. Please ask did he/she handle end-to-end proposals? Yes or no
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Proposals worked</td>
                <td>
                  <input
                    type="text"
                    id="proposals-worked"
                    placeholder="Enter number of proposals worked"
                    value={proposalsWorked}
                    onChange={(e) => setProposalsWorked(e.target.value)}
                  />
                </td>
                <td>
                  <select
                    id="proposals-worked-end-to-end"
                    value={proposalsWorkedEndToEnd}
                    onChange={(e) => setProposalsWorkedEndToEnd(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Efforts calculations Knowledge</td>
                <td>
                  <input
                    type="text"
                    id="efforts-calculations"
                    placeholder="Enter number of proposals worked"
                    value={effortsCalculations}
                    onChange={(e) => setEffortsCalculations(e.target.value)}
                  />
                </td>
                <td>
                  <select
                    id="efforts-calculations-end-to-end"
                    value={effortsCalculationsEndToEnd}
                    onChange={(e) => setEffortsCalculationsEndToEnd(e.target.value)}

                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DevOps Experience */}
        <div className="section">
          <table>
            <thead>
              <tr>
                <th>DevOps Experience</th>
                <th>Level of experience - Theory or Implementation</th>
                <th className="centered-text">
                  If candidate says Implementation knowledge, Please ask how many projects of experience he/she has?
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Knowledge on DevOps Maturity Model</td>
                <td>
                  <select
                    id="devops-maturity-model"
                    value={devopsMaturityModel}
                    onChange={(e) => setDevopsMaturityModel(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Theory">Only Theory Knowledge</option>
                    <option value="Implementation">Only Implementation Knowledge</option>
                    <option value="Both">Both Theory and Implementation Knowledge</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id="devops-maturity-model-projects"
                    placeholder="Enter number of projects handled"
                    value={devopsMaturityModelProjects}
                    onChange={(e) => setDevopsMaturityModelProjects(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>DORA metrics</td>
                <td>
                  <select
                    id="dora-metrics"
                    value={doraMetrics}
                    onChange={(e) => setDoraMetrics(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id="dora-metrics-projects"
                    placeholder="Enter number of projects handled"
                    value={doraMetricsProjects}
                    onChange={(e) => setDoraMetricsProjects(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Build Release Solutioning</td>
                <td>
                  <select
                    id="build-release-solutioning"
                    value={buildReleaseSolutioning}
                    onChange={(e) => setBuildReleaseSolutioning(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id="build-release-solutioning-projects"
                    placeholder="Enter number of projects handled"
                    value={buildReleaseSolutioningProjects}
                    onChange={(e) => setBuildReleaseSolutioningProjects(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="section">
          <table>
            <thead>
              <tr>
                <th>Observability</th>
                <th>Level of experience</th>
                <th className="centered-text">
                  If candidate says Implementation knowledge, please ask how many projects of experience he/she has?
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Knowledge on Observability</td>
                <td>
                  <select
                    id="observability-knowledge"
                    value={observabilityKnowledge}
                    onChange={(e) => setObservabilityKnowledge(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id="observability-knowledge-projects"
                    placeholder="Enter number of projects handled"
                    value={observabilityKnowledgeProjects}
                    onChange={(e) => setObservabilityKnowledgeProjects(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="section">
          <table>
            <thead>
              <tr>
                <th>Containerization</th>
                <th>Level of experience</th>
                <th className="centered-text">
                  If candidate says Implementation knowledge, please ask how many projects experience he/she has?
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Knowledge on Containerization</td>
                <td>
                  <select
                    id="containerization-knowledge"
                    value={containerizationKnowledge}
                    onChange={(e) => setContainerizationKnowledge(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Theory">Only Theory Knowledge</option>
                    <option value="Implementation">Only Implementation Knowledge</option>
                    <option value="Both">Both Theory and Implementation Knowledge</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id="containerization-knowledge-projects"
                    placeholder="Enter number of projects handled"
                    value={containerizationKnowledgeProjects}
                    onChange={(e) => setContainerizationKnowledgeProjects(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="app-section" style={{ display: 'block' }}>
        {/* Java Section */}
        <div id="java-section">
          <div className="section">
            <table >
              <thead>
                <tr>
                  <th>Java Experience</th>
                  <th>Number of years or Months</th>
                  <th>Mandatory for Candidates</th>
                </tr>
              </thead>
              <tbody id="java-table-body">
              </tbody>
            </table>
          </div>
        </div>
        {/* .NET Section */}
        <div id="dotnet-section" style={{ display: 'block' }}>
          <div className="section">
            <table>
              <thead>
                <tr>
                  <th>.NET Experience</th>
                  <th>Number of years or Months</th>
                  <th>Mandatory for Candidates</th>
                </tr>
              </thead>
              <tbody id="dotnet-table-body">
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="data-section" style={{ display: 'none' }}>
        <div className="section">
          <table className="experience-table">
            <thead>
              <tr>
                <th>Data Engineering Experience</th>
                <th>Number of years or Months</th>
                <th>Projects Handled</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Experience in Data Engineering?</td>
                <td>
                  <input
                    type="text"
                    id="data-engineering-experience"
                    placeholder="Enter total experience in Years/Months"
                    value={dataEngineeringExperience}
                    onChange={(e) => setDataEngineeringExperience(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="data-engineering-projects"
                    placeholder="Enter number of projects"
                    value={dataEngineeringProjects}
                    onChange={(e) => setDataEngineeringProjects(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Experience in SQL (PostgreSQL, MySQL, etc.)</td>
                <td>
                  <input
                    type="text"
                    id="sql-experience"
                    placeholder="Enter total experience in Years/Months"
                    value={sqlExperience}
                    onChange={(e) => setSqlExperience(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="sql-projects"
                    placeholder="Enter number of projects"
                    value={sqlProjects}
                    onChange={(e) => setSqlProjects(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Experience in NoSQL (MongoDB, Cassandra, etc.)</td>
                <td>
                  <input
                    type="text"
                    id="nosql-experience"
                    placeholder="Enter total experience in Years/Months"
                    value={nosqlExperience}
                    onChange={(e) => setNosqlExperience(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="nosql-projects"
                    placeholder="Enter number of projects"
                    value={nosqlProjects}
                    onChange={(e) => setNosqlProjects(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Experience in ETL Tools (Informatica, Talend, etc.)</td>
                <td>
                  <input
                    type="text"
                    id="etl-experience"
                    placeholder="Enter total experience in Years/Months"
                    value={etlExperience}
                    onChange={(e) => setEtlExperience(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="etl-projects"
                    placeholder="Enter number of projects"
                    value={etlProjects}
                    onChange={(e) => setEtlProjects(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Experience in Big Data (Hadoop, Spark, Hive, etc.)</td>
                <td>
                  <input
                    type="text"
                    id="bigdata-experience"
                    placeholder="Enter total experience in Years/Months"
                    value={bigdataExperience}
                    onChange={(e) => setBigdataExperience(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="bigdata-projects"
                    placeholder="Enter number of projects"
                    value={bigdataProjects}
                    onChange={(e) => setBigdataProjects(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Experience in Data Warehousing (Snowflake, Redshift, etc.)</td>
                <td>
                  <input
                    type="text"
                    id="data-warehousing-experience"
                    placeholder="Enter total experience in Years/Months"
                    value={dataWarehousingExperience}
                    onChange={(e) => setDataWarehousingExperience(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="data-warehousing-projects"
                    placeholder="Enter number of projects"
                    value={dataWarehousingProjects}
                    onChange={(e) => setDataWarehousingProjects(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Experience in Data Pipelines (Airflow, Luigi, etc.)</td>
                <td>
                  <input
                    type="text"
                    id="data-pipelines-experience"
                    placeholder="Enter total experience in Years/Months"
                    value={dataPipelinesExperience}
                    onChange={(e) => setDataPipelinesExperience(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="data-pipelines-projects"
                    placeholder="Enter number of projects"
                    value={dataPipelinesProjects}
                    onChange={(e) => setDataPipelinesProjects(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Experience in Data Analytics (Python, R, Pandas, etc.)</td>
                <td>
                  <input
                    type="text"
                    id="data-analytics-experience"
                    placeholder="Enter total experience in Years/Months"
                    value={dataAnalyticsExperience}
                    onChange={(e) => setDataAnalyticsExperience(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="data-analytics-projects"
                    placeholder="Enter number of projects"
                    value={dataAnalyticsProjects}
                    onChange={(e) => setDataAnalyticsProjects(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="feedback-section">
        <label htmlFor="detailed-feedback">Detailed Feedback: *</label>
        <textarea
          id="detailed-feedback"
          className="feedback-section-text"
          placeholder="Enter your detailed feedback here..."
          required
          value={detailedFeedback}
          onChange={(e) => setDetailedFeedback(e.target.value)}
        ></textarea>
      </div>
      <button type="button" id="generate-feedback-btn" onClick={handleGenerateFeedback}>
        Generate Feedback (AI)
      </button>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          id="submit-button"
          style={{ backgroundColor: '#1f4e79', color: '#ffffff', height: '25px', width: '200px', borderRadius: '5px' }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      {toast.message && (
        <div className={`toast ${toast.type}`} style={{ display: 'block' }}>
          {toast.message}
        </div>
      )}
      <br />
    </div>
  );
};

export default PrescreeningForm;