import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { NavigationService } from '../services/navigationService';
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarFooter, SidebarSeparator } from './ui/sidebar';
import { getIcon } from '../utils/iconUtils';
import { useSidebar } from '@/contexts/SidebarContext';
import { ChevronLeft, ChevronRight, Search, MapPin, Calculator, FileSpreadsheet, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ThemeSwitcher } from './ui/theme-switcher';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navSections = NavigationService.getMainNavigation();

  return (
    <Sidebar variant="floating" collapsible="icon" className="bg-background/80 backdrop-blur-sm">
      <SidebarHeader className="flex items-center gap-2 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <h2 className={`text-lg font-semibold transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
          Navigation
        </h2>
      </SidebarHeader>

      <div className="px-4 pb-4">
        <div className={`transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search address..." className="pl-8" />
          </div>
        </div>
      </div>

      <SidebarContent className="hover:bg-background/90 hover:backdrop-blur-md transition-all duration-200">
        {navSections.map((section, index) => (
          <React.Fragment key={section.title}>
            {index > 0 && <SidebarSeparator />}
            <div className="px-3 py-2">
              {!isCollapsed && (
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.links.map((link) => {
                  const Icon = getIcon(link.icon || '');
                  const isActive = location.pathname === link.path;
                  return (
                    <Link 
                      key={link.path} 
                      to={link.path}
                      className="block"
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-2 hover:bg-background/90 hover:backdrop-blur-md ${isCollapsed ? "px-2" : "px-3"}`}
                        size="sm"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && <span>{link.label}</span>}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        ))}

        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2 hover:bg-background/90 hover:backdrop-blur-md ${isCollapsed ? "px-2" : "px-3"}`}
            >
              <MapPin className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Current Location</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2 hover:bg-background/90 hover:backdrop-blur-md ${isCollapsed ? "px-2" : "px-3"}`}
            >
              <Calculator className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Calculator</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2 hover:bg-background/90 hover:backdrop-blur-md ${isCollapsed ? "px-2" : "px-3"}`}
            >
              <FileSpreadsheet className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Spreadsheet</span>}
            </Button>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <ThemeSwitcher />
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground">
              © 2024 NeXTeCH Systems
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Navigation; 