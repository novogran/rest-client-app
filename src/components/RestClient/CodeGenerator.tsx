'use client';

import { useMemo, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { HTTPSnippet } from 'httpsnippet';
import type { Har } from 'har-format';
import { RootState } from '@/lib/store';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeMirror from '@uiw/react-codemirror';

import { StreamLanguage } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { go } from '@codemirror/lang-go';
import { cpp } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';

const targets = [
  { key: 'shell_curl', title: 'cURL', lang: StreamLanguage.define(shell) },
  {
    key: 'javascript_fetch',
    title: 'JS (Fetch)',
    lang: javascript({ jsx: true }),
  },
  { key: 'javascript_xhr', title: 'JS (XHR)', lang: javascript({ jsx: true }) },
  { key: 'node_native', title: 'Node.js', lang: javascript({ jsx: true }) },
  { key: 'python_requests', title: 'Python', lang: python() },
  { key: 'java_okhttp', title: 'Java', lang: java() },
  { key: 'csharp_restsharp', title: 'C#', lang: cpp() },
  { key: 'go_native', title: 'Go', lang: go() },
  { key: 'php_curl', title: 'PHP', lang: php() },
  { key: 'ruby_native', title: 'Ruby', lang: javascript({ jsx: true }) },
];

export function CodeGenerator() {
  const [selectedTarget, setSelectedTarget] = useState(targets[0].key);

  const requestState = useSelector((state: RootState) => {
    const { method, url, headers, body } = state.restClient;
    return { method, url, headers, body };
  }, shallowEqual);

  const codeSnippet = useMemo(() => {
    if (!requestState.url) {
      return 'Please enter a URL to generate a code snippet.';
    }
    try {
      const har: Har = {
        log: {
          version: '1.2',
          creator: { name: 'REST Client App', version: '1.0' },
          entries: [
            {
              startedDateTime: new Date().toISOString(),
              time: 0,
              request: {
                method: requestState.method,
                url: requestState.url,
                headers: requestState.headers
                  .filter((h) => h.enabled && h.key)
                  .map((h) => ({ name: h.key, value: h.value })),
                postData: requestState.body
                  ? {
                      mimeType:
                        requestState.headers.find(
                          (h) =>
                            h.enabled && h.key.toLowerCase() === 'content-type'
                        )?.value || 'application/json',
                      text: requestState.body,
                    }
                  : undefined,
                httpVersion: 'HTTP/1.1',
                cookies: [],
                queryString: [],
                headersSize: -1,
                bodySize: -1,
              },
              response: {
                status: 0,
                statusText: '',
                httpVersion: 'HTTP/1.1',
                cookies: [],
                headers: [],
                content: { size: 0, mimeType: '' },
                redirectURL: '',
                headersSize: -1,
                bodySize: -1,
              },
              cache: {},
              timings: { send: 0, wait: 0, receive: 0 },
            },
          ],
        },
      };

      const snippet = new HTTPSnippet(har);
      const [target, client] = selectedTarget.split('_');

      type ConvertParams = Parameters<typeof snippet.convert>;
      const result = snippet.convert(
        target as ConvertParams[0],
        client as ConvertParams[1]
      );

      return result || 'Could not generate snippet for this target.';
    } catch (error) {
      console.error('Failed to generate code snippet:', error);
      return 'An error occurred while generating the code snippet.';
    }
  }, [requestState, selectedTarget]);

  const selectedLangExtension = targets.find(
    (t) => t.key === selectedTarget
  )?.lang;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Code</h3>
      <div className="rounded-md border">
        <Tabs
          value={selectedTarget}
          onValueChange={setSelectedTarget}
          className="w-full"
        >
          <TabsList className="m-1 h-auto flex-wrap justify-start">
            {targets.map((target) => (
              <TabsTrigger key={target.key} value={target.key}>
                {target.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={selectedTarget} className="mt-0">
            <CodeMirror
              value={
                Array.isArray(codeSnippet)
                  ? codeSnippet.join('\n')
                  : codeSnippet
              }
              height="250px"
              extensions={selectedLangExtension ? [selectedLangExtension] : []}
              readOnly
              theme="dark"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
