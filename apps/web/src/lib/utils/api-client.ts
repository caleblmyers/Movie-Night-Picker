/**
 * Client-side API utilities for making authenticated requests
 */

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success?: boolean;
}

/**
 * Makes an authenticated API request
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `Request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Makes a POST request to an API endpoint
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  body: unknown
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Makes a PUT request to an API endpoint
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  body: unknown
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * Makes a DELETE request to an API endpoint
 */
export async function apiDelete<T = unknown>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(endpoint, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return apiRequest<T>(url.pathname + url.search, {
    method: "DELETE",
  });
}

/**
 * Makes a GET request to an API endpoint
 */
export async function apiGet<T = unknown>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(endpoint, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return apiRequest<T>(url.pathname + url.search, {
    method: "GET",
  });
}

