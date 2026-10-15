import { createRoot } from 'react-dom/client'
import { NotificationProvider } from './features/shared/core/notifications/NotificationContext';
import { ThemeProvider } from './features/shared/core/theme/ThemeContext';
import { ThemedToaster } from './features/shared/components/ThemedToaster';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './config/config';
import { StrictMode } from 'react'
import { AppInitializer } from './features/shared/core/initializer/AppInitializer';
import './index.css'
import AppRouter from './router';

const queryClient = new QueryClient;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <NotificationProvider container={<ThemedToaster />}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <AppInitializer>
              <AppRouter />
            </AppInitializer>
          </Provider>
        </QueryClientProvider>
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>,
)
