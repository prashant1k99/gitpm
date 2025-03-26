export enum ProjectStatus {
  AT_RISK = 'AT_RISK',
  COMPLETE = 'COMPLETE',
  INACTIVE = 'INACTIVE',
  OFF_TRACK = 'OFF_TRACK',
  ON_TRACK = 'ON_TRACK'
}

export type ProjectStatusUpdates = {
  startDate: string,
  targetDate: string,
  updatedAt: string,
  createdAt: string,
  id: string,
  bodyHTML: string,
  creator: {
    login: string,
    avatarURL: string,
  },
  status: ProjectStatus
}

export type TProjectV2QR = {
  id: string,
  number: number,
  title: string,
  shortDescription: string,
  readme: string,
  template: boolean,
  public: boolean,
  closed: boolean,
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

