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
  fields: {},
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
        fields: {},
      }
    })
  }
})

export const loadAllFieldsForProject = async (projectNumber: number) => {
  if (fieldState.value.fields?.[projectNumber]) {
    return fieldState.value.fields?.[projectNumber]
  }
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
  if (fieldState.value.isLoadingFieldsForProject) {
    return
  }
  try {
    fieldState.value = {
      ...fieldState.value,
      isLoadingFieldsForProject: projectNumber,
    }

    const db = DB.getDatabases(orgState.value.activeOrg.login)
    const fieldService = new Field(authState.value.githubToken)
    const { totalCount, fields, pageInfo } =
      await fieldService.allFieldsForProject({
        orgLogin: orgState.value.activeOrg.login,
        projectNumber,
      })

    fields.map((field) => {
      db.fields.put({
        projectId: projectNumber,
        ...field
      })
    })
    console.log(db.fields.toArray())
    fieldState.value = {
      orgId: orgState.value.activeOrg.id,
      isLoadingFieldsForProject: null,
      fields: {
        ...fieldState.value.fields,
        [projectNumber]: {
          pageInfo,
          totalCount,
          fields,
        },
      },
    }

    return fields
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
