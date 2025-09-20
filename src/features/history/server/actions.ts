'use server';

import { db } from '@/core/firebase/client';
import { getSession } from '@/core/session/session';
import { logger } from '@/core/utils/logger';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

export interface HistoryEntry {
  id: string;
  userId: string;
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: string;
    size: number;
  };
  response: {
    status: number | null;
    duration: number | null;
    error: string | null;
    size: number;
  };
  createdAt: Date;
}

export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return [];
    }

    const q = query(
      collection(db, 'history'),
      where('userId', '==', session.userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    const history: HistoryEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      history.push({
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as HistoryEntry);
    });

    return history;
  } catch (error) {
    logger.error('Failed to fetch history:', error);
    return [];
  }
}
