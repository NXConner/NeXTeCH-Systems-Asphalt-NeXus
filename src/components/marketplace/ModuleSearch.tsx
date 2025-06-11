import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Module } from '@/services/moduleManager';

interface ModuleSearchProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: ModuleFilters) => void;
}

export interface ModuleFilters {
  category: string;
  language: string;
  compatibility: string;
  minStars: number;
}

export default function ModuleSearch({ onSearch, onSort, onFilter }: ModuleSearchProps) {
  const [filters, setFilters] = React.useState<ModuleFilters>({
    category: '',
    language: '',
    compatibility: '',
    minStars: 0
  });

  const handleFilterChange = (key: keyof ModuleFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              className="pl-8"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
        <Select onValueChange={(value) => onSort(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stars">Most Stars</SelectItem>
            <SelectItem value="forks">Most Forks</SelectItem>
            <SelectItem value="updated">Recently Updated</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="ui">UI Components</SelectItem>
            <SelectItem value="data">Data Management</SelectItem>
            <SelectItem value="auth">Authentication</SelectItem>
            <SelectItem value="api">API Integration</SelectItem>
            <SelectItem value="utils">Utilities</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.language}
          onValueChange={(value) => handleFilterChange('language', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Languages</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.compatibility}
          onValueChange={(value) => handleFilterChange('compatibility', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Compatibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Versions</SelectItem>
            <SelectItem value="v1.0.0+">v1.0.0+</SelectItem>
            <SelectItem value="v2.0.0+">v2.0.0+</SelectItem>
            <SelectItem value="v3.0.0+">v3.0.0+</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.minStars.toString()}
          onValueChange={(value) => handleFilterChange('minStars', parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Min Stars" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any Stars</SelectItem>
            <SelectItem value="10">10+ Stars</SelectItem>
            <SelectItem value="100">100+ Stars</SelectItem>
            <SelectItem value="1000">1000+ Stars</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setFilters({
              category: '',
              language: '',
              compatibility: '',
              minStars: 0
            });
            onFilter({
              category: '',
              language: '',
              compatibility: '',
              minStars: 0
            });
          }}
        >
          <Filter className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
} 