import { IUser } from "./common"

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
    avatarUrl: string,
  },
  status: ProjectStatus
}

export type TProjectV2QR = {
  id: string,
  number: number,
  title: string,
  shortDescription: string,
  statusUpdates: { nodes: ProjectStatusUpdates[] }
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

export type BaseTeam = {
  id: string,
  name: string,
  avatarUrl: string,
  description: string
}

export type TeamMemberStatuses = {
  id: string,
  emoji: string,
  message: string,
  user: IUser,
}

export type Teams = BaseTeam & {
  description: string,
  parentTeam: BaseTeam,
  childTeams: {
    nodes: BaseTeam[]
  },
  memberStatuses: {
    nodes: TeamMemberStatuses[]
  },
  viewerCanAdminister: boolean
}

export type BaseRepository = {
  id: string,
  name: string,
  descriptionHTML: string,
}

export type RepositoryMilestone = {
  id: string,
  number: string,
  title: string,
  description: string,
  updatedAt: string,
  state: string,
  closed: boolean,
  closedAt: string,
  viewerCanClose: boolean,
  viwerCanReopen: boolean,
  repository: BaseRepository
}

export type RepositoryLabels = {
  id: string,
  name: string,
  description: string,
  isDefaule: boolean,
  color: string,
  createdAt: string,
  repository: BaseRepository
}

export type TProjectRepository = BaseRepository & {
  milestones: {
    nodes: RepositoryMilestone[]
  }
  labels: {
    nodes: RepositoryLabels[]
  }
}
