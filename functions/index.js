const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const unauthenticationError = new functions.https.HttpsError(
  // Very important to use the codes defined in documentation
  // https://firebase.google.com/docs/reference/functions/providers_https_#functionserrorcode
  'unauthenticated',
  'User is not authenticated'
);

// ****************
// ASSEMBLIES
// ****************
exports.createAssembly = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw unauthenticationError;
  }
  return admin.firestore().collection('assemblies').add(data)
    .then(doc => ({ message: 'Assembly added succesfully', payload: { id: doc.id }}))
    .catch(error => {
      throw new functions.https.HttpsError(
        'internal',
        error.message
      );
    })
});

exports.updateAssembly = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw unauthenticationError;
  }
  return admin.firestore().collection('assemblies').doc(data.id).set(data.data, { merge: true })
    .then(doc => ({ message: 'Assembly updated succesfully', payload: { id: doc.id }}))
    .catch(error => {
      throw new functions.https.HttpsError(
        'internal',
        error.message
      );
    })
});

exports.deleteAssembly = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw unauthenticationError;
  }
  return admin.firestore().collection('assemblies').doc(data.id).delete();
});

// ****************
// USERS
// ****************
exports.createUser = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw unauthenticationError;
  }
  return admin.firestore().collection('users').doc(data.uid).set({
    email: data.email,
    displayName: data.displayName,
    church: data.church,
  })
    .then(doc => ({ message: 'User created succesfully', payload: { id: doc.id }}))
    .catch(error => {
      throw new functions.https.HttpsError(
        'internal',
        error.message
      );
    })
})

exports.deleteUser = functions.auth.user().onDelete(user => {
  return admin.firestore().collection('users').doc(user.uid).delete();
});


// ****************
// MEMBERS
// ****************
exports.createMember = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw unauthenticationError;
  }
  return admin.firestore().collection('members').add(data)
    .then(doc => ({ message: 'Member added succesfully', payload: { id: doc.id }}))
    .catch(error => {
      throw new functions.https.HttpsError(
        'internal',
        error.message
      );
    })
})

exports.updateMember = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw unauthenticationError;
  }
  return admin.firestore().collection('members').doc(data.id).set(data.data, { merge: true })
    .then(doc => ({ message: 'Member updated succesfully', payload: { id: doc.id }}))
    .catch(error => {
      throw new functions.https.HttpsError(
        'internal',
        error.message
      );
    })
});

exports.deleteMember = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw unauthenticationError;
  }
  return admin.firestore().collection('members').doc(data.id).delete();
});

// ****************
// VOTING
// ****************

exports.getVoting = functions.https.onCall((data) => {
  const { assemblyId, memberId } = data;
  if (!assemblyId || !memberId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid or missing arguments'
    );
  }
  let assembly;
  return admin.firestore().collection('votes').doc(memberId).get()
    .then(doc => {
      let item = doc.data();
      if (!doc || !item || (item && !item.hasVoted)) {
        return admin.firestore().collection('assemblies').doc(assemblyId).get();
      }
      throw new functions.https.HttpsError(
        'aborted',
        'User already voted'
      );
    })
    .then(doc => {
      assembly = { id: doc.id, ...doc.data()}
      const now = new Date();
      const initialDate = new Date(assembly.initialDate);
      const endDate = new Date(assembly.endDate);
      if (now >= initialDate && now < endDate) {
        return admin.firestore().collection('members').doc(memberId).get()
      }
      throw new functions.https.HttpsError(
        'aborted',
        'Assembly expired'
      ); 
    })
    .then(doc => {
      const member = { id: doc.id, ...doc.data()}
      return { payload: { assembly, member }}
    })
    .catch(error => {
      throw new functions.https.HttpsError(
        'internal',
        error.message
      );
    })
});

exports.vote = functions.https.onCall((data) => {
  const { assemblyId, memberId, sectionVotes } = data;
  let church;
  return admin.firestore().collection('assemblies').doc(assemblyId).get()
    .then(doc => {
      const assembly = doc.data();
      church = assembly.church;
      assembly.sections.forEach(section => {
        section.options.forEach(option => {
          if (sectionVotes[section.id].includes(option.id)) {
            option.votes.push(memberId);
          }
        })
      })
      return admin.firestore().collection('assemblies').doc(assemblyId).set(assembly, { merge: true });
    })
    .then(() => admin.firestore().collection('votes').doc(memberId).set({ hasVoted: true, church: church }, { merge: true }))
    .then(() => ({ message: 'Vote success'}))
});
