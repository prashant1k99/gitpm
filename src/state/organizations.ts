import { effect, signal } from "@preact/signals-react";
import authState from "./auth";
import { Organization as OrganizationService } from "@/services/api/organizations";
import { toast } from "sonner";
import { IOrganizationsState } from "@/types/organizations";

const getActiveOrgFromLocalStorage = (userId: string) => {
  const key = `${userId}:activeOrg`
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key) as string)
  }
  return null
}

const setActiveOrgToLocalStorage = (userId: string, org: string) => {
  const key = `${userId}:activeOrg`
  localStorage.setItem(key, org)
}

const orgState = signal<IOrganizationsState>({
  activeOrg: null,
  userOrgs: [],
  areOrgLoaded: false
})

effect(() => {
  if (authState.value.user) {
    const activeOrg = getActiveOrgFromLocalStorage(authState.value.user.uid as string)
    orgState.value.activeOrg = activeOrg
  }
})

export const loadAllUserOrgs = (): Promise<boolean> => new Promise((resolve, reject) => {
  if (!authState.value.githubToken) {
    return resolve(false)
  }
  try {
    const orgService = new OrganizationService(authState.value.githubToken);
    orgService.organizations().then((data) => {
      if (data.success) {
        orgState.value = {
          ...orgState.value,
          userOrgs: data.data.viewer.organizations.nodes,
          areOrgLoaded: true
        }
      } else {
        reject(data.errors[0])
      }
    })
  } catch (error) {
    reject(error)
  }
})

export const setActiveOrgForUser = (id: string) => {
  const activeOrg = orgState.value.userOrgs.find((org) => org.id == id)

  if (!activeOrg) {
    throw new Error("Invalid Organization selected")
  }

  setActiveOrgToLocalStorage(authState.value.user?.uid as string, JSON.stringify(activeOrg))
  orgState.value = {
    ...orgState.value,
    activeOrg
  }
  toast.info(`Switched to ${activeOrg.name}`)
}

export default orgState
