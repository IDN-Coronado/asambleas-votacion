import firebase from "firebase/app";

let db;

const getDb = () => {
  if (!db) {
    db = firebase.firestore();
  }
  return db;
}

export const getCollection = (collection) => {
  return getDb()
    .collection(collection)
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return data;
    })
    .catch(err => {
      throw err;
    })
}

export const getCollectionItem = (collection, id) => {
  return getDb()
    .collection(collection)
    .doc(id)
    .get()
    .then(doc => doc.data())
}

export const getCollectionByAttribute = (collection, attr, val) => {
  const assembliesRef = getDb().collection(collection);
  const snapshot = assembliesRef.where(attr, '==', val).get()
  return snapshot
    .then(doc => {
      let item = [];
      doc.forEach(qs => {
        item.push({ id: qs.id, ...qs.data()});
      })
      return item;
    })
}

export const getCollectionItemByAttribute = (collection, attr, val) => {
  const assembliesRef = getDb().collection(collection);
  const snapshot = assembliesRef.where(attr, '==', val).get()
  return snapshot
    .then(doc => {
      let item;
      doc.forEach(qs => {
        item = { id: qs.id, ...qs.data()}
      })
      return item;
    })
}

export const setCollectionItem = (collection, item) => {
  return getDb()
    .collection(collection)
    .add(item)
    .then(doc => doc.get())
    .then(snapshot => ({
        id: snapshot.id,
        ...snapshot.data(),
    }))
}

export const updateCollectionItem = (collection, id, item) => {
  return getDb()
    .collection(collection)
    .doc(id)
    .set(item, { merge: true })
}

export const deleteCollectionItem = (collection, id) => {
  return getDb()
    .collection(collection)
    .doc(id)
    .delete();
}

export const registerUser = ({ uid, displayName, church }) => {
  return getDb()
    .collection('users')
    .add({
      uid,
      displayName,
      church,
    })
    .then(doc => doc)
    .catch(err => {
      throw err;
    })
}