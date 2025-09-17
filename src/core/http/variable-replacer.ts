import { Variable } from '@/features/variables/model/slice';

export function applyVariables(text: string, variables: Variable[]): string {
  const variablesMap = new Map(variables.map((v) => [v.key, v.value]));

  return text.replace(/{{(.*?)}}/g, (match, variableName) => {
    return variablesMap.get(variableName.trim()) ?? match;
  });
}
