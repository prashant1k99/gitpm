import { computed, effect, signal, untracked } from "@preact/signals-react";
import orgState from "./organizations";
import { Project } from "@/services/api/projects";
import authState from "./auth";
import { toast } from "sonner";
import { IProjectState } from "@/types/projects";
import { addLoadedViewsToProject, ILoadViewsForProjects } from "./views";

const projectState = signal<IProjectState>({
  orgId: null,
  areLoading: false,
  paginationInfo: null,
  loadedProject: []
})

export const hasMoreProjectsToLoad = () => computed(() => projectState.value.paginationInfo?.hasNextPage)

export const isLoadingProjects = () => computed(() => projectState.value.areLoading)

export const loadProjects = async () => {
  // check if the app needs to load additional or the first 
  const projectService = new Project(authState.value.githubToken as string);
  if (!orgState.value.activeOrg) {
    toast.error("Unable to load projects", {
      description: "Active Organization not selected"
    })
    return
  }
  if (projectState.value.areLoading) {
    return
  }
  const after = projectState.value.paginationInfo?.endCursor || ""
  try {
    projectState.value = {
      ...projectState.value,
      areLoading: true
    }
    const data = await projectService.projects(orgState.value.activeOrg.login, after)
    if (data.success) {
      const projectQueryData = data.data.viewer.organization.projectsV2
      const projectMap = new Map(
        projectState.value.loadedProject.map(project => [project.number, project])
      )

      projectQueryData.nodes.forEach((project) => projectMap.set(project.number, project))

      projectState.value = {
        ...projectState.value,
        orgId: orgState.value.activeOrg?.id as string,
        areLoading: false,
        paginationInfo: projectQueryData.pageInfo,
        loadedProject: Array.from(projectMap.values()),
      }

      // For Saving preloaded views for there respective projects
      const viewsForProjects: ILoadViewsForProjects[] = []
      projectQueryData.nodes.forEach((project) => {
        viewsForProjects.push({
          project: project.number,
          views: project.views.nodes,
          pageInfo: project.views.pageInfo,
          totalCount: project.views.totalCount
        })
      })

      addLoadedViewsToProject(viewsForProjects);

      return
    } else {
      console.log(data.errors)
      throw new Error(data.errors[0])
    }
  } catch (error) {
    console.error(error)
    projectState.value = {
      ...projectState.value,
      areLoading: false
    }
    if (error instanceof Error) {
      toast.error(error.name, {
        description: error.message
      })
      return
    }
    toast.error("Something went wrong", {
      description: "Try again later"
    })
  }
}

effect(() => {
  // If organization is changed, clear all the projects as they are form current organization
  if (orgState.value.activeOrg?.id !== untracked(() => projectState.value.orgId) && authState.value.githubToken) {
    // Need to put project related changes in unstrack as it could lead to circular error
    untracked(() => {
      projectState.value = {
        orgId: null,
        areLoading: false,
        paginationInfo: null,
        loadedProject: []
      }
      loadProjects()
    })
  }
})

export default projectState
