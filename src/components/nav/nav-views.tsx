import { GanttChartSquare, MoreHorizontal, SquareKanban, Table2 } from "lucide-react"
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useState } from "react"
import { Skeleton } from "../ui/skeleton"
import { useSignalEffect } from "@preact/signals-react"
import { Link } from "react-router-dom"
import viewState, { loadViewsForProject } from "@/state/views"
import { IViewLayout } from "@/types/common"
import { IProjectV2ViewQR } from "@/types/projects"

const layoutIcons = {
  [IViewLayout.TABLE_LAYOUT]: Table2,
  [IViewLayout.BOARD_LAYOUT]: SquareKanban,
  [IViewLayout.ROADMAP_LAYOUT]: GanttChartSquare
} as const;

export function NavViews({
  project,
  baseLink
}: {
  project: number,
  baseLink: string
}) {
  const [isLoading, setIsLoading] = useState<boolean>(viewState.value.isLoadingViewsForProject == project)
  const [hasMoreViewsToLoad, setHasMoreViewsToLoad] = useState<boolean>(false)
  const [views, setViews] = useState<IProjectV2ViewQR[]>([])

  const loadMoreViews = (projectNumber: number) => {
    loadViewsForProject(projectNumber)
  }

  useSignalEffect(() => {
    const views = viewState.value.views
    if (views) {
      setViews(views[project].views || [])
      if (views[project].pageInfo.hasNextPage) {
        setHasMoreViewsToLoad(true)
      } else {
        setHasMoreViewsToLoad(false)
      }
    }
    if (viewState.value.isLoadingViewsForProject == project) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  })

  return (
    <SidebarMenuSub>
      {views.map((view) => (
        <SidebarMenuSubItem key={view.name}>
          <SidebarMenuSubButton asChild>
            <Link to={`${baseLink}/${view.number}`} >
              {(() => {
                const Icon = layoutIcons[view.layout] || Table2;
                return <Icon className="w-4 h-4 mr-2" />;
              })()}
              <span>{view.name}</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
      {isLoading && (
        <>
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
        </>
      )}
      {hasMoreViewsToLoad && (
        <SidebarMenuSubItem>
          <SidebarMenuSubButton aria-disabled={isLoading} onClick={() => loadMoreViews(project)} asChild>
            <div className="w-full cursor-pointer" >
              <MoreHorizontal className="w-4 h-4 mr-2" />
              <span>More</span>
            </div>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      )}
    </SidebarMenuSub >
  )
}
