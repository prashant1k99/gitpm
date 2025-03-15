import { ChevronRight, MoreHorizontal } from "lucide-react"
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
import projectState, { loadProjects } from "@/state/projects"
import { Skeleton } from "../ui/skeleton"
import { useSignalEffect } from "@preact/signals-react"
import { Link, useParams } from "react-router-dom"
import { TProject } from "@/types/projects"
import { NavViews } from "./nav-views"

export function NavProjects() {
  const [isLoadingProjects, setIsLoading] = useState<boolean>(projectState.value.areLoading)
  const [hasMoreProjectsToLoad, setHasMoreProjectsToLoad] = useState<boolean>(projectState.value.paginationInfo?.hasNextPage || false)
  const [projects, setProjects] = useState<TProject[]>([])

  const { projectNumber } = useParams();

  useSignalEffect(() => {
    if (projectState.value.areLoading) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
      setProjects(projectState.value.loadedProject)
      setHasMoreProjectsToLoad(projectState.value.paginationInfo?.hasNextPage as boolean)
    }
  })

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.number.toString() == projectNumber}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  <Link to={"/project/" + item.number}>
                    <span>{item.title}</span>
                  </Link>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <NavViews project={item.number} baseLink={"/project/" + item.number} />
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        {isLoadingProjects && (
          <>
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
          </>
        )}
        {hasMoreProjectsToLoad && (
          <SidebarMenuButton onClick={loadProjects} disabled={isLoadingProjects} className="text-sidebar-foreground/70 cursor-pointer">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        )}
      </SidebarMenu>
    </SidebarGroup >
  )
}
