import { IPageInfo } from "./common"
import { IProjectV2ViewQR } from "./projects"

export interface IViewInfo {
  views: IProjectV2ViewQR[]
  pageInfo: IPageInfo
  totalCount: number
}

export interface IViewsInfo {
  [key: number]: {
    views: IProjectV2ViewQR[]
    pageInfo: IPageInfo
    totalCount: number
  }
}

export interface IViewState {
  isLoadingViewsForProject: number | null // To show which project's views are loading
  views: IViewsInfo | null
}
