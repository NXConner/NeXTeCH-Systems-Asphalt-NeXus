import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { supabase } from '@/integrations/supabase/client';

// TODO: Integrate with Supabase for persistent checklist storage.

export const initialChecklist = [
  { id: 'achievements', label: 'Achievements Dashboard', done: false },
  { id: 'leaderboard', label: 'Leaderboard', done: false },
  { id: 'rewards', label: 'Rewards Panel', done: false },
  { id: 'feedback', label: 'Feedback Form', done: false },
  { id: 'forum', label: 'Community Forum', done: false },
  { id: 'security', label: 'Security Panel', done: false },
  { id: 'api', label: 'Open API Explorer', done: false },
  { id: 'progress', label: 'Progress Counter', done: false },
  { id: 'badges', label: 'Badge Gallery', done: false },
  // --- Theme Features ---
  { id: 'highContrast', label: 'High Contrast Theme', done: true },
  { id: 'specialtyAsphaltTechnician', label: 'Specialty Asphalt Technician Theme', done: true },
  { id: 'ghostRecon', label: 'Ghost Recon Theme', done: true },
  { id: 'splinterCell', label: 'Splinter Cell Theme', done: true },
  { id: 'cyberpunk2077', label: 'Cyberpunk 2077 Theme', done: true },
  { id: 'cyberpunk2077Rebuild', label: 'Cyberpunk 2077 Rebuild Theme', done: true },
  { id: 'cybervision', label: 'Cybervision Theme', done: true },
  // ...add more as needed
];

export default function ProgressChecklist() {
  const [checklist, setChecklist] = useState(initialChecklist);
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const { data } = await supabase.from('progress_checklist').select('*');
        if (data && Array.isArray(data) && data[0]?.id) setChecklist(data);
      } catch (e) {
        // fallback to local state
      }
    };
    fetchChecklist();
  }, []);
  const toggle = async (id: string) => {
    const updated = checklist.map(item => item.id === id ? { ...item, done: !item.done } : item);
    setChecklist(updated);
    try {
      await supabase.from('progress_checklist').upsert(updated);
    } catch (e) {
      // fallback to local state
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {checklist.map(item => (
            <li key={item.id} className="flex items-center gap-2">
              <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} title={`Mark ${item.label} as complete`} />
              <span className={item.done ? 'line-through text-muted-foreground' : ''}>{item.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export const getChecklistProgress = (checklist = initialChecklist) => {
  const completed = checklist.filter(item => item.done).length;
  return { completed, total: checklist.length, percent: Math.round((completed / checklist.length) * 100) };
};

export function useChecklistState() {
  const [checklist, setChecklist] = useState(initialChecklist);
  const completed = checklist.filter(item => item.done).length;
  return [checklist, setChecklist, completed] as const;
} 