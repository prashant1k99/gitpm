import { Button } from "@/components/ui/button"
import { signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"
import authState from "@/state/auth";
import { useSignalEffect } from "@preact/signals-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, LoaderCircle } from 'lucide-react';
import { useState } from "react";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  useSignalEffect(() => {
    if (authState.value.isAuthenticated) {
      navigate("/")
    }
  })

  const authenticateUser = () => {
    setIsProcessing(true)
    const provider = new GithubAuthProvider();
    provider.addScope('repo');
    provider.addScope('project');
    provider.addScope('admin:org');

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        if (!credential) {
          toast.error("Something went wrong", {
            description: "Unable to get Github token"
          })
          signOut(auth)
          throw new Error("Something went wrong");
        }
      }).catch((error) => {
        toast.error("Failed to Authenitcate", {
          description: error.message
        })
      }).finally(() => setIsProcessing(false))

  }

  return (
    <div className="flex min-h-svh justify-center items-center">
      <div className="flex w-full max-w-md flex-col gap-6 ">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex flex-col justify-center items-center text-2xl gap-2">
              <img src='/src/assets/logo.png' alt='GitPM Logo' className='w-16 h-16' />
              <h1>
                Welcome To GitPM
              </h1>
            </CardTitle>
            <CardDescription>
              Where we bring Project Management near to Code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled={isProcessing} className="cursor-pointer w-full" onClick={authenticateUser}>
              {isProcessing ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <Github className="w-4 h-4" />
              )}
              Sign In With Github
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


