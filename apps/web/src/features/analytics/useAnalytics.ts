import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsOverview } from '@/lib/api';

export function useAnalytics() {
  return useQuery({ queryKey: ['analytics'], queryFn: fetchAnalyticsOverview });
}
