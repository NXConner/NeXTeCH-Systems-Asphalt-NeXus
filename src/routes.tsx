import { RouteObject } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
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
import LeadPipeline from './components/crm/LeadPipeline';
import CustomerPortal from './components/customer/CustomerPortal';
import InventoryAudit from './components/inventory/InventoryAudit';
import InspectionChecklist from './components/quality/InspectionChecklist';
import IntegrationSettings from './components/integrations/IntegrationSettings';
import QuickAdd from './components/mobile/QuickAdd';
import OnboardingWalkthrough from './components/onboarding/OnboardingWalkthrough';
import ESignatureWorkflow from './components/documents/ESignatureWorkflow';
import ResourceAllocation from './components/resource/ResourceAllocation';
import GanttCalendar from './components/scheduling/GanttCalendar';
import TooltipHelp from './components/help/TooltipHelp';
import MicroInteractions from './components/ui/MicroInteractions';
import Landing from './pages/Landing';
import LoginForm from './components/LoginForm';
import SignUp from './pages/SignUp';
import UnifiedMapInterface from './components/UnifiedMapInterface';
import ThemeSelector from './components/ui/theme-selector';
import AchievementsPage from './pages/Achievements';
import BadgesPage from './pages/Badges';
import RewardsPage from './pages/Rewards';
import LeaderboardPage from './pages/Leaderboard';
import FeedbackPage from './pages/Feedback';
import ForumPage from './pages/Forum';
import ResourcePage from './pages/Resource';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/fleet',
    element: (
      <ProtectedRoute>
        <FleetManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/maintenance',
    element: (
      <ProtectedRoute>
        <MaintenanceTracking />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendors',
    element: (
      <ProtectedRoute>
        <VendorManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/enhanced-maintenance',
    element: (
      <ProtectedRoute>
        <EnhancedMaintenanceTracking />
      </ProtectedRoute>
    ),
  },
  {
    path: '/jobs',
    element: (
      <ProtectedRoute>
        <Jobs />
      </ProtectedRoute>
    ),
  },
  {
    path: '/estimates',
    element: (
      <ProtectedRoute>
        <Estimates />
      </ProtectedRoute>
    ),
  },
  {
    path: '/gps',
    element: (
      <ProtectedRoute>
        <RealTimeGPS />
      </ProtectedRoute>
    ),
  },
  {
    path: '/mapping',
    element: (
      <ProtectedRoute>
        <AdvancedMapping />
      </ProtectedRoute>
    ),
  },
  {
    path: '/employee-management',
    element: (
      <ProtectedRoute>
        <EmployeeManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/employee-management-enhanced',
    element: (
      <ProtectedRoute>
        <EmployeeManagementEnhanced />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventory-enhanced',
    element: (
      <ProtectedRoute>
        <InventoryManagementEnhanced />
      </ProtectedRoute>
    ),
  },
  {
    path: '/time-tracking',
    element: (
      <ProtectedRoute>
        <TimeTracking />
      </ProtectedRoute>
    ),
  },
  {
    path: '/scheduling',
    element: (
      <ProtectedRoute>
        <Scheduling />
      </ProtectedRoute>
    ),
  },
  {
    path: '/invoices',
    element: (
      <ProtectedRoute>
        <Invoices />
      </ProtectedRoute>
    ),
  },
  {
    path: '/invoice-management',
    element: (
      <ProtectedRoute>
        <InvoiceManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/crm',
    element: (
      <ProtectedRoute>
        <CRM />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventory',
    element: (
      <ProtectedRoute>
        <InventoryManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/safety',
    element: (
      <ProtectedRoute>
        <SafetyCompliance />
      </ProtectedRoute>
    ),
  },
  {
    path: '/documents',
    element: (
      <ProtectedRoute>
        <DocumentManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/financial',
    element: (
      <ProtectedRoute>
        <FinancialManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/estimates-management',
    element: (
      <ProtectedRoute>
        <EstimatesManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting',
    element: (
      <ProtectedRoute>
        <AccountingPlatform />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: <PredictiveAnalytics />,
  },
  {
    path: '/reports',
    element: <CustomReportBuilder />,
  },
  {
    path: '/customer-portal',
    element: <CustomerPortal />,
  },
  {
    path: '/inventory',
    element: <InventoryAudit />,
  },
  {
    path: '/quality',
    element: <InspectionChecklist />,
  },
  {
    path: '/integrations',
    element: <IntegrationSettings />,
  },
  {
    path: '/onboarding',
    element: <OnboardingWalkthrough />,
  },
  {
    path: '/esignature',
    element: <ESignatureWorkflow />,
  },
  {
    path: '/resource',
    element: (
      <ProtectedRoute>
        <ResourcePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/scheduling',
    element: <GanttCalendar />,
  },
  {
    path: '/help',
    element: <TooltipHelp text='Help and onboarding' />,
  },
  {
    path: '/micro',
    element: <MicroInteractions />,
  },
  {
    path: '/landing',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/map',
    element: <UnifiedMapInterface />,
  },
  {
    path: '/theme',
    element: <ThemeSelector />,
  },
  {
    path: '/achievements',
    element: <AchievementsPage />,
  },
  {
    path: '/badges',
    element: <BadgesPage />,
  },
  {
    path: '/rewards',
    element: <RewardsPage />,
  },
  {
    path: '/leaderboard',
    element: <LeaderboardPage />,
  },
  {
    path: '/feedback',
    element: <FeedbackPage />,
  },
  {
    path: '/forum',
    element: <ForumPage />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]; 