import { useState, useEffect, useCallback } from 'react';

export interface UseFetchOptions {
    /**
     * Automatically fetch on mount
     * @default true
     */
    autoFetch?: boolean;
    /**
     * Dependencies array for refetching
     */
    deps?: any[];
}

export interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching data with loading and error states
 *
 * @example
 * ```typescript
 * const { data, loading, error, refetch } = useFetch(() => getUser());
 * ```
 *
 * @example
 * ```typescript
 * // Manual fetch
 * const { data, loading, refetch } = useFetch(() => getUserById(userId), { autoFetch: false });
 * useEffect(() => {
 *   if (userId) refetch();
 * }, [userId, refetch]);
 * ```
 */
export function useFetch<T>(
    fetchFn: () => Promise<T>,
    options: UseFetchOptions = {}
): UseFetchResult<T> {
    const { autoFetch = true, deps = [] } = options;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState<Error | null>(null);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFn();
            setData(result);
        } catch (e) {
            const error = e instanceof Error ? e : new Error('An error occurred');
            setError(error);
            console.error('[useFetch] Error:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchFn]);

    useEffect(() => {
        if (autoFetch) {
            refetch();
        }
    }, [autoFetch, refetch, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

    return { data, loading, error, refetch };
}
