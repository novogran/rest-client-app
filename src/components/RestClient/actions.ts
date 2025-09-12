'use server';

interface RequestPayload {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export async function executeRequest(payload: RequestPayload) {
  const startTime = Date.now();
  try {
    const response = await fetch(payload.url, {
      method: payload.method,
      headers: payload.headers,
      body: payload.body,
    });
    const duration = Date.now() - startTime;

    const responseData = await response.text();
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      headers: responseHeaders,
      duration,
      error: null,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      status: null,
      statusText: null,
      data: null,
      headers: null,
      duration,
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'Failed to fetch',
    };
  }
}
