import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import * as L from 'leaflet';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  sidebarContent
}) => {
  const map = useMap();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      
      if (!newIsMobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!map) return;

    // Adjust map container size when sidebar state changes
    const mapContainer = map.getContainer();
    if (isMobile) {
      if (isSidebarOpen) {
        mapContainer.style.width = 'calc(100% - 300px)';
        mapContainer.style.marginLeft = '300px';
      } else {
        mapContainer.style.width = '100%';
        mapContainer.style.marginLeft = '0';
      }
    } else {
      mapContainer.style.width = 'calc(100% - 300px)';
      mapContainer.style.marginLeft = '300px';
    }

    // Trigger map resize
    map.invalidateSize();

    return () => {
      mapContainer.style.width = '100%';
      mapContainer.style.marginLeft = '0';
      map.invalidateSize();
    };
  }, [map, isMobile, isSidebarOpen]);

  return (
    <div className="relative h-full">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-background/80 backdrop-blur-sm shadow-lg transform transition-transform duration-300 ease-in-out z-[1000] ${
          isMobile
            ? isSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : 'translate-x-0'
        }`}
      >
        <div className="p-4">
          {sidebarContent}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`h-full transition-all duration-300 ease-in-out ${
          isMobile
            ? 'w-full'
            : 'ml-[300px] w-[calc(100%-300px)]'
        }`}
      >
        {children}
      </div>

      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-[1001] bg-background/80 backdrop-blur-sm"
        >
          {isSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}; 