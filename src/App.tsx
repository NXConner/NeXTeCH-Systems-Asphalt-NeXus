import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "./hooks/use-mobile";
import { MobileOptimizedLayout } from "./components/mobile/MobileOptimizedLayout";
import MiniMapWidget from "@/components/ui/MiniMapWidget";
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import FleetManagement from './pages/FleetManagement';
import MaintenanceTracking from './pages/MaintenanceTracking';
import VendorManagement from './pages/VendorManagement';
import EnhancedMaintenanceTracking from './pages/EnhancedMaintenanceTracking';
import Jobs from './pages/Jobs';
import Estimates from './pages/Estimates';
import RealTimeGPS from './pages/RealTimeGPS';
import AdvancedMapping from './pages/AdvancedMapping';
import EmployeeManagement from './pages/EmployeeManagement';
import EmployeeManagementEnhanced from './pages/EmployeeManagementEnhanced';
import InventoryManagementEnhanced from './pages/InventoryManagementEnhanced';
import TimeTracking from './pages/TimeTracking';
import Scheduling from './pages/Scheduling';
import Invoices from './pages/Invoices';
import InvoiceManagement from './pages/InvoiceManagement';
import CRM from './pages/CRM';
import InventoryManagement from './pages/InventoryManagement';
import SafetyCompliance from './pages/SafetyCompliance';
import DocumentManagement from './pages/DocumentManagement';
import FinancialManagement from './pages/FinancialManagement';
import Settings from './pages/Settings';
import EstimatesManagement from './pages/EstimatesManagement';
import AccountingPlatform from './pages/AccountingPlatform';
import NotFound from './pages/NotFound';
import PredictiveAnalytics from './components/analytics/PredictiveAnalytics';
import CustomReportBuilder from './components/reports/CustomReportBuilder';
import CustomerPortal from './components/customer/CustomerPortal';
import InventoryAudit from './components/inventory/InventoryAudit';
import InspectionChecklist from './components/quality/InspectionChecklist';
import IntegrationSettings from './components/integrations/IntegrationSettings';
import OnboardingWalkthrough from './components/onboarding/OnboardingWalkthrough';
import ESignatureWorkflow from './components/documents/ESignatureWorkflow';
import ResourcePage from './pages/Resource';
import GanttCalendar from './components/scheduling/GanttCalendar';
import TooltipHelp from './components/help/TooltipHelp';
import MicroInteractions from './components/ui/MicroInteractions';
import Landing from './pages/Landing';
import LoginForm from './components/LoginForm';
import UnifiedMapInterface from './components/UnifiedMapInterface';
import ThemeSelector from './components/ui/theme-selector';
import AchievementsPage from './pages/Achievements';
import BadgesPage from './pages/Badges';
import RewardsPage from './pages/Rewards';
import LeaderboardPage from './pages/Leaderboard';
import FeedbackPage from './pages/Feedback';
import ForumPage from './pages/Forum';
import SignUp from './pages/SignUp';
import './App.css';

