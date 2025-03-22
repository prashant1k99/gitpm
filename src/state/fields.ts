import { effect, signal, untracked } from '@preact/signals-react'
import orgState from './organizations'
import {
  IFieldState,
} from '@/types/fields'
import authState from './auth'
import { toast } from 'sonner'
import { Field } from '@/services/api/fields'
import DB from '@/db/organization'

const fieldState = signal<IFieldState>({
  orgId: null,
  isLoadingFieldsForProject: null,
  loadedProjects: []
})

effect(() => {
  if (
    orgState.value.activeOrg &&
    orgState.value.activeOrg.id != fieldState.peek().orgId
  ) {
    untracked(() => {
      fieldState.value = {
        orgId: orgState.value.activeOrg?.id as string,
        isLoadingFieldsForProject: null,
        loadedProjects: []
      }
    })
  }
})

export const loadAllFieldsForProject = async (projectNumber: number) => {
  if (!authState.value.githubToken) {
    toast.error('Github Token not found', {
      description: 'Try again later',
    })
    return
  }
  if (!orgState.value.activeOrg) {
    toast.error('Unable to load projects', {
      description: 'Active Organization not selected',
    })
    return
  }
  const db = DB.getDatabases(orgState.value.activeOrg.login)

  if (fieldState.value.loadedProjects.includes(projectNumber)) {
    return db.fields.where("projectId").equals(projectNumber).toArray()
  }
  if (fieldState.value.isLoadingFieldsForProject) {
    return
  }
  try {
    fieldState.value = {
      ...fieldState.value,
      isLoadingFieldsForProject: projectNumber,
    }

    const fieldService = new Field(authState.value.githubToken)

    await fieldService.allFieldsForProject({
      orgLogin: orgState.value.activeOrg.login,
      projectNumber,
    })

    fieldState.value = {
      orgId: orgState.value.activeOrg.id,
      isLoadingFieldsForProject: null,
      loadedProjects: [
        ...fieldState.value.loadedProjects,
        projectNumber
      ]
    }

    return
  } catch (error) {
    fieldState.value = {
      ...fieldState.value,
      isLoadingFieldsForProject: null,
    }
    if (error instanceof Error) {
      toast.error(error.name, {
        description: error.message,
      })
      return
    }
    toast.error('Something went wrong', {
      description: 'Try again later',
    })
  }
}

export default fieldState
