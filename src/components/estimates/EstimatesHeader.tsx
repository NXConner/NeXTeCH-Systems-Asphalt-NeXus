
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface EstimatesHeaderProps {
  onNewEstimate: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const EstimatesHeader = ({ onNewEstimate, searchTerm, onSearchChange }: EstimatesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estimates</h1>
        <p className="text-gray-600 mt-2">Manage project quotes and proposals</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search estimates..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        
        <Button onClick={onNewEstimate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Estimate
        </Button>
      </div>
    </div>
  );
};

export default EstimatesHeader;
