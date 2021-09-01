
import firebase from "firebase/app";
import React, { useContext, createContext, useState, useEffect } from "react";

import { getCollectionItem, getRef } from '../lib/firestore';
import usePrevious from "./usePrevious";

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [church, setChurch] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const prevUser = usePrevious(user);

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => 'Success');
  };

  const signup = (displayName, email, password, church) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const createUser = firebase.functions().httpsCallable('createUser');
        return createUser({
          uid: user.uid,
          displayName,
          church,
          email,
        })
      }
      ).then(user => 'Success');
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
      });
  };

  const sendPasswordResetEmail = (email) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code, password) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  useEffect(() => {
    let unsubscribeUser, unsubscribeAuth;
    unsubscribeAuth = firebase.auth().onAuthStateChanged((_user) => {
      if (_user) {
        setUserId(_user.uid);
      } else {
        setUserId(null);
        setIsLoading(false);
      }
    });
    if (!prevUser) {
      if (userId) {
        unsubscribeUser = getRef('users')
          .doc(userId)
          .onSnapshot(doc => {
            setUser({ id: doc.id, ...doc.data() })
            setIsLoading(false);
          })
      }
    }
    if (user && prevUser?.church !== user.church) {
      getCollectionItem('churches', user.church)
        .then(_church => setChurch(_church))
    }
    // Cleanup subscription on unmount
    return () => {
      unsubscribeAuth && unsubscribeAuth();
      unsubscribeUser && unsubscribeUser();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ userId, user ]);

  // Return the user object and auth methods
  return {
    user,
    church,
    isLoading,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}