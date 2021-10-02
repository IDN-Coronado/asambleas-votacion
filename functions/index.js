const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

const TWILIO_ACCOUNT_SID = functions.config().twilio.account_sid;
const TWILIO_AUTH_TOKEN = functions.config().twilio.auth_token;
const TWILIO_SMS_SID = functions.config().twilio.sms_sid;
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

admin.initializeApp();

const unauthenticationError = new functions.https.HttpsError(
  // Very important to use the codes defined in documentation
  // https://firebase.google.com/docs/reference/functions/providers_https_#functionserrorcode
  'unauthenticated',
  'User is not authenticated'
);

const getDateStatus = (startDate, endDate) => {
  const now = admin.firestore.Timestamp.now().valueOf();
  const initialDate = startDate.valueOf();
  const finalDate = endDate.valueOf();
  if (now < initialDate) return 'upcoming';
  if (now > finalDate) return 'expired';
  return 'live';
}

// ****************
// ASSEMBLIES
// ****************
exports.createAssembly = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw unauthenticationError;
  }
  const initialDate = new admin.firestore.Timestamp(data.initialDate.seconds, data.initialDate.nanoseconds);
  const endDate = new admin.firestore.Timestamp(data.endDate.seconds, data.endDate.nanoseconds);
  return admin.firestore().collection('assemblies').add({ ...data, initialDate, endDate })
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
  const initialDate = new admin.firestore.Timestamp(data.data.initialDate.seconds, data.data.initialDate.nanoseconds);
  const endDate = new admin.firestore.Timestamp(data.data.endDate.seconds, data.data.endDate.nanoseconds);
  return admin.firestore().collection('assemblies').doc(data.id).set({ ...data.data, initialDate, endDate }, { merge: true })
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
  return admin.firestore().collection('assemblies').doc(assemblyId).get()
    .then(doc => {
      assembly = { id: doc.id, ...doc.data()}
      if (assembly.votes.includes(memberId)) {
        throw new functions.https.HttpsError(
          'aborted',
          'voted'
        );
      }
      const assemblyDateStatus = getDateStatus(assembly.initialDate, assembly.endDate);
      if (assemblyDateStatus === 'expired') {
        throw new functions.https.HttpsError(
          'aborted',
          assemblyDateStatus
        ); 
      }
      if (assemblyDateStatus === 'upcoming') {
        throw new functions.https.HttpsError(
          'aborted',
          assemblyDateStatus
        ); 
      }
      return admin.firestore().collection('members').doc(memberId).get()
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
  return admin.firestore().collection('assemblies').doc(assemblyId).get()
    .then(doc => {
      const assembly = doc.data();
      assembly.sections.forEach(section => {
        section.options.forEach(option => {
          if (sectionVotes[section.id].includes(option.id)) {
            option.votes.push(memberId);
          }
        })
      })
      assembly.votes.push(memberId);
      return admin.firestore().collection('assemblies').doc(assemblyId).set(assembly, { merge: true });
    })
    .then(() => ({ message: 'Vote success'}))
});

// ****************
// URLS
// ****************

exports.onAddMember = functions.firestore.document('members/{member}').onCreate((snapMember) => {
  const memberData = snapMember.data();
  return admin.firestore().collection('assemblies').where('church', '==', memberData.church).get()
    .then(doc => {
      let item = [];
      doc.forEach(assemblySnap => {
        admin.firestore().collection('urls').doc().set({
          url: `https://idn-asambleas.web.app/votacion/${assemblySnap.id}/${snapMember.id}`,
          memberId: snapMember.id,
          assemblyId: assemblySnap.id
        })
      })
      return item;
    })
});

exports.onAddAssembly = functions.firestore.document('assemblies/{assembly}').onCreate((assemblySnap) => {
  const assembliesData = assemblySnap.data();
  return admin.firestore().collection('members').where('church', '==', assembliesData.church).get()
    .then(doc => {
      let item = [];
      doc.forEach(memberSnap => {
        admin.firestore().collection('urls').doc().set({
          url: `https://idn-asambleas.web.app/votacion/${assemblySnap.id}/${memberSnap.id}`,
          memberId: memberSnap.id,
          assemblyId: assemblySnap.id
        })
      })
      return item;
    })
});

// ****************
// NOTIFICATIONS
// ****************

exports.onUpdateUrl = functions.firestore.document('urls/{member}').onUpdate((change) => {
  const urlsData = change.after.data();
  if (urlsData.memberId) {
    return admin.firestore().collection('members').doc(urlsData.memberId).set({
      urls: {
        [urlsData.assemblyId]: urlsData.shortUrl
      }
    }, { merge: true })
  }
});

exports.sendWhatsappMessage = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw unauthenticationError;
  }
  return admin.firestore().collection('members').doc(data.memberId).get()
    .then(doc => {
      const member = doc.data();
      if (!member.phone) {
        throw new functions.https.HttpsError(
          'internal',
          'User does not have phone number'
        );
      }
      return twilioClient.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${member.phone}`,
        body: `${data.messge ? data.message : `Llegó la hora de votar. Puedes hacerlo en este link: ${member.urls[data.assemblyId]}`}`
      })
    })
    .then(message => message.sid)
    .catch(error => {
      throw new functions.https.HttpsError(
        'internal',
        error.message
      );
    })
});

exports.sendSMSMessage = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw unauthenticationError;
  }
  return admin.firestore().collection('members').doc(data.memberId).get()
    .then(doc => {
      const member = doc.data();
      if (!member.phone) {
        throw new functions.https.HttpsError(
          'internal',
          'User does not have phone number'
        );
      }
      return twilioClient.messages.create({
        messagingServiceSid: TWILIO_SMS_SID,
        to: `${member.phone}`,
        body: `${data.messge ? data.message : `Somos la Iglesia del Nazareno de Coronado. Llegó la hora de votar. Puedes hacerlo en este link: ${member.urls[data.assemblyId]}`}`
      })
    })
    .then(message => message.sid)
    .catch(error => {
      throw new functions.https.HttpsError(
        'internal',
        error.message
      );
    })
});