import { createEffect, type Component } from 'solid-js';
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "@/utils/firebase"
import { useAppState } from '@/state/auth';
import { useNavigate } from '@solidjs/router';

const AuthPage: Component = () => {
  const [appState, setAppState] = useAppState();
  const navigate = useNavigate()

  createEffect(() => {
    if (appState.isAuthenticated) {
      navigate('/', { replace: true });
    }
  })

  const authenticateUser = () => {
    const provider = new GithubAuthProvider();
    provider.addScope('repo');

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        if (!credential) {
          throw new Error("Something went wrong");
        }
        const token = credential.accessToken;
        console.log(token)

        const user = result.user;
        console.log(user)

        // Redirect user to the home page
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <div class='flex h-full min-w-dvh justify-center items-center'>
      <h1 class="text-3xl font-bold underline">
        Auth Page
      </h1>
      <button onClick={authenticateUser} class="btn btn-primary">Login</button>
    </div>
  );
};

export default AuthPage;
