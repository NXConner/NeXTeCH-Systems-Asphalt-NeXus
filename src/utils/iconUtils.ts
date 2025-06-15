import {
  LayoutDashboard,
  Map,
  Settings,
  Users,
  FileText,
  BarChart,
  Calendar,
  Mail,
  MessageSquare,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Map,
  Settings,
  Users,
  FileText,
  BarChart,
  Calendar,
  Mail,
  MessageSquare,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight
};

export const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || LayoutDashboard;
}; 