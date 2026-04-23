import type { SWRConfiguration } from "swr";

export class FetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "FetchError";
    this.status = status;
  }
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new FetchError(data.error || `Request failed with status ${res.status}`, res.status);
  }
  return res.json();
}

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 60000,
  shouldRetryOnError: (err) => {
    // Don't retry client errors (bad city, invalid params, rate-limited).
    if (err instanceof FetchError) {
      return err.status >= 500;
    }
    return true;
  },
  errorRetryCount: 3,
  errorRetryInterval: 1500,
};
