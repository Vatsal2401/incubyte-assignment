import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { EmployeesPage } from '@/pages/EmployeesPage';

export function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
    </Routes>
  );
}
