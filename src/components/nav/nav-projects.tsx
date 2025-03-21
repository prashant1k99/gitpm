import { ChevronRight, FolderDot, FolderOpenDot } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useState } from "react"
import projectState from "@/state/projects"
import { Skeleton } from "../ui/skeleton"
import { useSignalEffect } from "@preact/signals-react"
import { Link, useParams } from "react-router-dom"
import { NavViews } from "./nav-views"
import { useLiveQuery } from "dexie-react-hooks"
import orgState from "@/state/organizations"
import DB from "@/db/organization"

export function NavProjects() {
  const [orgLogin, setOrgLogin] = useState(orgState.value.activeOrg?.login)
  const [isLoading, setIsLoading] = useState(true)

  const projects = useLiveQuery(() => {
    const db = DB.getDatabases(orgState.value.activeOrg?.login as string)
    return db.projects.toArray()
  }, [orgLogin])

  useSignalEffect(() => {
    if (orgState.value.activeOrg) {
      setOrgLogin(orgState.value.activeOrg.login)
    }
  })

  useSignalEffect(() => {
    if (projectState.value.isLoading) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  })

  const { projectNumber } = useParams();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {(isLoading && projects?.length == 0) ? (
          <>
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
          </>
        ) : (
          projects?.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.number.toString() == projectNumber}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    <FolderDot className="group-data-[state=open]/collapsible:hidden" />
                    <FolderOpenDot className="hidden group-data-[state=open]/collapsible:inline" />
                    <Link to={`/project/${item.number}`}>
                      <span className="max-w-[160px] truncate inline-block" title={item.title}>{item.title}</span>
                    </Link>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <NavViews project={item.number} baseLink={"/project/" + item.number} />
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )))
        }
      </SidebarMenu>
    </SidebarGroup >
  )
}
