import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import EcSelection from "./components/EcSelection/EcSelection";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ec-selection" element={<EcSelection />} />

        
      </Routes>
    </Router>
  );
};

export default App;
