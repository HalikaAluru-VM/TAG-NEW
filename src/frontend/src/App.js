import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import "./styles/global.css"; // Import global styles
import Dashboard from "./components/Dashboard/Dashboard";
import EcSelection from "./components/EcSelection/EcSelection";
import AppRecruit from "./components/AppRecruit/AppRecruit"; // Import AppRecruit

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ec-selection" element={<EcSelection />} />
        <Route path="/app-recruit" element={<AppRecruit />} /> {/* New Route */}
      </Routes>
    </Router>
  );
};

export default App;