export type TProjectV2QR = {
  id: string,
  number: number,
  title: string,
  shortDescription: string,
  readme: string,
  template: boolean,
  viewerCanClose: boolean,
  viewerCanReopen: boolean,
  viewerCanUpdate: boolean,
  updatedAt: string,
}

export type TProject = Omit<TProjectV2QR, "views">

export interface IProjectState {
  orgId: string | null
  isLoading: boolean
}

