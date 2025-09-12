'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

export function MethodSelector({ value, onChange }: MethodSelectorProps) {
  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Method" />
      </SelectTrigger>
      <SelectContent>
        {methods.map((method) => (
          <SelectItem key={method} value={method}>
            {method}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
