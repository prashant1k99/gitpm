import { IPageInfo } from "./common"

export type TOrganizationInfoQR = {
  name: string,
  avatarUrl: string,
  login: string,
  id: string,
  viewerCanAdminister: boolean
  viewerCanCreateProjects: boolean
  viewerCanCreateRepositories: boolean
  viewerCanCreateTeams: boolean
}

export interface IOrganizationQR {
  name: string,
  email: string,
  avatarUrl: string,
  organizations: {
    totalCount: number,
    pageInfo: IPageInfo,
    nodes: TOrganizationInfoQR[]
  }
}

export type TOrganization = TOrganizationInfoQR

export interface IOrganizationsState {
  activeOrg: TOrganization | null,
  userOrgs: TOrganization[],
  areOrgLoaded: boolean
}
