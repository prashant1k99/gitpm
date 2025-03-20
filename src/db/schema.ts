import { TProjectV2Field } from "@/types/fields";
import {
  ItemType as TasksType,
  ItemContent as TaskContent,
  ProjectV2ItemFieldValue as TasksFieldValue
} from "@/types/items"

export interface Project {
  id: string;
  number: number;
  name: string;
  description?: string;
  readme: string;
  isTemplate: boolean;
  updatedAt: Date;
}

export enum IViewLayout {
  TABLE_LAYOUT = "TABLE_LAYOUT",
  ROADMAP_LAYOUT = "ROADMAP_LAYOUT",
  BOARD_LAYOUT = "BOARD_LAYOUT"
}

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

export interface Tasks {
  id: string
  projectId: number,
  isArchived: boolean
  type: TasksType
  updatedAt: Date
  fields: TasksFieldValue[],
  content: TaskContent,
  permissions: {
    viewerCanClose: boolean
    viewerCanDelete: boolean
    viewerCanLabel: boolean
    viewerCanReopen: boolean
    viewerCanUpdate: boolean
  }
}
