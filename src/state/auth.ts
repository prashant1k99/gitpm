import { signal } from "@preact/signals-react";
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
}

const authState = signal<AppState>({
  isAuthenticated: false,
  user: null
})

onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  if (firebaseUser) {
    authState.value = {
      isAuthenticated: true,
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      }
    }
  } else {
    authState.value = {
      isAuthenticated: false,
      user: null
    }
  }
})

export default authState
