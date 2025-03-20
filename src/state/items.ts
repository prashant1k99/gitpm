import { I_ItemState, IssueContent, ItemType } from '@/types/items'
import { signal } from '@preact/signals-react'
import orgState from './organizations'
import authState from './auth'
import { toast } from 'sonner'
import { ItemService } from '@/services/api/items'
import fieldState from './fields'
import DB from '@/db/organization'

const itemState = signal<I_ItemState>({
  isLoading: false,
  loadedProjects: [],
  orgLogin: null,
})

export const loadItemsForProject = async (projectNumber: number) => {
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
  if (itemState.value.loadedProjects.includes(projectNumber)) {
    return db.tasks.where("projectId").equals(projectNumber).toArray()
  }

  if (
    itemState.value.isLoading ||
    fieldState.value.isLoadingFieldsForProject == projectNumber
  ) {
    return
  }
  try {
    itemState.value = {
      ...itemState.value,
      isLoading: true,
    }
    const itemService = new ItemService(authState.value.githubToken)
    const fieldCount = await db.fields.where("projectId").equals(projectNumber).count() || 20

    const { items } =
      await itemService.allItemsForProject({
        orgLogin: orgState.value.activeOrg.login,
        projectNumber,
        fieldCount,
      })
    items.map((item) => {
      const defaultPermissions = {
        viewerCanClose: false,
        viewerCanDelete: false,
        viewerCanLabel: false,
        viewerCanReopen: false,
        viewerCanUpdate: false,
      }

      const permissions =
        item.type === ItemType.ISSUE
          ? {
            viewerCanClose:
              (item.content as IssueContent)?.viewerCanClose || false,
            viewerCanDelete:
              (item.content as IssueContent)?.viewerCanDelete || false,
            viewerCanLabel:
              (item.content as IssueContent)?.viewerCanLabel || false,
            viewerCanReopen:
              (item.content as IssueContent)?.viewerCanReopen || false,
            viewerCanUpdate:
              (item.content as IssueContent)?.viewerCanUpdate || false,
          }
          : defaultPermissions

      db.tasks.put({
        ...item,
        projectId: projectNumber,
        updatedAt: new Date(item.updatedAt),
        fields: item.fieldValues.nodes,
        content: item.content,
        permissions: permissions,
      })
    })
    itemState.value = {
      orgLogin: orgState.value.activeOrg.id,
      isLoading: false,
      loadedProjects: [...itemState.value.loadedProjects, projectNumber],
    }
    return items
  } catch (error) {
    console.error(error)
    itemState.value = {
      ...itemState.value,
      isLoading: false,
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

export default itemState
