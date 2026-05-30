import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type CreateEmployeeBody,
  type EmployeeFilters,
  createEmployee,
  deactivateEmployee,
  fetchEmployees,
  updateEmployee,
} from '@/lib/api';

export function useEmployees(filters: EmployeeFilters) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => fetchEmployees(filters),
    placeholderData: keepPreviousData,
  });
}

export function useEmployeeMutations() {
  const queryClient = useQueryClient();
  const invalidate = (): void => {
    void queryClient.invalidateQueries({ queryKey: ['employees'] });
    void queryClient.invalidateQueries({ queryKey: ['analytics'] });
  };

  const create = useMutation({ mutationFn: createEmployee, onSuccess: invalidate });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CreateEmployeeBody> }) =>
      updateEmployee(id, body),
    onSuccess: invalidate,
  });
  const deactivate = useMutation({ mutationFn: deactivateEmployee, onSuccess: invalidate });

  return { create, update, deactivate };
}
