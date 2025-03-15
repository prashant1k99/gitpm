import { IPageInfo, IViewLayout } from "./common"

export interface IProjectV2ViewQR {
  id: string,
  number: number,
  name: string,
  layout: IViewLayout,
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

