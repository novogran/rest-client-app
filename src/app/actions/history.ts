'use server';

import { db } from '@/firebase/firebase';
import { getSession } from '@/lib/session';
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
  };
  response: {
    status: number | null;
    duration: number | null;
    error: string | null;
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
    console.error('Failed to fetch history:', error);
    return [];
  }
}
