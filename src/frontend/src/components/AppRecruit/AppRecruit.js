import React, { useState, useEffect } from 'react';
import './AppRecruit.css';
import AWS from 'aws-sdk';
import * as pdfLib from 'pdf-lib';
import { PDFDocument } from 'pdf-lib';
import * as mammoth from 'mammoth';
import { PublicClientApplication } from '@azure/msal-browser';

const AppRecruit = () => {
  // State variables
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('select');
  const [cloudProvider, setCloudProvider] = useState('');
  const [showCloudProviderPopup, setShowCloudProviderPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [rrfId, setRrfId] = useState('');
  const [ecName, setEcName] = useState('');
  const [globalJobDescription, setGlobalJobDescription] = useState('');
  const [globalHrEmail, setGlobalHrEmail] = useState('');
  const [globalRrfId, setGlobalRrfId] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [finalSummary, setFinalSummary] = useState('');

  // Initialize AWS S3
  useEffect(() => {
    AWS.config.update({
      region: 'us-east-1',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:583ab747-d668-4305-8c02-0a7e39d4b791'
      })
    });

    // Initialize MSAL for email sending
    const msalConfig = {
      auth: {
        clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
        authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
        redirectUri: "http://localhost:8000",
      },
    };
    
    // Get selectedValue from URL params
    const params = new URLSearchParams(window.location.search);
    const value = params.get('selectedValue');
    if (value) {
      setSelectedValue(value);
      setEcName(value);
    }
  }, []);

  // Toast notification
  const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show', type);

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  };

  // Navigation functions
  const navigateToPage = () => {
    window.location.href = "/ec-selection";
  };

  const navigateTo = (page) => {
    window.location.href = page;
  };

  // Role selection and popup handling
  const selectRoleAndOpenPopup = (role, dropdownId) => {
    console.log("Selected role:", role);
  
    const level = document.getElementById(dropdownId)?.value;
    if (level === 'select') {
      setPopupMessage('Please select a level before proceeding.');
      setShowSuccessPopup(true);
      return;
    }
  
    if (!cloudProvider) {
      setShowCloudProviderPopup(true);
      return;
    }
  
    setSelectedLevel(level);
  
    // Format: L2 Azure Java
    const formattedSelection = `${selectedLevel} ${cloudProvider} ${role}`;
    setSelectedRole(formattedSelection);
  
    setShowResumePopup(true);
  
    // Fetch job description
    fetchJobDescription(role, cloudProvider, selectedLevel)
      .then(jobDescription => {
        console.log("Job description fetched:", jobDescription);
      })
      .catch(error => {
        console.error("Error fetching job description:", error);
      });
  };
  

  const fetchJobDescription = (role, cloudProvider, selectedLevel) => {
    let fileName = '';
    switch (role) {
      case 'Cloud Native Application Engineer - Backend':
        fileName = `Job Description/${selectedLevel}_${cloudProvider}_App.txt`;
        break;
      case 'Cloud Native Application Engineer - Frontend':
        fileName = `Job Description/${selectedLevel}_${cloudProvider}_App.txt`;
        break;
      case 'LCNC Platform Engineer':
        fileName = `Job Description/${selectedLevel}_${cloudProvider}_APP.txt`;
        break;
      case 'Integration Engineer':
        fileName = `Job Description/${selectedLevel}_${cloudProvider}_App.txt`;
        break;
      default:
        console.log("Role not found");
        return Promise.reject("Role not found");
    }

    const params = {
      Bucket: 'tagteam-bucket',
      Key: fileName
    };

    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    return new Promise((resolve, reject) => {
      s3.getObject(params, function (err, data) {
        if (err) {
          console.log("Error fetching file:", err);
          reject(err);
        } else {
          const jobDescription = data.Body.toString('utf-8');
          setGlobalJobDescription(jobDescription);
          console.log("Fetched Job Description Content:", jobDescription);
          resolve(jobDescription);
        }
      });
    });
  };

  // Popup controls
  const closeCloudProviderPopup = () => setShowCloudProviderPopup(false);
  const closeSuccessPopup = () => setShowSuccessPopup(false);
  const closePopup = () => {
    document.getElementById("resume").value = "";
    setShowResumePopup(false);
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.width = '0%';
  };

  // Resume upload and processing
  const uploadResume = async () => {
    const fileInput = document.getElementById('resume');
    const file = fileInput.files[0];

    // Validate HR email
    if (!hrEmail || !validateEmail(hrEmail)) {
      setPopupMessage('Please enter a valid HR email.');
      setShowSuccessPopup(true);
      return;
    }

    // Store the HR email and RRF ID in global variables
    setGlobalHrEmail(hrEmail);
    setGlobalRrfId(rrfId);

    if (file) {
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) progressBar.style.width = '0%';
      setShowLoadingPopup(true);

      try {
        let processedFile = file;

        // Convert DOCX to PDF if needed
        if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          setPopupMessage('Converting DOCX to PDF, please wait...');
          setShowSuccessPopup(true);
          
          let formData = new FormData();
          formData.append("word", file);

          const response = await fetch("http://localhost:8000/docxtopdf", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const blob = await response.blob();
            processedFile = new File([blob], file.name.replace(".docx", ".pdf"), { type: "application/pdf" });
            setPopupMessage('DOCX file successfully converted to PDF.');
            setShowSuccessPopup(true);
          } else {
            throw new Error("Error converting DOCX to PDF.");
          }
        } else if (file.type !== "application/pdf") {
          throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
        }

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Upload to GitHub
        const originalFileName = processedFile.name;
        const timestamp = Date.now();
        const fileName = timestamp + "_" + originalFileName;
        const githubUrl = await uploadToGitHub(fileName, processedFile);

        if (githubUrl) {
          if (progressBar) progressBar.style.width = '100%';
          setPopupMessage('Resume uploaded successfully: ' + processedFile.name);
          setShowSuccessPopup(true);
          closePopup();

          document.querySelector('.role-selection-container').style.display = 'none';
          document.querySelector('.container').style.display = 'block';

          // Evaluate resume with ChatPDF
          await evaluateResumeWithChatPDF(githubUrl);
        } else {
          setPopupMessage('Resume already evaluated.');
          setShowSuccessPopup(true);
          if (progressBar) progressBar.style.width = '0%';
        }
      } catch (error) {
        console.error('Error uploading file: ', error);
        if (progressBar) progressBar.style.width = '0%';
        setPopupMessage('Failed to upload resume.');
        setShowSuccessPopup(true);
      } finally {
        setShowLoadingPopup(false);
      }
    } else {
      setPopupMessage('Please upload a valid PDF or DOCX file.');
      setShowSuccessPopup(true);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const animateProgressBar = (progressBar) => {
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 90) {
        clearInterval(interval);
      } else {
        width++;
        progressBar.style.width = width + '%';
      }
    }, 20);
  };

  // GitHub upload function
  const uploadToGitHub = async (fileName, file) => {
    const githubToken = await getGithubToken();
    if (!githubToken) {
      console.error('GitHub token is not available.');
      return null;
    }

    const repoOwner = 'MohansaiAnde';
    const repoName = 'Tagteam';
    const folderPath = 'resumes';

    // Sanitize the file name
    const sanitizedFileName = fileName.includes('_')
      ? fileName.split('_').slice(1).join('_')
      : fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}/${sanitizedFileName}`;

    try {
      // Get the total number of resumes in the folder
      const folderApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;
      const folderResponse = await fetch(folderApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (folderResponse.status === 200) {
        const folderData = await folderResponse.json();
        const totalResumes = folderData.length;
        console.log(`Total resumes before upload: ${totalResumes}`);
      } else {
        console.error('Failed to retrieve folder contents:', await folderResponse.text());
      }

      // Read the file content
      const fileReader = new FileReader();
      const base64Content = await new Promise((resolve, reject) => {
        fileReader.onload = (event) => resolve(event.target.result.split(',')[1]);
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsDataURL(file);
      });

      // Check if the file already exists
      const checkFileResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
      });

      let sha = null;
      if (checkFileResponse.status === 200) {
        const existingFileData = await checkFileResponse.json();
        sha = existingFileData.sha;

        const existingBase64Content = existingFileData.content.replace(/\n/g, '');
        if (existingBase64Content === base64Content) {
          console.log('The file content is the same. No upload needed.');
          return null;
        }
      }

      // Proceed with upload
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload resume: ${sanitizedFileName}`,
          content: base64Content,
          sha: sha,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Resume uploaded successfully.');

        // Get updated count
        const updatedFolderResponse = await fetch(folderApiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (updatedFolderResponse.status === 200) {
          const updatedFolderData = await updatedFolderResponse.json();
          const count = updatedFolderData.length;
          console.log(`Total resumes after upload: ${count}`);
          await sendCountToDatabase(count);
        } else {
          console.error('Failed to retrieve updated folder contents:', await updatedFolderResponse.text());
        }

        return responseData.content.download_url;
      } else {
        console.error('GitHub API error:', await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const getGithubToken = async () => {
    try {
      const response = await fetch('https://demotag.vercel.app/api/github-token');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Failed to fetch GitHub token:', error);
      return null;
    }
  };

  const sendCountToDatabase = async (count) => {
    try {
      const response = await fetch('http://localhost:8000/send-resumes-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count }),
      });

      if (response.ok) {
        console.log('Resumes count updated successfully.');
      } else {
        console.error('Failed to update count:', await response.text());
      }
    } catch (error) {
      console.error('Error sending count to database:', error);
    }
  };

  // ChatPDF integration
  const getValidApiKey = async (resumeUrl) => {
    const apiKeys = [
      'sec_U9gJ7XetrGWfbji3eM3nE2xknV201Nab',
      'sec_U9gJ7XetrGWfbji3eM3nE2xknV201Ncd',
      'sec_U9gJ7XetrGWfbji3eM3nE2xknV201Nef',
      'sec_U9gJ7XetrGWfbji3eM3nE2xknV201N56',
      'sec_ELtQJOZKC9dGCpaTRqb8kVzLSiOvfT89',
      'sec_ELtQJOZKC9dGCpaTRqb8kVzLSiOvfT90',
      'sec_U9gJ7XetrGWfbji3eM3nE2xknV201N42',
    ];

    for (let apiKey of apiKeys) {
      try {
        const apiUrl = 'https://api.chatpdf.com/v1/sources/add-url';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({ url: resumeUrl })
        });

        if (response.ok) {
          console.log(`Valid API key found: ${apiKey}`);
          return apiKey;
        } else if (response.status === 401) {
          console.warn(`API key expired or unauthorized: ${apiKey}. Trying the next key...`);
        } else if (response.status === 403) {
          console.warn(`Quota exceeded for API key: ${apiKey}. Moving to the next key...`);
        } else if (response.status === 429) {
          console.error(`Rate limit exceeded for API key: ${apiKey}.`);
          return null;
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error with API key: ${apiKey}`, error.message);
      }
    }

    console.error("No valid API key found.");
    return null;
  };

  const evaluateResumeWithChatPDF = async (resumeUrl) => {
    console.log("Resume URL:", resumeUrl);
    console.log("Job Description:", globalJobDescription);
    setShowLoadingPopup(true);

    if (!globalJobDescription) {
      console.error("Job description is empty. Cannot proceed.");
      return;
    }

    const validApiKey = await getValidApiKey(resumeUrl);
    if (!validApiKey) {
      setShowLoadingPopup(false);
      const container = document.getElementById('evaluation-result-container');
      if (container) container.innerHTML = "All API keys failed. Please update your API key list.";
      return;
    }

    try {
      // Upload resume to ChatPDF
      const apiUrl = 'https://api.chatpdf.com/v1/sources/add-url';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': validApiKey,
        },
        body: JSON.stringify({ url: resumeUrl })
      });

      const uploadData = await response.json();
      const sourceId = uploadData.sourceId;

      // Evaluate resume with job description
      const evaluationResponse = await fetch('https://api.chatpdf.com/v1/chats/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': validApiKey,
        },
        body: JSON.stringify({
          sourceId: sourceId,
          messages: [{
            role: "user",
            content: `
              You are an expert HR assistant tasked with pre-screening resumes. Given a resume, analyze it thoroughly and provide a structured evaluation based on the following criteria:
              
              **Job Role Retrieval:**
              ${globalJobDescription}
              
              **Candidate Overview:**
              - Extract the candidate's full name.
              - Identify the total years of professional experience.
              - Determine the current or most recent job designation.
              
              **Contact Information:**
              - Verify if essential details (email, phone number, location) are present.
              
              **Education:**
              - Identify the highest level of education and the field of study.
              - Note any relevant certifications or specialized training.
              
              **Work Experience:**
              - Summarize the candidate's work history, focusing on the most recent or relevant positions.
              - Highlight any roles or responsibilities that align with the job opening.
              
              **Skills:**
              - List key technical and soft skills mentioned.
              - Identify any skills that are particularly relevant to the position.
              
              **Achievements:**
              - Note any significant accomplishments or awards.
              - Highlight quantifiable achievements (e.g., "increased sales by 20%").
              
              **Candidate Stability:**
              - Note any red flags (e.g., unexplained gaps in employment, frequent job changes).
              
              **Skill Gaps**
              - Evaluate the candidate's resume by comparing the listed skills against the required technical skills for the specified job role.
              - Identify any gaps where the candidate lacks experience or proficiency.
              - For each gap, briefly explain the missing skill and its relevance to the role, using specific keywords to highlight the absence of those skills.
              - If the candidate is rejected, include the explanation of the skill gaps in the result. 
              **Result:** Based on the analysis for the role of [Current Role] – Strong Match (meets/exceeds most requirements), Potential Match (meets key but lacks some), Not Suitable (does not meet essentials); add "Shortlisted for the next round" if suitable, or "Rejected" with gaps if not. Analyze and give the suitability percentage.
            `
          }]
        })
      });

      if (!evaluationResponse.ok) {
        const errorText = await evaluationResponse.text();
        throw new Error(`HTTP error! status: ${evaluationResponse.status}, message: ${errorText}`);
      }

      const evaluationData = await evaluationResponse.json();
      const evaluationContent = evaluationData.content;

      // Generate questions
      const questionResponse = await fetch('https://api.chatpdf.com/v1/chats/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': validApiKey,
        },
        body: JSON.stringify({
          sourceId: sourceId,
          messages: [{
            role: "user",
            content: `
              Analyze the technical skills extracted from the resume and generate multiple-choice questions that assess the candidate's knowledge and expertise in those skills. Focus on:
              1. Core technical skills and tools mentioned in the resume.
              2. Industry-standard practices related to these skills.
              3. Technical concepts and their applications.
              For each skill, generate a question with four answer options (A, B, C, D), including one correct answer.
            `
          }]
        })
      });

      if (!questionResponse.ok) {
        const errorText = await questionResponse.text();
        throw new Error(`HTTP error! status: ${questionResponse.status}, message: ${errorText}`);
      }

      const questionData = await questionResponse.json();
      const questionsContent = questionData.content;

      setShowLoadingPopup(false);
      displayEvaluationInCards(evaluationContent, resumeUrl, hrEmail, rrfId, selectedValue);
      console.log(questionsContent);
    } catch (error) {
      console.error('Error evaluating resume:', error);
      setShowLoadingPopup(false);
      const container = document.getElementById('evaluation-result-container');
      if (container) container.innerHTML = "Error evaluating resume. Please try again.";
    }
  };

  // Display evaluation results
  const displayEvaluationInCards = (content, resumeUrl, hrEmail, rrfId, selectedValue) => {
    console.log("Evaluation Content:", content);
    const container = document.getElementById('evaluation-result-container');
    if (!container) return;

    container.innerHTML = '';
    let candidateName = '';
    let candidateEmail = '';
    let candidatePhoneNumber = '';
    let candidateStatus = '';
    let suitabilityPercentage = '';
    let finalSummary = '';

    // Extract candidate name
    const nameKeyword = "Full Name:";
    if (content.includes(nameKeyword)) {
      const startIndex = content.indexOf(nameKeyword) + nameKeyword.length;
      const endIndex = content.indexOf('\n', startIndex);
      candidateName = content.substring(startIndex, endIndex).trim();
    }

    // Extract email
    const emailKeyword = "Email:";
    if (content.includes(emailKeyword)) {
      const startIndex = content.indexOf(emailKeyword) + emailKeyword.length;
      const endIndex = content.indexOf('\n', startIndex);
      candidateEmail = content.substring(startIndex, endIndex).trim()
        .replace(/\*\*/g, '')
        .replace(/\s+/g, '');
    }

    // Extract phone number
    const phoneKeyword = "Phone Number:";
    if (content.includes(phoneKeyword)) {
      const startIndex = content.indexOf(phoneKeyword) + phoneKeyword.length;
      const endIndex = content.indexOf('\n', startIndex);
      candidatePhoneNumber = content.substring(startIndex, endIndex).trim()
        .replace(/\*\*/g, '')
        .replace(/\s+/g, '');
    }

    // Display candidate name if available
    if (candidateName) {
      const nameHeading = document.createElement('h2');
      nameHeading.textContent = `Candidate: ${candidateName}`;
      nameHeading.classList.add('hidden');
      container.appendChild(nameHeading);
    }

    const sections = [
      { title: "Job Role Retrieval", keyword: "Job Role Retrieval" },
      { title: "Candidate Overview", keyword: "Candidate Overview" },
      { title: "Contact Information", keyword: "Contact Information" },
      { title: "Education", keyword: "Education" },
      { title: "Work Experience", keyword: "Work Experience" },
      { title: "Skills", keyword: "Skills" },
      { title: "Achievements", keyword: "Achievements" },
      { title: "Candidate Stability", keyword: "Candidate Stability" },
      { title: "Skill Gaps", keyword: "Skill Gaps" },
      { title: "Result", keyword: "Result" }
    ];

    let textContent = '';
    let anyContentDisplayed = false;
    let isShortlisted = false;

    sections.forEach((section, index) => {
      const startIndex = content.indexOf(section.keyword);
      const nextIndex = index < sections.length - 1 ? content.indexOf(sections[index + 1].keyword) : content.length;

      if (startIndex !== -1) {
        anyContentDisplayed = true;

        let sectionContent = content.substring(startIndex, nextIndex).trim();
        sectionContent = sectionContent.replace(/[#*]/g, '');
        sectionContent = sectionContent.replace(new RegExp(`${section.keyword}\\s*:?`), '').trim();

        const previewContent = sectionContent.split('\n').slice(0, 3).join('\n');

        const card = document.createElement('div');
        card.classList.add('card');
        card.style.color = '#b0b0b0';
        card.style.width = '100%';

        const heading = document.createElement('h2');
        heading.textContent = section.title;
        card.appendChild(heading);

        const p = document.createElement('p');
        p.textContent = previewContent;
        card.appendChild(p);

        container.appendChild(card);
        textContent += `${section.title}\n${sectionContent}\n\n`;

        // Check result section
        if (section.title === "Result") {
          finalSummary = sectionContent;
          setFinalSummary(finalSummary);
          suitabilityPercentage = sectionContent.match(/Suitability Percentage:\s*(\d+)%/)?.[1];
          if (sectionContent.includes("Shortlisted for the next round") || (suitabilityPercentage && parseInt(suitabilityPercentage) >= 75)) {
            candidateStatus = "Shortlisted";
            isShortlisted = true;
          } else if (sectionContent.includes("Rejected")) {
            candidateStatus = "Rejected";
          }

          console.log('Candidate Status:', candidateStatus);

          // Update database
          const updateField = candidateStatus === "Rejected" ? "rejected" : "shortlisted";
          fetch('http://localhost:8000/update-resume-count', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              field: updateField,
              value: 1,
            }),
          })
            .then(response => response.json())
            .then(data => {
              console.log('Database update successful:', data);
            })
            .catch(error => {
              console.error('Error updating database:', error);
            });
        }
      }
    });

    // Add status to result heading
    const headings = document.querySelectorAll('h2');
    headings.forEach(heading => {
      if (heading.textContent.trim() === "Result") {
        const statusSpan = document.createElement('span');
        statusSpan.textContent = candidateStatus ? ` - ${candidateStatus} (${suitabilityPercentage}% Matching With JD)` : '';
        statusSpan.style.color = candidateStatus === "Shortlisted" ? 'green' : 'red';
        heading.appendChild(statusSpan);
      }
    });

    if (!anyContentDisplayed) {
      displayInvalidFormatPopup("The content format is invalid or the required sections are missing.");
      return;
    }

    // Save candidate info
    sendCandidateInfoToDB(candidateName, candidateEmail, candidateStatus, selectedRole, suitabilityPercentage, candidatePhoneNumber, resumeUrl, hrEmail, rrfId, selectedValue);
    sendPrescreeningInfoToDB(candidateName, candidateEmail, candidateStatus, selectedRole, suitabilityPercentage, candidatePhoneNumber, resumeUrl, hrEmail, rrfId);
    sendRRFToDB(rrfId, selectedRole, selectedValue, 'open');
    sendCandidateDetailsToHR(candidateName, candidateEmail, candidateStatus, selectedRole, suitabilityPercentage, candidatePhoneNumber, resumeUrl, hrEmail, rrfId, selectedValue, finalSummary);

    // Create download button
    // const downloadButton = document.createElement('button');
    // downloadButton.classList.add('download-btn');
    // downloadButton.innerHTML = '<i class="fas fa-download"></i> Download Feedback';
    // downloadButton.onclick = () => downloadContentAsFile(textContent, candidateName, selectedRole, selectedLevel, cloudProvider, candidateStatus);
    // container.appendChild(downloadButton);

    // Save to localStorage
    const candidateDetails = {
      candidateName,
      candidateEmail,
      candidateStatus,
      role: selectedRole,
      suitabilityPercentage,
      candidatePhoneNumber,
      finalSummary,
      hrEmail,
      rrfId,
      eng_center: selectedValue
    };
    localStorage.setItem("candidateDetails", JSON.stringify(candidateDetails));

    // Add next button if shortlisted
    if (isShortlisted) {
      const nextButton = document.createElement('button');
      nextButton.classList.add('next-btn');
      nextButton.textContent = 'Next';
      nextButton.onclick = () => {
        window.location.href = '/prescreeningform';
      };
      container.appendChild(nextButton);
    }

    // Add back button
    const backButtonWrapper = document.createElement('div');
    backButtonWrapper.classList.add('back-button-wrapper');

    const backButton = document.createElement('button');
    backButton.classList.add('back-btnss');
    backButton.innerHTML = 'Back';
    backButton.onclick = () => {
      document.querySelector('.role-selection-container').style.display = 'block';
      document.getElementById('evaluation-result-container').innerHTML = '';
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) progressBar.style.width = '0%';
      window.location.reload();
    };
    backButtonWrapper.appendChild(backButton);
    container.appendChild(backButtonWrapper);
  };

  const displayInvalidFormatPopup = (message) => {
    console.log("Displaying invalid format popup");
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = 1000;

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    popup.appendChild(messageElement);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => document.body.removeChild(popup);
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
  };

  // Download content as PDF
  const downloadContentAsFile = (content, candidateName, selectedRole, selectedLevel, selectedCloudProvider, statusText) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    let yPosition = margin + 15;
    const lineHeight = 8;
    const maxYPosition = pageHeight - margin;

    function addNewPage() {
      doc.addPage();
      yPosition = margin + 15;
      doc.setFillColor(240, 240, 240);
      doc.rect(margin - 5, margin - 5, contentWidth + 10, pageHeight - margin, 'F');
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(margin - 5, margin - 5, contentWidth + 10, pageHeight - margin, 'S');
    }

    // Add background and borders
    doc.setFillColor(240, 240, 240);
    doc.rect(margin - 5, margin - 5, contentWidth + 10, pageHeight - margin, 'F');
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin - 5, margin - 5, contentWidth + 10, pageHeight - margin, 'S');

    // Add title and candidate name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.text(`Evaluation Report for: ${candidateName.trim()}`, margin, yPosition);
    yPosition += 10;

    // Add role title
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text(`Role: ${selectedLevel}_${selectedCloudProvider}_${selectedRole.trim()}`, margin, yPosition);
    yPosition += 15;

    // Include specific sections
    const sections = [
      { title: "Candidate Overview", keyword: "Candidate Overview" },
      { title: "Candidate Stability", keyword: "Candidate Stability" },
      { title: "Result", keyword: "Result" }
    ];

    sections.forEach((section) => {
      const startIndex = content.indexOf(section.keyword);
      const endIndex = content.indexOf('\n\n', startIndex);

      if (startIndex !== -1) {
        let sectionContent = content.substring(startIndex, endIndex).trim().replace(/[#*]/g, '');
        sectionContent = sectionContent.replace(new RegExp(`${section.keyword}\\s*:?`), '').trim();

        // Add section title
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.setFont('helvetica', 'bold');
        if (yPosition + 15 > maxYPosition) {
          addNewPage();
        }
        doc.text(section.title, margin, yPosition);
        yPosition += 10;

        // Add section content
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(sectionContent, contentWidth);

        lines.forEach(line => {
          if (yPosition + lineHeight > maxYPosition) {
            addNewPage();
          }
          doc.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        yPosition += 5;

        // Extract status and percentage from Result section
        if (section.title === "Result") {
          if (sectionContent.includes("Shortlisted for the next round") || (statusText && statusText.toLowerCase() === "shortlisted")) {
            statusText = "Shortlisted";
          } else if (sectionContent.includes("Rejected")) {
            statusText = "Rejected";
          }

          const percentageMatch = sectionContent.match(/Suitability Percentage:\s*(\d+)%/);
          const suitabilityPercentage = percentageMatch ? percentageMatch[1] : '';
          console.log('Candidate Status:', statusText);
        }
      }
    });

    // Set default status
    statusText = statusText || "Rejected";

    // Append status text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(statusText === "Shortlisted" ? 'green' : 'red');

    let statusTextWithPercentage = `Status: ${statusText}`;
    const percentageMatch = content.match(/Suitability Percentage:\s*(\d+)%/);
    if (percentageMatch) {
      statusTextWithPercentage += ` (${percentageMatch[1]}% Matching With JD)`;
    }

    if (yPosition + lineHeight > maxYPosition) {
      addNewPage();
    }
    doc.text(statusTextWithPercentage, margin, yPosition);

    // Save the PDF
    const currentDate = new Date().toISOString().split('T')[0];
    const fileName = `${candidateName.trim()}_${selectedLevel}_${selectedCloudProvider}_${selectedRole.trim()}_${currentDate}.pdf`;
    doc.save(fileName);
  };

  // Database functions
  const sendCandidateInfoToDB = (name, email, status, role, suitabilityPercentage, candidatePhoneNumber, resumeUrl, hrEmail, rrfId, selectedValue) => {
    let recruitmentPhase = status.toLowerCase() === 'rejected' ? 'prescreening' : 'Move to L1';
    const resume_score = `${suitabilityPercentage}% Matching With JD`;

    fetch('http://localhost:8000/api/add-candidate-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume: resumeUrl,
        candidate_name: name,
        candidate_email: email,
        prescreening_status: status,
        candidate_phone: candidatePhoneNumber,
        role: role,
        recruitment_phase: recruitmentPhase,
        resume_score: resume_score,
        hr_email: hrEmail,
        rrf_id: rrfId,
        eng_center: selectedValue
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Candidate information saved successfully:', data);
          const candidateId = data.data.id;
          console.log(`Candidate ID: ${candidateId}`);
          localStorage.setItem("candidateId", candidateId);
        }
      })
      .catch(error => {
        console.error('Error saving candidate information:', error);
      });
  };

  const sendPrescreeningInfoToDB = (name, email, status, role, suitabilityPercentage, candidatePhoneNumber, resumeUrl, hrEmail, rrfId) => {
    let recruitmentPhase = status.toLowerCase() === 'rejected' ? 'Rejected' : 'Move to L1';
    const resume_score = `${suitabilityPercentage}% Matching With JD`;

    fetch('http://localhost:8000/api/add-prescreening-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume: resumeUrl,
        candidate_name: name,
        candidate_email: email,
        prescreening_status: status,
        role: role,
        recruitment_phase: recruitmentPhase,
        candidate_phone: candidatePhoneNumber,
        resume_score: resume_score,
        hr_email: hrEmail,
        rrf_id: rrfId
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Prescreening information saved successfully:', data);
      })
      .catch(error => {
        console.error('Error saving prescreening information:', error);
      });
  };

  const sendRRFToDB = (rrfId, role, selectedValue, status = 'open') => {
    fetch('http://localhost:8000/api/rrf-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rrf_id: rrfId,
        role: role,
        eng_center: selectedValue,
        rrf_status: status
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('RRF information saved successfully:', data);
        }
      })
      .catch(error => {
        console.error('Error saving RRF information:', error);
      });
  };

  const sendCandidateDetailsToHR = async (candidateName, candidateEmail, statusText, role, suitabilityPercentage, candidatePhoneNumber, resumeUrl, hrEmail, rrfId, selectedValue, finalSummary) => {
    const loggedInUserEmail = localStorage.getItem("userEmail");
    if (!loggedInUserEmail) {
      showToast("User is not logged in. Please log in again.", "error");
      return;
    }

    try {
      const msalInstance = new PublicClientApplication({
        auth: {
          clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
          authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
          redirectUri: "http://localhost:8000",
        },
      });

      const account = msalInstance.getAllAccounts()[0];
      if (!account) {
        throw new Error("No active account! Please login first.");
      }

      const tokenRequest = {
        scopes: ["Mail.Send"],
        account: account
      };

      let tokenResponse;
      try {
        tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          tokenResponse = await msalInstance.acquireTokenPopup(tokenRequest);
        } else {
          throw error;
        }
      }

      const emailData = {
        message: {
          subject: `Prescreening Result: RRFID-${globalRrfId} - ${candidateName} for ${role} Role`,
          body: {
            contentType: "HTML",
            content: `
              <h3>Candidate Pre-screening Details</h3>
              <p><strong>Name:</strong> ${candidateName}</p>
              <p><strong>Email:</strong> ${candidateEmail}</p>
              <p><strong>Status:</strong> ${statusText}</p>
              <p><strong>Role:</strong> ${role}</p>
              <p><strong>Suitability Score:</strong> ${suitabilityPercentage}% Matching With JD</p>
              <p><strong>Phone Number:</strong> ${candidatePhoneNumber}</p>
              <p><strong>Resume:</strong> <a href="${resumeUrl}">View Resume</a></p>
              <p><strong>Result:</strong> ${finalSummary}</p>
              <br />
              <p>Please take the necessary actions based on the pre-screening results.</p>
            `
          },
          toRecipients: [
            {
              emailAddress: {
                address: globalHrEmail
              }
            }
          ]
        }
      };

      const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenResponse.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ? errorData.error.message : 'Failed to send email');
      }

      console.log('Email sent successfully');
      showToast('Email sent successfully!', 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast(`Failed to send email: ${error.message}`, "error");
      if (error.message?.includes('permission')) {
        showToast("This app needs permission to send emails. Please contact your administrator to grant the necessary permissions.", "error");
      }
    }
  };

  // Add prefix to RRF ID
  const addPrefix = (e) => {
    const value = e.target.value;
    if (!value.startsWith('POS-')) {
      setRrfId('POS-' + value.replace(/^POS-/, ''));
    } else {
      setRrfId(value);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ec = params.get("ec");
    if (ec) {
      setEcName(ec);
    }
  }, []);

  // Render function
  return (
    <div className="app-recruit">
      <div id="toast" className="toast"></div>

      {/* <button id="toggle-sidebar-btn" onClick={toggleSidebar}>☰ Menu</button> */}

      {/* Sidebar */}
      {/* <div id="sidebar" className={`sidebar-menu ${sidebarVisible ? '' : 'hidden'}`} style={{ width: '200px' }}>
        <div className="sidebar-option active" data-target="dashboard" data-tooltip="Dashboard" onClick={() => navigateTo('Dashboard.html')}>
          <span>📊</span>
          <span>Dashboard</span>
        </div>
        <div className="sidebar-option" data-target="interviews" data-tooltip="Interviews" onClick={() => navigateTo('ECselection.html')}>
          <span>👥</span>
          <span>Recruit</span>
        </div>
        <div className="sidebar-option" data-target="candidateInfo" data-tooltip="candidateInfo" onClick={() => navigateTo('candidatespage.html')}>
          <span>✔️</span>
          <span>RRF Tracking</span>
        </div>
        <div className="sidebar-option" data-target="candidateInfo" data-tooltip="candidateInfo" onClick={() => navigateTo('GTPrescreening.html')}>
          <span>✔️</span>
          <span>GT's Prescreening</span>
        </div>

        <div className="sidebar-option logout-option" data-tooltip="Logout" onClick={() => navigateTo('index.html')} style={{ marginTop: '149px' }}>
          <span>🚪</span>
          <span>Logout</span>
        </div>
      </div> */}

      <div className="backbutton" onClick={navigateToPage}>
        <span>←</span>
      </div>
      
      <div className="progress-steps">
        <div className="steps-container">
          <div className="progress-line"></div>
          <div className="step active">
            <div className="step-circle">1</div>
            <div className="step-title">Resume Pre-screen</div>
          </div>
          <div className="step">
            <div className="step-circle">2</div>
            <div className="step-title">Online iMocha</div>
          </div>
          <div className="step">
            <div className="step-circle">3</div>
            <div className="step-title">L2 Technical</div>
          </div>
          <div className="step">
            <div className="step-circle">4</div>
            <div className="step-title">Fitment Round</div>
          </div>
        </div>
      </div>

      <div id="interviews" className="active">
        <div className="role-selection-container">
          <div className="role-selection-header">
            <h1 style={{ color: 'black' }}>Select Your Role for the Interview</h1>
          </div>

          <div className="role-cards">
            {/* Backend Engineer Card */}
            <div className="role-card">
              <h2 style={{ color: 'black' }}>Cloud Native Application Engineer - Backend</h2>
              <p style={{ color: 'black' }}>
                Responsible for overseeing the code releases, combining an understanding of both engineering and coding. 
                DevOps engineers work with various departments to create and develop systems within a company.
              </p>

              <h3 style={{ color: 'black' }}>Select Cloud Provider and Level:</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value=".Net" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === '.Net'}
                    /> .Net
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="Java" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'Java'}
                    /> Java
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="Nodejs" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'Nodejs'}
                      disabled
                    /> Nodejs
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="Python" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'Python'}
                      disabled
                    /> Python
                  </label>
                </span>

                <select 
                  id="levelDropdown1" 
                  style={{ padding: '5px', background: '#E6E6FA', color: 'black' }}
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option>select</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option disabled value="Lead">Lead</option>
                </select>
              </div>

              <button 
                onClick={() => selectRoleAndOpenPopup('Cloud Native Application Engineer - Backend', 'levelDropdown1')}
                style={{ marginLeft: '46px', backgroundColor: '#DAF7A6', color: 'black' }}
              >
                Select
              </button>
            </div>

            {/* Frontend Engineer Card */}
            <div className="role-card">
              <h2 style={{ color: 'black' }}>Cloud Native Application Engineer - Front End</h2>
              <p style={{ color: 'black' }}>
                Innovates and builds the underlying systems that power application development and deployment. 
                Focuses on optimizing platform performance and scalability.
              </p>
              <h3 style={{ marginTop: '42px', color: 'black' }}>Select Cloud Provider and Level:</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="Angular" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'Angular'}
                    /> Angular
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="React" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'React'}
                    /> React
                  </label>
                </span>

                <select 
                  id="levelDropdown2" 
                  style={{ padding: '5px', background: '#E6E6FA', color: 'black' }}
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option>select</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option disabled value="Lead">Lead</option>
                </select>
              </div>

              <button 
                onClick={() => selectRoleAndOpenPopup('Cloud Native Application Engineer - Frontend', 'levelDropdown2')}
                style={{ marginLeft: '51px', backgroundColor: '#DAF7A6', color: 'black', marginTop: '10px' }}
              >
                Select
              </button>
            </div>

            {/* LCNC Platform Engineer Card */}
            <div className="role-card">
              <h2 style={{ color: 'black' }}>LCNC Platform Engineer</h2>
              <p style={{ color: 'black' }}>
                Manages cloud infrastructure and services, ensuring smooth deployment, support, and monitoring of cloud environments. 
                Works on automating cloud operations and optimizing costs.
              </p>
              <h3 style={{ marginTop: '40px', color: 'black' }}>Select Cloud Provider and Level:</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="Mendix" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'Mendix'}
                    /> Mendix
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="UIMendix" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'UIMendix'}
                      disabled
                    /> UI Mendix
                  </label>
                </span>

                <select 
                  id="levelDropdown3" 
                  style={{ padding: '5px', background: '#E6E6FA', color: 'black' }}
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option>select</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option disabled value="Lead">Lead</option>
                </select>
              </div>

              <button 
                onClick={() => selectRoleAndOpenPopup('LCNC Platform Engineer', 'levelDropdown3')}
                style={{ backgroundColor: '#DAF7A6', color: 'black' }}
              >
                Select
              </button>
            </div>

            {/* Integration Engineer Card */}
            <div className="role-card">
              <h2 style={{ color: 'black' }}>Integration Engineer</h2>
              <p style={{ color: 'black' }}>
                Works to create a bridge between development and IT operations, focusing on creating scalable and highly reliable software systems. 
                Monitors system performance and ensures service availability.
              </p>
              <h3 style={{ color: 'black' }}>Select Cloud Provider and Level:</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="radio-group" style={{ fontSize: '6px' }}>
                  <label>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="IBM Integration Bus" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'IBM Integration Bus'}
                    /> IBM Integration Bus
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="IBM Data Power" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'IBM Data Power'}
                    /> IBM Data Power
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="MuleSoft" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'MuleSoft'}
                    /> MuleSoft
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="API Connect" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'API Connect'}
                    /> API Connect
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input 
                      type="radio" 
                      name="cloudProvider" 
                      value="SAG web methods" 
                      onChange={(e) => setCloudProvider(e.target.value)}
                      checked={cloudProvider === 'SAG web methods'}
                    /> SAG web methods
                  </label>
                </span>

                <select 
                  id="levelDropdown4" 
                  style={{ padding: '5px', background: '#E6E6FA', color: 'black' }}
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option>select</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              <button 
                onClick={() => selectRoleAndOpenPopup('Integration Engineer', 'levelDropdown4')}
                style={{ backgroundColor: '#DAF7A6', color: 'black' }}
              >
                Select
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Provider Reminder Popup */}
        {showCloudProviderPopup && (
          <div id="cloudProviderPopup" className="popupc">
            <div className="popup-contentc">
              <span className="close-btn" onClick={closeCloudProviderPopup} style={{ marginLeft: '389px', cursor: 'pointer' }}>&times;</span>
              <p>Please select a cloud provider before proceeding.</p>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div id="successPopup" className="popups" style={{ animation: 'fadeOut 2s forwards' }}>
            <div className="popup-contents">
              <span className="close-btns" onClick={closeSuccessPopup}>&times;</span>
              <p id="popupMessage">{popupMessage}</p>
            </div>
          </div>
        )}

        {/* Resume Popup */}
        {showResumePopup && (
          <div id="resume-popup" className="popup">
            <div className="popup-content" style={{ width: '30%', left: '9%' }}>
              <h2 style={{ color: 'black' }}>Prescreening</h2>

              <label htmlFor="hr-email" style={{ color: 'black' }}>HR Email:</label>
              <input 
                type="email" 
                id="hr-email" 
                placeholder="Enter HR Email"
                style={{ width: '82%', padding: '8px', marginTop: '5px', backgroundColor: '#E6E6FA' }}
                value={hrEmail}
                onChange={(e) => setHrEmail(e.target.value)}
              />

              <label htmlFor="RRF-ID" style={{ color: 'black' }}>RRF ID:</label>
              <input 
                type="text" 
                id="RRF-ID" 
                placeholder="Enter RRF-ID"
                style={{ width: '82%', padding: '8px', marginTop: '5px', backgroundColor: '#E6E6FA' }}
                value={rrfId}
                onChange={addPrefix}
              />

<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
              <label htmlFor="ec-name" style={{ color: 'black', marginRight: '10px' }}>EC Name:</label>
              <input 
                type="text" 
                id="ec-name"
                style={{ width: '60%', padding: '8px', backgroundColor: '#E6E6FA', textAlign: 'center' }} 
                readOnly 
                value={ecName}
              />
            </div>

              <input type="file" id="resume" accept=".pdf,.doc,.docx" />

              <div className="progress-container">
                <div className="progress-bar"></div>
              </div>

              <br />

              <button onClick={uploadResume} style={{ backgroundColor: '#DAF7A6', width: '144px' }}>Upload</button>
              <button onClick={closePopup} style={{ backgroundColor: '#DAF7A6', width: '120px' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Loading Popup */}
        {showLoadingPopup && (
          <div id="loading-popup" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            textAlign: 'center',
            fontSize: '24px',
            paddingTop: '20%',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              border: '6px solid rgba(255, 255, 255, 0.3)',
              borderTop: '6px solid #ffffff',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ marginTop: '20px' }}>Please wait while resume is being evaluated!...</span>
          </div>
        )}

        {/* Evaluation Result Container */}
        <div className="container" style={{display: 'none',width: '100%',height: 'fit-content'}}> 
          <div className="header">
            <div id="evaluation-result-container" className="cards-container" style={{ marginTop: '55px' }}>
              <h1 style={{ color: '#bb86fc' }}></h1>
            </div>
            {/* <div id="questions-form-container" className="form-container"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppRecruit;