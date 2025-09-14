'use server';

import { getSession } from '@/lib/session';
import { db } from '@/firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface RequestPayload {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

interface ClientResponse {
  status: number | null;
  statusText: string | null;
  data: string | null;
  headers: Record<string, string> | null;
  duration: number;
  error: string | null;
}

export async function executeRequest(
  payload: RequestPayload
): Promise<ClientResponse> {
  const startTime = Date.now();
  let responseForClient: string | null = null;
  try {
    const response = await fetch(payload.url, {
      method: payload.method,
      headers: payload.headers,
      body: payload.body,
    });
    const duration = Date.now() - startTime;

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const rawText = await response.text();
    try {
      const jsonData: unknown = JSON.parse(rawText);
      responseForClient = JSON.stringify(jsonData, null, 2);
    } catch {
      responseForClient = rawText;
    }

    const clientResponse = {
      status: response.status,
      statusText: response.statusText,
      data: responseForClient,
      headers: responseHeaders,
      duration,
      error: null,
    };

    await saveToHistory(payload, clientResponse);

    return clientResponse;
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorResponse = {
      status: null,
      statusText: null,
      data: null,
      headers: null,
      duration,
      error: error instanceof Error ? error.message : 'Failed to fetch',
    };

    await saveToHistory(payload, errorResponse);

    return errorResponse;
  }
}

async function saveToHistory(
  request: RequestPayload,
  response: ClientResponse
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      console.log('No active session, skipping history save.');
      return;
    }

    const historyEntry = {
      userId: session.userId,
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        size: request.body ? new Blob([request.body]).size : 0,
      },
      response: {
        status: response.status,
        duration: response.duration,
        size: response.data ? new Blob([response.data]).size : 0,
        error: response.error,
      },
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'history'), historyEntry);
  } catch (error) {
    console.error('Failed to save request to history:', error);
  }
}
