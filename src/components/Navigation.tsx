import React, { useState, useEffect } from 'react';
import { Link, useMatch, useLocation } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { NavigationService } from '../services/navigationService';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { Palette } from 'lucide-react';
import { ThemeIntegration } from './ui/theme-integration';
import { Badge } from './ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';
import UserMenu from './UserMenu';
import { NotificationCenter } from '../components/notifications/NotificationCenter';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical } from 'lucide-react';
import { Trophy, Award, Gift, Users, MessageCircle, BookOpen } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { Home, Truck, Calendar, FileText } from 'lucide-react';

const navSections = NavigationService.getMainNavigation();
const quickActions = NavigationService.getQuickActions();

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/fleet', label: 'Fleet', icon: Truck },
  { path: '/jobs', label: 'Jobs', icon: Calendar },
  { path: '/employee-management', label: 'Staff', icon: Users },
  { path: '/accounting', label: 'Finance', icon: FileText },
  { path: '/dashboard', label: 'Dashboard', icon: LucideIcons.BarChart3 },
  { path: '/analytics', label: 'Analytics', icon: LucideIcons.BarChart3 },
  { label: 'Gamification & Community', type: 'section' },
  { path: '/achievements', label: 'Achievements', icon: Trophy },
  { path: '/badges', label: 'Badges', icon: Award },
  { path: '/rewards', label: 'Rewards', icon: Gift },
  { path: '/leaderboard', label: 'Leaderboard', icon: Users },
  { path: '/feedback', label: 'Feedback', icon: MessageCircle },
  { path: '/forum', label: 'Forum', icon: BookOpen },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <SidebarMenu>
      {navItems.filter(item => item.path && item.icon).map(item => {
        const isActive = location.pathname === item.path || 
          (item.path === '/' && location.pathname === '/landing');
        return (
          <SidebarMenuItem key={item.path + '-' + item.label}>
            <Link to={item.path} style={{ width: '100%' }}>
              <SidebarMenuButton isActive={isActive}>
                {item.icon && React.createElement(item.icon, { className: 'mr-2 h-5 w-5' })}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default Navigation; 