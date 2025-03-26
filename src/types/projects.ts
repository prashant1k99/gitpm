export enum ProjectStatus {
  AT_RISK = 'AT_RISK',     // A project v2 that is at risk and encountering some challenges
  COMPLETE = 'COMPLETE',    // A project v2 that is complete
  INACTIVE = 'INACTIVE',    // A project v2 that is inactive
  OFF_TRACK = 'OFF_TRACK',  // A project v2 that is off track and needs attention
  ON_TRACK = 'ON_TRACK'     // A project v2 that is on track with no risks
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

