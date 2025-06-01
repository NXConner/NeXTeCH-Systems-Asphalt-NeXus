// Refactored to use real API data. Please implement useMaintenanceTracking hook for fetching and updating maintenance items.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wrench, 
  AlertTriangle, 
  Calendar, 
  DollarSign,
  Clock,
  CheckCircle,
  Plus
} from "lucide-react";

interface MaintenanceItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: 'oil-change' | 'tire-rotation' | 'brake-check' | 'inspection' | 'repair';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  estimatedCost: number;
  actualCost?: number;
  assignedTechnician?: string;
  notes?: string;
}

interface MaintenanceTrackerProps {
  maintenanceItems: MaintenanceItem[];
}

export const MaintenanceTracker = ({ maintenanceItems }: MaintenanceTrackerProps) => {
  const overdueItems = maintenanceItems.filter(item => 
    new Date(item.dueDate) < new Date() && item.status !== 'completed'
  );
  
  const dueSoonItems = maintenanceItems.filter(item => {
    const dueDate = new Date(item.dueDate);
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    return dueDate >= today && dueDate <= threeDaysFromNow && item.status !== 'completed';
  });

  const inProgressItems = maintenanceItems.filter(item => item.status === 'in-progress');
  const completedItems = maintenanceItems.filter(item => item.status === 'completed');

  const getStatusColor = (status: MaintenanceItem['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: MaintenanceItem['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{overdueItems.length}</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{dueSoonItems.length}</div>
                <div className="text-sm text-muted-foreground">Due Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{inProgressItems.length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{completedItems.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {overdueItems.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Critical Maintenance Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueItems.map((item) => (
                <div key={item.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-red-800">{item.description}</h4>
                      <p className="text-sm text-red-600">{item.vehicleName}</p>
                      <p className="text-xs text-red-500">Overdue since: {new Date(item.dueDate).toLocaleDateString()}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getPriorityColor(item.priority)} variant="secondary">
                          {item.priority}
                        </Badge>
                        <Badge variant="outline">
                          ${item.estimatedCost}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Schedule Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Upcoming Maintenance
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dueSoonItems.concat(maintenanceItems.filter(item => 
              item.status === 'scheduled' && !dueSoonItems.includes(item)
            )).map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{item.description}</h4>
                      <Badge className={getStatusColor(item.status)} variant="secondary">
                        {item.status}
                      </Badge>
                      <Badge className={getPriorityColor(item.priority)} variant="secondary">
                        {item.priority}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Vehicle:</span>
                        <p className="font-medium">{item.vehicleName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Due Date:</span>
                        <p className="font-medium">{new Date(item.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Estimated Cost:</span>
                        <p className="font-medium">${item.estimatedCost}</p>
                      </div>
                    </div>
                    
                    {item.assignedTechnician && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Technician:</span>
                        <span className="ml-2 font-medium">{item.assignedTechnician}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm">
                      Start Work
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Completed Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div>
                  <h4 className="font-medium">{item.description}</h4>
                  <p className="text-sm text-muted-foreground">{item.vehicleName}</p>
                  <p className="text-xs text-green-600">
                    Completed: {new Date(item.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    ${item.actualCost || item.estimatedCost}
                  </div>
                  <Badge className="bg-green-100 text-green-800" variant="secondary">
                    Completed
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
