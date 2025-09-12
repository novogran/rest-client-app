'use client';
import { useDispatch, useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { setBody } from './restClientSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppDispatch, RootState } from '@/store/store';
import { useTranslations } from 'next-intl';

export function BodyEditor() {
  const t = useTranslations('RestClient');
  const dispatch: AppDispatch = useDispatch();
  const body = useSelector((state: RootState) => state.restClient.body);

  const handlePrettify = () => {
    try {
      if (!body.trim()) {
        toast.info(t('prettifyInfo'));
        return;
      }
      const parsedJson = JSON.parse(body);
      const prettyJson = JSON.stringify(parsedJson, null, 2);
      dispatch(setBody(prettyJson));
      toast.success(t('prettifySuccess'));
    } catch {
      toast.error(t('prettifyError'));
    }
  };

  return (
    <div className="space-y-2" data-testid="body-editor-section">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t('bodyTitle')}</h3>
        <Button variant="outline" size="sm" onClick={handlePrettify}>
          {t('prettifyButton')}
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
