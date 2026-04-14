import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Employee, RoleChangePayload } from '../types';
import { employees as initialData } from '../data';
import { applyRoleChange } from '../utils';

interface EmployeeContextValue {
  employees: Employee[];
  updateRole: (payload: RoleChangePayload) => void;
  getById: (id: string) => Employee | undefined;
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialData);

  const updateRole = useCallback((payload: RoleChangePayload) => {
    setEmployees((prev) => applyRoleChange(prev, payload));
  }, []);

  const getById = useCallback(
    (id: string) => employees.find((e) => e.id === id),
    [employees],
  );

  return (
    <EmployeeContext.Provider value={{ employees, updateRole, getById }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees(): EmployeeContextValue {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployees must be used within EmployeeProvider');
  return ctx;
}
