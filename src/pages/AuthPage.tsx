import { Button } from "@/components/ui/button"
import authState, { loadGithubToken } from "@/state/auth";
import { useSignalEffect } from "@preact/signals-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, LoaderCircle } from 'lucide-react';
import { useState } from "react";
import { toast } from "sonner";
import { githubAuth } from "@/utils/auth";
import orgState from "@/state/organizations";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProcessing, setIsProcessing] = useState(false);

  useSignalEffect(() => {
    // handle the loading of github token here and give feedback to user
    if (authState.value.isAuthenticated) {
      if (authState.value.githubToken) {
        if (orgState.value.activeOrg) {
          const to = location.state?.from || '/';
          navigate(to, { replace: true });
        } else {
          navigate("/onboarding")
        }
      } else {
        setIsProcessing(true)
        toast.success("Authenticated Successfully", {
          description: "Loading github token"
        })
        loadGithubToken().finally(() => {
          setIsProcessing(false)
        })
      }
    }
  })

  const authenticateUser = () => {
    setIsProcessing(true)

    githubAuth().then(() => {
      console.log("Successfully saved token")
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
