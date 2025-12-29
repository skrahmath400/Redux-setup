import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

// Import all your page components
import Employeelandingpage from "../employee/Employeelandingpage";
import SkillTest from "../employee/SkillTest";
// import BasicInfo from "../pages/BasicInfo";
// import AddressInfo from "../pages/AddressInfo";
// import FamilyInfo from "../pages/FamilyInfo";
// // ... import all other page components you have

// Object-based config for O(1) lookup — this is the ONLY place you add screens
const screenConfig = {
  screen10: { path: "/employee", component: Employeelandingpage, name: "Employee Landing" },
  screen11: { path: "/employee/hr-employee-onboarding/skilltest", component: SkillTest, name: "Skill Test" },
//   screen12: { path: "/employee/hr-new-employee-onboarding/basic-info", component: BasicInfo, name: "Basic Info" },
//   screen13: { path: "/employee/hr-new-employee-onboarding/address-info", component: AddressInfo, name: "Address Info" },
//   screen14: { path: "/employee/hr-new-employee-onboarding/family-info", component: FamilyInfo, name: "Family Info" },
  // Add all your 40+ screens here like this:
  // screen15: { path: "/your-path", component: YourComponent, name: "Screen Name" },
};

const ProtectedApp = () => {
  const { permissions } = useSelector((state) => state.authorization);

  // Dynamically build visible screens from permissions
  const visibleScreens = Object.keys(permissions)
    .filter((key) => permissions[key] !== "none" && screenConfig[key]) // only if defined and allowed
    .map((key) => ({
      key,
      ...screenConfig[key],
    }))
    .sort((a, b) => a.key.localeCompare(b.key)); // optional: sort by screen number

  // First allowed path for default redirect
  const firstPath = visibleScreens[0]?.path || "/unauthorized";

  return (
    <Routes>
      {/* Redirect root (/) to first allowed screen */}
      <Route index element={<Navigate to={firstPath} replace />} />

      {/* Dynamically generate routes from permissions */}
      {visibleScreens.map((screen) => (
        <Route
          key={screen.key}
          path={screen.path}
          element={screen.component ? <screen.component /> : <div>{screen.name} (Missing Component)</div>}
        />
      ))}

      {/* Fallback: redirect unknown paths to first allowed screen */}
      <Route path="*" element={<Navigate to={firstPath} replace />} />
    </Routes>
  );
};

export default ProtectedApp;