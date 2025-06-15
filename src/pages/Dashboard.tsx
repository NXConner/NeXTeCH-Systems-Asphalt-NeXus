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
import { useSidebar } from "@/contexts/SidebarContext";
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
import { UnifiedMapInterface } from '../components';
import AdvancedMapping from "./AdvancedMapping";
import ThemeColorPicker from "@/components/ui/ThemeColorPicker";
import PayrollDashboard from "@/components/payroll/PayrollDashboard";
import ReceiptUpload from "@/components/receipts/ReceiptUpload";
import ProgressChecklist, { useChecklistState } from "@/components/gamification/ProgressChecklist";
import ProgressCounter from "@/components/gamification/ProgressCounter";
import AchievementsDashboard from '../components/gamification/AchievementsDashboard';
import BadgeGallery from '../components/gamification/BadgeGallery';
import RewardsPanel from '../components/gamification/RewardsPanel';
import Leaderboard from '../components/gamification/Leaderboard';
import FeedbackForm from '../components/feedback/FeedbackForm';
import ForumBoard from '../components/community/ForumBoard';
import { ThemeShowcase } from '@/components/ui/theme-showcase';
import { ThemeEffectsShowcase } from '@/components/ui/theme-effects-showcase';
import ThemeSelector from '@/components/ui/theme-selector';
import { ResourceAllocation } from '@/components/dashboard/ResourceAllocation';
import { useResourceData } from '@/hooks/useResourceData';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useStats } from '@/hooks/useStats';
import { useRecentActivities } from '@/hooks/useRecentActivities';
import { ActivityList } from '@/components/ActivityList';
import { StatsOverview } from '@/components/StatsOverview';
import { QuickActions } from '@/components/QuickActions';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';

type Notification = Database['public']['Tables']['notifications']['Row'];
type Activity = { id: string; description: string; created_at: string };

function StatsOverview({ stats, loading }: { stats: any, loading: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded" />
        ))
      ) : (
        <>
          <div className="p-4 bg-card rounded shadow">
            <div className="text-xs text-muted-foreground mb-1">Total Jobs</div>
            <div className="text-2xl font-bold">{stats.jobs}</div>
          </div>
          <div className="p-4 bg-card rounded shadow">
            <div className="text-xs text-muted-foreground mb-1">Active Vehicles</div>
            <div className="text-2xl font-bold">{stats.vehicles}</div>
          </div>
          <div className="p-4 bg-card rounded shadow">
            <div className="text-xs text-muted-foreground mb-1">Open Estimates</div>
            <div className="text-2xl font-bold">{stats.estimates}</div>
          </div>
          <div className="p-4 bg-card rounded shadow">
            <div className="text-xs text-muted-foreground mb-1">Staff</div>
            <div className="text-2xl font-bold">{stats.staff}</div>
          </div>
        </>
      )}
    </div>
  );
}

function FleetStatus({ vehicles, loading }: { vehicles: any[], loading: boolean }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Fleet Status</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading fleet...</div>
        ) : vehicles.length === 0 ? (
          <div className="text-muted-foreground">No vehicles found.</div>
        ) : (
          <ul className="flex flex-wrap gap-4">
            {vehicles.slice(0, 6).map(v => (
              <li key={v.id} className="p-2 border rounded min-w-[120px]">
                <div className="font-bold">{v.name}</div>
                <div className="text-xs text-muted-foreground">{v.status}</div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function QuickLinks() {
  const navigate = useNavigate();
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate('/inventory')}>Inventory</Button>
          <Button onClick={() => navigate('/maintenance')}>Maintenance</Button>
          <Button onClick={() => navigate('/crm')}>CRM</Button>
          <Button onClick={() => navigate('/settings')}>Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}

const Dashboard = () => {
  const { isMobile } = useSidebar();
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
  const [tab, setTab] = useState('overview');
  const { resources, isLoading, error } = useResourceData();
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({ jobs: 0, vehicles: 0, estimates: 0, staff: 0 });
  const [fleet, setFleet] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingFleet, setLoadingFleet] = useState(true);
  const { stats: useStatsStats, loading: useStatsLoading } = useStats();
  const { activities, loading: useRecentActivitiesLoading } = useRecentActivities();

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    setLoadingStats(true);
    setLoadingFleet(true);
    const fetchData = async () => {
      const { data: notifData } = await supabase
        .from<Database['public']['Tables']['notifications']['Row']>('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      // Fallback: If activity_feed table does not exist, use forum_posts and jobs as activity
      let activityArr: Activity[] = [];
      const { data: forumPosts } = await supabase
        .from('forum_posts')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (forumPosts) {
        activityArr = activityArr.concat(forumPosts.map((p: any) => ({ id: p.id, description: `Posted in forum: ${p.title}`, created_at: p.created_at })));
      }
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, job_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2);
      if (jobs) {
        activityArr = activityArr.concat(jobs.map((j: any) => ({ id: j.id, description: `Created job: ${j.job_name}`, created_at: j.created_at })));
      }
      activityArr.sort((a, b) => b.created_at.localeCompare(a.created_at));
      setNotifications(notifData || []);
      setActivity(activityArr);
      setLoadingData(false);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { count: jobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
      const { count: vehicles } = await supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'active');
      const { count: estimates } = await supabase.from('estimates').select('*', { count: 'exact', head: true });
      const { count: staff } = await supabase.from('employees').select('*', { count: 'exact', head: true });
      setStats({ jobs: jobs || 0, vehicles: vehicles || 0, estimates: estimates || 0, staff: staff || 0 });
      setLoadingStats(false);
    };
    const fetchFleet = async () => {
      const { data } = await supabase.from('vehicles').select('id, name, status').order('created_at', { ascending: false });
      setFleet(data || []);
      setLoadingFleet(false);
    };
    fetchStats();
    fetchFleet();
  }, [user]);

  useEffect(() => {
    achievements.forEach(a => {
      if (a.progress === 100) setAchievementNotification(`${a.name} unlocked!`);
    });
  }, [achievements]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    navigate('/login');
    return null;
  }

  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-4">
        <MobileDashboard />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsOverview stats={useStatsStats} loading={useStatsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityList activities={activities} loading={useRecentActivitiesLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceMetrics />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
