import { describe, it, expect } from 'vitest';
import { applyVariables } from './variable-replacer';
import { Variable } from '@/features/variables/model/slice';

describe('applyVariables Utility', () => {
  const variables: Variable[] = [
    { id: '1', key: 'host', value: 'api.example.com' },
    { id: '2', key: 'user_id', value: '123' },
    { id: '3', key: 'token', value: 'Bearer XYZ' },
  ];

  const testCases = [
    {
      description: 'should replace a single variable in the URL',
      input: 'https://{{host}}/users',
      expected: 'https://api.example.com/users',
    },
    {
      description: 'should replace multiple variables',
      input: 'https://{{host}}/users/{{user_id}}',
      expected: 'https://api.example.com/users/123',
    },
    {
      description: 'should replace variables in headers and body',
      input: 'Authorization: {{token}}',
      expected: 'Authorization: Bearer XYZ',
    },
    {
      description: 'should handle repeated variables',
      input: 'id={{user_id}}&id2={{user_id}}',
      expected: 'id=123&id2=123',
    },
    {
      description: 'should ignore non-existent variables',
      input: 'https://{{host}}/path/{{non_existent_var}}',
      expected: 'https://api.example.com/path/{{non_existent_var}}',
    },
    {
      description: 'should handle variables with spaces in the template',
      input: 'Bearer {{ token }}',
      expected: 'Bearer Bearer XYZ',
    },
    {
      description:
        'should return the original string if no variables are present',
      input: 'A string with no variables.',
      expected: 'A string with no variables.',
    },
    {
      description: 'should handle an empty string input',
      input: '',
      expected: '',
    },
  ];

  it.each(testCases)('$description', ({ input, expected }) => {
    const result = applyVariables(input, variables);
    expect(result).toBe(expected);
  });
});
