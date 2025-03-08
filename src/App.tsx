import { createSignal, type Component } from 'solid-js';
import AuthPage from './pages/auth';
import { Navigate, Route } from '@solidjs/router';
import HomePage from './pages/home';

const Dashboard: Component = () => <div>Dashboard Page</div>;

type ProtectedRouteConfig = {
  path: string;
  component: Component;
}[];

// List of protected routes
const protectedRoutes: ProtectedRouteConfig = [
  { path: '/', component: HomePage },
  { path: '/dashboard', component: Dashboard },
];


const AuthGuard: Component<{ children: any }> = (props) => {
  const [isAuthenticated] = createSignal(false); // Replace with your auth logic

  return (
    <>
      {isAuthenticated() ? (
        props.children
      ) : (
        <Navigate href="/login" />
      )}
    </>
  );
};

const createProtectedRoutes = (routes: ProtectedRouteConfig) => {
  return routes.map(({ path, component: RouteComponent }) => (
    <Route
      path={path}
      component={() => (
        <AuthGuard>
          <RouteComponent />
        </AuthGuard>
      )}
    />
  ));
};

const App: Component = () => {
  return (
    <Route>
      <Route path="/login" component={AuthPage} />
      {createProtectedRoutes(protectedRoutes)}
    </Route>
  );
};

export default App;
