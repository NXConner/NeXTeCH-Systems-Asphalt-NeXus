import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SealcoatingSpreadsheetApp } from '@/components/estimates/SealcoatingSpreadsheetApp';
import { PopoutCalculator } from '@/components/ui/PopoutCalculator';
import TimelinePanel from '@/components/Map/TimelinePanel';

interface MapModalsProps {
  showSpreadsheet: boolean;
  onCloseSpreadsheet: () => void;
  showCalculator: boolean;
  onCloseCalculator: () => void;
  showTimeline: boolean;
  onCloseTimeline: () => void;
  timeline: any[];
  timelineIndex: number;
  onTimelineChange: (index: number) => void;
}

export const MapModals: React.FC<MapModalsProps> = ({
  showSpreadsheet,
  onCloseSpreadsheet,
  showCalculator,
  onCloseCalculator,
  showTimeline,
  onCloseTimeline,
  timeline,
  timelineIndex,
  onTimelineChange
}) => {
  return (
    <>
      <Dialog open={showSpreadsheet} onOpenChange={onCloseSpreadsheet}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Sealcoating Calculator</DialogTitle>
          </DialogHeader>
          <SealcoatingSpreadsheetApp />
        </DialogContent>
      </Dialog>

      <Dialog open={showCalculator} onOpenChange={onCloseCalculator}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Area Calculator</DialogTitle>
          </DialogHeader>
          <PopoutCalculator />
        </DialogContent>
      </Dialog>

      <Dialog open={showTimeline} onOpenChange={onCloseTimeline}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Timeline</DialogTitle>
          </DialogHeader>
          <TimelinePanel
            timeline={timeline}
            currentIndex={timelineIndex}
            onIndexChange={onTimelineChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}; 