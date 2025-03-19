import { createBrowserRouter, redirect, RouteObject } from 'react-router-dom';
import RootLayout from '@/layout/RootLayout';
import MainLayout from '@/layout/MainLayout';
import DashboardPage from '@/pages/Dashboard';
import AuthPage from '@/pages/AuthPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Onboarding from './pages/Onboarding';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ViewPage from './pages/ViewPage';
import OrgSettingPage from './pages/OrgSettingPage';
import { loadUser } from './state/auth';

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'login',
        element: <AuthPage />,
        loader: async () => {
          const isAuthenticated = await loadUser()
          if (isAuthenticated) {
            const params = new URLSearchParams(window.location.search);
            if (params.get("from")) {
              return redirect(params.get("from") as string)
            }
            return redirect('/')
          } else {
            return null
          }
        },
      },
      {
        path: '/',
        loader: async () => {
          const isAuthenticated = await loadUser()
          if (isAuthenticated) {
            return null
          } else {
            const redirectTo = `/login?from=${location.pathname}`
            return redirect(redirectTo)
          }
        },
        children: [
          {
            path: 'onboarding',
            element: <RootLayout />,
            children: [
              {
                index: true,
                element: <Onboarding />,
              },
            ],
          },
          {
            // Need to find a way to validate the current path for activeOrg selection
            element: <MainLayout />,
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
