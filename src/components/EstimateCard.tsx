
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Clock, CheckCircle, XCircle, Eye } from "lucide-react";

interface EstimateCardProps {
  estimate: {
    id: string;
    client: string;
    project: string;
    area: string;
    amount: string;
    status: string;
    createdDate: string;
    expiryDate: string;
  };
}

const EstimateCard = ({ estimate }: EstimateCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Approved":
        return <CheckCircle className="h-4 w-4" />;
      case "Rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{estimate.project}</CardTitle>
              <CardDescription>{estimate.id} • {estimate.client}</CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(estimate.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(estimate.status)}
              {estimate.status}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Area:</span>
            <p>{estimate.area}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Amount:</span>
            <p className="text-green-600 font-semibold">{estimate.amount}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Created:</span>
            <p>{estimate.createdDate}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Expires:</span>
            <p>{estimate.expiryDate}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimateCard;
