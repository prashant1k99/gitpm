import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import orgState, { loadAllUserOrgs, setActiveOrgForUser } from "@/state/organizations";
import { useSignalEffect } from "@preact/signals-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

export default function Onboarding() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [activeOrgId, setActiveOrgId] = useState("");
  const navigate = useNavigate();

  useSignalEffect(() => {
    if (orgState.value.activeOrg) {
      navigate("/")
    }
    if (orgState.value.areOrgLoaded) {
      setIsProcessing(false)
    }
  })

  useEffect(() => {
    loadAllUserOrgs()
  }, [])

  const setActiveOrg = () => {
    setIsProcessing(true)
    try {
      setActiveOrgForUser(activeOrgId)
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to select Organization",
          {
            description: error.message
          })
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex min-h-svh justify-center items-center">
      <div className="flex w-full max-w-lg flex-col gap-6 ">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex flex-col justify-center items-center text-2xl gap-2">
              <img src='/src/assets/logo.png' alt='GitPM Logo' className='w-16 h-16' />
              <h1>Connect organization with GitPM</h1>
            </CardTitle>
            <CardDescription>This organization will be set as Actibe Organization for performing operations. You can switch it from the app when you want to switch in between organizations</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Select disabled={isProcessing} onValueChange={(value) => setActiveOrgId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Organizations" />
              </SelectTrigger>
              <SelectContent>
                {orgState.value.userOrgs.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    <img className="inline-block size-6 rounded-md" src={org.avatarUrl} alt="" />
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="cursor-pointer w-full" disabled={isProcessing || activeOrgId == ""} onClick={setActiveOrg}>
              {isProcessing && (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              )}
              Select Primary Organization
            </Button>
            <Button variant={"link"} className="cursor-pointer" asChild>
              <a href="https://github.com/organizations/plan" target="_blank">
                Create New Organization
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
