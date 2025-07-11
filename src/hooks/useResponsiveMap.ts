import { useState, useEffect } from 'react';

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface MapResponsiveSettings {
  controls: {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    isVertical: boolean;
  };
  zoomLevel: number;
  controlsVisible: boolean;
  isFullWidth: boolean;
  isMobileView: boolean;
}

export const useResponsiveMap = () => {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [settings, setSettings] = useState<MapResponsiveSettings>({
    controls: {
      position: 'top-right',
      isVertical: true
    },
    zoomLevel: 15,
    controlsVisible: true,
    isFullWidth: false,
    isMobileView: false
  });

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update settings based on screen width
  useEffect(() => {
    // Mobile
    if (width < 640) {
      setSettings({
        controls: {
          position: 'bottom-right',
          isVertical: false
        },
        zoomLevel: 14,
        controlsVisible: false,
        isFullWidth: true,
        isMobileView: true
      });
    }
    // Small tablet
    else if (width < 768) {
      setSettings({
        controls: {
          position: 'bottom-right',
          isVertical: true
        },
        zoomLevel: 15,
        controlsVisible: true,
        isFullWidth: false,
        isMobileView: true
      });
    }
    // Medium desktop
    else {
      setSettings({
        controls: {
          position: 'top-right',
          isVertical: true
        },
        zoomLevel: 15,
        controlsVisible: true,
        isFullWidth: false,
        isMobileView: false
      });
    }
  }, [width]);

  /**
   * Get CSS classes for positioning elements based on responsive settings
   */
  const getPositionClasses = (position = settings.controls.position) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  /**
   * Get CSS classes for layout direction based on responsive settings
   */
  const getLayoutClasses = (isVertical = settings.controls.isVertical) => {
    return isVertical ? 'flex-col' : 'flex-row';
  };

  return {
    width,
    settings,
    getPositionClasses,
    getLayoutClasses,
    isMobile: width < 768,
    isDesktop: width >= 1024
  };
};
