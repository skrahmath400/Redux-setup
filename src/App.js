// src/App.js

import React from "react";
import { Routes, Route, Router, Navigate } from "react-router-dom"; // ← Your original import (kept unchanged)
import PermissionGuard from "./components/PermissionGuard";

// Your components — 100% UNCHANGED
// import TokenTestComponent from "./components/TokenTestComponent";
import LoginForm from "./components/LoginForm"; 
import ReduxState from "./components/ReduxState"; // optional

// Required for routing
import Unauthorized from "./employee/Unauthorized";
// import Layout from "./components/Layout";
import ProtectedApp from "./components/ProtectedRoute";
// import { routeConfig } from "./config/routeconfig";
// import { useSelector } from "react-redux";
import Employeelandingpage from "./employee/Employeelandingpage";
import skilltest from "./employee/SkillTest";
import SkillTestTable from "./employee/SkillTest";
import SkillTestProfileCard from "./employee/SkillTestProfileCard";
import BasicInfoForm from "./employee/BasicInfoForm";
import AddressInfoForm from "./employee/AddressInfoForm";
import OnboardingTable from "./employee/OnboardingTable";
import WorkingInfoOverview from "./employee/WorkingInfoOverview";
import WorkingInfoOverviewCO from "./employee/WorkingInfoOverviewCO";
import ProfileBasicInfo from "./employee/ProfileBasicInfo";
import SkillTest from "./employee/SkillTest";

// ← Your comment kept

// Simple Layout (you already had this)
const Layout = ({ children }) => (
  <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
    <header style={{
      backgroundColor: "#2c3e50",
      color: "white",
      padding: "20px",
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "600"
    }}>
      Employee Portal
    </header>
    <main style={{ padding: "20px" }}>
      {children}
    </main>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ permissionKey, children }) => (
  <PermissionGuard permissionKey={permissionKey}>
    <Layout>{children}</Layout>
  </PermissionGuard>
);

function App() {
  // Simple auth check using your token
  const isAuthenticated = !!localStorage.getItem("jwtToken");

  return (
    // REMOVED <Router> HERE — it's already in index.js
    <Routes>
      {/* Public Route: Login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/employee" replace /> : 
        
      <> <LoginForm /> <ReduxState/></>  
      }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/employee" : "/login"} replace />}
      />

      {/* Employee Portal - All protected routes */}
      <Route path="/employee">
        {/* Landing Page */}
        <Route
          index
          element={
            <ProtectedRoute permissionKey="EMPLOYEE_LANDING_PAGE">
              <Employeelandingpage /> {/* Using your imported component */}
            </ProtectedRoute>
          }
        />

        {/* HR Onboarding Forms */}
        <Route
          path="hr-employee-onboarding/skilltest"
          element={
            <ProtectedRoute permissionKey="ONBOARD_NEW_EMPLOYEE_SKILL_TEST_TEACH">
              <SkillTest /> {/* Using your SkillTest component */}
            </ProtectedRoute>
          }
        />

        <Route
          path="hr-new-employee-onboarding/basic-info"
          element={
            <ProtectedRoute permissionKey="ONBOARD_NEW_EMPLOYEE_NON_TEACH_BASIC_INFO_FORM">
              <BasicInfoForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="hr-new-employee-onboarding/address-info"
          element={
            <ProtectedRoute permissionKey="ONBOARD_NEW_EMPLOYEE_NON_TEACH_ADDRESS_INFO_FORM">
              <AddressInfoForm />
            </ProtectedRoute>
          }
        />

        {/* HR Review Tables */}
        <Route
          path="hr-review/onboarding"
          element={
            <ProtectedRoute permissionKey="ONBOARDING_STATUS_TABLE_ONBOARDING_TABLE">
              <OnboardingTable />
            </ProtectedRoute>
          }
        />

        <Route
          path="hr-review/skillTest"
          element={
            <ProtectedRoute permissionKey="ONBOARDING_STATUS_TABLE_SKILL_TEST_TABLE">
              <SkillTestTable />
            </ProtectedRoute>
          }
        />

        <Route
          path="hr-review/:employeeId/skill-test"
          element={
            <ProtectedRoute permissionKey="ONBOARDING_STATUS_SKILL_TEST_PROFILE_CARD">
              <SkillTestProfileCard />
            </ProtectedRoute>
          }
        />

        {/* DO Review Screens */}
        <Route
          path="do-review/:employeeId/onboarding/working-info"
          element={
            <ProtectedRoute permissionKey="ONBOARDING_STATUS_DO_SCREENS_OVERVIEWS_WORKING_INFO">
              <WorkingInfoOverview />
            </ProtectedRoute>
          }
        />

        {/* CO Review Screens */}
        <Route
          path="co-review/:employeeId/onboarding/working-info"
          element={
            <ProtectedRoute permissionKey="ONBOARDING_STATUS_CO_SCREENS_OVERVIEWS_WORKING_INFO">
              <WorkingInfoOverviewCO />
            </ProtectedRoute>
          }
        />

        {/* Profile Overview */}
        <Route
          path="profile-overview/:employeeId/basic-info"
          element={
            <ProtectedRoute permissionKey="POV_EMP_BASIC_INFO">
              <ProfileBasicInfo />
            </ProtectedRoute>
          }
        />

        {/* Fallback for unknown /employee/* routes */}
        <Route path="*" element={<Navigate to="/employee" replace />} />
      </Route>

      {/* Global fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    // </Router> REMOVED — do not wrap here
  );
}

export default App;