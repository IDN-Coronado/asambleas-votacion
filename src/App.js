
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
import { ProvideVotes } from "./hooks/useVotes"; 

import Nav from './components/Nav/Nav';

import HomePage from './pages/HomePage/HomePage';
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import AssembliesPage from "./pages/AssembliesPage/AssembliesPage";
import AssemblyDetailPage from "./pages/AssemblyDetailPage/AssemblyDetailPage";
import MembersPage from "./pages/MembersPage/MembersPage";
import AssemblyMembersPage from "./pages/AssemblyMembersPage/AssemblyMembersPage";
import VotingPage from "./pages/VotingPage/VotingPage";
import ResultsPage from "./pages/ResultsPage/ResultsPage";

import './App.css';

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
            <Route path="/votacion/:assemblyId/:memberId" exact>
              <VotingPage />
            </Route>
            <PublicRoute path="/acceso" exact>
              <LoginPage />
            </PublicRoute>
            <PublicRoute path="/registro" exact>
              <SignUpPage />
            </PublicRoute>
            <PrivateRoute path="/asambleas/:id" exact>
              <ProvideAssembly><AssemblyDetailPage /></ProvideAssembly>
            </PrivateRoute>
            <PrivateRoute path="/asambleas/:id/miembros" exact>
              <ProvideAssembly>
                <ProvideMember>
                  <ProvideVotes><AssemblyMembersPage /></ProvideVotes>
                </ProvideMember>
              </ProvideAssembly>
            </PrivateRoute>
            <PrivateRoute path="/resultados/:assemblyId" exact>
              <ProvideAssembly>
                <ProvideMember>
                  <ProvideVotes><ResultsPage /></ProvideVotes>
                </ProvideMember>
              </ProvideAssembly>
            </PrivateRoute>
            <PrivateRoute path="/asambleas" exact>
              <ProvideAssembly><AssembliesPage /></ProvideAssembly>
            </PrivateRoute>
            <PrivateRoute path="/miembros" exact>
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
