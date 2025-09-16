// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';

// 👉 React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// (Opcional) Devtools: descomente se quiser
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ajustes sensatos pro seu app
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10_000,
    },
    mutations: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);

