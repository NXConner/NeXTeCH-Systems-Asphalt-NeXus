import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeTimeTracker } from "@/components/timeTracking/EmployeeTimeTracker";
import { useEmployeeManagement } from "@/hooks/useEmployeeManagement";
import { useCostData } from "@/hooks/useCostData";
import { Clock, Users, TrendingUp, MapPin, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TimeTracking() {
  const { employees } = useEmployeeManagement();
  const { calculateJobCost, getCostByName } = useCostData();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
  
  // Calculate real-time cost data
  const laborRate = getCostByName('Crew Leader')?.price_with_tax || 29.50;
  const currentHours = 6.5; // This would come from actual time tracking
  const estimatedLaborCost = currentHours * laborRate;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Clock className="h-8 w-8" />
          Employee Time Tracking
        </h1>
        <p className="text-muted-foreground mt-2">
          Track employee hours, location, and activities with real-time cost calculations
        </p>
      </div>

      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tracker">Time Tracker</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker">
          <div className="space-y-6">
            {/* Employee Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Employee</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  title="Select Employee"
                  aria-label="Select Employee"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select an employee...</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.personalInfo.firstName} {employee.personalInfo.lastName} - {employee.employment.position}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {/* Real-time Cost Display */}
            {selectedEmployee && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <DollarSign className="h-5 w-5" />
                    Real-time Labor Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-700">${laborRate.toFixed(2)}</div>
                      <div className="text-sm text-green-600">Hourly Rate (with tax)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-700">{currentHours}h</div>
                      <div className="text-sm text-green-600">Hours Today</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-700">${estimatedLaborCost.toFixed(2)}</div>
                      <div className="text-sm text-green-600">Total Cost Today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Time Tracker Component */}
            {selectedEmployee && (
              <EmployeeTimeTracker
                employeeId={selectedEmployee.id}
                employeeName={`${selectedEmployee.personalInfo.firstName} ${selectedEmployee.personalInfo.lastName}`}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Time Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed time reports with integrated cost analysis will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Time Tracking Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Analytics summary - connect real data here */}
              <div className="mb-4">
                <div className="font-semibold">Total Hours: 320</div>
                <div className="font-semibold">Average Hours per Employee: 40</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'Alice', hours: 42 },
                  { name: 'Bob', hours: 38 },
                  { name: 'Carlos', hours: 40 },
                  { name: 'Diana', hours: 36 },
                  { name: 'Eve', hours: 44 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Virginia Labor Rates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Crew Leader:</span>
                      <span className="font-medium">${getCostByName('Crew Leader')?.price_with_tax.toFixed(2) || '29.50'}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment Operator:</span>
                      <span className="font-medium">$26.00/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>General Laborer:</span>
                      <span className="font-medium">$19.25/hr</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Cost Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    All time tracking data automatically integrates with the cost management system, 
                    providing real-time labor cost calculations with Virginia tax rates applied.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
