import { GithubClient } from "../core/github";

export interface IOrganizationInfo {
  name: string,
  avatarUrl: string,
  login: string,
  id: string,
  viewerCanAdminister: boolean
}

export interface IOrganizationQueryResponse {
  name: string,
  email: string,
  avatarUrl: string,
  organizations: {
    totalCount: number,
    nodes: IOrganizationInfo[]
  }
}

export interface IViewer {
  viewer: IOrganizationQueryResponse
}

export class Organization {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  get organizations() {
    const query = `
      query GetOrganization {
        viewer {
          organizations(first: 30) {
            totalCount,
            nodes {
              name
              avatarUrl
              login
              id
              viewerCanAdminister
            }
          }
        }
      }
    `;



    return this.github.executeGraph<IViewer>(query)
  }

  organization(name: string) {
    return this.github.request("GET /orgs/{org}", {
      org: name
    })
  }

  listMembers(name: string) {
    return this.github.request("GET /orgs/{org}/members", {
      org: name,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }

  getUserRole({ orgName, userName }: {
    orgName: string,
    userName: string
  }) {
    return this.github.request("GET /orgs/{org}/memberships/{username}", {
      org: orgName,
      username: userName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }
}
