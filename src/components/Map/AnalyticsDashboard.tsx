import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Download, Filter } from 'lucide-react';
import * as L from 'leaflet';
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  id: string;
  type: string;
  value: number;
  timestamp: number;
  category?: string;
  location?: [number, number];
}

interface AnalyticsDashboardProps {
  onDataExport?: (data: AnalyticsData[]) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  onDataExport
}) => {
  const map = useMap();
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [filteredData, setFilteredData] = useState<AnalyticsData[]>([]);
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Fetch analytics data
    const fetchData = async () => {
      try {
        // Simulated data - replace with actual API call
        const mockData: AnalyticsData[] = Array.from({ length: 100 }, (_, i) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: ['temperature', 'humidity', 'pressure'][Math.floor(Math.random() * 3)],
          value: Math.random() * 100,
          timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
          location: [
            51.505 + (Math.random() - 0.5) * 0.1,
            -0.09 + (Math.random() - 0.5) * 0.1
          ]
        }));

        setData(mockData);
        setFilteredData(mockData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFilter = () => {
    const filtered = data.filter(item => {
      const itemDate = new Date(item.timestamp);
      const isInDateRange = itemDate >= dateRange[0] && itemDate <= dateRange[1];
      const isInCategory = !selectedCategory || item.category === selectedCategory;
      return isInDateRange && isInCategory;
    });

    setFilteredData(filtered);
  };

  const handleExport = () => {
    if (onDataExport) {
      onDataExport(filteredData);
    } else {
      const dataStr = JSON.stringify(filteredData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = 'analytics-data.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const renderBarChart = () => {
    const chartData = filteredData.reduce((acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, value: 0 };
      }
      acc[date].value += item.value;
      return acc;
    }, {} as Record<string, { date: string; value: number }>);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={Object.values(chartData)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  };

  const renderLineChart = () => {
    const chartData = filteredData
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(item => ({
        date: new Date(item.timestamp).toLocaleTimeString(),
        value: item.value
      }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    const chartData = filteredData.reduce((acc, item) => {
      const category = item.category || 'Unknown';
      if (!acc[category]) {
        acc[category] = { name: category, value: 0 };
      }
      acc[category].value += item.value;
      return acc;
    }, {} as Record<string, { name: string; value: number }>);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={Object.values(chartData)}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          />
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-background/80 backdrop-blur-sm"
      >
        <BarChart className="h-4 w-4" />
      </Button>

      {isExpanded && (
        <div className="mt-2 w-[600px] bg-background/80 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFilter}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="date"
                  value={dateRange[0].toISOString().split('T')[0]}
                  onChange={e => setDateRange([new Date(e.target.value), dateRange[1]])}
                />
                <Input
                  type="date"
                  value={dateRange[1].toISOString().split('T')[0]}
                  onChange={e => setDateRange([dateRange[0], new Date(e.target.value)])}
                />
                <select
                  value={selectedCategory || ''}
                  onChange={e => setSelectedCategory(e.target.value || null)}
                  className="px-3 py-2 bg-background border rounded-md"
                >
                  <option value="">All Categories</option>
                  <option value="A">Category A</option>
                  <option value="B">Category B</option>
                  <option value="C">Category C</option>
                </select>
              </div>

              <Tabs defaultValue="bar">
                <TabsList>
                  <TabsTrigger value="bar">
                    <BarChart className="h-4 w-4 mr-2" />
                    Bar Chart
                  </TabsTrigger>
                  <TabsTrigger value="line">
                    <LineChart className="h-4 w-4 mr-2" />
                    Line Chart
                  </TabsTrigger>
                  <TabsTrigger value="pie">
                    <PieChart className="h-4 w-4 mr-2" />
                    Pie Chart
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="bar" className="mt-4">
                  {renderBarChart()}
                </TabsContent>
                <TabsContent value="line" className="mt-4">
                  {renderLineChart()}
                </TabsContent>
                <TabsContent value="pie" className="mt-4">
                  {renderPieChart()}
                </TabsContent>
              </Tabs>

              <div className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {data.length} data points
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 