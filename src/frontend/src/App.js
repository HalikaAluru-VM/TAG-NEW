import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import CandidatesPage from "./components/CandidatesPage/CandidatesPage";
import AppRecruit from "./components/AppRecruit/AppRecruit";
import EcSelection from "./components/EcSelection/EcSelection";
import Panel from "./components/panel/panel";
import PrescreeningForm from "./components/prescreening/prescreeningform";
import L2CloudTechnical from "./components/L2CloudTechnical/L2_cloud_technical";





import "./styles/global.css"; // Import global styles
import Imocha from "./components/Imocha/imocha";
import Finalfeedbackform from "./components/Finalfeedback/Finalfeedbackform";
import Admin from "./components/Admin/Admin";
import L2AppTechnical from "./components/L2AppTechnical/L2_app_technical";
import FeedbackForm from "./components/FeedbackForm/feedback";
import CloudRecruit from "./components/CloudRecruit/cloudrecruit";




const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the Login page */}
        <Route path="/" element={<Login />} />

        {/* Route for the Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Route for the Candidates Page */}
        <Route path="/candidatespage" element={<CandidatesPage />} />
        <Route path="/app-recruit" element={<AppRecruit />} />
        <Route path="/ec-selection" element={<EcSelection />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/prescreeningform" element={<PrescreeningForm />} />
        <Route path="/imocha" element={<Imocha />} />
        <Route path="/L2-CloudTechnical" element={<L2CloudTechnical />} />
        <Route path="/finalfeedbackform" element={<Finalfeedbackform />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/L2-AppTechnical" element={<L2AppTechnical />} />
        <Route path="/feedbackform" element={<FeedbackForm />} />
        <Route path="/cloud-recruit" element={<CloudRecruit />} />


        {/* Add more routes as needed */}
        
      </Routes>
    </Router>
  );
};

export default App;