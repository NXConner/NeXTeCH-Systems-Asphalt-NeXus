
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, TrendingUp, DollarSign } from "lucide-react";

const fleetUtilizationData = [
  { month: 'Jan', utilization: 85, maintenance: 15 },
  { month: 'Feb', utilization: 78, maintenance: 22 },
  { month: 'Mar', utilization: 92, maintenance: 8 },
  { month: 'Apr', utilization: 88, maintenance: 12 },
  { month: 'May', utilization: 95, maintenance: 5 },
  { month: 'Jun', utilization: 90, maintenance: 10 },
];

const revenueData = [
  { name: 'Paving', value: 450000, color: '#3b82f6' },
  { name: 'Maintenance', value: 280000, color: '#10b981' },
  { name: 'Sealcoating', value: 150000, color: '#f59e0b' },
  { name: 'Striping', value: 120000, color: '#8b5cf6' },
];

export function UnifiedReports() {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fleet Utilization
          </CardTitle>
          <CardDescription>
            Monthly fleet utilization vs maintenance time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fleetUtilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
              <Bar dataKey="maintenance" fill="#f59e0b" name="Maintenance %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue by Service Type
          </CardTitle>
          <CardDescription>
            Revenue distribution across service categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Revenue</span>
              <span className="text-lg font-bold">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Reports
          </CardTitle>
          <CardDescription>
            Generate comprehensive reports across fleet and business operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              Fleet Report
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Financial Report
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Performance Report
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
