
import { useState } from "react";
import { Driver } from "@/types/driver";

export const useDriverManagement = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    console.log('Selected driver:', driver);
  };

  const clearSelection = () => {
    setSelectedDriver(null);
  };

  return {
    selectedDriver,
    handleDriverSelect,
    clearSelection
  };
};
