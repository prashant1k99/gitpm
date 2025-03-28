import { effect, signal, untracked } from "@preact/signals-react"
import orgState from "./organizations"
import { IViewLayout } from "@/types/common"
import { Field } from "@/db/schema"

export interface IViewState {
  orgLogin: string
  activeViewId: number | null
  selectedIds: string[]
}

const viewState = signal<IViewState>({
  orgLogin: "",
  activeViewId: null,
  selectedIds: [],
})

export enum FilterOptionOperations {
  EQ,
  GT,
  LT,
  GTE,
  LTE
}

export interface IFilterOptions {
  [key: string]: unknown,
  operation: FilterOptionOperations
}

export enum ConstVisibleFields {
  Description = "const_description",
  UpdatedAt = "const_updatedAt",
  Assignee = "const_assignee",
  Labels = "const_labels",
  CreatedAt = "const_createdAt",
}

export interface IViewOptionState {
  groupByField?: Field
  filter?: IFilterOptions
  layout: IViewLayout
  fieldsVisible: string[]
  fieldsVisibleConst: ConstVisibleFields[]
}

export const viewOptionState = signal<IViewOptionState>({
  layout: IViewLayout.TABLE_LAYOUT,
  fieldsVisible: [],
  fieldsVisibleConst: [ConstVisibleFields.Labels, ConstVisibleFields.Assignee, ConstVisibleFields.Description, ConstVisibleFields.UpdatedAt]
})

export function setGroupByOptions(field?: Field) {
  viewOptionState.value = {
    ...viewOptionState.value,
    groupByField: field
  }
}

export function setViewLayout(layout: IViewLayout) {
  viewOptionState.value = {
    ...viewOptionState.value,
    layout
  }
}

export function toggleFieldVisibleConst(field: ConstVisibleFields) {
  const visibleConstField = viewOptionState.value.fieldsVisibleConst.includes(field)
    ? viewOptionState.value.fieldsVisibleConst.filter(el => el != field)
    : [...viewOptionState.value.fieldsVisibleConst, field]

  viewOptionState.value = {
    ...viewOptionState.value,
    fieldsVisibleConst: visibleConstField as ConstVisibleFields[]
  }
}

export function toggleFieldVisible(field: string) {
  const visibleFields = viewOptionState.value.fieldsVisible.includes(field)
    ? viewOptionState.value.fieldsVisible.filter(el => el != field)
    : [...viewOptionState.value.fieldsVisible, field]

  viewOptionState.value = {
    ...viewOptionState.value,
    fieldsVisible: visibleFields
  }
}

effect(() => {
  if (orgState.value.activeOrg && orgState.value.activeOrg?.login != viewState.peek().orgLogin) {
    untracked(() => {
      viewState.value = {
        orgLogin: orgState.value.activeOrg?.login as string,
        activeViewId: null,
        selectedIds: []
      }
    })
  }
})

export default viewState
