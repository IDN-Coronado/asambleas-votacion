
import React, { useContext, createContext, useState, useEffect } from "react";

import { useAuth } from '../hooks/useAuth';

import {
  getCollectionByAttribute,
  deleteCollectionItem,
  setCollectionItem,
  updateCollectionItem
} from '../lib/firestore'

const assemblyContext = createContext();

export function ProvideAssembly({ children }) {
  const assembly = useProvideAssembly();
  return <assemblyContext.Provider value={assembly}>{children}</assemblyContext.Provider>;
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

  const getAll = churchId => {
    return getCollectionByAttribute('assemblies', 'church', churchId)
      .then(data => {
        setAssemblies(data);
        return data;
      })
  }

  const remove = id => {
    return deleteCollectionItem('assemblies', id)
      .then(() => {
        setAssemblies(assemblies.filter(as => !(as.id === id)))
      })
  }

  const create = ({
    title,
    description,
    church,
    initialDate,
    endDate,
  }) => {
    return setCollectionItem('assemblies', {
      title,
      description,
      church,
      initialDate,
      endDate,
    }).then(assembly => {
      setAssemblies(assemblies.concat(assembly))
      return assembly;
    })
  }

  const get = id => {
    return assemblies.filter(as => as.id === id).shift() || {}
  }

  const update = assembly => {
    const newAssemblies = [ ...assemblies ];
    let assemblyIndex;
    assemblies.forEach((a, i) => {
      if (a.id === assembly.id) {
        assemblyIndex = i;
      }
    })
    return updateCollectionItem('assemblies', assembly.id, assembly)
      .then(() => {
        newAssemblies[assemblyIndex] = assembly;
        setAssemblies(newAssemblies);
        return true;
      });
  }

  useEffect(() => {
    getAll(auth.user.church)
  }, [ auth ]);

  // Return the user object and auth methods
  return {
    assemblies,
    getAll,
    get,
    remove,
    create,
    update,
  };
}