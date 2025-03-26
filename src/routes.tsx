import { createBrowserRouter, Navigate, redirect, RouteObject } from 'react-router-dom';
import RootLayout from '@/layout/RootLayout';
import MainLayout from '@/layout/MainLayout';
import DashboardPage from '@/pages/Dashboard';
import AuthPage from '@/pages/AuthPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Onboarding from './pages/Onboarding';
import ProjectDetailPage from './pages/ProjectDetailPage';
import OrgSettingPage from './pages/OrgSettingPage';
import { loadUser } from './state/auth';
import TaskPage from './pages/TaskPage';
import ProjectViewPage from './pages/ViewPage';

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
                    element: <Navigate to=".." relative='path' />
                  },
                  {
                    path: ":projectNumber",
                    children: [
                      {
                        index: true,
                        element: <ProjectDetailPage />
                      },
                      {
                        path: "task",
                        children: [
                          {
                            index: true,
                            element: <Navigate to=".." relative='path' />
                          },
                          {
                            path: ":taskNumber",
                            element: <TaskPage />
                          }
                        ]
                      },
                      {
                        path: "view",
                        children: [
                          {
                            index: true,
                            element: <Navigate to=".." relative='path' />
                          },
                          {
                            path: ":viewNumber",
                            element: <ProjectViewPage />
                          }
                        ]
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
