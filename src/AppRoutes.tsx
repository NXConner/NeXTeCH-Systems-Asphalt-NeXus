import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import AdvancedFleetDashboard from "./pages/AdvancedFleetDashboard";
import EstimatesManagement from "./pages/EstimatesManagement";
import CustomerManagement from "./pages/CustomerManagement";
import SignUp from "./pages/SignUp";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/fleet" element={<AdvancedFleetDashboard />} />
      <Route path="/estimates" element={<EstimatesManagement />} />
      <Route path="/customer-management" element={<CustomerManagement />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default AppRoutes;
