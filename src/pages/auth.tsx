import { createEffect, type Component } from 'solid-js';
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "@/utils/firebase"
import { useAppState } from '@/state/auth';
import { useNavigate } from '@solidjs/router';
import { ToastType, useToasts } from '@/state/toast';
import Toast from '@/components/toast';
import { AiFillGithub } from 'solid-icons/ai';

const AuthPage: Component = () => {
  const [appState] = useAppState();
  const navigate = useNavigate()
  const [_, { addToast }] = useToasts();

  createEffect(() => {
    if (appState.isAuthenticated) {
      navigate('/', { replace: true });
    }
  })

  const authenticateUser = () => {
    const provider = new GithubAuthProvider();
    provider.addScope('repo');
    provider.addScope('project');
    provider.addScope('admin:org');

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

        addToast("Successfully logged in", ToastType.PRIMARY)
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
    <div class='flex flex-col h-full min-h-dvh justify-center items-center'>
      <div class="card card-dash bg-accent-content w-lg ring ring-accent">
        <div class="card-body flex flex-col gap-4">
          <div class='flex flex-col justify-center items-center gap-2'>
            <img src='/src/assets/logo.png' alt='GitPM Logo' class='w-16 h-16' />
            <h2 class="card-title text-2xl">Authenticate gitPM</h2>
          </div>
          <p class='text-pretty'>Sign in with your Github account to continue, as GitPM uses your github organizations, projects, issues and repository to manage the tasks and GitPM does not stores any information, as we purely rely on GitHub APIs to store all information.</p>
          <div class="card-actions">
            <button class="btn bg-black text-white border-black w-full hover:ring-1" onClick={authenticateUser}>
              <AiFillGithub class='w-4 h-4' />
              Sign In With Github
            </button>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default AuthPage;
