
'use client'

import React, { useEffect, useState } from 'react';
import { StrictMode } from 'react';
import { Provider as ModalsProvider } from '@ebay/nice-modal-react';
import { createServices, Services, ServicesProvider } from './services';
import { App}  from '../src/App';

function configureMonacoEnvironment() {
  if (typeof window !== 'undefined') {
    window.MonacoEnvironment = {
      getWorker(_, label) {
        switch (label) {
        case 'editorWorkerService':
          return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
        case 'json':
          return new Worker(
            new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url),
          );
        case 'yaml':
        case 'yml':
          return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
        default:
          throw new Error(`Unknown worker ${label}`);
        }
      },
    };
  }
}

function Page() {
  const [services, setServices] = useState<Services>();
  useEffect(() => {
    const fetchData = async () => {
      const servicess = await createServices();
      setServices(servicess)
      configureMonacoEnvironment();
    };

    fetchData();
  }, []);

  if (!services) {
    return <h1>Loading....</h1>;
  }
  return (
    <StrictMode>
      <ServicesProvider value={services}>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </ServicesProvider>
    </StrictMode>
  );
}

export default Page;
