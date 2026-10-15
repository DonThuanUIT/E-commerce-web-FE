import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from '../config/queryClient';
import { router } from '../routes';

/**
 * Connects the application to the shared browser router and React Query provider.
 *
 * The router owns URL matching and renders the registered page for the current
 * location. Feature content is supplied by those pages.
 *
 * @returns {React.JSX.Element} Router provider rendering the current route.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
