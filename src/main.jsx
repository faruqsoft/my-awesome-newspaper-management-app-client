import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Your global styles
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // For toast notifications
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // TanStack Query
import { AuthProvider } from './providers/AuthProvider'; // Your AuthProvider

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider> {/* Wrap your App with AuthProvider */}
          <App />
          <Toaster /> {/* Place Toaster here for global notifications */}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);