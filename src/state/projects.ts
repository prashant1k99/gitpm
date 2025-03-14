import { IPageInfo } from "@/types/common";
import { TProjectV2QR } from "@/types/projects";

export type TProject = Omit<TProjectV2QR, "views">;

export interface IProjectInfo {
  allProjectsLoaded: boolean
  paginationInfo: IPageInfo
  areLoading: boolean
  activeProjectNumber: number
  loadedProject: TProject[]
}

// Org permissions when fetching projects:
// Get Project Views
// Team
// isTemplate
// permissions: viewerCanUpdate, viewerCanClose
// readme

