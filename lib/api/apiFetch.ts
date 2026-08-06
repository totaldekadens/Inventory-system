// lib/api/apiFetch.ts

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    const message =
      typeof result.data === "string"
        ? result.data
        : "Ett oväntat fel inträffade.";

    throw new ApiError(message, response.status);
  }

  return result.data;
};
