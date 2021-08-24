
import React, { useContext, createContext, useState, useEffect } from "react";

import { useAuth } from './useAuth';

import {
  getCollectionByAttribute,
  deleteCollectionItem,
  setCollectionItem,
  updateCollectionItem
} from '../lib/firestore'

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
  const [members, setMembers] = useState([]);

  const getAll = churchId => {
    return getCollectionByAttribute('members', 'church', churchId)
      .then(data => {
        setMembers(data);
        return data;
      })
  }

  const remove = id => {
    return deleteCollectionItem('members', id)
      .then(() => {
        setMembers(members.filter(as => !(as.id === id)))
      })
  }

  const create = (memberData) => {
    return setCollectionItem('members', memberData)
      .then(member => {
        setMembers(members.concat(member))
        return member;
      })
  }

  const get = id => {
    return members.filter(as => as.id === id).shift() || {}
  }

  const update = member => {
    const newMembers = [ ...members ];
    let memberIndex;
    members.forEach((a, i) => {
      if (a.id === member.id) {
        memberIndex = i;
      }
    })
    return updateCollectionItem('members', member.id, member)
      .then(() => {
        newMembers[memberIndex] = member;
        setMembers(newMembers);
        return true;
      });
  }

  useEffect(() => {
    getAll(auth.user.church)
  }, [ auth ]);

  // Return the user object and auth methods
  return {
    members,
    getAll,
    get,
    remove,
    create,
    update,
  };
}