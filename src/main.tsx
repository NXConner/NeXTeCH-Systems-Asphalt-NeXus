import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SidebarProvider } from "@/contexts/SidebarContext";

const queryClient = new QueryClient();

// Only show React DevTools warning in development
if (process.env.NODE_ENV === 'development') {
  console.info(
    'Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools'
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <AuthProvider>
            <ThemeProvider>
              <App />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </SidebarProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </BrowserRouter>
);

// Register service worker only in production (avoid intercepting dev module requests)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
