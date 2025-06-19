import React, { useState } from "react";
import "./EcSelection.css";

const EcSelection = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Modified navigateTo to support query params
  const navigateTo = (url, ecName) => {
    if (ecName) {
      window.location.href = `${url}?ec=${encodeURIComponent(ecName)}`;
    } else {
      window.location.href = url;
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div className="backbutton" onClick={() => navigateTo("index.html")}>
        <i className="fas fa-arrow-left"></i>
      </div>

      {/* Cards Section */}
      <div className="card-container">
        <div
          className="card"
          onClick={() => navigateTo("cloudrecruit.html", "Cloud EC")}
        >
          <i className="fas fa-cloud card-icon"></i>
          <div className="card-title">Cloud EC</div>
        </div>
        <div
          className="card"
          onClick={() => navigateTo("app-recruit", "App EC")}
        >
          <i className="fas fa-cogs card-icon"></i>
          <div className="card-title">App EC</div>
        </div>
        <div
          className="card"
          onClick={() => navigateTo("datarecruit.html", "Data EC")}
        >
          <i className="fas fa-database card-icon"></i>
          <div className="card-title">Data EC</div>
        </div>
        <div
          className="card"
          onClick={() => navigateTo("corerecruit.html", "Core EC")}
        >
          <i className="fas fa-microchip card-icon"></i>
          <div className="card-title">Core EC</div>
        </div>
      </div>
    </div>
  );
};

export default EcSelection;
