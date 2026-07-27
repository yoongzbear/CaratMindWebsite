export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function parseJsonSafe(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  const { accessToken, headers, ...rest } = options;

  const res = await fetch(path, {
    ...rest,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  const contentType = res.headers.get('content-type') ?? '';
  let data: unknown;

  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    console.error('Non-JSON response from server:', text);
    data = { error: 'Unexpected response from server.' };
  }

  if (!res.ok) {
    const message =
      typeof data === 'object' && data !== null && 'error' in data
        ? (data as { error: string }).error
        : 'Request failed.';
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export { request };