function App() {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsible="offcanvas">
        <Navigation />
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center h-16 px-4 border-b bg-card">
          <SidebarTrigger className="mr-4" />
          <span className="font-bold text-xl ml-4">Asphalt-NexTech_Systems</span>
        </header>
        <main className="flex-1">
          <MiniMapWidget />
          {isMobile ? (
            <MobileOptimizedLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/landing" replace />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/fleet" element={<ProtectedRoute><FleetManagement /></ProtectedRoute>} />
                <Route path="/maintenance" element={<ProtectedRoute><MaintenanceTracking /></ProtectedRoute>} />
                <Route path="/vendors" element={<ProtectedRoute><VendorManagement /></ProtectedRoute>} />
                <Route path="/enhanced-maintenance" element={<ProtectedRoute><EnhancedMaintenanceTracking /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                <Route path="/estimates" element={<ProtectedRoute><Estimates /></ProtectedRoute>} />
                <Route path="/gps" element={<ProtectedRoute><RealTimeGPS /></ProtectedRoute>} />
                <Route path="/mapping" element={<ProtectedRoute><AdvancedMapping /></ProtectedRoute>} />
                <Route path="/employee-management" element={<ProtectedRoute><EmployeeManagement /></ProtectedRoute>} />
                <Route path="/employee-management-enhanced" element={<ProtectedRoute><EmployeeManagementEnhanced /></ProtectedRoute>} />
                <Route path="/inventory-enhanced" element={<ProtectedRoute><InventoryManagementEnhanced /></ProtectedRoute>} />
                <Route path="/time-tracking" element={<ProtectedRoute><TimeTracking /></ProtectedRoute>} />
                <Route path="/scheduling" element={<ProtectedRoute><Scheduling /></ProtectedRoute>} />
                <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
                <Route path="/invoice-management" element={<ProtectedRoute><InvoiceManagement /></ProtectedRoute>} />
                <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><InventoryManagement /></ProtectedRoute>} />
                <Route path="/safety" element={<ProtectedRoute><SafetyCompliance /></ProtectedRoute>} />
                <Route path="/documents" element={<ProtectedRoute><DocumentManagement /></ProtectedRoute>} />
                <Route path="/financial" element={<ProtectedRoute><FinancialManagement /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/estimates-management" element={<ProtectedRoute><EstimatesManagement /></ProtectedRoute>} />
                <Route path="/accounting" element={<ProtectedRoute><AccountingPlatform /></ProtectedRoute>} />
                <Route path="/analytics" element={<PredictiveAnalytics />} />
                <Route path="/reports" element={<CustomReportBuilder />} />
                <Route path="/customer-portal" element={<CustomerPortal />} />
                <Route path="/inventory" element={<InventoryAudit />} />
                <Route path="/quality" element={<InspectionChecklist />} />
                <Route path="/integrations" element={<IntegrationSettings />} />
                <Route path="/onboarding" element={<OnboardingWalkthrough />} />
                <Route path="/esignature" element={<ESignatureWorkflow />} />
                <Route path="/resource" element={<ProtectedRoute><ResourcePage /></ProtectedRoute>} />
                <Route path="/scheduling" element={<GanttCalendar />} />
                <Route path="/help" element={<TooltipHelp text='Help and onboarding' />} />
                <Route path="/micro" element={<MicroInteractions />} />
                <Route path="/map" element={<UnifiedMapInterface />} />
                <Route path="/theme" element={<ThemeSelector />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/badges" element={<BadgesPage />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/forum" element={<ForumPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MobileOptimizedLayout>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/landing" replace />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/fleet" element={<ProtectedRoute><FleetManagement /></ProtectedRoute>} />
              <Route path="/maintenance" element={<ProtectedRoute><MaintenanceTracking /></ProtectedRoute>} />
              <Route path="/vendors" element={<ProtectedRoute><VendorManagement /></ProtectedRoute>} />
              <Route path="/enhanced-maintenance" element={<ProtectedRoute><EnhancedMaintenanceTracking /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
              <Route path="/estimates" element={<ProtectedRoute><Estimates /></ProtectedRoute>} />
              <Route path="/gps" element={<ProtectedRoute><RealTimeGPS /></ProtectedRoute>} />
              <Route path="/mapping" element={<ProtectedRoute><AdvancedMapping /></ProtectedRoute>} />
              <Route path="/employee-management" element={<ProtectedRoute><EmployeeManagement /></ProtectedRoute>} />
              <Route path="/employee-management-enhanced" element={<ProtectedRoute><EmployeeManagementEnhanced /></ProtectedRoute>} />
              <Route path="/inventory-enhanced" element={<ProtectedRoute><InventoryManagementEnhanced /></ProtectedRoute>} />
              <Route path="/time-tracking" element={<ProtectedRoute><TimeTracking /></ProtectedRoute>} />
              <Route path="/scheduling" element={<ProtectedRoute><Scheduling /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/invoice-management" element={<ProtectedRoute><InvoiceManagement /></ProtectedRoute>} />
              <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><InventoryManagement /></ProtectedRoute>} />
              <Route path="/safety" element={<ProtectedRoute><SafetyCompliance /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><DocumentManagement /></ProtectedRoute>} />
              <Route path="/financial" element={<ProtectedRoute><FinancialManagement /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/estimates-management" element={<ProtectedRoute><EstimatesManagement /></ProtectedRoute>} />
              <Route path="/accounting" element={<ProtectedRoute><AccountingPlatform /></ProtectedRoute>} />
              <Route path="/analytics" element={<PredictiveAnalytics />} />
              <Route path="/reports" element={<CustomReportBuilder />} />
              <Route path="/customer-portal" element={<CustomerPortal />} />
              <Route path="/inventory" element={<InventoryAudit />} />
              <Route path="/quality" element={<InspectionChecklist />} />
              <Route path="/integrations" element={<IntegrationSettings />} />
              <Route path="/onboarding" element={<OnboardingWalkthrough />} />
              <Route path="/esignature" element={<ESignatureWorkflow />} />
              <Route path="/resource" element={<ProtectedRoute><ResourcePage /></ProtectedRoute>} />
              <Route path="/scheduling" element={<GanttCalendar />} />
              <Route path="/help" element={<TooltipHelp text='Help and onboarding' />} />
              <Route path="/micro" element={<MicroInteractions />} />
              <Route path="/map" element={<UnifiedMapInterface />} />
              <Route path="/theme" element={<ThemeSelector />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/badges" element={<BadgesPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
