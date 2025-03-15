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
            totalCount: string,
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
}
