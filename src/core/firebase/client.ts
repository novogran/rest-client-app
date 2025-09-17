import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  AuthError,
  UserCredential,
} from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDv4oabYFvGR1eBdDdHf0Yf2t4CnYl6DZU',
  authDomain: 'rest-client-app-df943.firebaseapp.com',
  projectId: 'rest-client-app-df943',
  storageBucket: 'rest-client-app-df943.firebasestorage.app',
  messagingSenderId: '313438366065',
  appId: '1:313438366065:web:91a21131488d38c1dbaed0',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential | null> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    const error = err as AuthError;
    throw new Error(error.message);
  }
};

const registerWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      authProvider: 'local',
      email,
      createdAt: new Date(),
    });

    return userCredential;
  } catch (err) {
    const error = err as AuthError;
    throw new Error(error.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
};
