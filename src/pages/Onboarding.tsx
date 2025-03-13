import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import orgState from "@/state/organizations";
import { useSignalEffect } from "@preact/signals-react";
import { AudioWaveform, Command, GalleryVerticalEnd, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const teams = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Free",
  },
]

export default function Onboarding() {
  const navigate = useNavigate();

  useSignalEffect(() => {
    if (orgState.value.activeOrg) {
      navigate("/")
    }
  })

  return (
    <div className="flex min-h-svh justify-center items-center">
      <div className="flex w-full max-w-lg flex-col gap-6 ">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex flex-col justify-center items-center text-2xl gap-2">
              <img src='/src/assets/logo.png' alt='GitPM Logo' className='w-16 h-16' />
              <h1>Select Organization to add to GitPM</h1>
            </CardTitle>
            <CardDescription>This organization will be set as Actibe Organization for performing operations. You can switch it from the app when you want to switch in between organizations</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Organizations" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.name} value={team.name}>
                    <div className="flex size-6 items-center justify-center rounded-sm border ">
                      <team.logo className="size-4 shrink-0" />
                    </div>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="cursor-pointer w-full">
              Select Primary Organization
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
