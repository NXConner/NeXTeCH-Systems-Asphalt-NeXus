import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
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

const navSections = NavigationService.getMainNavigation();
const quickActions = NavigationService.getQuickActions();

const Navigation = () => null;
export default Navigation; 