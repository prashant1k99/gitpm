import { IOrganizationQR } from "@/types/organizations";
import { GithubClient } from "../core/github";

export class Organization {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  organizations(after = "", before = "") {
    const query = `
      query GetOrganization($after: String!, $before: String!) {
        viewer {
          organizations(first: 30, after: $after, before: $before) {
            totalCount,
            pageInfo {
              hasNextPage
              endCursor
              startCursor
              hasPreviousPage
            }
            nodes {
              name
              avatarUrl
              login
              id
              viewerCanAdminister
              viewerCanCreateProjects
              viewerCanCreateRepositories
            }
          }
        }
      }
    `;

    return this.github.executeGraph<{
      viewer: IOrganizationQR
    }>(query, {
      after,
      before
    })
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
