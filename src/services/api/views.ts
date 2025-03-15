import { IPageInfo } from "@/types/common";
import { GithubClient } from "../core/github";
import { IProjectV2ViewQR } from "@/types/projects";
import viewsQuery from "@/graphql/queries/views.graphql";

export class View {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  views(orgLogin: string, projectNumber: number, after = "", before = "") {
    interface IViewerProjectsLists {
      viewer: {
        organization: {
          projectV2: {
            views: {
              totalCount: number,
              pageInfo: IPageInfo,
              nodes: IProjectV2ViewQR[]
            }
          }
        }
      }
    }

    return this.github.executeGraph<IViewerProjectsLists>(viewsQuery, {
      login: orgLogin,
      projectNumber,
      after,
      before
    })
  }
}
