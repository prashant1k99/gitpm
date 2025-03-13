import { createBrowserRouter, RouteObject } from 'react-router-dom';
import RootLayout from '@/layout/RootLayout';
import MainLayout from '@/layout/MainLayout';
import ProtectedRoute from '@/routes/ProtectedRoutes';
import DashboardPage from '@/pages/Dashboard';
import AuthPage from '@/pages/AuthPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Onboarding from './pages/Onboarding';
import TestPage from './pages/Test';

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'login',
        element: <AuthPage />,
      },
      {
        path: 'onboarding',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Onboarding />,
          },
        ],
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
              {
                path: "test",
                element: <TestPage />
              }
            ],
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
