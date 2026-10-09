import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { homeRoutes } from './homeRoutes';

export const router = createBrowserRouter([...homeRoutes, ...authRoutes]);
