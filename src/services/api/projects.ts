import { IPageInfo } from "@/types/common";
import { GithubClient } from "../core/github";
import { TProjectV2QR } from "@/types/projects";

export class Project {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  projects(orgLogin: string, after = "", before = "") {
    const query = `
      query GetProjects($login: String!, $after: String!, $before: String!) {
        viewer {
          organization(login: $login) {
            projectsV2(first: 20, after: $after, before: $before) {
              totalCount
              pageInfo {
                hasNextPage
                endCursor
                startCursor
                hasPreviousPage
              }
              nodes {
                readme
                id
                shortDescription
                number
                viewerCanClose
                viewerCanUpdate
                title
                template
                views(first: 10) {
                  totalCount
                  pageInfo {
                    hasNextPage
                    endCursor
                    startCursor
                    hasPreviousPage
                  }
                  nodes {
                    layout
                    number
                    id
                    name
                    filter
                  }
                }
                viewerCanUpdate
                viewerCanClose
                viewerCanReopen
              }
            }
          }
        }
      }
    `

    interface IViewerProjectsLists {
      viewer: {
        organization: {
          projectsV2: {
            totalCount: string,
            pageInfo: IPageInfo,
            nodes: TProjectV2QR[]
          }
        }
      }
    }

    return this.github.executeGraph<IViewerProjectsLists>(query, {
      login: orgLogin,
      after,
      before
    })
  }
}
