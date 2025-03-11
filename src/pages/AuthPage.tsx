import { Button } from "@/components/ui/button"
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase"
import authState from "@/state/auth";
import { useSignalEffect } from "@preact/signals-react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  // const authS = useSignal(authState);
  useSignalEffect(() => {
    // if (authS.value.value.isAuthenticated) {
    if (authState.value.isAuthenticated) {
      navigate("/")
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

        // Redirect user to the home page
      }).catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.customData.email;
        // const credential = GithubAuthProvider.credentialFromError(error);
        // ...
        console.error(error)
      });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Button className="cursor-pointer" onClick={authenticateUser}>Click me</Button>
    </div>
  )
}


