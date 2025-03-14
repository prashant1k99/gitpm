import { computed, effect, signal, untracked } from "@preact/signals-react";
import orgState from "./organizations";
import { Project } from "@/services/api/projects";
import authState from "./auth";
import { toast } from "sonner";
import { IProjectState } from "@/types/projects";

const projectState = signal<IProjectState>({
  orgId: null,
  areLoading: false,
  paginationInfo: null,
  loadedProject: []
})

export const hasMoreProjectsToLoad = () => computed(() => projectState.value.paginationInfo?.hasNextPage)

export const isLoadingProjects = () => computed(() => projectState.value.areLoading)

export const loadProjects = (): Promise<boolean> => new Promise((resolve, reject) => {
  // check if the app needs to load additional or the first 
  const projectService = new Project(authState.value.githubToken as string);
  if (!orgState.value.activeOrg) {
    toast.error("Unable to load projects", {
      description: "Active Organization not selected"
    })
    return reject("Another problem")
  }
  if (projectState.value.areLoading) {
    return resolve(true)
  }
  const after = projectState.value.paginationInfo?.endCursor || ""
  try {
    projectState.value = {
      ...projectState.value,
      areLoading: true
    }
    projectService.projects(orgState.value.activeOrg.login, after).then((data) => {
      if (data.success) {
        // Something went wrong
        projectState.value = {
          ...projectState.value,
          orgId: orgState.value.activeOrg?.id as string,
          areLoading: false,
          paginationInfo: data.data.viewer.organization.projectsV2.pageInfo,
          loadedProject: [...projectState.value.loadedProject, ...data.data.viewer.organization.projectsV2.nodes]
        }
        return resolve(true)
      } else {
        return reject("Something went wrong")
      }
    })
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
      return reject(error.message)
    }
    return reject("Something went wrong")
  }
})

const clearProjectState = () => {
  projectState.value = {
    orgId: null,
    areLoading: false,
    paginationInfo: null,
    loadedProject: []
  }
}

effect(() => {
  // If organization is changed, clear all the projects as they are form current organization
  if (orgState.value.activeOrg?.id !== untracked(() => projectState.value.orgId) && authState.value.githubToken) {
    // Need to put project related changes in unstrack as it could lead to circular error
    untracked(() => {
      clearProjectState()
      loadProjects()
    })
  }
})

export default projectState
