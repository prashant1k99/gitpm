import { IPageInfo } from "./common"

export enum IViewLayout {
  TABLE_LAYOUT = "TABLE_LAYOUT",
  ROADMAP_LAYOUT = "ROADMAP_LAYOUT",
  BOARD_LAYOUT = "BOARD_LAYOUT"
}

export interface IProjectV2ViewQR {
  id: string,
  number: number,
  title: string,
  layout: IViewLayout,
  filter: string,
}

export type TProjectV2QR = {
  id: string,
  number: number,
  title: string,
  shortDescription: string,
  readme: string,
  template: boolean,
  viewerCanClose: boolean,
  viewerCanReopem: boolean,
  viewerCanUpdatre: boolean,
  views: {
    totalCount: number,
    pageInfo: IPageInfo,
    nodes: IProjectV2ViewQR[]
  }
}

export type TProject = Omit<TProjectV2QR, "views">
export interface IProjectState {
  orgId: string | null
  paginationInfo: IPageInfo | null,
  areLoading: boolean
  loadedProject: TProject[]
}

