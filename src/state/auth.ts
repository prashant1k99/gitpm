import { signal } from "@preact/signals-react";
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase';
import { getKeyFromDB, logUserOut } from "@/utils/auth";
import { toast } from "sonner";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  githubUserName: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  firebaseUser: FirebaseUser | null;
  githubToken: string | null;
  githubTokenExpired: boolean;
}

const authState = signal<AppState>({
  isAuthenticated: false,
  user: null,
  firebaseUser: null,
  githubToken: null,
  githubTokenExpired: false
})

onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  if (firebaseUser) {
    authState.value = {
      isAuthenticated: true,
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        githubUserName: firebaseUser.providerId
      },
      firebaseUser: firebaseUser,
      githubToken: null,
      githubTokenExpired: false,
    }
  } else {
    authState.value = {
      isAuthenticated: false,
      user: null,
      firebaseUser: null,
      githubToken: null,
      githubTokenExpired: false
    }
  }
})

export const loadGithubToken = () => new Promise((resolve, reject) => {
  getKeyFromDB().then((githubToken) => {
    authState.value = {
      ...authState.value,
      githubToken: githubToken
    }
    // authState.value.githubToken = githubToken
    resolve("Ok")
  }).catch((error: string) => {
    toast.error("Something went wrong while fetching", {
      description: error
    })
    logUserOut()
    reject()
  })
})

export default authState
