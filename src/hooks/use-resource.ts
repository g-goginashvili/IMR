import { useEffect, useState } from "react"

export const useResource = <T>(
    fetcher: (signal: AbortSignal) => Promise<T>,
    initialState: T,
    errorMessage: string
) => {
    const [data, setData] = useState<T>(initialState);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetcher(controller.signal);
                setData(response);
                setIsLoading(false);
            } catch (error) {
                if (controller.signal.aborted) return;
                setData(initialState);
                setError(error instanceof Error ? error.message : errorMessage);
                setIsLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    return [
        data,
        setData,
        isLoading,
        error,
        setError
    ] as const;
};
