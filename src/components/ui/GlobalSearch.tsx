import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent } from './dialog';
import { Input } from './input';
import { Button } from './button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({ jobs: [], vehicles: [], forum: [], employees: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults({ jobs: [], vehicles: [], forum: [], employees: [] });
      return;
    }
    setLoading(true);
    const [jobs, vehicles, forum, employees] = await Promise.all([
      supabase.from('jobs').select('id, job_name').ilike('job_name', `%${q}%`).limit(5),
      supabase.from('vehicles').select('id, name').ilike('name', `%${q}%`).limit(5),
      supabase.from('forum_posts').select('id, title').ilike('title', `%${q}%`).limit(5),
      supabase.from('employees').select('id, name').ilike('name', `%${q}%`).limit(5),
    ]);
    setResults({
      jobs: jobs.data || [],
      vehicles: vehicles.data || [],
      forum: forum.data || [],
      employees: employees.data || [],
    });
    setLoading(false);
  };

  const handleNavigate = (type: string, id: string) => {
    setOpen(false);
    if (type === 'jobs') navigate(`/jobs/${id}`);
    if (type === 'vehicles') navigate(`/fleet/${id}`);
    if (type === 'forum') navigate(`/forum/${id}`);
    if (type === 'employees') navigate(`/employee-management/${id}`);
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Search">
        <Search className="h-5 w-5" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg w-full">
          <Input
            autoFocus
            placeholder="Search jobs, vehicles, forum, employees..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
            className="mb-4"
          />
          {loading ? (
            <div>Searching...</div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {['jobs', 'vehicles', 'forum', 'employees'].map(type => (
                results[type].length > 0 && (
                  <div key={type}>
                    <div className="font-bold mb-1 capitalize">{type}</div>
                    <ul>
                      {results[type].map((item: any) => (
                        <li
                          key={item.id}
                          className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
                          onClick={() => handleNavigate(type, item.id)}
                        >
                          {item.job_name || item.name || item.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
              {Object.values(results).every(arr => arr.length === 0) && query && !loading && (
                <div className="text-muted-foreground">No results found.</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 