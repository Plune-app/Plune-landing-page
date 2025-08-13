import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { Router } from './routes/index.routes';
import { useMemo } from 'react';

function App() {
  const queryClient = useMemo(() => (new QueryClient()), []);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;