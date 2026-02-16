import { useState, useEffect, useCallback } from 'react';

export interface UseFetchMultipleOptions {
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

export interface UseFetchMultipleResult<T extends any[]> {
    data: T;
    loading: boolean;
    errors: (Error | null)[];
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching multiple data sources in parallel
 *
 * @example
 * ```typescript
 * const { data, loading, errors, refetch } = useFetchMultiple([
 *   () => getUser(),
 *   () => getMissions(),
 *   () => getCollections(),
 * ]);
 * const [user, missions, collections] = data;
 * ```
 */
export function useFetchMultiple<T extends any[]>(
    fetchFns: { [K in keyof T]: () => Promise<T[K]> },
    options: UseFetchMultipleOptions = {}
): UseFetchMultipleResult<T> {
    const { autoFetch = true, deps = [] } = options;

    const [data, setData] = useState<T>([] as any as T);
    const [loading, setLoading] = useState(autoFetch);
    const [errors, setErrors] = useState<(Error | null)[]>([]);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            setErrors([]);

            const results = await Promise.allSettled(
                fetchFns.map(fn => fn())
            );

            const newData: any[] = [];
            const newErrors: (Error | null)[] = [];

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    newData[index] = result.value;
                    newErrors[index] = null;
                } else {
                    newData[index] = null;
                    newErrors[index] = result.reason instanceof Error
                        ? result.reason
                        : new Error('An error occurred');
                    console.error(`[useFetchMultiple] Error in fetch ${index}:`, result.reason);
                }
            });

            setData(newData as T);
            setErrors(newErrors);
        } catch (e) {
            const error = e instanceof Error ? e : new Error('An unexpected error occurred');
            console.error('[useFetchMultiple] Unexpected error:', error);
            setErrors([error]);
        } finally {
            setLoading(false);
        }
    }, [fetchFns]);

    useEffect(() => {
        if (autoFetch) {
            refetch();
        }
    }, [autoFetch, refetch, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

    return { data, loading, errors, refetch };
}
