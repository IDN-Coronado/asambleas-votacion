import React, { useContext, createContext, useState, useEffect } from "react";
import firebase from "firebase/app";

import { useAuth } from './useAuth';
import { getRef } from '../lib/firestore'

const memberContext = createContext();

export function ProvideMember({ children }) {
  const member = useProvideMember();
  return <memberContext.Provider value={member}>{children}</memberContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useMember = () => {
  return useContext(memberContext);
};

// Provider hook that creates auth object and handles state
function useProvideMember() {
  const auth = useAuth();
  const [ members, setMembers ] = useState([]);

  const remove = id => {
    const deleteMember = firebase.functions().httpsCallable('deleteMember');
    return deleteMember({ id });
  }

  const create = (memberData) => {
    const createMember = firebase.functions().httpsCallable('createMember');
    return createMember(memberData)
      .then(({ data }) => data.payload);
  }

  const get = id => {
    return members.filter(as => as.id === id).shift() || {}
  }

  const update = ({ id, ...data }) => {
    const createMember = firebase.functions().httpsCallable('updateMember');
    return createMember({ id, data })
      .then(({ data }) => data.payload);
  }

  useEffect(() => {
    const unsubscribe = getRef('members')
      .where('church', '==', auth.user.church)
      .onSnapshot(snapshot => {
        let _members = [];
        snapshot.forEach(doc => {
          _members.push({ id: doc.id, ...doc.data() })
        })
        setMembers(_members)
      });
    return () => unsubscribe();
  }, [ auth ]);

  // Return the user object and auth methods
  return {
    members,
    get,
    remove,
    create,
    update,
  };
}