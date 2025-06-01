
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useLocationTracking = () => {
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const startLocationTracking = () => {
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation(position);
          console.log("Location updated:", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            speed: position.coords.speed,
            timestamp: new Date().toISOString()
          });
        },
        (error) => {
          console.error("Location error:", error);
          toast.error("Location tracking error");
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 10000
        }
      );
      setWatchId(id);
      setIsTracking(true);
    }
  };

  const stopLocationTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    currentLocation,
    isTracking,
    startLocationTracking,
    stopLocationTracking
  };
};
