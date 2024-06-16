/* eslint-disable @typescript-eslint/no-explicit-any */
import {QueryClient, QueryKey} from '@tanstack/react-query';

class TanStackQueryService {
  static queryClient = new QueryClient();

  static prefetchInfiniteQuery = async (
    queryKey: QueryKey,
    queryFn: any,
    initialPageParam: number,
  ) => {
    await TanStackQueryService.queryClient.prefetchInfiniteQuery({
      queryKey,
      queryFn,
      initialPageParam: initialPageParam as never,
      staleTime: 1000 * 60 * 5,
    });
  };
}

export default TanStackQueryService;
