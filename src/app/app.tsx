import { RouterProvider } from 'react-router-dom';
import { router } from '../routes';

/**
 * Connects the application to the shared browser router.
 *
 * The router owns URL matching and renders the registered page for the current
 * location. Feature content is supplied by those pages.
 *
 * @returns {React.JSX.Element} Router provider rendering the current route.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
