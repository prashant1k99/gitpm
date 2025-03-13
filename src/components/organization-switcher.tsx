import { ChevronsUpDown, ExternalLink, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import orgState, { IOrganization, loadAllUserOrgs, setActiveOrgForUser } from "@/state/organizations"
import { useSignalEffect } from "@preact/signals-react"
import { useState } from "react"
import { Skeleton } from "./ui/skeleton"
import { useNavigate } from "react-router-dom"

export function OrganizationSwitcher() {
  const navigate = useNavigate()
  const { isMobile } = useSidebar()

  const [orgsLoaded, setOrgsLoaded] = useState(false);
  const [orgs, setOrgs] = useState<IOrganization[]>([])
  const [activeOrg, setActiveOrg] = useState<IOrganization>(orgState.value.activeOrg as IOrganization)

  useSignalEffect(() => {
    if (orgState.value.areOrgLoaded) {
      setOrgsLoaded(true)
      setActiveOrg(orgState.value.activeOrg as IOrganization)
      setOrgs(orgState.value.userOrgs.filter(org => org.id != orgState.value.activeOrg?.id))
    } else {
      setOrgsLoaded(false)
    }
  })

  const switchOrg = (id: string) => {
    console.log("Switch to: ", id)
    if (id == activeOrg?.id) {
      return
    }
    setActiveOrgForUser(id)
    navigate("/")
  }

  const loadOrgs = () => {
    if (!orgsLoaded) {
      loadAllUserOrgs()
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu onOpenChange={loadOrgs}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              onChange={() => {
                console.log("From trigger")
              }}
              variant={"outline"}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <img className="inline-block size-8 rounded-md" src={activeOrg?.avatar} alt="" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeOrg?.name}
                </span>
                <span className="truncate text-xs">Organization</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {
              activeOrg?.currentUserCanAdminister && (
                <>
                  <DropdownMenuItem
                    className="gap-2 p-2 "
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <Settings className="size-4 shrink-0 " />
                    </div>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )
            }
            {orgsLoaded ? (
              orgs.length > 0 ? (
                orgs.map((org, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => switchOrg(org.id)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <img className="inline-block size-8 rounded-md w-4 h-4" src={org?.avatar} alt="" />
                    </div>
                    {org.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem
                  disabled
                  className="gap-2 p-2 "
                >
                  No Org found
                </DropdownMenuItem>
              )
            ) : (
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2 cursor-pointer" onClick={() => window.open("https://github.com/organizations/plan", "_blank")}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <ExternalLink />
              </div>
              <div className="font-medium text-muted-foreground">Add Organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
