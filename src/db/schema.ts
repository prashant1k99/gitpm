import { IViewLayout } from "@/types/common";
import { TProjectV2Field } from "@/types/fields";
import {
  ItemType as TasksType,
  ItemContent as TaskContent,
  ProjectV2ItemFieldValue
} from "@/types/items"

export interface View {
  id: string;
  index: number;
  number: number;
  projectId: number;
  name: string;
  layout: IViewLayout;
  filter: Record<string, unknown>;
  sortBy: Record<string, "asc" | "desc">;
  createdAt: Date;
  updatedAt: Date;
}

export type Field = TProjectV2Field & {
  projectId: number
}

export type ItemType = "Tasks" | "Project" | "Field" | "Organization"

export interface Favourites {
  id?: number;
  itemId: string;
  itemName: string;
  itemParentId: string;
  itemType: ItemType;
  index: number;
}

export interface PageInfo {
  id?: number;
  itemId?: number;
  itemType: ItemType;
  hasNextPage: boolean;
  endCursor: string;
  hasPreviousPage: boolean;
  startCursor: string;
}

export type T_TaskField = {
  [key: string]: ProjectV2ItemFieldValue
}

export type Tasks = {
  id: string
  projectId: number,
  isArchived: boolean
  type: TasksType
  updatedAt: Date
  fields: T_TaskField,
  content: TaskContent,
  permissions: {
    viewerCanClose: boolean
    viewerCanDelete: boolean
    viewerCanLabel: boolean
    viewerCanReopen: boolean
    viewerCanUpdate: boolean
  }
}
