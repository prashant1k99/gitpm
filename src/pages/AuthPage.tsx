import { Button } from "@/components/ui/button"
import { useSignalEffect } from "@preact/signals-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from 'lucide-react';
import { useEffect, useState } from "react";
import { toast } from "sonner";
import account from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";
import authState from "@/state/auth";
import orgState from "@/state/organizations";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [navigateTo, setNavigateTo] = useState("/");

  useSignalEffect(() => {
    if (authState.value.isAuthenticated) {
      if (orgState.value.activeOrg) {
        const to = location.state?.from || '/';
        navigate(to, { replace: true });
      } else {
        navigate("/onboarding")
      }
    }
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParams = params.get("error")
    if (errorParams) {
      const errorContent = JSON.parse(errorParams) as {
        message: string,
      }
      toast.error("Unable to Authenticate", {
        description: errorContent.message
      })
    }
    const fromParam = params.get("from")
    if (fromParam) {
      setNavigateTo(fromParam)
    }
  }, []);

  const authUserWithAppWrite = () => {
    account.createOAuth2Session(
      OAuthProvider.Github, // provider
      `http://localhost:5173${navigateTo}`, // redirect here on success
      'http://localhost:5173/login', // redirect here on failure
      ['repo', 'user', 'admin:org', 'org', 'project'] // scopes (optional)
    );
  }

  return (
    <div className="flex min-h-svh justify-center items-center">
      <div className="flex w-full max-w-md flex-col gap-6 ">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex flex-col justify-center items-center text-2xl gap-2">
              <img src='/logo.png' alt='GitPM Logo' className='w-16 h-16' />
              <h1>
                Welcome To GitPM
              </h1>
            </CardTitle>
            <CardDescription>
              Where we bring Project Management near to Code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="cursor-pointer w-full" onClick={authUserWithAppWrite}>
              <Github className="w-4 h-4" />
              Sign In With Github
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
