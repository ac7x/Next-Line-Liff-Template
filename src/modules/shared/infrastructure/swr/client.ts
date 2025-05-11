import { QueryClient } from '@tanstack/react-query';
import useSWR, { MutatorOptions, SWRConfiguration, mutate as swrMutate } from 'swr';

// SWR 僅用於 partial update 或跨組件同步（如 mutate/revalidate）
export function mutateSWR(key: string, data?: any, options?: MutatorOptions) {
  return swrMutate(key, data, options);
}

export function revalidateSWR(key: string) {
  return swrMutate(key);
}

// React Query 快取失效（需傳入全域 queryClient 實例）
export async function invalidateReactQuery(queryClient: QueryClient, queryKey: unknown[]) {
  await queryClient.invalidateQueries({ queryKey });
}

// SWR 通用 hook（僅用於需要 SWR 的場景，推薦優先用 React Query）
export function useSWRClient<Data = any, Error = any>(
  key: string,
  fetcher: () => Promise<Data>,
  config?: SWRConfiguration<Data, Error>
) {
  return useSWR<Data, Error>(key, fetcher, config);
}
