
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface JobsFiltersProps {
  onFiltersChange: (filters: any) => void;
  availableStatuses: string[];
  availablePriorities: string[];
  availableProjectTypes: string[];
}

export const JobsFilters = ({ 
  onFiltersChange, 
  availableStatuses, 
  availablePriorities,
  availableProjectTypes 
}: JobsFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: [] as string[],
    priority: [] as string[],
    projectType: [] as string[],
    dateRange: { from: '', to: '' }
  });

  const updateFilters = (newFilters: any) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (array: string[], value: string) => {
    return array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      status: [],
      priority: [],
      projectType: [],
      dateRange: { from: '', to: '' }
    };
    updateFilters(clearedFilters);
  };

  const activeFilterCount = filters.status.length + filters.priority.length + filters.projectType.length + 
    (filters.searchTerm ? 1 : 0) + (filters.dateRange.from ? 1 : 0);

  return (
    <Card className="w-full lg:w-80">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">{activeFilterCount}</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search jobs..."
                value={filters.searchTerm}
                onChange={(e) => updateFilters({...filters, searchTerm: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) => updateFilters({
                    ...filters, 
                    dateRange: {...filters.dateRange, from: e.target.value}
                  })}
                />
                <Input
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) => updateFilters({
                    ...filters, 
                    dateRange: {...filters.dateRange, to: e.target.value}
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex flex-wrap gap-1">
                {availableStatuses.map((status) => (
                  <Badge
                    key={status}
                    variant={filters.status.includes(status) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateFilters({
                      ...filters,
                      status: toggleArrayFilter(filters.status, status)
                    })}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-1">
                {availablePriorities.map((priority) => (
                  <Badge
                    key={priority}
                    variant={filters.priority.includes(priority) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateFilters({
                      ...filters,
                      priority: toggleArrayFilter(filters.priority, priority)
                    })}
                  >
                    {priority}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Type</Label>
              <div className="flex flex-wrap gap-1">
                {availableProjectTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={filters.projectType.includes(type) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateFilters({
                      ...filters,
                      projectType: toggleArrayFilter(filters.projectType, type)
                    })}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
