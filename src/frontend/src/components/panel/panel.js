import React, { useState, useEffect } from 'react';
import './panel.css';

const Panel = () => {
    const [currentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [meetings, setMeetings] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [showCalendar, setShowCalendar] = useState(true);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackIframeSrc, setFeedbackIframeSrc] = useState('');
    const [feedbackWindows, setFeedbackWindows] = useState({});

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const roundDetailsMap = {
        'L2 Technical Round Scheduled': 'L2 Technical',
        'Client Fitment Round Scheduled': 'Client Fitment Round',
        'Project Fitment Round Scheduled': 'Project Fitment Round',
        'Fitment Round Scheduled': 'Fitment Round',
        'EC Fitment Round Scheduled': 'EC Fitment Round'
    };

    useEffect(() => {
        renderCalendar(currentMonth, currentYear);
        fetchMeetingsForSelectedDate(currentDate);
    }, []);

    const renderCalendar = (month, year) => {
        const firstDay = new Date(year, month, 1);
        const firstDayIndex = firstDay.getDay();
        const lastDay = new Date(year, month + 1, 0);
        const totalDaysInMonth = lastDay.getDate();
        const days = [];

        // Fill in empty days from previous month
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(
                <div key={`empty-${i}`} className="day other-month"></div>
            );
        }

        // Fill in days for the current month
        for (let day = 1; day <= totalDaysInMonth; day++) {
            const isActive = day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
            const isSelected = selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();

            days.push(
                <div 
                    key={`day-${day}`}
                    className={`day ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDateClick(day, month, year)}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    const handleDateClick = (day, month, year) => {
        const newSelectedDate = new Date(year, month, day);
        setSelectedDate(newSelectedDate);
        fetchMeetingsForSelectedDate(newSelectedDate);
    };

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value);
        setCurrentMonth(newMonth);
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value);
        setCurrentYear(newYear);
    };

    const handlePrevMonth = () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;
        
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }
        
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const handleNextMonth = () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;
        
        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const getFeedbackFormUrl = (recruitmentPhase) => {
        const feedbackFormUrls = {
            'L2 Technical Round Scheduled': 'L2-Technical.html',
            'Shortlisted in L2': 'L2-Technical.html',
            'Client Fitment Round Scheduled': 'feedbackform.html',
            'Shortlisted in Client Fitment Round': 'feedbackform.html',
            'Project Fitment Round Scheduled': 'feedbackform.html',
            'Shortlisted in Project Fitment Round': 'feedbackform.html',
            'Fitment Round Scheduled': 'feedbackform.html',
            'Shortlisted in Fitment Round': 'feedbackform.html',
            'EC Fitment Round Scheduled': 'feedbackform.html',
            'Shortlisted in EC Fitment Round': 'feedbackform.html',
            'Project Fitment Round': 'feedbackform.html',
            'Fitment Round': 'feedbackform.html',
            'L2 Technical': 'L2-Technical.html',
            'Client Fitment Round': 'feedbackform.html',
            'EC Fitment Round': 'feedbackform.html',
        };

        return feedbackFormUrls[recruitmentPhase] || 'default-feedback.html';
    };

    const joinMeetingAndShowFeedback = (candidateEmail, recruitmentPhase, meetingLink) => {
        const roundDetails = roundDetailsMap[recruitmentPhase] || recruitmentPhase;
        openFeedbackForm(candidateEmail, roundDetails);
        window.open(meetingLink, "_blank");
    };

    const openFeedbackForm = async (candidateEmail, recruitmentPhase) => {
        try {
            const response = await fetch('https://demotag.vercel.app/api/get-ec-select', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ candidateEmail }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch ec_select value.");
            }

            const data = await response.json();

            if (data.ec_select === "App") {
                const windowFeatures = 'width=1000,height=800,top=100,left=100';
                const newWindow = window.open(
                    `L2_App_Technical.html?candidateEmail=${encodeURIComponent(candidateEmail)}&roundDetails=${encodeURIComponent(recruitmentPhase)}`,
                    `feedbackWindow_${candidateEmail}`,
                    windowFeatures
                );
                setFeedbackWindows(prev => ({
                    ...prev,
                    [candidateEmail]: newWindow
                }));
            } 
            else if (data.ec_select === "Data") {
                const windowFeatures = 'width=1000,height=800,top=100,left=100';
                const newWindow = window.open(
                    `L2_Data_Technical.html?candidateEmail=${encodeURIComponent(candidateEmail)}&roundDetails=${encodeURIComponent(recruitmentPhase)}`,
                    `feedbackWindow_${candidateEmail}`,
                    windowFeatures
                );
                setFeedbackWindows(prev => ({
                    ...prev,
                    [candidateEmail]: newWindow
                }));
            }
            else {
                localStorage.setItem('roundDetails', recruitmentPhase);
                setFeedbackIframeSrc(`${getFeedbackFormUrl(recruitmentPhase)}?candidateEmail=${encodeURIComponent(candidateEmail)}`);
                setShowFeedbackModal(true);
            }
        } catch (error) {
            console.error("Error opening feedback form:", error);
            alert("Failed to open feedback form. Please try again.");
        }
    };

    const closeFeedbackModal = () => {
        setShowFeedbackModal(false);
        setFeedbackIframeSrc('about:blank');
        
        // Close any tracked feedback windows
        Object.values(feedbackWindows).forEach(win => {
            if (win && !win.closed) {
                win.close();
            }
        });
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const fetchMeetingsForSelectedDate = async (date) => {
        const userEmail = localStorage.getItem("userEmail");
        
        try {
            if (date) {
                date.setHours(0, 0, 0, 0);
            } else {
                date = new Date();
                date.setHours(0, 0, 0, 0);
            }
            const formattedSelectedDate = date.toLocaleDateString('en-CA');

            // Fetch shortlisted candidates (Meetings)
            const response = await fetch(`https://demotag.vercel.app/api/panel-candidates-info?l_2_interviewdate=${formattedSelectedDate}&userEmail=${userEmail}`);
            let candidatesData = [];
            if (response.ok) {
                candidatesData = await response.json();
            }

            // Fetch feedback for the selected date
            const feedbackResponse = await fetch(`https://demotag.vercel.app/api/feedback-for-panel-member?interview_date=${formattedSelectedDate}&userEmail=${userEmail}`);
            let feedbacks = [];
            if (feedbackResponse.ok) {
                feedbacks = await feedbackResponse.json();
            }

            // Fetch feedback from the feedback-table API
            const feedbackTableResponse = await fetch(`https://demotag.vercel.app/api/feedback-table?interview_date=${formattedSelectedDate}&userEmail=${userEmail}`);
            let feedbackTableData = [];
            if (feedbackTableResponse.ok) {
                feedbackTableData = await feedbackTableResponse.json();
            }

            setMeetings(candidatesData);
            setFeedbacks([...feedbacks, ...feedbackTableData]);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchFeedbackForCandidate = async (candidateEmail) => {
        try {
            const response = await fetch(`https://demotag.vercel.app/api/candidate-feedback?candidateEmail=${candidateEmail}`);
            if (!response.ok) {
                throw new Error('Failed to fetch feedback');
            }
            const feedbacks = await response.json();
            setFeedbacks(feedbacks);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    return (
        <div className="panel-container">
            <div className="body">
                {showCalendar && (
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <h2>{monthNames[currentMonth]} {currentYear}</h2>
                            <div className="month-year-selectors">
                                <select 
                                    value={currentMonth} 
                                    onChange={handleMonthChange}
                                    id="monthSelector"
                                >
                                    {monthNames.map((month, index) => (
                                        <option key={month} value={index}>{month}</option>
                                    ))}
                                </select>
                                <select 
                                    value={currentYear} 
                                    onChange={handleYearChange}
                                    id="yearSelector"
                                >
                                    {Array.from({length: 600}, (_, i) => 1901 + i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="month-nav-buttons">
                                <button id="prevMonthBtn" onClick={handlePrevMonth}>‹</button>
                                <button id="nextMonthBtn" onClick={handleNextMonth}>›</button>
                            </div>
                        </div>
                        <div className="calendar-grid">
                            {dayNames.map(day => (
                                <div key={day} className="day-header">{day}</div>
                            ))}
                            {renderCalendar(currentMonth, currentYear)}
                        </div>
                    </div>
                )}

                <div className="meetings-container">
                    <h3 className="meeting-date">
                        {selectedDate ? 
                            `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}` : 
                            `${monthNames[currentMonth]} ${currentDate.getDate()}, ${currentYear}`
                        }
                    </h3>
                    
                    {meetings.length > 0 ? (
                        meetings.map((meeting, index) => {
                            const roundDetails = roundDetailsMap[meeting.recruitment_phase] || meeting.recruitment_phase || 'L2 Technical';
                            const formattedDate = new Date(meeting.l_2_interviewdate).toLocaleDateString('en-CA');

                            return (
                                <div key={index} className="meeting-card">
                                    <div className="meeting-header">
                                        <div>
                                            <h4 className="meeting-title">Meeting with - {meeting.candidate_name}</h4>
                                        </div>
                                        <img src="/api/placeholder/40/40" alt="Company logo" className="company-logo" />
                                    </div>
                                    <div className="meeting-details">
                                        <div className="meeting-info">
                                            <div className="meeting-location">Interview Details: {roundDetails}</div>
                                            <div className="meeting-location">Role: {meeting.role}</div>
                                            <div className="meeting-location">Email: {meeting.candidate_email}</div>
                                            <div className="meeting-time">🕐 {formattedDate}, {meeting.l_2_interviewtime}</div>
                                        </div>
                                        <button 
                                            className="btn-teams" 
                                            onClick={() => joinMeetingAndShowFeedback(
                                                meeting.candidate_email, 
                                                meeting.recruitment_phase, 
                                                meeting.meeting_link
                                            )}
                                        >
                                            <img src="teams.png" alt="Teams Logo" className="teams-logo" />
                                            <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer" className="join-link">Join Meeting</a>
                                        </button>
                                    </div>
                                    <div className="buttons">
                                        <button className="btn btn-resume">
                                            <a href={meeting.resume} target="_blank" rel="noopener noreferrer">Candidate Resume</a>
                                        </button>
                                        <button className="btn btn-mocha">
                                            <a href={meeting.imocha_report} target="_blank" rel="noopener noreferrer">iMocha Result</a>
                                        </button>
                                        <button 
                                            className="btn btn-feedback" 
                                            onClick={() => openFeedbackForm(meeting.candidate_email, roundDetails)}
                                        >
                                            Feedback Form
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No meetings scheduled for this date.</p>
                    )}

                    {feedbacks.length > 0 && (
                        <div className="feedback-section">
                            <h3>Previous Feedback</h3>
                            {feedbacks.map((feedback, index) => (
                                <div key={index} className="feedback-card">
                                    <div className="feedback-header">
                                        <h4 className="feedback-title">Feedback for - {feedback.candidate_name}</h4>
                                    </div>
                                    <div className="feedback-details">
                                        <p><b>Position:</b> {feedback.position || 'N/A'}</p>
                                        <p><b>Interview Round:</b> {feedback.round_details || 'L2 Technical'}</p>
                                        <p><b>Email:</b> {feedback.candidate_email}</p>
                                        <p><b>Result:</b> {feedback.result || 'N/A'}</p>
                                        <p><b>Submitted At:</b> {feedback.submitted_at ? new Date(feedback.submitted_at).toLocaleString() : 'N/A'}</p>
                                    </div>
                                    <div className="feedback-content">
                                        <p><strong>Feedback:</strong> {feedback.detailed_feedback || 'No detailed feedback available.'}</p>
                                    </div>
                                    <div className="buttons">
                                        <button 
                                            className="btn btn-feedback" 
                                            onClick={() => openFeedbackForm(feedback.candidate_email, feedback.round_details || 'L2 Technical')}
                                        >
                                            Feedback Form
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showFeedbackModal && (
                <div id="feedbackModal" className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={closeFeedbackModal}>&times;</span>
                        <iframe 
                            id="feedbackFormIframe" 
                            src={feedbackIframeSrc} 
                            title="Feedback Form"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Panel;