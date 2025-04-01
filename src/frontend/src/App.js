import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import "./styles/global.css"; // Import global styles
import Dashboard from "./components/Dashboard/Dashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;




// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./components/Login/Login";
// import Dashboard from "./components/Dashboard/Dashboard";
// import EcSelection from "./components/EcSelection/EcSelection";
// import AppRecruit from "./components/AppRecruit/AppRecruit";
// import Layout from "./components/common/Layout";
// import "./styles/global.css"; // Import global styles

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route
//           path="/dashboard"
//           element={
//             <Layout>
//               <Dashboard />
//             </Layout>
//           }
//         />
//         <Route
//           path="/ec-selection"
//           element={
//             <Layout>
//               <EcSelection />
//             </Layout>
//           }
//         />
//         <Route
//           path="/app-recruit"
//           element={
//             <Layout>
//               <AppRecruit />
//             </Layout>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;