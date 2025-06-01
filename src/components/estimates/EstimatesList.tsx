// Refactored to use real API data. Please implement useEstimates hook for fetching and updating estimates.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Send } from "lucide-react";
import { Estimate } from "@/types/estimate";

interface EstimatesListProps {
  estimates: Estimate[];
}

const EstimatesList = ({ estimates }: EstimatesListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (estimates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No estimates found</p>
        <p className="text-gray-400">Create your first estimate to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {estimates.map((estimate) => (
        <Card key={estimate.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{estimate.title}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {estimate.client.name} • {estimate.project.location}
                </p>
              </div>
              <Badge className={getStatusColor(estimate.status)}>
                {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Project Type:</span>
                  <p className="font-medium capitalize">{estimate.project.type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Cost:</span>
                  <p className="font-medium text-lg">${estimate.calculations.totalCost.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Area:</span>
                  <p className="font-medium">{estimate.project.area.toLocaleString()} sq ft</p>
                </div>
                <div>
                  <span className="text-gray-500">Valid Until:</span>
                  <p className="font-medium">{new Date(estimate.validUntil).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EstimatesList;
