import React, { useContext, createContext, useState, useEffect } from "react";

import { useAuth } from './useAuth';
import { getRef } from '../lib/firestore'

const votesContext = createContext();

export function ProvideVotes({ children }) {
  const votes = useProvideVotes();
  return <votesContext.Provider value={votes}>{children}</votesContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useVotes = () => {
  return useContext(votesContext);
};

// Provider hook that creates auth object and handles state
function useProvideVotes() {
  const auth = useAuth();
  const [ votes, setVotes ] = useState([]);

  const get = id => {
    return votes.filter(as => as.id === id).shift() || {}
  }

  useEffect(() => {
    const unsubscribe = getRef('votes')
      .where('church', '==', auth.user.church)
      .onSnapshot(snapshot => {
        let _votes = [];
        snapshot.forEach(doc => {
          _votes.push({ id: doc.id, ...doc.data() })
        })
        setVotes(_votes)
      });
    return () => unsubscribe();
  }, [ auth ]);

  // Return the user object and auth methods
  return {
    votes,
    get,
  };
}