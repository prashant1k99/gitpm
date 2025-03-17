import { createBrowserRouter, Outlet, redirect, RouteObject } from 'react-router-dom';
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
import orgState from './state/organizations';

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
            return redirect('/')
          } else {
            return
          }
        },

      },
      {
        path: '/',
        loader: async () => {
          const isAuthenticated = await loadUser()
          if (isAuthenticated) {
            const params = new URLSearchParams(window.location.search);
            if (params.get("from")) {
              return redirect(params.get("from") as string)
            }
            return <Outlet />
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
            loader: () => {
              if (!orgState.value.activeOrg) {
                return redirect("/onboarding")
              }
              return null
            },
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
