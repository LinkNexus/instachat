import {useCallback, useState} from "react";

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  data?: Record<string, any> | FormData | null;
  contentType?: "json" | "form-data";
  accept?: "json" | "text";
}

export async function apiFetch<T>(
  url: string | URL,
  options: ApiFetchOptions = {
    data: null,
    contentType: "json",
    accept: "json",
  }
) {
  const { data = null, contentType = "json", accept = "json" } = options;
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
  onSuccess?: (data: T) => void | Promise<void>;
  finally?: () => void;
}

export function useApiFetch<T, S>(
  url: string | URL,
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

  const fetchData = useCallback(
    async (params: {
      data?: ApiFetchOptions["data"];
      searchParams?: Record<string, (string|number)|(string | number)[]>;
    } = {
      data: options.data,
      searchParams: {}
    }) => {
      if (loading) return; // Prevent multiple concurrent requests
      const { data, searchParams } = params;

      setLoading(true);
      setError(null);

      if (!(url instanceof URL)) {
        url = new URL(url, window.location.origin);
      }

      // Append search parameters to the URL
      if (searchParams && Object.keys(searchParams).length > 0) {
        const urlSearchParams = new URLSearchParams();
        for (const [key, values] of Object.entries(searchParams)) {
          if (Array.isArray(values)) {
            values.forEach(value => urlSearchParams.append(key, String(value)));
          } else {
            urlSearchParams.set(key, String(values));
          }
        }
        url.search = urlSearchParams.toString();
      }

      try {
        const res = await apiFetch<T>(url, {
          ...restOptions,
          data,
        });
        setData(res);
        await onSuccess?.(res);
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
        options.finally?.();
      }
    },
    [url, loading, ...deps]
  );

  return {
    data, error,
    loading,
    callback: fetchData
  };
}
