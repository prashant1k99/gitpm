import { GithubClient } from "../core/github";
import fieldQuery from "@/graphql/queries/fields.graphql";
import { IPageInfo } from "@/types/common";
import { TProjectV2FieldQR } from "@/types/fields";
import { transformFieldNameForQuery } from "./utils/generateItemsQuery";
import DB from "@/db/organization";

export class Field {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  async allFieldsForProject({
    orgLogin,
    projectNumber,
    after = "",
    before = ""
  }: {
    orgLogin: string,
    projectNumber: number,
    after?: string,
    before?: string
  }) {
    let pageInfo: IPageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: before,
      endCursor: after
    }
    let totalCount: number = 0

    const db = DB.getDatabases(orgLogin)

    let hasMorePages: boolean = true
    while (hasMorePages) {
      const data = await this.github.executeGraph<{
        viewer: {
          organization: {
            projectV2: {
              fields: {
                totalCount: number,
                pageInfo: IPageInfo,
                nodes: TProjectV2FieldQR[]
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

      if (data.success) {
        const queryResponse = data.data.viewer.organization.projectV2.fields
        hasMorePages = queryResponse.pageInfo.hasNextPage
        after = data.data.viewer.organization.projectV2.fields.pageInfo.endCursor

        queryResponse.nodes.map((field) => {
          const fieldQueryName = transformFieldNameForQuery(field.name)
          db.fields.put({
            projectId: projectNumber,
            ...field,
            fieldQueryName,
          })
        })

        pageInfo = queryResponse.pageInfo
        totalCount = queryResponse.totalCount
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
