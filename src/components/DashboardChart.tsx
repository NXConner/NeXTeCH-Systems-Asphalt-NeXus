import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 95000, jobs: 12 },
  { month: "Feb", revenue: 110000, jobs: 15 },
  { month: "Mar", revenue: 125000, jobs: 18 },
  { month: "Apr", revenue: 95000, jobs: 14 },
  { month: "May", revenue: 135000, jobs: 20 },
  { month: "Jun", revenue: 125430, jobs: 16 },
];

const fleetUtilization = [
  { name: "Active", value: 18, color: "#10B981" },
  { name: "Maintenance", value: 3, color: "#EF4444" },
  { name: "Idle", value: 3, color: "#6B7280" },
];

const DashboardChart = () => {
  const chartColors = {
    grid: "#E5E7EB",
    text: "#374151",
    bar: "#3B82F6"
  };

  const renderCustomLabel = ({ name, value }: { name: string; value: number }) => {
    return `${name}: ${value}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue and job count over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="month" tick={{ fill: chartColors.text }} />
              <YAxis tick={{ fill: chartColors.text }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Jobs'
                ]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${chartColors.grid}`,
                  borderRadius: "6px",
                  color: chartColors.text
                }}
              />
              <Bar dataKey="revenue" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Utilization</CardTitle>
          <CardDescription>Current status of your vehicle fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fleetUtilization}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={renderCustomLabel}
              >
                {fleetUtilization.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${chartColors.grid}`,
                  borderRadius: "6px",
                  color: chartColors.text
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardChart;
