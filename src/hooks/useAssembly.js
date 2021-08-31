import firebase from "firebase/app";
import React, { useContext, createContext, useState, useEffect } from "react";

import { useAuth } from '../hooks/useAuth';
import { getRef } from '../lib/firestore';

const assemblyContext = createContext();

export function ProvideAssembly({ children }) {
  const assemblyHook = useProvideAssembly();
  return <assemblyContext.Provider value={assemblyHook}>{children}</assemblyContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAssembly = () => {
  return useContext(assemblyContext);
};

// Provider hook that creates auth object and handles state
function useProvideAssembly() {
  const auth = useAuth();
  const [assemblies, setAssemblies] = useState([]);

  const remove = id => {
    const deleteAssembly = firebase.functions().httpsCallable('deleteAssembly');
    return deleteAssembly({ id });
  }

  const create = (assembly) => {
    const createAssembly = firebase.functions().httpsCallable('createAssembly');
    return createAssembly({ ...assembly, church: auth.user.church, votes: [] })
      .then(({ data }) => data.payload);
  }

  const get = id => {
    return assemblies.filter(as => as.id === id).shift() || {}
  }

  const update = ({id, ...data}) => {
    const updateAssembly = firebase.functions().httpsCallable('updateAssembly');
    return updateAssembly({ id, data })
      .then(({ data }) => data.payload);
  }

  useEffect(() => {
    const unsubscribe = getRef('assemblies')
      .where('church', '==', auth.user.church)
      .onSnapshot(snapshot => {
        let _assemblies = [];
        snapshot.forEach(doc => {
          _assemblies.push({ id: doc.id, ...doc.data() })
        })
        setAssemblies(_assemblies)
      });
    return () => unsubscribe();
  }, [ auth ]);

  // Return the user object and auth methods
  return {
    assemblies,
    get,
    remove,
    create,
    update,
  };
}