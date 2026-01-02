// src/constants/routes.js
import Employeelandingpage from "../employee/Employeelandingpage";
import BasicInfoForm from "../employee/BasicInfoForm";
import AddressInfoForm from "../employee/AddressInfoForm";
import SkillTest from "../employee/SkillTest";
import SkillTestProfileCard from "../employee/SkillTestProfileCard";
import OnboardingTable from "../employee/OnboardingTable";
import ProfileBasicInfo from "../employee/ProfileBasicInfo";
import WorkingInfoOverview from "../employee/WorkingInfoOverview";
import Unauthorized from "../employee/Unauthorized";
import ReduxState from "../components/ReduxState"; // for debugging

export const ROUTES = [
  {
    path: "/employee",
    element: <Employeelandingpage />,
    screenKey: "EMPLOYEE_LANDING_PAGE", // This one is correct
    title: "Employee Dashboard",
  },
  {
    path: "/employee/hr-new-employee-onboarding/basic-info",
    element: <BasicInfoForm />,
    screenKey: "ONBOARD_NEW_EMPLOYEE_NON_TEACH_BASIC_INFO_FORM", // ← FIXED
    title: "Basic Info",
  },
  {
    path: "/employee/hr-new-employee-onboarding/address-info",
    element: <AddressInfoForm />,
    screenKey: "ONBOARD_NEW_EMPLOYEE_NON_TEACH_ADDRESS_INFO_FORM", // ← FIXED
    title: "Address Info",
  },
  {
    path: "/employee/hr-employee-onboarding/skilltest",
    element: <SkillTest />,
    screenKey: "ONBOARD_NEW_EMPLOYEE_SKILL_TEST_TEACH", // ← Check if this exists in Redux
    title: "Skill Test",
  },
  {
    path: "/employee/hr-employee-onboarding/skilltest/profile",
    element: <SkillTestProfileCard />,
    screenKey: "ONBOARDING_STATUS_SKILL_TEST_PROFILE_CARD", // ← FIXED
    title: "Skill Test Profile",
  },
  {
    path: "/employee/onboarding-table",
    element: <OnboardingTable />,
    screenKey: "ONBOARDING_STATUS_TABLE_ONBOARDING_TABLE", // ← FIXED
    title: "Onboarding Table",
  },
  {
    path: "/employee/profile/basic-info",
    element: <ProfileBasicInfo />,
    screenKey: "ONBOARDING_STATUS_DO_SCREENS_OVERVIEWS_ACCOUNT_INFO", // or find correct one
    title: "Profile - Basic Info",
  },
  {
    path: "/employee/working-info-overview",
    element: <WorkingInfoOverview />,
    screenKey: "ONBOARDING_STATUS_DO_SCREENS_OVERVIEWS_WORKING_INFO", // ← FIXED
    title: "Working Info Overview",
  },
  {
    path: "/unauthorized",
    element: (
      <>
        <Unauthorized />
        <ReduxState /> {/* Remove this later, just for debugging */}
      </>
    ),
    screenKey: null,
  },
];