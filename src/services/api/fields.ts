import { GithubClient } from "../core/github";
import fieldQuery from "@/graphql/queries/fields.graphql";
import { IPageInfo } from "@/types/common";
import { IProjectV2Field } from "@/types/fields";

export class Field {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  fields({
    orgLogin,
    projectNumber,
    after = "",
    before = ""
  }: {
    orgLogin: string,
    projectNumber: number,
    after: string,
    before: string
  }) {
    return this.github.executeGraph<{
      viewer: {
        organization: {
          projectV2: {
            fields: {
              totalCount: number,
              pageInfo: IPageInfo,
              nodes: IProjectV2Field[]
            }
          }
        }
      }
    }>(fieldQuery, {
      orgLogin,
      projectNumber,
      after,
      before
    })
  }
}
