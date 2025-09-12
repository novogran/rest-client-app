'use client';
import { useDispatch, useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { setBody } from './restClientSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppDispatch, RootState } from '@/store/store';

export function BodyEditor() {
  const dispatch: AppDispatch = useDispatch();
  const body = useSelector((state: RootState) => state.restClient.body);

  const handlePrettify = () => {
    try {
      if (!body.trim()) {
        toast.info('Nothing to prettify.');
        return;
      }
      const parsedJson = JSON.parse(body);
      const prettyJson = JSON.stringify(parsedJson, null, 2);
      dispatch(setBody(prettyJson));
      toast.success('JSON successfully prettified!');
    } catch {
      toast.error('Invalid JSON. Cannot prettify.');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Body</h3>
        <Button variant="outline" size="sm" onClick={handlePrettify}>
          Prettify
        </Button>
      </div>
      <div className="rounded-md border">
        <CodeMirror
          value={body}
          height="200px"
          extensions={[json()]}
          onChange={(value) => dispatch(setBody(value))}
          theme="dark"
        />
      </div>
    </div>
  );
}
