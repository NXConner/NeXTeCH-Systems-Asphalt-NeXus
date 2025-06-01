import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  FileText,
  Clock,
  DollarSign,
  Award,
  UserCheck,
  Building2,
  Calendar,
  Download
} from "lucide-react";
import { Employee } from "@/types/employee";
import { mockEmployees } from "@/data/mockEmployeeData";
import { DocumentUpload } from "@/components/employee/DocumentUpload";
import { CustomerContractManager } from "@/components/contracts/CustomerContractManager";
import { DailyLog } from "@/components/reports/DailyLog";
import { ReceiptManager } from "@/components/receipts/ReceiptManager";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { toast } from "sonner";

interface Document {
  id: string;
  type: 'license' | 'w2' | 'manual' | 'contract';
  name: string;
  url: string;
  uploadDate: string;
  signed?: boolean;
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const { hasPermission, canAccess } = useRoleAccess();

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || employee.employment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleDocumentUpload = (document: Omit<Document, 'id' | 'uploadDate'>) => {
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString(),
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const exportEmployeeData = () => {
    const csvData = employees.map(emp => ({
      Name: `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`,
      Email: emp.personalInfo.email,
      Department: emp.employment.department,
      Position: emp.employment.position,
      Status: emp.employment.status,
      HireDate: emp.employment.hireDate,
      PayType: emp.compensation.payType,
      Rate: emp.compensation.baseRate,
    }));
    
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employee-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success("Employee data exported successfully");
  };

  if (!canAccess(['admin', 'manager', 'hr'])) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              You don't have permission to access employee management features.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Employee Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive HR management system for your workforce
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportEmployeeData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            {hasPermission('canEditEmployees') && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="reports">Daily Reports</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                    <p className="text-2xl font-bold">{employees.length}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
                    <p className="text-2xl font-bold">
                      {employees.filter(e => e.employment.status === 'active').length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Departments</p>
                    <p className="text-2xl font-bold">
                      {new Set(employees.map(e => e.employment.department)).size}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Tenure</p>
                    <p className="text-2xl font-bold">2.3 yrs</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-3 py-2"
              title="Filter by employee status"
              aria-label="Filter by employee status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                        </h3>
                        <Badge variant={employee.employment.status === 'active' ? 'default' : 'secondary'}>
                          {employee.employment.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-1">{employee.employment.position}</p>
                      <p className="text-sm text-muted-foreground">{employee.employment.department}</p>
                      <p className="text-sm text-muted-foreground">{employee.personalInfo.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${employee.compensation.baseRate.toLocaleString()}/{employee.compensation.payType === 'hourly' ? 'hr' : 'yr'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Hired: {new Date(employee.employment.hireDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <DocumentUpload
            employeeId="current-employee"
            documents={documents}
            onDocumentUpload={handleDocumentUpload}
          />
        </TabsContent>

        <TabsContent value="contracts">
          <CustomerContractManager />
        </TabsContent>

        <TabsContent value="reports">
          <DailyLog />
        </TabsContent>

        <TabsContent value="receipts">
          <ReceiptManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
