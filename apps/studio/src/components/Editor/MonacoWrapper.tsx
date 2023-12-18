import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { debounce } from '../../helpers';
import { useServices } from '../../services';
import { useFilesState, useSettingsState } from '../../state';

import type { FunctionComponent } from 'react';
import type { EditorProps as MonacoEditorProps } from '@monaco-editor/react';
const DynamicMonaco = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});
export const MonacoWrapper: FunctionComponent<MonacoEditorProps> = ({
  ...props
}) => {
  const { editorSvc, parserSvc } = useServices();
  const { autoSaving, savingDelay } = useSettingsState(state => state.editor);
  const file = useFilesState(state => state.files['asyncapi']);
  const onChange = useMemo(() => {
    return debounce((v: string) => {
      editorSvc.updateState({ content: v, file: { from: 'storage', source: undefined } });
      autoSaving && editorSvc.saveToLocalStorage(v, false);
      parserSvc.parse('asyncapi', v);
    }, savingDelay);
  }, [autoSaving, savingDelay]);

  return (
    <DynamicMonaco
      language={file.language}
      defaultValue={file.content}
      theme="asyncapi-theme"
      onMount={(arg) => {
        if (!window?.MonacoEnvironment) return
        editorSvc.onDidCreate.bind(editorSvc)(arg)
        window.MonacoEnvironment.getWorkerUrl = (moduleId, label) => {
          switch (label) {
          case 'editorWorkerService':
            return '_next/static/editor.worker.js';
          case 'json':
            return '_next/static/json.worker.js';
          case 'yaml':
          case 'yml':
            return '_next/monaco-yaml/yaml.worker.js';
          default:
            throw new Error(`Unknown worker ${label}`);
          }
        }
      }}
      onChange={onChange}
      options={{
        wordWrap: 'on',
        smoothScrolling: true,
        glyphMargin: true,
      }}
      {...(props || {})}
    />
  );
};
