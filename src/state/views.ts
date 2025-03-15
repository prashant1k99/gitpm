import { IViewLayout } from "@/types/common";

export interface IView {
  id: string
  number: number
  name: string
  layout: IViewLayout
}

export interface IViewInfo {
  project: number
  views: IView[]
}
