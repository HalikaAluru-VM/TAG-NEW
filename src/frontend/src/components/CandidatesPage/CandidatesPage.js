import React, { useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import './CandidatesPage.css';

const CandidatesPage = () => {
  // Mock data for testing
  const mockCandidates = [
    {
      rrfId: 'POS-1999',
      name: 'HimaNiteshTeilgrobu',
      hrEmail: 'Mohansai.Ande@valuemonrestum.com',
      email: 'himaniteir88448@gmail.com',
      mobile: '+91-7981673918',
      role: 'Junior Azure DevOps Engineer',
      testScore: 24,
      recruitmentPhase: 'Shortlisted in Finnish Round',
      imochaDueDate: '2025-03-27',
      action: 'No Further Rounds',
      status: 'completed',
      ecCategory: 'cloud',
      l_1_status: 'Completed',
      imocha_report: 'https://example.com/report1.pdf'
    },
    {
      rrfId: 'POS-2000',
      name: 'John Smith',
      hrEmail: 'hr.smith@company.com',
      email: 'john.smith@example.com',
      mobile: '+1-555-123-4567',
      role: 'Senior Cloud Architect',
      testScore: 85,
      recruitmentPhase: 'Technical Interview Scheduled',
      imochaDueDate: '2025-04-15',
      action: 'Schedule L2',
      status: 'pending',
      ecCategory: 'cloud'
    },
    {
      rrfId: 'POS-2001',
      name: 'Alice Johnson',
      hrEmail: 'hr.alice@company.com',
      email: 'alice.j@example.com',
      mobile: '+44-7890-123456',
      role: 'Data Engineer',
      testScore: 78,
      recruitmentPhase: 'Imocha Test Pending',
      imochaDueDate: '2025-04-02',
      action: 'Awaiting Results',
      status: 'pending',
      ecCategory: 'data'
    }
  ];

  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: '',
    ecCategory: ''
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [panels, setPanels] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    domain: '',
    panel: '',
    datetime: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // MSAL Configuration
  const msalConfig = {
    auth: {
      clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
      authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
      redirectUri: "https://demotag.vercel.app"
    }
  };
  const msalInstance = new PublicClientApplication(msalConfig);

  useEffect(() => {
    // Simulate API call with mock data
    const timer = setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
      // Automatically send emails for completed candidates
      sendEmailsForCompletedCandidates(mockCandidates);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      let filtered = mockCandidates;
      
      if (filters.status !== 'all') {
        filtered = filtered.filter(c => c.status === filters.status);
      }
      
      if (filters.startDate) {
        filtered = filtered.filter(c => c.imochaDueDate >= filters.startDate);
      }
      
      if (filters.endDate) {
        filtered = filtered.filter(c => c.imochaDueDate <= filters.endDate);
      }
      
      if (filters.ecCategory) {
        filtered = filtered.filter(c => c.ecCategory === filters.ecCategory);
      }
      
      setCandidates(filtered);
      setLoading(false);
    }, 300);
  };

  const handleScheduleClick = (candidate) => {
    setSelectedCandidate(candidate);
    setModalOpen(true);
  };

  const handleScheduleSubmit = async () => {
    try {
      const { name, hrEmail, email } = selectedCandidate;
      const { panel, datetime } = scheduleData;

      const date = new Date(datetime);
      const startDateTime = date.toISOString();
      const endDateTime = new Date(date.getTime() + 30 * 60 * 1000).toISOString();

      // Get access token
      const tokenRequest = {
        scopes: ["OnlineMeetings.ReadWrite", "Calendars.ReadWrite", "Mail.Send"],
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

      // 1. Create Teams Meeting
      const meetingResponse = await fetch("https://graph.microsoft.com/v1.0/me/onlineMeetings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          startDateTime,
          endDateTime,
          subject: `L2 Interview: ${name}`,
          participants: {
            organizer: { upn: hrEmail },
            attendees: [
              { upn: email, role: "attendee" },
              { upn: panel, role: "attendee" }
            ]
          }
        })
      });

      if (!meetingResponse.ok) throw new Error("Failed to create Teams meeting");
      const meetingData = await meetingResponse.json();
      const meetingLink = meetingData.joinWebUrl;

      // 2. Create Calendar Event
      const eventResponse = await fetch("https://graph.microsoft.com/v1.0/me/events", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject: `L2 Interview: ${name}`,
          start: { dateTime: startDateTime, timeZone: "UTC" },
          end: { dateTime: endDateTime, timeZone: "UTC" },
          location: { displayName: "Microsoft Teams Meeting" },
          attendees: [
            { emailAddress: { address: email, name }, type: "required" },
            { emailAddress: { address: panel, name: "Panel Member" }, type: "required" },
            { emailAddress: { address: "Tagassistdemo@valuemomentum.com", name: "TAG Assist" }, type: "optional" }
          ],
          isOnlineMeeting: true,
          onlineMeetingProvider: "teamsForBusiness",
          onlineMeeting: { joinUrl: meetingLink },
          body: {
            contentType: "HTML",
            content: `
              <p>Dear ${name},</p>
              <p>You have been scheduled for your <b>L2 Interview</b>.</p>
              <p><b>Interview Details:</b></p>
              <ul>
                <li><b>Date & Time:</b> ${date.toUTCString()}</li>
                <li><b>Panel Member:</b> ${panel}</li>
                <li><b>Meeting Link:</b> <a href="${meetingLink}">${meetingLink}</a></li>
              </ul>
              <p>Please ensure you join on time and have a stable internet connection.</p>
              <p>Best Regards,</p>
              <p><b>TAG Assist Team</b></p>
            `
          }
        })
      });

      if (!eventResponse.ok) throw new Error("Failed to create calendar event");

      // 3. Update status in UI
      setCandidates(prev => prev.map(c => 
        c.email === email ? { ...c, recruitmentPhase: 'L2 Scheduled', action: 'Scheduled' } : c
      ));

      showToast(`Interview for ${name} scheduled successfully!`, 'success');
      setModalOpen(false);
    } catch (error) {
      console.error("Error scheduling interview:", error);
      showToast(`Error scheduling interview: ${error.message}`, 'error');
    }
  };

  const sendEmailForCandidate = async (candidate) => {
    if (!candidate.imocha_report) return;

    try {
      const tokenRequest = {
        scopes: ["Mail.Send"],
        account: msalInstance.getAllAccounts()[0]
      };

      const tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
      const accessToken = tokenResponse.accessToken;

      const emailData = {
        message: {
          subject: `iMocha Assessment Completed: RRFID-${candidate.rrfId} | Role: ${candidate.role} | Candidate: ${candidate.name}`,
          body: {
            contentType: "HTML",
            content: `
              <h3>Candidate iMocha Test Completed</h3>
              <p><strong>Name:</strong> ${candidate.name}</p>
              <p><strong>Email:</strong> ${candidate.email}</p>
              <p><strong>Phone:</strong> ${candidate.mobile}</p>
              <p><strong>Role:</strong> ${candidate.role}</p>
              <p><strong>Score:</strong> ${candidate.testScore || 'N/A'}</p>
              <p><strong>Status:</strong> ${candidate.l_1_status}</p>
              <p><strong>Recruitment Phase:</strong> ${candidate.recruitmentPhase}</p>
              <p><strong>PDF Report:</strong> <a href="${candidate.imocha_report}" target="_blank">View Report</a></p>
            `
          },
          toRecipients: [{ emailAddress: { address: candidate.hrEmail } }],
          saveToSentItems: "true"
        }
      };

      await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emailData)
      });

      console.log(`Email sent for candidate ${candidate.name}`);
    } catch (error) {
      console.error(`Error sending email for candidate ${candidate.name}:`, error);
    }
  };

  const sendEmailsForCompletedCandidates = async (candidates) => {
    for (const candidate of candidates.filter(c => c.status === 'completed')) {
      await sendEmailForCandidate(candidate);
    }
    showToast('Emails processed for all completed iMocha candidates', 'success');
  };

  const fetchPanels = async (domain) => {
    try {
      // Simulate API call with mock data
      const mockPanels = {
        cloud: ['cloudpanel1@company.com', 'cloudpanel2@company.com'],
        data: ['datapanel1@company.com', 'datapanel2@company.com'],
        app: ['apppanel1@company.com', 'apppanel2@company.com']
      };
      setPanels(mockPanels[domain] || []);
    } catch (error) {
      console.error('Error fetching panels:', error);
      showToast('Failed to load panels', 'error');
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'completed' && candidate.status === 'completed') ||
                         (filters.status === 'pending' && candidate.status !== 'completed');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rrf-tracking-container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <h1>RRF Tracking</h1>
      
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Search by name" 
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="search-btn">
          <i className="fas fa-search"></i>
        </button>
      </div>

      <div className="filter-section">
        <form onSubmit={handleFilterSubmit}>
          <div className="filter-group">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="status-filter"
            >
              <option value="all">All</option>
              <option value="completed">Imocha Completed</option>
              <option value="pending">Imocha Pending</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label>EC Category:</label>
            <select
              name="ecCategory"
              value={filters.ecCategory}
              onChange={handleFilterChange}
            >
              <option value="">-- Select --</option>
              <option value="cloud">Cloud</option>
              <option value="data">Data</option>
              <option value="app">App</option>
            </select>
          </div>
          
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading candidates...</div>
        ) : (
          <table className="candidates-table">
            <thead>
              <tr>
                <th>RRF ID</th>
                <th>Name</th>
                <th>Hr Email</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Test Score</th>
                <th>Recruitment Phase</th>
                <th>Imocha Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate, index) => (
                  <tr key={index}>
                    <td>{candidate.rrfId}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.hrEmail}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.mobile}</td>
                    <td>{candidate.role}</td>
                    <td>{candidate.testScore}</td>
                    <td>{candidate.recruitmentPhase}</td>
                    <td>{candidate.imochaDueDate}</td>
                    <td>
                      {candidate.action === 'Schedule L2' ? (
                        <button 
                          className="schedule-btn" 
                          onClick={() => handleScheduleClick(candidate)}
                        >
                          Schedule L2
                        </button>
                      ) : (
                        candidate.action
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-results">No candidates found matching your criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Schedule Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">Schedule L2 Interview</div>
            <div className="modal-body">
              <div className="form-group">
                <label>Domain:</label>
                <select
                  value={scheduleData.domain}
                  onChange={(e) => {
                    setScheduleData({...scheduleData, domain: e.target.value});
                    fetchPanels(e.target.value);
                  }}
                >
                  <option value="">Select Domain</option>
                  <option value="cloud">Cloud</option>
                  <option value="data">Data</option>
                  <option value="app">App</option>
                </select>
              </div>
              <div className="form-group">
                <label>Panel:</label>
                <select
                  value={scheduleData.panel}
                  onChange={(e) => setScheduleData({...scheduleData, panel: e.target.value})}
                  disabled={!scheduleData.domain}
                >
                  <option value="">Select Panel</option>
                  {panels.map((panel, index) => (
                    <option key={index} value={panel}>{panel}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date & Time:</label>
                <input
                  type="datetime-local"
                  value={scheduleData.datetime}
                  onChange={(e) => setScheduleData({...scheduleData, datetime: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={handleScheduleSubmit}>Schedule</button>
              <button className="btn" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesPage;

///Complete UI

// import React, { useState, useEffect } from 'react';
// import './CandidatesPage.css';

// const CandidatesPage = () => {
//   // Mock data for testing
//   const mockCandidates = [
//     {
//       rrfId: 'POS-1999',
//       name: 'HimaNiteshTeilgrobu',
//       hrEmail: 'Mohansai.Ande@valuemonrestum.com',
//       email: 'himaniteir88448@gmail.com',
//       mobile: '+91-7981673918',
//       role: 'Junior Azure DevOps Engineer',
//       testScore: 24,
//       recruitmentPhase: 'Shortlisted in Finnish Round',
//       imochaDueDate: '2025-03-27',
//       action: 'No Further Rounds',
//       status: 'completed',
//       ecCategory: 'cloud'
//     },
//     {
//       rrfId: 'POS-2000',
//       name: 'John Smith',
//       hrEmail: 'hr.smith@company.com',
//       email: 'john.smith@example.com',
//       mobile: '+1-555-123-4567',
//       role: 'Senior Cloud Architect',
//       testScore: 85,
//       recruitmentPhase: 'Technical Interview Scheduled',
//       imochaDueDate: '2025-04-15',
//       action: 'Schedule L2',
//       status: 'pending',
//       ecCategory: 'cloud'
//     },
//     {
//       rrfId: 'POS-2001',
//       name: 'Alice Johnson',
//       hrEmail: 'hr.alice@company.com',
//       email: 'alice.j@example.com',
//       mobile: '+44-7890-123456',
//       role: 'Data Engineer',
//       testScore: 78,
//       recruitmentPhase: 'Imocha Test Pending',
//       imochaDueDate: '2025-04-02',
//       action: 'Awaiting Results',
//       status: 'pending',
//       ecCategory: 'data'
//     }
//   ];

//   const [candidates, setCandidates] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     status: 'all',
//     startDate: '',
//     endDate: '',
//     ecCategory: ''
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call with mock data
//     const timer = setTimeout(() => {
//       setCandidates(mockCandidates);
//       setLoading(false);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setTimeout(() => {
//       let filtered = mockCandidates;
      
//       if (filters.status !== 'all') {
//         filtered = filtered.filter(c => c.status === filters.status);
//       }
      
//       if (filters.startDate) {
//         filtered = filtered.filter(c => c.imochaDueDate >= filters.startDate);
//       }
      
//       if (filters.endDate) {
//         filtered = filtered.filter(c => c.imochaDueDate <= filters.endDate);
//       }
      
//       if (filters.ecCategory) {
//         filtered = filtered.filter(c => c.ecCategory === filters.ecCategory);
//       }
      
//       setCandidates(filtered);
//       setLoading(false);
//     }, 300);
//   };

//   const filteredCandidates = candidates.filter(candidate => 
//     candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="rrf-tracking-container">
//       <h1>RRF Tracking</h1>
      
//       <div className="search-box">
//         <input 
//           type="text" 
//           placeholder="Search by name" 
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//         <button className="search-btn">
//           <i className="fas fa-search"></i>
//         </button>
//       </div>

//       <div className="filter-section">
//         <form onSubmit={handleFilterSubmit}>
//           <div className="filter-group">
//             <select
//               name="status"
//               value={filters.status}
//               onChange={handleFilterChange}
//               className="status-filter"
//             >
//               <option value="all">All</option>
//               <option value="completed">Imocha Completed</option>
//               <option value="pending">Imocha Pending</option>
//             </select>
//           </div>
          
//           <div className="filter-group">
//             <label>Start Date:</label>
//             <input
//               type="date"
//               name="startDate"
//               value={filters.startDate}
//               onChange={handleFilterChange}
//             />
//           </div>
          
//           <div className="filter-group">
//             <label>End Date:</label>
//             <input
//               type="date"
//               name="endDate"
//               value={filters.endDate}
//               onChange={handleFilterChange}
//             />
//           </div>
          
//           <div className="filter-group">
//             <label>EC Category:</label>
//             <select
//               name="ecCategory"
//               value={filters.ecCategory}
//               onChange={handleFilterChange}
//             >
//               <option value="">-- Select --</option>
//               <option value="cloud">Cloud</option>
//               <option value="data">Data</option>
//               <option value="app">App</option>
//             </select>
//           </div>
          
//           <button type="submit" className="submit-btn">Submit</button>
//         </form>
//       </div>

//       <div className="table-container">
//         {loading ? (
//           <div className="loading">Loading candidates...</div>
//         ) : (
//           <table className="candidates-table">
//             <thead>
//               <tr>
//                 <th>RRF ID</th>
//                 <th>Name</th>
//                 <th>Hr Email</th>
//                 <th>Email</th>
//                 <th>Mobile</th>
//                 <th>Role</th>
//                 <th>Test Score</th>
//                 <th>Recruitment Phase</th>
//                 <th>Imocha Due Date</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCandidates.length > 0 ? (
//                 filteredCandidates.map((candidate, index) => (
//                   <tr key={index}>
//                     <td>{candidate.rrfId}</td>
//                     <td>{candidate.name}</td>
//                     <td>{candidate.hrEmail}</td>
//                     <td>{candidate.email}</td>
//                     <td>{candidate.mobile}</td>
//                     <td>{candidate.role}</td>
//                     <td>{candidate.testScore}</td>
//                     <td>{candidate.recruitmentPhase}</td>
//                     <td>{candidate.imochaDueDate}</td>
//                     <td>{candidate.action}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="10" className="no-results">No candidates found matching your criteria</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CandidatesPage;


// complete UI