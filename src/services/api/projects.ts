import { IPageInfo } from "@/types/common";
import { GithubClient } from "../core/github";
import { TProjectV2QR } from "@/types/projects";
import projectsQuery from "@/graphql/queries/projects.graphql";

export class Project {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  projects(orgLogin: string, after = "", before = "") {
    interface IViewerProjectsLists {
      viewer: {
        organization: {
          projectsV2: {
            totalCount: number,
            pageInfo: IPageInfo,
            nodes: TProjectV2QR[]
          }
        }
      }
    }

    return this.github.executeGraph<IViewerProjectsLists>(projectsQuery, {
      login: orgLogin,
      after,
      before
    })
  }

  async getAllProjects({
    orgLogin,
    after = "",
    before = ""
  }: {
    orgLogin: string,
    after?: string,
    before?: string
  }) {
    interface IViewerProjectsLists {
      viewer: {
        organization: {
          projectsV2: {
            totalCount: number,
            pageInfo: IPageInfo,
            nodes: TProjectV2QR[]
          }
        }
      }
    }

    const projects: TProjectV2QR[] = []
    let pageInfo: IPageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: before,
      endCursor: after
    }
    let totalCount: number = 0

    let hasMoreProjects: boolean = true
    while (hasMoreProjects) {
      const data = await this.github.executeGraph<IViewerProjectsLists>(projectsQuery, {
        login: orgLogin,
        after,
        before
      })

      if (data.success) {
        const queryResponse = data.data.viewer.organization.projectsV2
        hasMoreProjects = queryResponse.pageInfo.hasNextPage
        after = queryResponse.pageInfo.endCursor
        totalCount = queryResponse.totalCount

        projects.push(...queryResponse.nodes)
        pageInfo = queryResponse.pageInfo
      } else {
        throw new Error(data.errors[0])
      }
    }

    return {
      projects,
      pageInfo,
      totalCount
    }
  }
}
