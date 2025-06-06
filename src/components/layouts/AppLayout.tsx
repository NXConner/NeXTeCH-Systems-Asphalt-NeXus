import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import Navigation from '@/components/Navigation';
import MiniMapWidget from '@/components/ui/MiniMapWidget';
import { MobileOptimizedLayout } from '@/components/mobile/MobileOptimizedLayout';

const AppLayout = () => {
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