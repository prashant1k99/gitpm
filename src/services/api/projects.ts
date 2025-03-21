import { IPageInfo } from "@/types/common";
import { GithubClient } from "../core/github";
import { TProjectV2QR } from "@/types/projects";
import projectsQuery from "@/graphql/queries/projects.graphql";
import DB from "@/db/organization";

export class Project {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
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

    let pageInfo: IPageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: before,
      endCursor: after
    }
    let totalCount: number = 0

    const db = DB.getDatabases(orgLogin)

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

        queryResponse.nodes.map((project) => {
          db.projects.put(project)
        })

        pageInfo = queryResponse.pageInfo
      } else {
        throw new Error(data.errors[0])
      }
    }

    return {
      pageInfo,
      totalCount
    }
  }
}
