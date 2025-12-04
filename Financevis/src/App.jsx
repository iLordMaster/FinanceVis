import { Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Pricing from "./pages/Pricing";

import DashboardLayout from "./components/DashboardLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Protected Dashboard Layout Routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Overview />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/profile" element={<ProfileSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
