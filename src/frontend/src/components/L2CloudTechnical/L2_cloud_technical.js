import React, { useEffect } from 'react';
import './L2_cloud_technical.css';
import html2pdf from 'html2pdf.js';
import * as msal from '@azure/msal-browser';

const L2CloudTechnical = () => {
    useEffect(() => {
        const msalConfig = {
            auth: {
                clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
                authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
                redirectUri: "http://localhost:3000",
            }
        };

        const msalInstance = new msal.PublicClientApplication(msalConfig);
        const loggedInUserEmail = localStorage.getItem("userEmail");

        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.remove('success', 'error');

            toast.classList.add('show');
            toast.classList.add(type);
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        document.getElementById('generate-summary')?.addEventListener('click', function (e) {
            e.preventDefault();
            generateFeedback();
        });

        async function generateFeedback() {
            const geminiApiKey = 'AIzaSyAQ7ENlXhG7wadU7YlrLk1ba6NJS7k8IsY';

            // Show loading message
            document.getElementById('loading-message').style.display = 'block';

            // Collect form data with validation
            const formData = {
                coreCloudConcepts: {
                    deployment: document.getElementById('core-cloud-concepts-deployment').value || 'N/A',
                    configuration: document.getElementById('core-cloud-concepts-configuration').value || 'N/A',
                    troubleshooting: document.getElementById('core-cloud-concepts-troubleshooting').value || 'N/A',
                    justification: document.getElementById('core-cloud-concepts-justification').value || 'N/A',
                    improvements: document.getElementById('core-cloud-concepts-improvements').value || 'N/A',
                },
                networkingSecurity: {
                    deployment: document.getElementById('networking-security-deployment').value || 'N/A',
                    configuration: document.getElementById('networking-security-configuration').value || 'N/A',
                    troubleshooting: document.getElementById('networking-security-troubleshooting').value || 'N/A',
                    justification: document.getElementById('networking-security-justification').value || 'N/A',
                    improvements: document.getElementById('networking-security-improvements').value || 'N/A',
                },
                infrastructureManagement: {
                    deployment: document.getElementById('infrastructure-management-deployment').value || 'N/A',
                    configuration: document.getElementById('infrastructure-management-configuration').value || 'N/A',
                    troubleshooting: document.getElementById('infrastructure-management-troubleshooting').value || 'N/A',
                    justification: document.getElementById('infrastructure-management-justification').value || 'N/A',
                    improvements: document.getElementById('infrastructure-management-improvements').value || 'N/A',
                },
                scalabilityHighAvailability: {
                    deployment: document.getElementById('scalability-high-avail-deployment').value || 'N/A',
                    configuration: document.getElementById('scalability-high-avail-configuration').value || 'N/A',
                    troubleshooting: document.getElementById('scalability-high-avail-troubleshooting').value || 'N/A',
                    justification: document.getElementById('scalability-high-avail-justification').value || 'N/A',
                    improvements: document.getElementById('scalability-high-avail-improvements').value || 'N/A',
                },
                automation: {
                    deployment: document.getElementById('automation-deployment').value || 'N/A',
                    configuration: document.getElementById('automation-configuration').value || 'N/A',
                    troubleshooting: document.getElementById('automation-troubleshooting').value || 'N/A',
                    justification: document.getElementById('automation-justification').value || 'N/A',
                    improvements: document.getElementById('automation-improvements').value || 'N/A',
                },
                observability: {
                    deployment: document.getElementById('observability-deployment').value || 'N/A',
                    configuration: document.getElementById('observability-configuration').value || 'N/A',
                    troubleshooting: document.getElementById('observability-troubleshooting').value || 'N/A',
                    justification: document.getElementById('observability-justification').value || 'N/A',
                    improvements: document.getElementById('observability-improvements').value || 'N/A',
                },
            };

            console.log("Form Data Sent:", formData);

            const payload = {
                contents: [{
                    parts: [{
                        text: `Provide a brief summary in 120 words highlighting key skills, weaknesses, and areas for improvement based on the following data:

            Core Cloud Concepts: ${formData.coreCloudConcepts.deployment}, ${formData.coreCloudConcepts.configuration}, ${formData.coreCloudConcepts.troubleshooting}, ${formData.coreCloudConcepts.justification}, ${formData.coreCloudConcepts.improvements}
            Networking & Security: ${formData.networkingSecurity.deployment}, ${formData.networkingSecurity.configuration}, ${formData.networkingSecurity.troubleshooting}, ${formData.networkingSecurity.justification}, ${formData.networkingSecurity.improvements}
            Infrastructure Management: ${formData.infrastructureManagement.deployment}, ${formData.infrastructureManagement.configuration}, ${formData.infrastructureManagement.troubleshooting}, ${formData.infrastructureManagement.justification}, ${formData.infrastructureManagement.improvements}
            Scalability & High Availability: ${formData.scalabilityHighAvailability.deployment}, ${formData.scalabilityHighAvailability.configuration}, ${formData.scalabilityHighAvailability.troubleshooting}, ${formData.scalabilityHighAvailability.justification}, ${formData.scalabilityHighAvailability.improvements}
            Automation: ${formData.automation.deployment}, ${formData.automation.configuration}, ${formData.automation.troubleshooting}, ${formData.automation.justification}, ${formData.automation.improvements}
            Observability: ${formData.observability.deployment}, ${formData.observability.configuration}, ${formData.observability.troubleshooting}, ${formData.observability.justification}, ${formData.observability.improvements}

            After the summary, provide a one-line response for each concept, highlighting:
            - What the person is good at (strengths).
            - What they need to improve (weaknesses).

            For each concept (Core Cloud Concepts, Networking & Security, Infrastructure Management, Scalability & High Availability, Automation, and Observability), write a single sentence in the following format:

            [Concept Name]: The candidate is good at [strength] but needs improvement in [weakness].`
                    }]
                }]
            };

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const responseBody = await response.json();
                console.log("API Response Body:", responseBody);

                document.getElementById('loading-message').style.display = 'none';

                if (!response.ok || !responseBody.candidates || responseBody.candidates.length === 0) {
                    console.error('Error: Invalid response structure', responseBody);
                    alert('Error generating feedback. Please try again later.');
                    return;
                }

                const firstCandidate = responseBody.candidates[0];
                console.log('First candidate structure:', firstCandidate);

                const generatedFeedback = firstCandidate.content?.parts[0]?.text || 'No feedback generated';
                document.getElementById('detailed-feedback').value = generatedFeedback;
            } catch (error) {
                console.error('Error generating feedback:', error);
                alert('Error generating feedback. Please try again later.');
                document.getElementById('loading-message').style.display = 'none';
            }
        }

        function downloadPDF() {
            const formContainer = document.querySelector('.form-container');

            formContainer.style.marginLeft = '0';
            formContainer.style.marginTop = '0';

            const options = {
                margin: 1,
                filename: 'Interview_Feedback_Form.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(options).from(formContainer).save().then(() => {
                formContainer.style.marginLeft = '22%';
                formContainer.style.marginTop = '-41%';
            });
        }

        function navigateTo(page) {
            window.location.href = page;
        }

        document.addEventListener("DOMContentLoaded", function () {
            const urlParams = new URLSearchParams(window.location.search);
            const candidateEmail = urlParams.get('candidateEmail');
 
            if (candidateEmail) {
                fetch(`http://localhost:3000/api/getCandidateData?candidateEmail=${candidateEmail}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            showToast(data.error, "error");
                        } else {
                            document.getElementById('candidate-name').value = data.candidate_name;
                            document.getElementById('position').value = data.role;
                            document.getElementById('interviewer-name').value = data.panel_name;
                            document.getElementById('interview-date').value = data.l_2_interviewdate;
                            document.getElementById('imocha-score').textContent = data.l_1_score;
                            document.getElementById('candidate-email').textContent = candidateEmail;
                            document.getElementById('rrf-id').value = data.rrf_id;
                            document.getElementById('hr-email').value = data.hr_email;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching candidate data:', error);
                        showToast("Failed to load candidate data.", "error");
                    });
            }
        });

        document.addEventListener("DOMContentLoaded", function () {
            const urlParams = new URLSearchParams(window.location.search);
            const candidateEmail = urlParams.get('candidateEmail');

            if (candidateEmail) {
                fetch(`http://localhost:3000/api/get-feedback?candidateEmail=${candidateEmail}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            showToast(data.error, "error");
                        } else {
                            document.getElementById('candidate-name').value = data.candidate_name;
                            document.getElementById('position').value = data.position;
                            document.getElementById('interviewer-name').value = data.interviewer_name;
                            document.getElementById('interview-date').value = data.interview_date;
                            document.getElementById('imocha-score').textContent = data.imocha_score || 'N/A';
                            document.getElementById('candidate-email').textContent = candidateEmail;
                            document.getElementById('rrf-id').value = data.rrf_id;
                            document.getElementById('hr-email').value = data.hr_email;

                            // Populate Core Cloud Concepts fields
                            document.getElementById('core-cloud-concepts-deployment').value = data.core_cloud_concepts_deployment;
                            document.getElementById('core-cloud-concepts-configuration').value = data.core_cloud_concepts_configuration;
                            document.getElementById('core-cloud-concepts-troubleshooting').value = data.core_cloud_concepts_troubleshooting;
                            document.getElementById('core-cloud-concepts-justification').value = data.core_cloud_concepts_justification;
                            document.getElementById('core-cloud-concepts-improvements').value = data.core_cloud_concepts_improvements;

                            // Populate Networking & Security fields
                            document.getElementById('networking-security-deployment').value = data.networking_security_deployment;
                            document.getElementById('networking-security-configuration').value = data.networking_security_configuration;
                            document.getElementById('networking-security-troubleshooting').value = data.networking_security_troubleshooting;
                            document.getElementById('networking-security-justification').value = data.networking_security_justification;
                            document.getElementById('networking-security-improvements').value = data.networking_security_improvements;

                            // Populate Infrastructure Management fields
                            document.getElementById('infrastructure-management-deployment').value = data.infrastructure_management_deployment;
                            document.getElementById('infrastructure-management-configuration').value = data.infrastructure_management_configuration;
                            document.getElementById('infrastructure-management-troubleshooting').value = data.infrastructure_management_troubleshooting;
                            document.getElementById('infrastructure-management-justification').value = data.infrastructure_management_justification;
                            document.getElementById('infrastructure-management-improvements').value = data.infrastructure_management_improvements;

                            // Populate Scalability & High Availability fields
                            document.getElementById('scalability-high-avail-deployment').value = data.scalability_high_avail_deployment;
                            document.getElementById('scalability-high-avail-configuration').value = data.scalability_high_avail_configuration;
                            document.getElementById('scalability-high-avail-troubleshooting').value = data.scalability_high_avail_troubleshooting;
                            document.getElementById('scalability-high-avail-justification').value = data.scalability_high_avail_justification;
                            document.getElementById('scalability-high-avail-improvements').value = data.scalability_high_avail_improvements;

                            // Populate Automation fields
                            document.getElementById('automation-deployment').value = data.automation_deployment;
                            document.getElementById('automation-configuration').value = data.automation_configuration;
                            document.getElementById('automation-troubleshooting').value = data.automation_troubleshooting;
                            document.getElementById('automation-justification').value = data.automation_justification;
                            document.getElementById('automation-improvements').value = data.automation_improvements;

                            // Populate Observability fields
                            document.getElementById('observability-deployment').value = data.observability_deployment;
                            document.getElementById('observability-configuration').value = data.observability_configuration;
                            document.getElementById('observability-troubleshooting').value = data.observability_troubleshooting;
                            document.getElementById('observability-justification').value = data.observability_justification;
                            document.getElementById('observability-improvements').value = data.observability_improvements;

                            // Populate the remaining fields
                            document.getElementById('detailed-feedback').value = data.detailed_feedback;
                            document.getElementById('result').value = data.result;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching candidate data:', error);
                        showToast("Failed to load candidate data.", "error");
                    });
                }
            });

        document.getElementById('submit-button')?.addEventListener('click', function (e) {
            e.preventDefault();
            const feedback = document.getElementById('detailed-feedback').value;
            const result = document.getElementById('result').value;
            const candidateEmail = new URLSearchParams(window.location.search).get('candidateEmail');
            if (!feedback || !result) {
                showToast("Please fill in all required fields.", "error");
                return;
            }

            fetch('http://localhost:3000/api/updateCandidateFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidateEmail: candidateEmail,
                    feedback: feedback,
                    result: result,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showToast('Feedback and result updated successfully.');
                        window.close();
                    } else {
                        showToast('Error updating the feedback and result.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showToast('An error occurred while submitting the feedback.', 'error');
                });
        });

        document.getElementById('submit-button')?.addEventListener('click', function (e) {
            e.preventDefault();
            const formData = {
                rrf_id: document.getElementById('rrf-id').value,
                position: document.getElementById('position').value,
                candidate_name: document.getElementById('candidate-name').value,
                interview_date: document.getElementById('interview-date').value,
                interviewer_name: document.getElementById('interviewer-name').value,
                hr_email: document.getElementById('hr-email').value,
                candidate_email: document.getElementById('candidate-email').textContent,

                // Core Cloud Concepts
                core_cloud_concepts_deployment: document.getElementById('core-cloud-concepts-deployment').value,
                core_cloud_concepts_configuration: document.getElementById('core-cloud-concepts-configuration').value,
                core_cloud_concepts_troubleshooting: document.getElementById('core-cloud-concepts-troubleshooting').value,
                core_cloud_concepts_justification: document.getElementById('core-cloud-concepts-justification').value,
                core_cloud_concepts_improvements: document.getElementById('core-cloud-concepts-improvements').value,

                // Networking & Security
                networking_security_deployment: document.getElementById('networking-security-deployment').value,
                networking_security_configuration: document.getElementById('networking-security-configuration').value,
                networking_security_troubleshooting: document.getElementById('networking-security-troubleshooting').value,
                networking_security_justification: document.getElementById('networking-security-justification').value,
                networking_security_improvements: document.getElementById('networking-security-improvements').value,

                // Infrastructure Management
                infrastructure_management_deployment: document.getElementById('infrastructure-management-deployment').value,
                infrastructure_management_configuration: document.getElementById('infrastructure-management-configuration').value,
                infrastructure_management_troubleshooting: document.getElementById('infrastructure-management-troubleshooting').value,
                infrastructure_management_justification: document.getElementById('infrastructure-management-justification').value,
                infrastructure_management_improvements: document.getElementById('infrastructure-management-improvements').value,

                // Scalability & High Availability
                scalability_high_avail_deployment: document.getElementById('scalability-high-avail-deployment').value,
                scalability_high_avail_configuration: document.getElementById('scalability-high-avail-configuration').value,
                scalability_high_avail_troubleshooting: document.getElementById('scalability-high-avail-troubleshooting').value,
                scalability_high_avail_justification: document.getElementById('scalability-high-avail-justification').value,
                scalability_high_avail_improvements: document.getElementById('scalability-high-avail-improvements').value,

                // Automation
                automation_deployment: document.getElementById('automation-deployment').value,
                automation_configuration: document.getElementById('automation-configuration').value,
                automation_troubleshooting: document.getElementById('automation-troubleshooting').value,
                automation_justification: document.getElementById('automation-justification').value,
                automation_improvements: document.getElementById('automation-improvements').value,

                // Observability
                observability_deployment: document.getElementById('observability-deployment').value,
                observability_configuration: document.getElementById('observability-configuration').value,
                observability_troubleshooting: document.getElementById('observability-troubleshooting').value,
                observability_justification: document.getElementById('observability-justification').value,
                observability_improvements: document.getElementById('observability-improvements').value,

                // Additional fields for Detailed Feedback and Result
                detailed_feedback: document.getElementById('detailed-feedback').value,
                result: document.getElementById('result').value
            };

            const formContainer = document.querySelector('.form-container');
            const originalMarginLeft = formContainer.style.marginLeft;
            const originalMarginTop = formContainer.style.marginTop;
            formContainer.style.marginLeft = '0';
            formContainer.style.marginTop = '0';

            setTimeout(() => {
                function replaceInputsWithText(container) {
                    container.querySelectorAll("input, textarea").forEach((el) => {
                        let text = document.createTextNode(el.value || "");
                        let parent = el.parentNode;
                        parent.replaceChild(text, el);
                    });
                }

                let clonedFormContainer = formContainer.cloneNode(true);
                replaceInputsWithText(clonedFormContainer);

                html2pdf()
                    .set({
                        margin: 0.5,
                        filename: 'Interview_Feedback_Form.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 3, useCORS: true },
                        jsPDF: { unit: 'in', format: [11, 8.5], orientation: 'landscape' }
                    })
                    .from(clonedFormContainer)
                    .toPdf()
                    .get('pdf')
                    .then(async (pdf) => {
                        const pdfBlob = pdf.output('blob');

                        formContainer.style.marginLeft = originalMarginLeft;
                        formContainer.style.marginTop = originalMarginTop;

                        const base64PDF = await convertBlobToBase64(pdfBlob);

                        const tokenRequest = {
                            scopes: ["Mail.Send"],
                            account: msalInstance.getAllAccounts()[0]
                        };

                        let tokenResponse;
                        try {
                            tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
                        } catch (silentError) {
                            console.warn("Silent token acquisition failed; trying popup.", silentError);
                            tokenResponse = await msalInstance.acquireTokenPopup(tokenRequest);
                        }

                        const accessToken = tokenResponse.accessToken;

                        const emailContent = {
                            message: {
                                subject: "Interview Feedback Form",
                                body: {
                                    contentType: "HTML",
                                    content: `<p>Please find the attached interview feedback form for <strong>${formData.candidate_name}</strong>.</p>`
                                },
                                toRecipients: [
                                    { emailAddress: { address: formData.hr_email } }
                                ],
                                attachments: [
                                    {
                                        "@odata.type": "#microsoft.graph.fileAttachment",
                                        name: "Interview_Feedback_Form.pdf",
                                        contentType: "application/pdf",
                                        contentBytes: base64PDF
                                    }
                                ]
                            }
                        };

                        fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${accessToken}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(emailContent)
                        })
                            .then(response => response.json())
                            .then(data => {
                                showToast("Email sent successfully with attachment!", "success");
                            })
                            .catch(error => {
                                console.error("Error sending email:", error);
                            });

                        fetch('http://localhost:3000/api/add-feedback', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    showToast("Feedback submitted successfully!", "success");
                                    window.parent.closeFeedbackModal();
                                } else {
                                    showToast("Error submitting feedback", "error");
                                }
                            })
                            .catch(error => {
                                console.error("Error:", error);
                                showToast("An error occurred while submitting the feedback", "error");
                            });
                    });
            }, 500);
        });

        async function convertBlobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    resolve(reader.result.split(',')[1]);
                };
                reader.onerror = reject;
            });
        }
    }, []);

    return (
        <div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <div id="toast" className="toast"></div>

            <div className="form-container" id="form-container">
                <div style={{ color: '#000000' }}>
                    <p>Email: <span id="candidate-email"></span></p>
                    <p>iMocha Score: <span id="imocha-score"></span></p>
                </div>
                <br />
                {/* Header Section */}

                <div style={{ maxWidth: '50%' }}>
                    <table>
                        <tr>
                            <td className="details">RRF ID</td>
                            <td><input type="text" id="rrf-id" placeholder="" readOnly /></td>
                        </tr>
                        <tr>
                            <td className="details">Job Designation</td>
                            <td><input type="text" id="position" placeholder="" readOnly /></td>
                        </tr>
                        <tr>
                            <td className="details">Name of the Candidate</td>
                            <td><input type="text" id="candidate-name" placeholder="" readOnly /></td>
                        </tr>
                        <tr>
                            <td className="details">Date of Interview</td>
                            <td><input type="text" id="interview-date" readOnly /></td>
                        </tr>
                        <tr>
                            <td className="details">Interviewer Mail</td>
                            <td><input type="text" id="interviewer-name" placeholder="" readOnly /></td>
                        </tr>
                        <tr>
                            <td className="details">TAG Team Member</td>
                            <td><input type="text" id="hr-email" placeholder="" readOnly /></td>
                        </tr>
                    </table>
                </div>

                <table>
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
                    <tr>
                        <td className="header">Core Cloud Concepts</td>
                        <td>Be prepared to discuss IaaS, PaaS, SaaS, deployment models (public, private, hybrid), and the
                            advantages and disadvantages of cloud</td>
                        <td>Yes</td>
                        <td>
                            <select id="core-cloud-concepts-deployment" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="core-cloud-concepts-configuration" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="core-cloud-concepts-troubleshooting" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td><textarea id="core-cloud-concepts-justification" required></textarea></td>
                        <td><textarea id="core-cloud-concepts-improvements" required></textarea></td>
                    </tr>
                    <tr>
                        <td className="header">Networking & Security</td>
                        <td>Expect questions on virtual networks, security groups, firewalls, endpoints and access control
                            mechanisms within a cloud environment.</td>
                        <td>No</td>
                        <td>
                            <select id="networking-security-deployment" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="networking-security-configuration" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="networking-security-troubleshooting" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td><textarea id="networking-security-justification" required></textarea></td>
                        <td><textarea id="networking-security-improvements" required></textarea></td>
                    </tr>
                    <tr>
                        <td className="header">Infrastructure Management</td>
                        <td>Candidate might be asked about resource provisioning (VMs, storage, Containerization), configuration
                            management tools (Chef, Ansible), and CloudFormation.</td>
                        <td>No</td>
                        <td>
                            <select id="infrastructure-management-deployment" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="infrastructure-management-configuration" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="infrastructure-management-troubleshooting" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td><textarea id="infrastructure-management-justification" required></textarea></td>
                        <td><textarea id="infrastructure-management-improvements" required></textarea></td>
                    </tr>
                    <tr>
                        <td className="header">Scalability & High Availability</td>
                        <td>Understanding of how to design and implement scalable and highly available infrastructure in the
                            cloud.</td>
                        <td>No</td>
                        <td>
                            <select id="scalability-high-avail-deployment" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="scalability-high-avail-configuration" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="scalability-high-avail-troubleshooting" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td><textarea id="scalability-high-avail-justification" required></textarea></td>
                        <td><textarea id="scalability-high-avail-improvements" required></textarea></td>
                    </tr>
                    <tr>
                        <td className="header">Automation</td>
                        <td>Infrastructure as code (IaC) with Terraform or ARM(Azure) or CloudFormation (AWS)</td>
                        <td>No</td>
                        <td>
                            <select id="automation-deployment" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="automation-configuration" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="automation-troubleshooting" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td><textarea id="automation-justification" required></textarea></td>
                        <td><textarea id="automation-improvements" required></textarea></td>
                    </tr>
                    <tr>
                        <td className="header">Observability</td>
                        <td>Discuss observability tools and techniques for monitoring and debugging cloud systems.</td>
                        <td>No</td>
                        <td>
                            <select id="observability-deployment" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="observability-configuration" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td>
                            <select id="observability-troubleshooting" className="dropdown" required>
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                            </select>
                        </td>
                        <td><textarea id="observability-justification" required></textarea></td>
                        <td><textarea id="observability-improvements" required></textarea></td>
                    </tr>
                </table>

                {/* Feedback Section */}
                <div className="feedback-section">
                    <label htmlFor="detailed-feedback">Detailed Feedback: *</label>
                    <h3><div id="loading-message" style={{ display: 'none', fontStyle: 'italic', color: '#00d9ff' }}>Please wait while analysing the feedback based on given inputs...</div></h3>
                    <textarea id="detailed-feedback" className="feedback-section-text"
                        placeholder="Enter your detailed feedback here..." required></textarea>
                    <button id="generate-summary">Generate Feedback</button>
                </div>

                {/* Result Section */}
                <div className="result-section">
                    <label htmlFor="result">Shortlisted for next round</label>
                    <select id="result" className="result-select" required>
                        <option value="">Select</option>
                        <option value="Recommended">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button id="submit-button"
                        style={{ backgroundColor: '#1f4e79', color: '#ffffff', height: '25px', width: '200px', borderRadius: '5px' }}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default L2CloudTechnical;