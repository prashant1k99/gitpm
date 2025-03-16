import { View } from "@/services/api/views";
import { ILoadViewsForProjects, IViewInfo, IViewsInfo, IViewState } from "@/types/views";
import { signal } from "@preact/signals-react";
import projectState from "./projects";
import authState from "./auth";
import orgState from "./organizations";
import { toast } from "sonner";

const viewState = signal<IViewState>({
  isLoadingViewsForProject: null,
  views: {},
})

export const addLoadedViewsToProject = (data: ILoadViewsForProjects[]) => {
  const newViews = data.reduce((acc, item) => ({
    ...acc,
    [item.project]: {
      pageInfo: item.pageInfo,
      views: item.views,
      totalCount: item.totalCount
    } as IViewInfo
  }), {}) as IViewsInfo;

  viewState.value = {
    ...viewState.value,
    views: {
      ...viewState.value.views,
      ...newViews
    }
  }
}

export const loadViewsForProject = async (projectNumber: number) => {
  // check if the app needs to load additional or the first 
  const viewService = new View(authState.value.githubToken as string);
  if (!orgState.value.activeOrg) {
    toast.error("Unable to load projects", {
      description: "Active Organization not selected"
    })
    return
  }
  if (viewState.value.isLoadingViewsForProject || projectState.value.areLoading) {
    return
  }
  const after = viewState.value.views?.[projectNumber]?.pageInfo.endCursor || ""
  try {
    viewState.value = {
      ...viewState.value,
      isLoadingViewsForProject: projectNumber,
    }
    const data = await viewService.views(orgState.value.activeOrg.login, projectNumber, after)
    if (data.success) {
      const viewsData = data.data.viewer.organization.projectV2.views

      const viewMap = new Map(
        (viewState.value.views?.[projectNumber]?.views || []).map(view => [view.number, view])
      )

      viewsData.nodes.forEach(view => {
        viewMap.set(view.number, view)
      })

      viewState.value = {
        views: {
          ...viewState.value.views,
          [projectNumber]: {
            pageInfo: viewsData.pageInfo,
            views: Array.from(viewMap.values()),
            totalCount: viewsData.totalCount
          }
        },
        isLoadingViewsForProject: null
      }
      return
    } else {
      console.log(data.errors)
      throw new Error(data.errors[0])
    }
  } catch (error) {
    console.error(error)
    viewState.value = {
      ...viewState.value,
      isLoadingViewsForProject: null
    }
    if (error instanceof Error) {
      toast.error(error.name, {
        description: error.message
      })
      return
    }
    toast.error('Something went wrong', {
      description: 'Try again later'
    })
  }
}

export default viewState
