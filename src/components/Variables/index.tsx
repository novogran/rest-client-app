'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addVariable,
  removeVariable,
  updateVariable,
  selectVariables,
} from './variablesSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

export function VariablesPage() {
  const dispatch = useAppDispatch();
  const variables = useAppSelector(selectVariables);

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Variables</h1>
        <Button onClick={() => dispatch(addVariable())}>Add Variable</Button>
      </div>
      <div className="space-y-2 rounded-md border p-4">
        {variables.map((variable) => (
          <div key={variable.id} className="flex items-center gap-2">
            <Input
              placeholder="Variable Name"
              value={variable.key}
              onChange={(e) =>
                dispatch(
                  updateVariable({ id: variable.id, key: e.target.value })
                )
              }
            />
            <Input
              placeholder="Variable Value"
              value={variable.value}
              onChange={(e) =>
                dispatch(
                  updateVariable({ id: variable.id, value: e.target.value })
                )
              }
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(removeVariable(variable.id))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {variables.length === 0 && (
          <p className="text-sm text-muted-foreground p-4 text-center">
            No variables created yet.
          </p>
        )}
      </div>
    </div>
  );
}
