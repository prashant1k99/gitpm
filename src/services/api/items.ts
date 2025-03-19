import { GithubClient } from "../core/github";
import { IPageInfo } from "@/types/common";
import itemsQuery from "@/graphql/queries/items.graphql"
import { I_ItemInfo } from "@/types/items";

export class ItemService {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  items({
    orgLogin,
    projectNumber,
    fieldCount = 10,
    itemCount = 20,
    after = "",
    before = ""
  }: {
    orgLogin: string,
    projectNumber: number,
    fieldCount?: number,
    itemCount?: number,
    after?: string,
    before?: string
  }) {
    return this.github.executeGraph<{
      viewer: {
        organization: {
          projectV2: {
            items: {
              totalCount: number,
              pageInfo: IPageInfo,
              nodes: I_ItemInfo[]
            }
          }
        }
      }
    }>(itemsQuery, {
      orgLogin,
      projectNumber,
      itemCount,
      fieldCount,
      after,
      before
    })
  }

  async allItemsForProject({
    orgLogin,
    projectNumber,
    fieldCount = 10,
    itemCount = 20,
    after = "",
    before = ""
  }: {
    orgLogin: string,
    projectNumber: number,
    fieldCount?: number,
    itemCount?: number,
    after?: string,
    before?: string
  }) {
    const items: I_ItemInfo[] = []
    let pageInfo: IPageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: before,
      endCursor: after
    }
    let totalCount: number = 0

    let hasMorePages: boolean = true
    while (hasMorePages) {
      const count: number = (totalCount > 0) ? totalCount - items.length : itemCount;
      const data = await this.github.executeGraph<{
        viewer: {
          organization: {
            projectV2: {
              items: {
                totalCount: number,
                pageInfo: IPageInfo,
                nodes: I_ItemInfo[]
              }
            }
          }
        }
      }>(itemsQuery, {
        orgLogin,
        projectNumber,
        itemCount: count,
        fieldCount,
        after,
        before
      })

      if (data.success) {
        const queryResponse = data.data.viewer.organization.projectV2.items
        hasMorePages = queryResponse.pageInfo.hasNextPage
        after = data.data.viewer.organization.projectV2.items.pageInfo.endCursor

        items.push(...data.data.viewer.organization.projectV2.items.nodes)
        pageInfo = queryResponse.pageInfo
        totalCount = queryResponse.totalCount
      } else {
        throw new Error(data.errors[0])
      }
    }
    return {
      items,
      pageInfo,
      totalCount
    }
  }
}
