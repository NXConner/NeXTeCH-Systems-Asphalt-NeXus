
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Users, DollarSign, Clock, Award } from "lucide-react";
import { useEmployeeManagement } from "@/hooks/useEmployeeManagement";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { Employee } from "@/types/employee";

const EmployeeManagementEnhanced = () => {
  const {
    employees,
    departments,
    selectedEmployee,
    setSelectedEmployee,
    addEmployee,
    updateEmployee,
    removeEmployee,
    calculatePayroll
  } = useEmployeeManagement();

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter(employee =>
    `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    employee.employment.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEmployee = (employee: Employee) => {
    if (editingEmployee) {
      updateEmployee(employee.id, employee);
    } else {
      addEmployee(employee);
    }
    setShowForm(false);
    setEditingEmployee(undefined);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.employment.status === 'active').length,
    totalPayroll: employees.reduce((sum, emp) => sum + emp.compensation.baseRate, 0),
    departments: departments.length
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onCancel={() => {
            setShowForm(false);
            setEditingEmployee(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600 mt-2">Manage your workforce and HR operations</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                  <div className="text-sm text-muted-foreground">Total Employees</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.activeEmployees}</div>
                  <div className="text-sm text-muted-foreground">Active Employees</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">${stats.totalPayroll.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Payroll Base</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.departments}</div>
                  <div className="text-sm text-muted-foreground">Departments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="employees" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          <TabsContent value="employees" className="space-y-4">
            <div className="grid gap-4">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">
                            {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                          </h3>
                          <Badge className={getStatusColor(employee.employment.status)}>
                            {employee.employment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="font-medium">Position:</span> {employee.employment.position}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span> {employee.employment.department}
                          </div>
                          <div>
                            <span className="font-medium">Employee ID:</span> {employee.employment.employeeId}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                          <div>{employee.personalInfo.email}</div>
                          <div>{employee.personalInfo.phone}</div>
                          <div>Hired: {new Date(employee.employment.hireDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2 ml-6">
                        <div className="text-lg font-bold text-green-600">
                          ${employee.compensation.baseRate.toLocaleString()}
                          <span className="text-sm text-gray-500">
                            /{employee.compensation.payType === 'hourly' ? 'hr' : 'year'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedEmployee(employee)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculatePayroll().map((payroll) => {
                    const employee = employees.find(emp => emp.id === payroll.employeeId);
                    return (
                      <div key={payroll.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">
                            {employee?.personalInfo.firstName} {employee?.personalInfo.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">{employee?.employment.position}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ${payroll.netPay.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Gross: ${payroll.grossPay.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((department) => {
                const deptEmployees = employees.filter(emp => emp.employment.department === department.name);
                return (
                  <Card key={department.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {department.name}
                        <Badge variant="outline">{deptEmployees.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Manager:</span> {department.manager}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Budget:</span> ${department.budget?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {department.description}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Employee Directory
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Performance Reviews
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Training Records
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Certification Tracking
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payroll Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Payroll Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Time & Attendance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Benefits Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Tax Summary
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeManagementEnhanced;
