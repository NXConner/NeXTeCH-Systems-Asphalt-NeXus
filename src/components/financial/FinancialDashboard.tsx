
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  PieChart,
  BarChart3,
  Calendar
} from "lucide-react";

interface FinancialData {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
  };
  expenses: {
    total: number;
    monthly: number;
    categories: { name: string; amount: number; }[];
  };
  profit: {
    gross: number;
    net: number;
    margin: number;
  };
  cashFlow: {
    inflow: number;
    outflow: number;
    balance: number;
  };
  accounts: {
    receivable: number;
    payable: number;
    overdue: number;
  };
}

interface FinancialDashboardProps {
  data: FinancialData;
}

export const FinancialDashboard = ({ data }: FinancialDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">${data.revenue.total.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+{data.revenue.growth}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">${data.expenses.total.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Expenses</div>
                <div className="text-xs text-gray-500">Monthly: ${data.expenses.monthly.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">${data.profit.net.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Net Profit</div>
                <div className="text-xs text-gray-500">{data.profit.margin}% margin</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">${data.cashFlow.balance.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Cash Flow</div>
                <div className="text-xs text-gray-500">Available balance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cash Inflow</span>
                    <span className="font-medium text-green-600">
                      ${data.cashFlow.inflow.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash Outflow</span>
                    <span className="font-medium text-red-600">
                      ${data.cashFlow.outflow.toLocaleString()}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Net Cash Flow</span>
                    <span className={data.cashFlow.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${data.cashFlow.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Gross Profit</span>
                    <span className="font-medium">${data.profit.gross.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Profit</span>
                    <span className="font-medium">${data.profit.net.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin</span>
                    <span className="font-medium">{data.profit.margin}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">Profit Margin Progress</span>
                  <Progress value={data.profit.margin} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-12 w-12 text-gray-400" />
                  <span className="ml-2 text-gray-500">Revenue chart placeholder</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Paving Projects</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Maintenance</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Materials</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.expenses.categories.map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-lg font-bold">
                        ${category.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accounts Receivable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${data.accounts.receivable.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Outstanding invoices</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accounts Payable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  ${data.accounts.payable.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Pending payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overdue Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${data.accounts.overdue.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Past due invoices</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
