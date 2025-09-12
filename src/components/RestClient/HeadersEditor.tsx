'use client';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { addHeader, removeHeader, updateHeader } from './restClientSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

export function HeadersEditor() {
  const dispatch: AppDispatch = useDispatch();
  const headers = useSelector((state: RootState) => state.restClient.headers);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Headers</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(addHeader())}
        >
          Add Header
        </Button>
      </div>
      <div className="space-y-2 rounded-md border p-2">
        {headers.map((header) => (
          <div key={header.id} className="flex items-center gap-2">
            <Checkbox
              checked={header.enabled}
              onCheckedChange={(checked) =>
                dispatch(updateHeader({ id: header.id, enabled: !!checked }))
              }
            />
            <Input
              placeholder="Key"
              value={header.key}
              onChange={(e) =>
                dispatch(updateHeader({ id: header.id, key: e.target.value }))
              }
            />
            <Input
              placeholder="Value"
              value={header.value}
              onChange={(e) =>
                dispatch(updateHeader({ id: header.id, value: e.target.value }))
              }
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(removeHeader(header.id))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {headers.length === 0 && (
          <p className="text-sm text-muted-foreground p-2 text-center">
            No headers added.
          </p>
        )}
      </div>
    </div>
  );
}
