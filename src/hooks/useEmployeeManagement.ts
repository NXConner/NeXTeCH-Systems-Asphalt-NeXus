
import { useState, useCallback } from 'react';
import { Employee, Department, Payroll } from '@/types/employee';
import { mockEmployees, mockDepartments } from '@/data/mockEmployeeData';

export const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const addEmployee = useCallback((employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: `emp-${String(employees.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  }, [employees]);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === id 
          ? { ...emp, ...updates, updatedAt: new Date().toISOString() } 
          : emp
      )
    );
  }, []);

  const removeEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  }, []);

  const getEmployeeById = useCallback((id: string) => {
    return employees.find(emp => emp.id === id) || null;
  }, [employees]);

  const getEmployeesByDepartment = useCallback((departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (!department) return [];
    
    return employees.filter(emp => emp.employment.department === department.name);
  }, [employees, departments]);

  const addDepartment = useCallback((department: Omit<Department, 'id'>) => {
    const newDepartment: Department = {
      ...department,
      id: `dept-${String(departments.length + 1).padStart(3, '0')}`
    };
    
    setDepartments(prev => [...prev, newDepartment]);
    return newDepartment;
  }, [departments]);

  const updateDepartment = useCallback((id: string, updates: Partial<Department>) => {
    setDepartments(prev => 
      prev.map(dept => 
        dept.id === id 
          ? { ...dept, ...updates } 
          : dept
      )
    );
  }, []);

  const removeDepartment = useCallback((id: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
  }, []);

  const calculatePayroll = useCallback(() => {
    // Simplified payroll calculation
    return employees.map(employee => {
      const isHourly = employee.compensation.payType === 'hourly';
      const regularHours = Math.min(employee.timeTracking.currentWeekHours, 40);
      const overtimeHours = Math.max(0, employee.timeTracking.currentWeekHours - 40);
      
      let grossPay = 0;
      if (isHourly) {
        grossPay = (regularHours * employee.compensation.baseRate) + 
                  (overtimeHours * (employee.compensation.overtimeRate || employee.compensation.baseRate * 1.5));
      } else {
        // For salaried employees, calculate weekly pay
        grossPay = employee.compensation.baseRate / 52;
      }
      
      const federalTax = grossPay * 0.15;
      const stateTax = grossPay * 0.05;
      const socialSecurity = grossPay * 0.062;
      const medicare = grossPay * 0.0145;
      const healthInsurance = employee.benefits.healthInsurance ? 25 : 0;
      const retirement = employee.benefits.retirement401k ? grossPay * 0.04 : 0;
      
      const totalDeductions = federalTax + stateTax + socialSecurity + medicare + healthInsurance + retirement;
      const netPay = grossPay - totalDeductions;
      
      const payroll: Payroll = {
        id: `pay-${employee.id}-${new Date().getTime()}`,
        employeeId: employee.id,
        payPeriod: {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        },
        grossPay,
        deductions: {
          federalTax,
          stateTax,
          socialSecurity,
          medicare,
          healthInsurance,
          retirement401k: retirement,
          other: 0
        },
        netPay,
        payDate: new Date().toISOString(),
        status: 'draft'
      };
      
      return payroll;
    });
  }, [employees]);

  return {
    employees,
    departments,
    selectedEmployee,
    setSelectedEmployee,
    addEmployee,
    updateEmployee,
    removeEmployee,
    getEmployeeById,
    getEmployeesByDepartment,
    addDepartment,
    updateDepartment,
    removeDepartment,
    calculatePayroll
  };
};
