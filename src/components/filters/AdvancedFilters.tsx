import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import React, { useState } from 'react';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  availableStatuses: string[];
  availableProjectTypes: string[];
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFiltersChange, availableStatuses, availableProjectTypes }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [projectType, setProjectType] = useState('');

  React.useEffect(() => {
    onFiltersChange({ search, status, projectType });
  }, [search, status, projectType, onFiltersChange]);

  return (
    <div className="flex gap-2 items-center">
      <Input
        aria-label="Search input"
        title="Search input"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Select
        aria-label="Status filter select"
        title="Status filter select"
        value={status}
        onValueChange={setStatus}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          {availableStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select
        aria-label="Project type filter select"
        title="Project type filter select"
        value={projectType}
        onValueChange={setProjectType}
      >
        <SelectTrigger>
          <SelectValue placeholder="Project Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          {availableProjectTypes.map(pt => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}; 