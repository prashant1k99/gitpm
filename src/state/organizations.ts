import { signal } from "@preact/signals-react";
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from "@/lib/firebase";

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

onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  if (firebaseUser) {
    const activeOrg = getActiveOrgFromLocalStorage(firebaseUser.uid)
    orgState.value.activeOrg = activeOrg
    // Call API to load all the Orgs for User
  }
})

export default orgState
