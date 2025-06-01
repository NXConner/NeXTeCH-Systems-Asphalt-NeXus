import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Wrench, Calendar, AlertTriangle, Clock, DollarSign } from "lucide-react";
import { MaintenanceTask, MaintenanceSchedule } from "@/types/maintenance";

const MaintenanceTracking = () => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getPriorityColor = (priority: MaintenanceTask['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: MaintenanceTask['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalTasks: tasks.length,
    scheduledTasks: tasks.filter(t => t.status === 'scheduled').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    totalCost: tasks.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost), 0)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Maintenance Tracking</h1>
        <p className="text-muted-foreground mt-2">
          Schedule and track vehicle maintenance, repairs, and inspections
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.totalTasks}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{stats.scheduledTasks}</div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">${stats.totalCost.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="tasks">Maintenance Tasks</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search maintenance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>
        </div>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)} variant="secondary">
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)} variant="secondary">
                          {task.status}
                        </Badge>
                        <Badge variant="outline">{task.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div><strong>Vehicle ID:</strong> {task.vehicleId}</div>
                          <div><strong>Scheduled:</strong> {new Date(task.scheduledDate).toLocaleDateString()}</div>
                          <div><strong>Labor Hours:</strong> {task.laborHours}h</div>
                        </div>
                        <div>
                          <div><strong>Mileage:</strong> {task.mileageAtService?.toLocaleString()}</div>
                          {task.nextServiceDate && (
                            <div><strong>Next Service:</strong> {new Date(task.nextServiceDate).toLocaleDateString()}</div>
                          )}
                          {task.mechanicId && <div><strong>Mechanic:</strong> {task.mechanicId}</div>}
                        </div>
                      </div>

                      {task.parts.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium mb-2">Parts Required:</div>
                          <div className="space-y-1">
                            {task.parts.map((part) => (
                              <div key={part.id} className="text-xs text-muted-foreground flex justify-between">
                                <span>{part.name} ({part.partNumber}) x{part.quantity}</span>
                                <span>${part.totalCost}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {task.notes && (
                        <div className="text-sm">
                          <strong>Notes:</strong> {task.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right space-y-2 ml-6">
                      <div className="text-lg font-bold text-green-600">
                        ${(task.actualCost || task.estimatedCost).toLocaleString()}
                      </div>
                      {task.actualCost && task.actualCost !== task.estimatedCost && (
                        <div className="text-sm text-muted-foreground">
                          Est: ${task.estimatedCost.toLocaleString()}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Add Photos
                        </Button>
                        <Button size="sm">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{schedule.taskType}</h3>
                        <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
                          {schedule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{schedule.description}</p>
                      
                      <div className="text-sm space-y-1">
                        <div><strong>Vehicle ID:</strong> {schedule.vehicleId}</div>
                        <div>
                          <strong>Interval:</strong> Every {schedule.intervalValue} {
                            schedule.intervalType === 'mileage' ? 'miles' : 
                            schedule.intervalType === 'time' ? 'months' : 'hours'
                          }
                        </div>
                        <div><strong>Estimated Cost:</strong> ${schedule.estimatedCost}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Schedule Now
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant={schedule.isActive ? 'destructive' : 'default'}>
                        {schedule.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4">
            {tasks.filter(t => t.status === 'completed').map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Vehicle: {task.vehicleId} | Completed: {task.completedDate ? new Date(task.completedDate).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-sm">Cost: ${(task.actualCost || task.estimatedCost).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Download Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Monthly Maintenance Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Vehicle Maintenance History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Cost Analysis Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Upcoming Maintenance Schedule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                  <div className="text-sm font-medium text-orange-800">Overdue Maintenance</div>
                  <div className="text-xs text-orange-600">Vehicle-003 oil change is 500 miles overdue</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-sm font-medium text-blue-800">Upcoming Service</div>
                  <div className="text-xs text-blue-600">Vehicle-001 brake inspection due in 2 days</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceTracking;
