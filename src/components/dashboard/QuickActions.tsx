
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Calculator, FileText, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="p-4 h-auto flex flex-col items-center gap-2 hover:bg-accent"
            onClick={() => navigate('/fleet')}
          >
            <Truck className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium">Add Vehicle</span>
          </Button>
          <Button 
            variant="outline" 
            className="p-4 h-auto flex flex-col items-center gap-2 hover:bg-accent"
            onClick={() => navigate('/jobs')}
          >
            <Briefcase className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium">New Job</span>
          </Button>
          <Button 
            variant="outline" 
            className="p-4 h-auto flex flex-col items-center gap-2 hover:bg-accent"
            onClick={() => navigate('/estimates')}
          >
            <Calculator className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium">New Estimate</span>
          </Button>
          <Button 
            variant="outline" 
            className="p-4 h-auto flex flex-col items-center gap-2 hover:bg-accent"
            onClick={() => navigate('/invoices')}
          >
            <FileText className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium">Create Invoice</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
