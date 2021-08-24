
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { ProvideAuth, useAuth } from './hooks/useAuth';
import { ProvideAssembly } from './hooks/useAssembly';
import { ProvideMember } from './hooks/useMember';

import Nav from './components/Nav/Nav';

import HomePage from './pages/HomePage/HomePage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import AssembliesPage from "./pages/AssembliesPage/AssembliesPage";
import AssemblyDetailPage from "./pages/AssemblyDetailPage/AssemblyDetailPage";
import MembersPage from "./pages/MembersPage/MembersPage";
import AssemblyMembersPage from "./pages/AssemblyMembersPage/AssemblyMembersPage";

export default function App() {
  return (
    <ProvideAuth>
      <Router>
        <div>
          <Nav />

          <Switch>
            <Route path="/" exact>
              <HomePage />
            </Route>
            <PublicRoute path="/acceso">
              <LoginPage />
            </PublicRoute>
            <PublicRoute path="/registro">
              <SignUpPage />
            </PublicRoute>
            <PrivateRoute path="/panel">
              <DashboardPage />
            </PrivateRoute>
            <PrivateRoute path="/asambleas/:id" exact>
              <ProvideAssembly><AssemblyDetailPage /></ProvideAssembly>
            </PrivateRoute>
            <PrivateRoute path="/asambleas/:id/miembros" exact>
              <ProvideAssembly>
                <ProvideMember><AssemblyMembersPage /></ProvideMember>
              </ProvideAssembly>
            </PrivateRoute>
            <PrivateRoute path="/asambleas" exact>
              <ProvideAssembly><AssembliesPage /></ProvideAssembly>
            </PrivateRoute>
            <PrivateRoute path="/miembros">
              <ProvideMember><MembersPage /></ProvideMember>
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  );
}

function PublicRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isLoading ? (
          <div>Loading...</div>
        )
        : (!auth.isLoading && auth.user) ? (
          <Redirect
            to={{
              pathname: location.path,
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isLoading ? (
          <div>Loading...</div>
        ) : 
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/acceso",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
