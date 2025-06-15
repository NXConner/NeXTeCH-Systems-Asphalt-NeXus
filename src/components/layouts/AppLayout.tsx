import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import Navigation from '@/components/Navigation';
import { MobileOptimizedLayout } from '@/components/mobile/MobileOptimizedLayout';
import { useSidebar } from '@/contexts/SidebarContext';
import GlobalSearch from '@/components/ui/GlobalSearch';
import NotificationsDropdown from '@/components/ui/NotificationsDropdown';
import OnlineUsers from '@/components/Presence/OnlineUsers';
import UserAvatarMenu from '@/components/ui/UserAvatarMenu';

const AppLayout = () => {
  const { isMobile } = useSidebar();
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar variant="floating" collapsible="icon">
        <Navigation />
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center h-16 px-4 border-b bg-card">
          <SidebarTrigger className="mr-4" />
          <GlobalSearch />
          <NotificationsDropdown />
          <OnlineUsers />
          <UserAvatarMenu />
          <span className="font-bold text-xl ml-4">Asphalt-NexTech_Systems</span>
        </header>
        <main className="flex-1">
          {isMobile ? (
            <MobileOptimizedLayout>
              <Outlet />
            </MobileOptimizedLayout>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 