import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import Navigation from '@/components/Navigation';
import MiniMapWidget from '@/components/ui/MiniMapWidget';
import { MobileOptimizedLayout } from '@/components/mobile/MobileOptimizedLayout';
import { useSidebar } from '@/contexts/SidebarContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
// ... rest of your imports ...

const Layout = () => {
  const { isMobile } = useSidebar();
  
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      // ... rest of your routes ...
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}); 