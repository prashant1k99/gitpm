import { effect, signal, untracked } from "@preact/signals-react";
import orgState from "./organizations";
import { Project } from "@/services/api/projects";
import authState from "./auth";
import { toast } from "sonner";
import { IProjectState } from "@/types/projects";

const projectState = signal<IProjectState>({
  orgId: null,
  isLoading: false,
})

export const loadProjects = async () => {
  // check if the app needs to load additional or the first 
  const projectService = new Project(authState.value.githubToken as string);
  if (!orgState.value.activeOrg) {
    toast.error("Unable to load projects", {
      description: "Active Organization not selected"
    })
    return
  }
  try {
    projectState.value = {
      ...projectState.value,
      isLoading: true
    }

    await projectService.getAllProjects({
      orgLogin: orgState.value.activeOrg.login
    })

    projectState.value = {
      ...projectState.value,
      orgId: orgState.value.activeOrg?.id as string,
      isLoading: false,
    }

  } catch (error) {
    console.error(error)
    projectState.value = {
      ...projectState.value,
      isLoading: false
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
        isLoading: false,
      }
      loadProjects()
    })
  }
})

export default projectState
