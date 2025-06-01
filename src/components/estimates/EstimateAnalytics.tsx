
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', estimates: 12, value: 480000, converted: 8 },
  { month: 'Feb', estimates: 15, value: 620000, converted: 11 },
  { month: 'Mar', estimates: 18, value: 750000, converted: 13 },
  { month: 'Apr', estimates: 22, value: 890000, converted: 16 },
  { month: 'May', estimates: 19, value: 760000, converted: 14 },
  { month: 'Jun', estimates: 25, value: 1020000, converted: 19 }
];

const statusData = [
  { name: 'Pending', value: 35, color: '#f59e0b' },
  { name: 'Approved', value: 45, color: '#10b981' },
  { name: 'Rejected', value: 15, color: '#ef4444' },
  { name: 'Draft', value: 5, color: '#6b7280' }
];

export const EstimateAnalytics = () => {
  const totalValue = monthlyData.reduce((sum, item) => sum + item.value, 0);
  const totalEstimates = monthlyData.reduce((sum, item) => sum + item.estimates, 0);
  const totalConverted = monthlyData.reduce((sum, item) => sum + item.converted, 0);
  const conversionRate = ((totalConverted / totalEstimates) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{totalEstimates}</div>
                <div className="text-sm text-muted-foreground">Total Estimates</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% vs last period
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Total Value</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18% vs last period
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{conversionRate}%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2% vs last period
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">3.2</div>
                <div className="text-sm text-muted-foreground">Avg Days to Close</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Improved by 0.5 days
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Estimates Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'value' ? `$${(value as number / 1000).toFixed(0)}K` : value,
                    name === 'estimates' ? 'Estimates' : name === 'converted' ? 'Converted' : 'Value'
                  ]}
                />
                <Bar dataKey="estimates" fill="#3b82f6" name="estimates" />
                <Bar dataKey="converted" fill="#10b981" name="converted" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimate Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
