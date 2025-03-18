export interface Project {
  id: string;
  number: number;
  name: string;
  description?: string;
  readme: string;
  isTemplate: boolean;
  updatedAt: Date;
  orgLogin: string;
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

export interface Field {
  id?: number;
  projectId: number; // Foreign key to Project
  name: string;
  type: string; // e.g., 'text', 'number', 'select', 'date'
  options?: string; // Options for this field
  defaultValue?: string;
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ItemType = "Tasks" | "Project" | "Field" | "Organization"

export interface Permissions {
  permissionFor: ItemType;
  permissionKey: string;
  permissionStatus: boolean;
  orgLogin: string;
}

export interface Favourites {
  id?: number;
  itemId: string;
  itemName: string;
  itemParentId: string;
  itemType: ItemType;
  index: number;
  orgLogin: string;
}

export interface PageInfo {
  id?: number;
  itemId?: number;
  itemType: ItemType;
  hasNextPage: boolean;
  endCursor: string;
  hasPreviousPage: boolean;
  startCursor: string;
  orgLogin: string;
}
