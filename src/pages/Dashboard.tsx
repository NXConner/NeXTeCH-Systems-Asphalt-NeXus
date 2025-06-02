import StatsGrid from "@/components/dashboard/StatsGrid";
import { EmployeeTrackingMap } from "@/components/dashboard/EmployeeTrackingMap";
import { UnifiedReports } from "@/components/dashboard/UnifiedReports";
import { FleetFocusIntegration } from "@/components/fleet/FleetFocusIntegration";
import { DashboardThemeIntegration } from "@/components/ui/dashboard-theme-integration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardFleet } from "@/components/dashboard/DashboardFleet";
import { DashboardOptimization } from "@/components/dashboard/DashboardOptimization";
import { EnhancedDashboard } from "@/components/dashboard/EnhancedDashboard";
import { MobileDashboard } from "@/components/mobile/MobileDashboard";
import { ObjectivesWidget } from "@/components/dashboard/ObjectivesWidget";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Users } from "lucide-react";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useState, useEffect } from 'react';
import ARProjection from '../components/ui/ARProjection';
import AchievementBadge from '../components/ui/AchievementBadge';
import SafetyAlert from '../components/ui/SafetyAlert';
import { useTheme } from '../components/ThemeProvider';
import { SealcoatingSpreadsheetApp } from '../components/estimates/SealcoatingSpreadsheetApp';
import { PopoutCalculator } from '../components/ui/PopoutCalculator';
import UnifiedMapInterface from "@/components/UnifiedMapInterface";
import AdvancedMapping from "./AdvancedMapping";
import ThemeColorPicker from "@/components/ui/ThemeColorPicker";
import PayrollDashboard from "@/components/payroll/PayrollDashboard";
import ReceiptUpload from "@/components/receipts/ReceiptUpload";
import ProgressChecklist, { useChecklistState } from "@/components/gamification/ProgressChecklist";
import ProgressCounter from "@/components/gamification/ProgressCounter";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { hasPermission } = useRoleAccess();
  const [arMode, setArMode] = useState(false);
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [achievements, setAchievements] = useState([
    { name: 'Pressure Washing Wizard', tier: 'gold', progress: 80, count: 40000 },
    { name: 'Sealcoat Star', tier: 'silver', progress: 60, count: 12 },
    { name: 'Crack Crusher', tier: 'bronze', progress: 25, count: 250 },
  ]);
  const [achievementNotification, setAchievementNotification] = useState<string|null>(null);
  const [checklist, setChecklist, completed] = useChecklistState();

  useEffect(() => {
    achievements.forEach(a => {
      if (a.progress === 100) setAchievementNotification(`${a.name} unlocked!`);
    });
  }, [achievements]);

  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-4">
        <MobileDashboard />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="min-h-screen bg-white container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Fleet Asphalt Nexus</h1>
        <button
          className="m-4 p-2 bg-[var(--accent-orange)] text-white rounded"
          onClick={() => setArMode(!arMode)}
        >
          {arMode ? 'Exit AR Mode' : 'Enter AR Mode'}
        </button>
        {arMode ? (
          <>
            <ARProjection
              type="measurement"
              content="Area: 500 sq ft, Cost: $5,000"
              position={{ lat: 100, lng: 200 }}
            />
            <ARProjection
              type="task"
              content="John: Prep Surface"
              position={{ lat: 150, lng: 250 }}
            />
            <ARProjection
              type="alert"
              content="Low Gravel: Order Now"
              position={{ lat: 120, lng: 220 }}
            />
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <AchievementBadge name="Pressure Washing Wizard" tier="gold" />
            <SafetyAlert type="osha" message="Wear heat-resistant gloves for crack filling" />
            <SafetyAlert type="deq" message="Use silt fence to prevent sealcoat runoff" />
          </div>
        )}
        <div className="mb-8">
          <p className="text-muted-foreground mt-2">
            Complete overview of your asphalt business operations and fleet management
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-8">
          <StatsGrid />
        </div>
        <div className="mt-8">
          <ObjectivesWidget />
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8">
          <div>
            <ProgressCounter checklist={checklist} />
          </div>
          <div>
            <ProgressChecklist />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8">
          {hasPermission('canEditEmployees') && (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-medium">Advanced Employee Management</h3>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Comprehensive HR solution with payroll, benefits administration, performance reviews, and more.
                  </p>
                  <div className="mt-4">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate('/employee-management')}
                    >
                      Explore Employee Management
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {hasPermission('canViewFinancials') && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-medium">Business Accounting Platform</h3>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Complete financial management with invoicing, expense tracking, financial reports, and accounting tools.
                  </p>
                  <div className="mt-4">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => navigate('/accounting')}
                    >
                      Access Accounting Platform
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8">
          <EnhancedDashboard />
          <DashboardOverview />
          <DashboardFleet />
          <DashboardOptimization />
          <UnifiedReports />
          <EmployeeTrackingMap />
          <UnifiedMapInterface />
          <AdvancedMapping />
          <PayrollDashboard />
          <ReceiptUpload />
        </div>
        <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
          <button className="rounded-full bg-blue-600 text-white p-4 shadow-lg" onClick={() => setShowSpreadsheet(v => !v)} title="Sealcoating Spreadsheet">
            S
          </button>
          <button className="rounded-full bg-green-600 text-white p-4 shadow-lg" onClick={() => setShowCalculator(v => !v)} title="Calculator">
            C
          </button>
        </div>
        {showSpreadsheet && <SealcoatingSpreadsheetApp />}
        {showCalculator && <PopoutCalculator />}
      </div>
    </div>
  );
};

export default Dashboard;
