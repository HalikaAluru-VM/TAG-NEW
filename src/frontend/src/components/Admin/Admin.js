// admin.js
import React, { useEffect, useState } from 'react';
import './Admin.css';

const Admin = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin-details");
      const data = await response.json();

      if (data.message) {
        console.log(data.message);
        return;
      }

      // This would be handled differently in React with state management
      // The original DOM manipulation is preserved in the equivalent React way
      console.log("Admin details fetched:", data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const showToast = (message, type = "success") => {
    const newToast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
    }, 3000);
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    const checkboxes = document.querySelectorAll(
      "#adminTable td:first-child input[type='checkbox']"
    );

    checkboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  };

  const handleSubmit = async () => {
    const selectedAdmins = [];
    const rows = document.querySelectorAll("#adminTable tbody tr");

    rows.forEach((row) => {
      const selectCheckbox = row.querySelector('td input[type="checkbox"]');
      const ecCheckboxes = [
        row.cells[4]?.querySelector('input[type="checkbox"]'), // Cloud EC
        row.cells[5]?.querySelector('input[type="checkbox"]'), // App EC
        row.cells[6]?.querySelector('input[type="checkbox"]'), // Data EC
        row.cells[7]?.querySelector('input[type="checkbox"]'), // Core EC
      ];

      const statusDropdown = row.querySelector("td .status-select");

      if (selectCheckbox && selectCheckbox.checked) {
        const vamid = row.cells[1]?.textContent.trim(); // VAM ID from the 2nd column
        const ecMapping = [];

        ecCheckboxes.forEach((checkbox, idx) => {
          if (checkbox?.checked) {
            const ecName = ["Cloud EC", "App EC", "Data EC", "Core EC"][idx];
            ecMapping.push(ecName);
          }
        });

        selectedAdmins.push({
          vamid,
          ec_mapping: ecMapping.length > 0 ? ecMapping.join(", ") : null,
          status: statusDropdown.value,
        });
      }
    });

    if (selectedAdmins.length > 0) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/update-ec-mapping",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedAdmins }),
          }
        );

        const result = await response.json();
        if (result.success) {
          showToast("EC mappings updated successfully");
          window.location.reload();
          fetchAdminDetails();
        } else {
          showToast("Error updating EC mappings", "failure");
        }
      } catch (error) {
        showToast(
          "There was an error updating the EC mappings.",
          "failure"
        );
      }
    } else {
      showToast("No selections made!", "failure");
    }
  };

  const handleNewAdminSubmit = async (event) => {
    event.preventDefault();

    const vamId = document.getElementById("vamId").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const ecMapping = Array.from(
      document.querySelectorAll('input[name="ecMapping"]:checked')
    ).map((checkbox) => checkbox.value);
    const status = document.getElementById("status").value;

    const adminData = {
      vamid: vamId,
      name,
      email,
      ec_mapping: ecMapping.join(", "),
      status,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/add-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminData),
        }
      );

      const result = await response.json();

      if (result.success) {
        showToast("User added successfully!");
        window.location.reload();
        setShowPopup(false);
      } else {
        showToast("Error adding user", "failure");
      }
    } catch (error) {
      showToast("There was an error adding the user.", "failure");
    }

    event.target.reset();
  };

  return (
    <div className="admin-management">
      <div className="header">
        <div className="buttons">
          <button id="logoutBtn" onClick={() => { window.location.href = "/"; }}>Logout</button>
        </div>
        <h1>Admin Management Portal</h1>
        <div className="buttons">
          <button id="submitBtn" onClick={handleSubmit}>Submit</button>
          <button id="newBtn" onClick={() => setShowPopup(true)}>New</button>
        </div>
      </div>
      <div className="container">
        <table id="adminTable">
          <thead>
            <tr>
              <th><input type="checkbox" id="selectAllCheckbox" onChange={handleSelectAll} />Select</th>
              <th>VAM ID</th>
              <th>VAM Mail ID</th>
              <th>Name</th>
              <th>Cloud EC</th>
              <th>App EC</th>
              <th>Data EC</th>
              <th>Core EC</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>

      {showPopup && (
        <div id="popupForm" className="popup-overlay" style={{ display: 'flex' }}>
          <div className="popup-content">
            <h2>Add New User</h2>
            <form id="newAdminForm" onSubmit={handleNewAdminSubmit}>
              <label htmlFor="vamId">VAM ID:</label>
              <input type="text" id="vamId" required />
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" required />
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" required />
              <fieldset>
                <legend>EC Mapping:</legend>
                <div style={{ display: "flex", gap: "20px" }}>
                  <label><input type="checkbox" name="ecMapping" value="Cloud EC" /> Cloud EC</label>
                  <label><input type="checkbox" name="ecMapping" value="App EC" /> App EC</label>
                  <label><input type="checkbox" name="ecMapping" value="Data EC" /> Data EC</label>
                  <label><input type="checkbox" name="ecMapping" value="Core EC" /> Core EC</label>
                </div>
              </fieldset>

              <div className="select-dropdown">
                <label htmlFor="status">Status:</label>
                <select id="status" required>
                  <option value="Enable">Enable</option>
                  <option value="Disable">Disable</option>
                </select>
              </div>

              <div className="form-buttons">
                <button type="submit">Submit</button>
                <button type="button" id="closePopupBtn" onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div id="toastContainer">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`toast ${toast.type === "failure" ? "failure" : "success"} show`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;