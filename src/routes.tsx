import { createBrowserRouter, RouteObject } from 'react-router-dom';
import RootLayout from '@/layout/RootLayout';
import MainLayout from '@/layout/MainLayout';
import ProtectedRoute from '@/routes/ProtectedRoutes';
import DashboardPage from '@/pages/Dashboard';
import AuthPage from '@/pages/AuthPage';
import NotFoundPage from '@/pages/NotFoundPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'login',
        element: <AuthPage />,
      },
    ],
    errorElement: <NotFoundPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
