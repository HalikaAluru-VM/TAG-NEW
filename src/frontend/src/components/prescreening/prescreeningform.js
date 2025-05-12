import React, { useState, useEffect } from 'react';
import './prescreeningform.css';

const PrescreeningForm = () => {
  const [selectedEC, setSelectedEC] = useState('');
  const [status, setStatus] = useState('shortlisted');
  const [imagePreview, setImagePreview] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateEmails, setCandidateEmails] = useState([]);
  const [formData, setFormData] = useState({
    rrfId: '',
    position: '',
    candidateName: '',
    uanNumber: '',
    interviewDate: '',
    hrEmail: '',
    introductionValueMomentum: '',
    introductionCloudApp: '',
    rolesResponsibilities: '',
    preScreening: '',
    summary: '',
    azureExperience: '',
    azureWellArchitectedFramework: '',
    azureZeroTrustSecurity: '',
    awsExperience: '',
    awsWellArchitectedFramework: '',
    awsZeroTrustSecurity: '',
    asIsMigration: '',
    paasMigration: '',
    databaseMigration: '',
    proposalsWorked: '',
    proposalsWorkedEndToEnd: '',
    effortsCalculations: '',
    effortsCalculationsEndToEnd: '',
    devopsMaturityModel: '',
    doraMetrics: '',
    buildReleaseSolutioning: '',
    devopsMaturityModelProjects: '',
    doraMetricsProjects: '',
    buildReleaseSolutioningProjects: '',
    observabilityKnowledge: '',
    observabilityKnowledgeProjects: '',
    containerizationKnowledge: '',
    containerizationKnowledgeProjects: '',
    javaExperience: '',
    java8Experience: '',
    concurrencyExperience: '',
    microserviceExperience: '',
    distributedTransactionsExperience: '',
    eventDrivenExperience: '',
    securityExperience: '',
    designPatternsExperience: '',
    dataStructuresExperience: '',
    springBootExperienceDetails: '',
    sqlQueriesExperience: '',
    jvmTuningExperience: '',
    dataEngineeringExperience: '',
    dataEngineeringProjects: '',
    sqlExperience: '',
    sqlProjects: '',
    nosqlExperience: '',
    nosqlProjects: '',
    etlExperience: '',
    etlProjects: '',
    bigdataExperience: '',
    bigdataProjects: '',
    dataWarehousingExperience: '',
    dataWarehousingProjects: '',
    dataPipelinesExperience: '',
    dataPipelinesProjects: '',
    dataAnalyticsExperience: '',
    dataAnalyticsProjects: '',
    detailedFeedback: ''
  });

  useEffect(() => {
    // Fetch candidate emails when component mounts
    fetch("http://localhost:3000/api/getAllCandidateEmails")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showToast(data.error, "error");
        } else {
          setCandidateEmails(data.emails);
          const candidateDetails = JSON.parse(localStorage.getItem("candidateDetails"));
          if (candidateDetails && candidateDetails.candidateEmail) {
            setCandidateEmail(candidateDetails.candidateEmail);
            fetchCandidateData(candidateDetails.candidateEmail);
            const finalSummary = localStorage.getItem("finalSummary");
            if (finalSummary) {
              setFormData(prev => ({...prev, summary: finalSummary}));
            }
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching candidate emails:", error);
        showToast("Failed to load candidate emails.", "error");
      });
  }, []);

  const fetchCandidateData = (email) => {
    fetch(`http://localhost:3000/api/getCandidateData?candidateEmail=${email}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showToast(data.error, "error");
        } else {
          setFormData(prev => ({
            ...prev,
            candidateName: data.candidate_name,
            position: data.role,
            rrfId: data.rrf_id,
            hrEmail: data.hr_email
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching candidate data:", error);
        showToast("Failed to load candidate data.", "error");
      });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        showToast("Image uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleECChange = (e) => {
    setSelectedEC(e.target.value);
  };

  const validateWordCount = (text) => {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    return wordCount >= 100;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateWordCount(formData.detailedFeedback)) {
      showToast("Please provide at least 100 words of feedback.", "error");
      return;
    }

    const submissionData = {
      candidate_email: candidateEmail,
      rrf_id: formData.rrfId,
      position: formData.position,
      candidate_name: formData.candidateName,
      uan_number: formData.uanNumber,
      interview_date: formData.interviewDate,
      hr_email: formData.hrEmail,
      introduction_value_momentum: formData.introductionValueMomentum,
      introduction_cloud_app: formData.introductionCloudApp,
      roles_responsibilities: formData.rolesResponsibilities,
      pre_screening: formData.preScreening,
      status: status,
      summary: formData.summary,
      ec_select: selectedEC,
      cloud_experience_azure_experience: formData.azureExperience,
      cloud_experience_azure_well_architected_framework: formData.azureWellArchitectedFramework,
      cloud_experience_azure_zero_trust_security: formData.azureZeroTrustSecurity,
      cloud_experience_aws_experience: formData.awsExperience,
      cloud_experience_aws_well_architected_framework: formData.awsWellArchitectedFramework,
      cloud_experience_aws_zero_trust_security: formData.awsZeroTrustSecurity,
      migration_experience_as_is_migration: formData.asIsMigration,
      migration_experience_paas_migration: formData.paasMigration,
      migration_experience_database_migration: formData.databaseMigration,
      presales_experience_proposals_worked: formData.proposalsWorked,
      presales_experience_proposals_worked_end_to_end: formData.proposalsWorkedEndToEnd,
      presales_experience_efforts_calculations: formData.effortsCalculations,
      presales_experience_efforts_calculations_end_to_end: formData.effortsCalculationsEndToEnd,
      devops_experience_devops_maturity_model: formData.devopsMaturityModel,
      devops_experience_dora_metrics: formData.doraMetrics,
      devops_experience_build_release_solutioning: formData.buildReleaseSolutioning,
      devops_experience_devops_maturity_model_projects: formData.devopsMaturityModelProjects,
      devops_experience_dora_metrics_projects: formData.doraMetricsProjects,
      devops_experience_build_release_solutioning_projects: formData.buildReleaseSolutioningProjects,
      observability_experience_observability_knowledge: formData.observabilityKnowledge,
      observability_experience_observability_knowledge_projects: formData.observabilityKnowledgeProjects,
      containerization_experience_containerization_knowledge: formData.containerizationKnowledge,
      containerization_experience_containerization_knowledge_projects: formData.containerizationKnowledgeProjects,
      java_experience_java_experience: formData.javaExperience,
      java_experience_java8_experience: formData.java8Experience,
      java_experience_concurrency_experience: formData.concurrencyExperience,
      java_experience_microservice_experience: formData.microserviceExperience,
      java_experience_distributed_transactions_experience: formData.distributedTransactionsExperience,
      java_experience_event_driven_experience: formData.eventDrivenExperience,
      java_experience_security_experience: formData.securityExperience,
      java_experience_design_patterns_experience: formData.designPatternsExperience,
      java_experience_data_structures_experience: formData.dataStructuresExperience,
      java_experience_spring_boot_experience_details: formData.springBootExperienceDetails,
      java_experience_sql_queries_experience: formData.sqlQueriesExperience,
      java_experience_jvm_tuning_experience: formData.jvmTuningExperience,
      data_experience_data_engineering_experience: formData.dataEngineeringExperience,
      data_experience_data_engineering_projects: formData.dataEngineeringProjects,
      data_experience_sql_experience: formData.sqlExperience,
      data_experience_sql_projects: formData.sqlProjects,
      data_experience_nosql_experience: formData.nosqlExperience,
      data_experience_nosql_projects: formData.nosqlProjects,
      data_experience_etl_experience: formData.etlExperience,
      data_experience_etl_projects: formData.etlProjects,
      data_experience_bigdata_experience: formData.bigdataExperience,
      data_experience_bigdata_projects: formData.bigdataProjects,
      data_experience_data_warehousing_experience: formData.dataWarehousingExperience,
      data_experience_data_warehousing_projects: formData.dataWarehousingProjects,
      data_experience_data_pipelines_experience: formData.dataPipelinesExperience,
      data_experience_data_pipelines_projects: formData.dataPipelinesProjects,
      data_experience_data_analytics_experience: formData.dataAnalyticsExperience,
      data_experience_data_analytics_projects: formData.dataAnalyticsProjects,
      feedback: formData.detailedFeedback
    };

    fetch("http://localhost:3000/api/feedback-form-db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          showToast(data.message, data.message.includes("success") ? "success" : "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast("Failed to submit form.", "error");
      });
  };

  const showToast = (message, type) => {
    const toast = document.getElementById("toast");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  };

  return (
    <div className="form-container">
      <center>
        <h1><strong>TAG Team Prescreening Form</strong></h1>
      </center>
      <div style={{ color: '#000000', width: '60%' }}>
        <select 
          id="candidate-email-dropdown" 
          className="styled-dropdown"
          value={candidateEmail}
          onChange={(e) => {
            setCandidateEmail(e.target.value);
            if (e.target.value) {
              fetchCandidateData(e.target.value);
              const finalSummary = localStorage.getItem("finalSummary");
              if (finalSummary) {
                setFormData(prev => ({...prev, summary: finalSummary}));
              }
            }
          }}
        >
          <option value="">Select a Candidate Email</option>
          {candidateEmails.map(email => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>
      </div>
      <br />

      <div className="header">
        <div className="candidate-container">
          <div className="candidate-info">
            <table>
              <tr>
                <td className="details">RRF ID</td>
                <td>
                  <input 
                    type="text" 
                    id="rrf-id" 
                    placeholder="" 
                    readOnly 
                    value={formData.rrfId}
                  />
                </td>
              </tr>
              <tr>
                <td className="details">Job Designation</td>
                <td>
                  <input 
                    type="text" 
                    id="position" 
                    placeholder="" 
                    readOnly 
                    value={formData.position}
                  />
                </td>
              </tr>
              <tr>
                <td className="details">Name of the Candidate</td>
                <td>
                  <input
                    type="text"
                    id="candidate-name"
                    placeholder=""
                    readOnly
                    value={formData.candidateName}
                  />
                </td>
              </tr>
              <tr>
                <td>UAN Number</td>
                <td>
                  <input
                    type="text"
                    id="uan-number"
                    name="uanNumber"
                    placeholder="Enter UAN Number"
                    minLength="0"
                    maxLength="12"
                    onChange={handleInputChange}
                    value={formData.uanNumber}
                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  />
                </td>
              </tr>
              <tr>
                <td>Date of Interview</td>
                <td>
                  <input
                    type="date"
                    id="interview-date"
                    name="interviewDate"
                    onChange={handleInputChange}
                    value={formData.interviewDate}
                    onClick={(e) => e.target.showPicker()}
                  />
                </td>
              </tr>
              <tr>
                <td className="details">TAG Team Member</td>
                <td>
                  <input 
                    type="text" 
                    id="hr-email" 
                    placeholder="" 
                    readOnly 
                    value={formData.hrEmail}
                  />
                </td>
              </tr>
            </table>
          </div>

          <div className="introduction-tables">
            <table>
              <tr>
                <td>Introduction of ValueMomentum</td>
                <td>
                  <select 
                    id="introduction-value-momentum"
                    name="introductionValueMomentum"
                    onChange={handleInputChange}
                    value={formData.introductionValueMomentum}
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
                    name="introductionCloudApp"
                    onChange={handleInputChange}
                    value={formData.introductionCloudApp}
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
                    name="rolesResponsibilities"
                    onChange={handleInputChange}
                    value={formData.rolesResponsibilities}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Did Candidate qualify using pre-screening Q's</td>
                <td>
                  <select 
                    id="pre-screening"
                    name="preScreening"
                    onChange={handleInputChange}
                    value={formData.preScreening}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div className="candidate-photo">
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <div className="image-container" id="imageContainer" onClick={() => document.getElementById('imageUpload').click()}>
            {imagePreview ? (
              <img id="imagePreview" src={imagePreview} alt="Candidate" style={{ display: 'block' }} />
            ) : (
              <label htmlFor="imageUpload" id="uploadLabel" className="upload-label">
                <center>Upload</center>
                <br />Candidate Image
              </label>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <table>
          <tr>
            <th className="pre-screening">Pre-screening Q's</th>
            <th>Summary</th>
          </tr>
          <tr>
            <td>
              <select 
                id="status-dropdown" 
                style={{ fontWeight: 'bold' }}
                className={status === 'shortlisted' ? 'green-background' : 'red-background'}
                value={status}
                onChange={handleStatusChange}
              >
                <option value="shortlisted">Shortlisted</option>
                <option value="not-shortlisted">Not Shortlisted</option>
              </select>
            </td>
            <td>
              <textarea
                id="summary"
                name="summary"
                onChange={handleInputChange}
                value={formData.summary}
                style={{
                  height: '100px',
                  width: '100%',
                  fontFamily: 'Arial, sans-serif',
                }}
              />
            </td>
          </tr>
        </table>

        <div style={{ marginLeft: '50px' }}>
          <label htmlFor="ec-select">Select the EC</label>
          <select 
            id="ec-select" 
            style={{ width: '150px' }}
            value={selectedEC}
            onChange={handleECChange}
          >
            <option value="" selected>Select an option</option>
            <option value="Cloud">Cloud EC</option>
            <option value="App">App EC</option>
            <option value="Data">Data EC</option>
          </select>
        </div>
      </div>

      <div id="cloud-section" style={{ display: selectedEC === 'Cloud' ? 'block' : 'none' }}>
        <div className="section">
          <table className="experience-table">
            <tr>
              <th>Cloud Experience</th>
              <th>Number of years or Months</th>
              <th>
                Please ask did he/she worked on Well-Architected Framework
              </th>
              <th>Please ask did he/she worked on Zero-trust security</th>
            </tr>
            <tr>
              <td>Total Experience in Azure Cloud from overall experience?</td>
              <td>
                <input
                  type="text"
                  id="azure-experience"
                  name="azureExperience"
                  onChange={handleInputChange}
                  value={formData.azureExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <select 
                  id="azure-well-architected-framework"
                  name="azureWellArchitectedFramework"
                  onChange={handleInputChange}
                  value={formData.azureWellArchitectedFramework}
                >
                  <option value="" selected>Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <select 
                  id="azure-zero-trust-security"
                  name="azureZeroTrustSecurity"
                  onChange={handleInputChange}
                  value={formData.azureZeroTrustSecurity}
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
                  name="awsExperience"
                  onChange={handleInputChange}
                  value={formData.awsExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <select 
                  id="aws-well-architected-framework"
                  name="awsWellArchitectedFramework"
                  onChange={handleInputChange}
                  value={formData.awsWellArchitectedFramework}
                >
                  <option value="" selected>Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <select 
                  id="aws-zero-trust-security"
                  name="awsZeroTrustSecurity"
                  onChange={handleInputChange}
                  value={formData.awsZeroTrustSecurity}
                >
                  <option value="" selected>Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
            </tr>
          </table>
        </div>

        <div className="section">
          <table>
            <tr>
              <th>Migration Experience - Onpremise to Cloud</th>
              <th>Number of Projects handled</th>
            </tr>
            <tr>
              <td>As-Is Migration</td>
              <td>
                <input
                  type="text"
                  id="as-is-migration"
                  name="asIsMigration"
                  onChange={handleInputChange}
                  value={formData.asIsMigration}
                  placeholder="Enter number of projects handled"
                />
              </td>
            </tr>
            <tr>
              <td>PaaS migration to WebApp services</td>
              <td>
                <input
                  type="text"
                  id="paas-migration"
                  name="paasMigration"
                  onChange={handleInputChange}
                  value={formData.paasMigration}
                  placeholder="Enter number of projects handled"
                />
              </td>
            </tr>
            <tr>
              <td>Database migration</td>
              <td>
                <input
                  type="text"
                  id="database-migration"
                  name="databaseMigration"
                  onChange={handleInputChange}
                  value={formData.databaseMigration}
                  placeholder="Enter number of projects handled"
                />
              </td>
            </tr>
          </table>
        </div>

        <div className="section">
          <table>
            <tr>
              <th>Pre-sales experience</th>
              <th>Number of Proposals</th>
              <th className="centered-text">
                If candidate says, worked on proposals. Please ask did he/she
                handle end-to-end proposals? Yes or no
              </th>
            </tr>
            <tr>
              <td>Proposals worked</td>
              <td>
                <input
                  type="text"
                  id="proposals-worked"
                  name="proposalsWorked"
                  onChange={handleInputChange}
                  value={formData.proposalsWorked}
                  placeholder="Enter number of proposals worked"
                />
              </td>
              <td>
                <select 
                  id="proposals-worked-end-to-end"
                  name="proposalsWorkedEndToEnd"
                  onChange={handleInputChange}
                  value={formData.proposalsWorkedEndToEnd}
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
                  name="effortsCalculations"
                  onChange={handleInputChange}
                  value={formData.effortsCalculations}
                  placeholder="Enter number of proposals worked"
                />
              </td>
              <td>
                <select 
                  id="efforts-calculations-end-to-end"
                  name="effortsCalculationsEndToEnd"
                  onChange={handleInputChange}
                  value={formData.effortsCalculationsEndToEnd}
                >
                  <option value="" selected>Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
            </tr>
          </table>
        </div>

        <div className="section">
          <table>
            <tr>
              <th>DevOps Experience</th>
              <th>Level of experience - Theory or Implementation</th>
              <th className="centered-text">
                If candidate says Implementation knowledge, Please ask how many
                projects of experience he/she has?
              </th>
            </tr>
            <tr>
              <td>Knowledge on DevOps Maturity Model</td>
              <td>
                <select 
                  id="devops-maturity-model"
                  name="devopsMaturityModel"
                  onChange={handleInputChange}
                  value={formData.devopsMaturityModel}
                >
                  <option value="" selected>Select</option>
                  <option value="Theory">Only Theory Knowledge</option>
                  <option value="Implementation">
                    Only Implementation Knowledge
                  </option>
                  <option value="Both">
                    Both Theory and Implementation Knowledge
                  </option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  id="devops-maturity-model-projects"
                  name="devopsMaturityModelProjects"
                  onChange={handleInputChange}
                  value={formData.devopsMaturityModelProjects}
                  placeholder="Enter number of projects handled"
                />
              </td>
            </tr>
            <tr>
              <td>DORA metrics</td>
              <td>
                <select 
                  id="dora-metrics"
                  name="doraMetrics"
                  onChange={handleInputChange}
                  value={formData.doraMetrics}
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
                  name="doraMetricsProjects"
                  onChange={handleInputChange}
                  value={formData.doraMetricsProjects}
                  placeholder="Enter number of projects handled"
                />
              </td>
            </tr>
            <tr>
              <td>Build Release Solutioning</td>
              <td>
                <select 
                  id="build-release-solutioning"
                  name="buildReleaseSolutioning"
                  onChange={handleInputChange}
                  value={formData.buildReleaseSolutioning}
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
                  name="buildReleaseSolutioningProjects"
                  onChange={handleInputChange}
                  value={formData.buildReleaseSolutioningProjects}
                  placeholder="Enter number of projects handled"
                />
              </td>
            </tr>
          </table>
        </div>
        <div className="section">
          <table>
            <tr>
              <th>Observability</th>
              <th>Level of experience</th>
              <th className="centered-text">
                If candidate says Implementation knowledge, please ask how many
                projects of experience he/she has?
              </th>
            </tr>
            <tr>
              <td>Knowledge on Observability</td>
              <td>
                <select 
                  id="observability-knowledge"
                  name="observabilityKnowledge"
                  onChange={handleInputChange}
                  value={formData.observabilityKnowledge}
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
                  name="observabilityKnowledgeProjects"
                  onChange={handleInputChange}
                  value={formData.observabilityKnowledgeProjects}
                  placeholder="Enter number of projects handled"
                />
              </td>
            </tr>
          </table>
        </div>

        <div className="section">
          <table>
            <tr>
              <th>Containerization</th>
              <th>Level of experience</th>
              <th className="centered-text">
                If candidate says Implementation knowledge, please ask how many
                projects experience he/she has?
              </th>
            </tr>
            <tr>
              <td>Knowledge on Containerization</td>
              <td>
                <select 
                  id="containerization-knowledge"
                  name="containerizationKnowledge"
                  onChange={handleInputChange}
                  value={formData.containerizationKnowledge}
                >
                  <option value="" selected>Select</option>
                  <option value="Theory">Only Theory Knowledge</option>
                  <option value="Implementation">
                    Only Implementation Knowledge
                  </option>
                  <option value="Both">
                    Both Theory and Implementation Knowledge
                  </option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  id="containerization-knowledge-projects"
                  name="containerizationKnowledgeProjects"
                  onChange={handleInputChange}
                  value={formData.containerizationKnowledgeProjects}
                  placeholder="Enter number of projects handled"
                />
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div id="app-section" style={{ display: selectedEC === 'App' ? 'block' : 'none' }}>
        <div className="section">
          <table>
            <tr>
              <th>Java Experience</th>
              <th>Number of years or Months</th>
              <th>Mandatory for Candidates</th>
            </tr>
            <tr>
              <td>Total Experience in Java development?</td>
              <td>
                <input
                  type="text"
                  id="java-experience"
                  name="javaExperience"
                  onChange={handleInputChange}
                  value={formData.javaExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Mandatory</td>
            </tr>
            <tr>
              <td>Total Experience in Java8 development using Streams?</td>
              <td>
                <input
                  type="text"
                  id="java8-experience"
                  name="java8Experience"
                  onChange={handleInputChange}
                  value={formData.java8Experience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Mandatory</td>
            </tr>
            <tr>
              <td>Total Experience in Concurrency and Multithreading?</td>
              <td>
                <input
                  type="text"
                  id="concurrency-experience"
                  name="concurrencyExperience"
                  onChange={handleInputChange}
                  value={formData.concurrencyExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Nice to have</td>
            </tr>
            <tr>
              <td>Total Experience in Microservice Architecture?</td>
              <td>
                <input
                  type="text"
                  id="microservice-experience"
                  name="microserviceExperience"
                  onChange={handleInputChange}
                  value={formData.microserviceExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Mandatory</td>
            </tr>
            <tr>
              <td>Total Experience in Distributed Transactions?</td>
              <td>
                <input
                  type="text"
                  id="distributed-transactions-experience"
                  name="distributedTransactionsExperience"
                  onChange={handleInputChange}
                  value={formData.distributedTransactionsExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Mandatory</td>
            </tr>
            <tr>
              <td>Total Experience in Event Driven Architecture?</td>
              <td>
                <input
                  type="text"
                  id="event-driven-experience"
                  name="eventDrivenExperience"
                  onChange={handleInputChange}
                  value={formData.eventDrivenExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Nice to have</td>
            </tr>
            <tr>
              <td>Total Experience in Application Security?</td>
              <td>
                <input
                  type="text"
                  id="security-experience"
                  name="securityExperience"
                  onChange={handleInputChange}
                  value={formData.securityExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Mandatory</td>
            </tr>
            <tr>
              <td>Total Experience in using Design Patterns?</td>
              <td>
                <input
                  type="text"
                  id="design-patterns-experience"
                  name="designPatternsExperience"
                  onChange={handleInputChange}
                  value={formData.designPatternsExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Mandatory</td>
            </tr>
            <tr>
              <td>Total Experience in using Data Structure & Algorithms?</td>
              <td>
                <input
                  type="text"
                  id="data-structures-experience"
                  name="dataStructuresExperience"
                  onChange={handleInputChange}
                  value={formData.dataStructuresExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Nice to have</td>
            </tr>
            <tr>
              <td>Total Experience in Spring Boot?</td>
              <td>
                <input
                  type="text"
                  id="spring-boot-experience-details"
                  name="springBootExperienceDetails"
                  onChange={handleInputChange}
                  value={formData.springBootExperienceDetails}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Mandatory</td>
            </tr>
            <tr>
              <td>Total Experience in writing SQL queries?</td>
              <td>
                <input
                  type="text"
                  id="sql-queries-experience"
                  name="sqlQueriesExperience"
                  onChange={handleInputChange}
                  value={formData.sqlQueriesExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Mandatory</td>
            </tr>
            <tr>
              <td>Total Experience in JVM tuning & profiling?</td>
              <td>
                <input
                  type="text"
                  id="jvm-tuning-experience"
                  name="jvmTuningExperience"
                  onChange={handleInputChange}
                  value={formData.jvmTuningExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>Nice to have</td>
            </tr>
          </table>
        </div>
      </div>

      <div id="data-section" style={{ display: selectedEC === 'Data' ? 'block' : 'none' }}>
        <div className="section">
          <table className="experience-table">
            <tr>
              <th>Data Engineering Experience</th>
              <th>Number of years or Months</th>
              <th>Projects Handled</th>
            </tr>
            <tr>
              <td>Total Experience in Data Engineering?</td>
              <td>
                <input
                  type="text"
                  id="data-engineering-experience"
                  name="dataEngineeringExperience"
                  onChange={handleInputChange}
                  value={formData.dataEngineeringExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="data-engineering-projects"
                  name="dataEngineeringProjects"
                  onChange={handleInputChange}
                  value={formData.dataEngineeringProjects}
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in SQL (PostgreSQL, MySQL, etc.)</td>
              <td>
                <input
                  type="text"
                  id="sql-experience"
                  name="sqlExperience"
                  onChange={handleInputChange}
                  value={formData.sqlExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="sql-projects"
                  name="sqlProjects"
                  onChange={handleInputChange}
                  value={formData.sqlProjects}
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in NoSQL (MongoDB, Cassandra, etc.)</td>
              <td>
                <input
                  type="text"
                  id="nosql-experience"
                  name="nosqlExperience"
                  onChange={handleInputChange}
                  value={formData.nosqlExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="nosql-projects"
                  name="nosqlProjects"
                  onChange={handleInputChange}
                  value={formData.nosqlProjects}
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in ETL Tools (Informatica, Talend, etc.)</td>
              <td>
                <input
                  type="text"
                  id="etl-experience"
                  name="etlExperience"
                  onChange={handleInputChange}
                  value={formData.etlExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="etl-projects"
                  name="etlProjects"
                  onChange={handleInputChange}
                  value={formData.etlProjects}
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in Big Data (Hadoop, Spark, Hive, etc.)</td>
              <td>
                <input
                  type="text"
                  id="bigdata-experience"
                  name="bigdataExperience"
                  onChange={handleInputChange}
                  value={formData.bigdataExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="bigdata-projects"
                  name="bigdataProjects"
                  onChange={handleInputChange}
                  value={formData.bigdataProjects}
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>
                Experience in Data Warehousing (Snowflake, Redshift, etc.)
              </td>
              <td>
                <input
                  type="text"
                  id="data-warehousing-experience"
                  name="dataWarehousingExperience"
                  onChange={handleInputChange}
                  value={formData.dataWarehousingExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="data-warehousing-projects"
                  name="dataWarehousingProjects"
                  onChange={handleInputChange}
                  value={formData.dataWarehousingProjects}
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in Data Pipelines (Airflow, Luigi, etc.)</td>
              <td>
                <input
                  type="text"
                  id="data-pipelines-experience"
                  name="dataPipelinesExperience"
                  onChange={handleInputChange}
                  value={formData.dataPipelinesExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="data-pipelines-projects"
                  name="dataPipelinesProjects"
                  onChange={handleInputChange}
                  value={formData.dataPipelinesProjects}
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in Data Analytics (Python, R, Pandas, etc.)</td>
              <td>
                <input
                  type="text"
                  id="data-analytics-experience"
                  name="dataAnalyticsExperience"
                  onChange={handleInputChange}
                  value={formData.dataAnalyticsExperience}
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="data-analytics-projects"
                  name="dataAnalyticsProjects"
                  onChange={handleInputChange}
                  value={formData.dataAnalyticsProjects}
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div className="feedback-section">
        <label htmlFor="detailed-feedback">Detailed Feedback: *</label>
        <textarea
          id="detailed-feedback"
          name="detailedFeedback"
          onChange={handleInputChange}
          value={formData.detailedFeedback}
          className="feedback-section-text"
          placeholder="Enter your detailed feedback here..."
          required
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          id="submit-button"
          onClick={handleSubmit}
          style={{
            backgroundColor: '#1f4e79',
            color: '#ffffff',
            height: '25px',
            width: '200px',
            borderRadius: '5px',
          }}
        >
          Submit
        </button>
      </div>
      <div id="toast" className="toast"></div>
    </div>
  );
};

export default PrescreeningForm;