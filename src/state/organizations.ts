import { effect, signal } from "@preact/signals-react";
import authState from "./auth";

interface Organization {
  name: string,
  avatar: string,
  id: string,
  isCurrentUserAdmin: boolean
}

interface OrganizationsState {
  activeOrg: Organization | null,
  userOrgs: Organization[],
  areOrgLoaded: boolean
}

const getActiveOrgFromLocalStorage = (userId: string) => {
  const key = `${userId}:activeOrg`
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key) as string)
  }
  return null
}

const orgState = signal<OrganizationsState>({
  activeOrg: null,
  userOrgs: [],
  areOrgLoaded: false
})

effect(() => {
  if (authState.value.user) {
    const activeOrg = getActiveOrgFromLocalStorage(authState.value.user.uid as string)
    orgState.value.activeOrg = activeOrg
  }
  // Load all the other organizations after setting it up
})

export default orgState
