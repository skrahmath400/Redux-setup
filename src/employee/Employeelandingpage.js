import React from "react";
import { useNavigate } from "react-router-dom";

function Employeelandingpage() {
 // Example: Inside EmployeeLandingPage.js (or any component)

  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to Employee Landing Page</h1>
      <p>This is the main dashboard for employees.</p>

      {/* TEST NAVIGATION BUTTONS - Remove later when sidebar is ready */}
      <div style={{ marginTop: "40px", padding: "20px", background: "#f0f0f0", borderRadius: "8px" }}>
        <h3>Quick Navigation (For Testing Permissions)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button onClick={() => navigate("/employee")} style={buttonStyle}>
            Dashboard
          </button>
          <button onClick={() => navigate("/employee/hr-new-employee-onboarding/basic-info")} style={buttonStyle}>
            Basic Info Form
          </button>
          <button onClick={() => navigate("/employee/hr-new-employee-onboarding/address-info")} style={buttonStyle}>
            Address Info Form
          </button>
          <button onClick={() => navigate("/employee/hr-employee-onboarding/skilltest")} style={buttonStyle}>
            Skill Test
          </button>
          <button onClick={() => navigate("/employee/hr-employee-onboarding/skilltest/profile")} style={buttonStyle}>
            Skill Test Profile
          </button>
          <button onClick={() => navigate("/employee/onboarding-table")} style={buttonStyle}>
            Onboarding Table
          </button>
          <button onClick={() => navigate("/employee/working-info-overview")} style={buttonStyle}>
            Working Info Overview
          </button>
          {/* Add more as you build them */}
        </div>
      </div>
    </div>
  );
};

// Simple button style
const buttonStyle = {
  padding: "10px 16px",
  background: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

       

export default Employeelandingpage;