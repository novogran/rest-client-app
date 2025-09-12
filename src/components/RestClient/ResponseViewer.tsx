'use client';
import { useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { RootState } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export function ResponseViewer() {
  const { status, statusText, data, loading, error, duration } = useSelector(
    (state: RootState) => state.restClient.response
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-destructive">Error</h3>
        <pre className="bg-destructive/10 text-destructive p-4 rounded-md text-sm">
          {error}
        </pre>
      </div>
    );
  }

  if (status === null) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>Send a request to see the response here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <h3 className="font-semibold">Response</h3>
        <span
          className={`text-sm font-bold ${status >= 200 && status < 300 ? 'text-green-500' : 'text-red-500'}`}
        >
          Status: {status} {statusText}
        </span>
        <span className="text-sm text-muted-foreground">
          Time: {duration}ms
        </span>
      </div>
      <div className="rounded-md border">
        <CodeMirror
          value={data ?? ''}
          height="300px"
          extensions={[json()]}
          readOnly
          theme="light"
        />
      </div>
    </div>
  );
}
