const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.createAssembly = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      // Very important to use the codes defined in documentation
      // https://firebase.google.com/docs/reference/functions/providers_https_#functionserrorcode
      'unauthenticated',
      'User is not authenticated'
    );
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