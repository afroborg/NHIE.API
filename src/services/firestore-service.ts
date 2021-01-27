import { firestore, initializeApp } from 'firebase-admin';

initializeApp();

const db = firestore();

export const getDocs = async <T>(
  collection: string,
  limit = 100
): Promise<T[]> =>
  db
    .collection(collection)
    .limit(limit)
    .get()
    .then((snapshot) => toArray<T>(snapshot.docs));

export const setDoc = (collection: string, data: any, doc?: string) =>
  doc
    ? db.collection(collection).doc(doc).set(data)
    : db.collection(collection).doc().set(data);

export const deleteDoc = (collection: string, doc: string) =>
  db.collection(collection).doc(doc).delete();

const toArray = <T>(
  docs: firestore.QueryDocumentSnapshot<firestore.DocumentData>[]
): T[] => {
  const arr: T[] = [];
  docs.forEach((d) => {
    const data = d.data();
    data.id = d.id;

    if ('date' in data) {
      data.date = data.date.toDate();
    }

    arr.push(data as T);
  });
  return arr;
};
