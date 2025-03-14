import { createBrowserRouter, RouteObject } from 'react-router-dom';
import RootLayout from '@/layout/RootLayout';
import MainLayout from '@/layout/MainLayout';
import ProtectedRoute from '@/routes/ProtectedRoutes';
import DashboardPage from '@/pages/Dashboard';
import AuthPage from '@/pages/AuthPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Onboarding from './pages/Onboarding';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ViewPage from './pages/ViewPage';
import OrgSettingPage from './pages/OrgSettingPage';

const routes: RouteObject[] = [
  {
    path: "/",
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
                path: "project",
                children: [
                  {
                    index: true,
                    element: <ProjectsPage />,
                  },
                  {
                    path: ":projectNumber",
                    children: [
                      {
                        index: true,
                        element: <ProjectDetailPage />
                      },
                      {
                        path: ":viewNumber",
                        element: <ViewPage />
                      }
                    ]
                  }
                ]
              },
              {
                path: "settings",
                element: <OrgSettingPage />
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
