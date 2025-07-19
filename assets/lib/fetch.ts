import {useCallback, useState} from "react";

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  data?: Record<string, any> | FormData | null;
  contentType?: "json" | "form-data";
  accept?: "json" | "text";
}

export async function apiFetch<T>(
  url: string,
  options: ApiFetchOptions = {
    data: null,
    contentType: "json",
    accept: "json",
  }
) {
  const {data = null, contentType = "json", accept = "json"} = options;
  let headers: Record<string, string> = {};

  if (data && !(data instanceof FormData) && contentType === "json")
    headers["Content-Type"] = "application/json";
  if (accept === "json") headers["Accept"] = "application/json";

  const response = await fetch(url, {
    ...options,
    body: data
      ? data instanceof FormData
        ? data
        : JSON.stringify(data)
      : null,
    headers: {
      ...headers,
      ...options.headers,
    },
    method: options.method ?? "GET",
  });

  if (!response.ok) {
    // if (response.status === 401) {
    //   toast.error("Unauthorized access - please log in again.", { closeButton: true });
    //   // Clear user state on 401 by accessing the store directly
    //   useAppStore.getState().setUser(null);
    // }

    throw new ApiError(await response.json(), response.status);
  }

  if (response.status === 204) {
    return null as unknown as T; // No content response
  }

  return accept === "json"
    ? ((await response.json()) as T)
    : ((await response.text()) as T);
}

export class ApiError<T> extends Error {
  public data: T;
  public statusCode: number;

  constructor(
    data: T,
    statusCode: number
  ) {
    super();
    this.name = "ApiError";
    this.data = data;
    this.statusCode = statusCode;
  }
}

interface UseApiFetchOptions<T, S> extends ApiFetchOptions {
  onError?: (error: ApiError<S>) => void;
  onSuccess?: (data: T) => void;
}

export function useApiFetch<T, S>(
  url: string,
  options: UseApiFetchOptions<T, S> = {
    contentType: "json",
    accept: "json",
  },
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError<S> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { onError, onSuccess, ...restOptions } = options;

  const fetchData = useCallback(async (data: ApiFetchOptions["data"] = options.data) => {
    if (loading) return; // Prevent multiple concurrent requests

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch<T>(url, {
        ...restOptions,
        data
      });
      setData(res);
      onSuccess?.(res);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
        onError?.(err);
      } else {
        console.error("Unexpected error:", err);
        throw err; // Re-throw unexpected errors
      }
    } finally {
      setLoading(false);
    }
  }, [url, loading, ...deps]);

  return {
    data,
    error,
    loading,
    callback: fetchData
  };
}
