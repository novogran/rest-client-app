'use client';

import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import {
  selectVariables,
  addVariable,
  updateVariable,
  removeVariable,
} from '@/features/variables';
import { useTranslations } from 'next-intl';

export default function VariablesPage() {
  const dispatch = useAppDispatch();
  const variables = useAppSelector(selectVariables);
  const t = useTranslations('Variables');

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Button onClick={() => dispatch(addVariable())}>
          {t('createVariableButton')}
        </Button>
      </div>
      <div className="space-y-2 rounded-md border p-4">
        {variables.map((v) => (
          <div key={v.id} className="flex items-center gap-2">
            <Input
              placeholder={t('variableNamePlaceholder')}
              value={v.key}
              onChange={(e) =>
                dispatch(updateVariable({ id: v.id, key: e.target.value }))
              }
            />
            <Input
              placeholder={t('variableValuePlaceholder')}
              value={v.value}
              onChange={(e) =>
                dispatch(updateVariable({ id: v.id, value: e.target.value }))
              }
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(removeVariable(v.id))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {variables.length === 0 && (
          <p className="text-sm text-muted-foreground p-4 text-center">
            {t('noVariablesMessage')}
          </p>
        )}
      </div>
    </div>
  );
}
