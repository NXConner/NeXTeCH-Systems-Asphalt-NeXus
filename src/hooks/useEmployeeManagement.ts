import { useState, useCallback } from 'react';
import { Employee, Department, Payroll } from '@/types/employee';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEmployeeManagement = () => {
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase.from('employees').select('*');
      if (error) throw error;
      return data as Employee[];
    }
  });

  const { data: departments = [], isLoading: departmentsLoading, error: departmentsError } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('departments').select('*');
      if (error) throw error;
      return data as Department[];
    }
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const addEmployee = useMutation({
    mutationFn: async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase.from('employees').insert(employee).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['employees'])
  });

  const updateEmployee = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Employee> }) => {
      const { data, error } = await supabase.from('employees').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['employees'])
  });

  const removeEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries(['employees'])
  });

  const getEmployeeById = useCallback((id: string) => {
    return employees.find(emp => emp.id === id) || null;
  }, [employees]);

  const getEmployeesByDepartment = useCallback((departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (!department) return [];
    
    return employees.filter(emp => emp.employment.department === department.name);
  }, [employees, departments]);

  const addDepartment = useMutation({
    mutationFn: async (department: Omit<Department, 'id'>) => {
      const { data, error } = await supabase.from('departments').insert(department).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['departments'])
  });

  const updateDepartment = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Department> }) => {
      const { data, error } = await supabase.from('departments').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['departments'])
  });

  const removeDepartment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries(['departments'])
  });

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
