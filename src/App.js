// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./Logincomponents/LoginForm";
import ReduxState from "./components/ReduxState";
import Unauthorized from "./employee/Unauthorized";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<><LoginForm /> <ReduxState/> </>} />
       <Route path="/unauthorized" element={<Unauthorized />} />
      {/* Protected routes from your config */}
      {ROUTES.map(({ path, element, screenKey }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute screenKey={screenKey}>{element}</ProtectedRoute>}
        />
      ))}

      {/* Fallback: redirect to dashboard if logged in, else login */}
<Route path="/" element={<Navigate to="/employee" replace />} />
<Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;