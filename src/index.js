import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {QueryClient,QueryClientProvider} from 'react-query';
import { ReactQueryDevtools} from 'react-query/devtools';
import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <SnackbarProvider maxSnack={3} style={{ backgroundColor: '#7FFF00', fontSize:'18px', color: '#8B0000' }}>
    <App />
    </SnackbarProvider>
    <ReactQueryDevtools initialIsOpen/>
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
