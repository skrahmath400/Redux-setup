// components/OnboardingNav.js (example for hr-new-employee-onboarding)
import { useLocation, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';
import BasicInfoForm from './BasicInfoForm';
import AddressInfoForm from './AddressInfoForm';
// ... import all subs

const OnboardingNav = () => {
  const location = useLocation();

  // Get permissions for subs
  const basicPerms = usePermission('ONBOARD_NEW_EMPLOYEE_NON_TEACH_BASIC_INFO_FORM');
  const addressPerms = usePermission('ONBOARD_NEW_EMPLOYEE_NON_TEACH_ADDRESS_INFO_FORM');
  // ... for all subs

  // Filter visible tabs
  const subTabs = [
    { label: 'Basic Info', path: 'basic-info', canView: basicPerms.canView, canCreate: basicPerms.canCreate },
    { label: 'Address Info', path: 'address-info', canView: addressPerms.canView, canCreate: addressPerms.canCreate },
    // ... add all onboarding subs
  ].filter(tab => tab.canView);

  if (subTabs.length === 0) {
    return <div>No access to onboarding forms.</div>;
  }

  const firstVisiblePath = subTabs[0].path;

  return (
    <div>
      <nav>
        <ul>
          {subTabs.map(tab => (
            <li key={tab.path}>
              <NavLink to={tab.path}>{tab.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Routes>
        <Route index element={<Navigate to={firstVisiblePath} replace />} />
        <Route path="basic-info" element={<BasicInfoForm />} />
        <Route path="address-info" element={<AddressInfoForm />} />
        {/* ... add all subs */}
        <Route path="*" element={<Navigate to={firstVisiblePath} replace />} />
      </Routes>

      {/* Example: Create button if canCreate on current tab */}
      {subTabs.find(tab => location.pathname.includes(tab.path))?.canCreate && <button>Create New</button>}
    </div>
  );
};

export default OnboardingNav;