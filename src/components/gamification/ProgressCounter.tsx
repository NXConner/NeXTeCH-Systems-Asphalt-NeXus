import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { initialChecklist, getChecklistProgress } from './ProgressChecklist';

export default function ProgressCounter({ checklist = initialChecklist }: { checklist?: typeof initialChecklist }) {
  const { completed, total, percent } = getChecklistProgress(checklist);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div className="bg-green-600 h-4 rounded-full" style={{ width: `${percent}%` }}></div>
        </div>
        <div className="text-center font-bold">{percent}% Complete ({completed} / {total})</div>
      </CardContent>
    </Card>
  );
} 