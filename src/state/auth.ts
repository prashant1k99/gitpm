import { createStore } from 'solid-js/store'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from '../utils/firebase';

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

const [appState, setAppState] = createStore<AppState>({
  isAuthenticated: false,
  user: null
})

onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  console.log("Checked for logged in user")
  if (firebaseUser) {
    setAppState({
      isAuthenticated: true,
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      }
    })
  } else {
    setAppState({
      isAuthenticated: false,
      user: null
    })
  }
})


export const useAppState = () => [appState, setAppState] as const
