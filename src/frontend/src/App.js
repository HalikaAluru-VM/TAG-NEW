import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import CandidatesPage from "./components/CandidatesPage/CandidatesPage";
import "./styles/global.css"; // Import global styles

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
      </Routes>
    </Router>
  );
};

export default App;