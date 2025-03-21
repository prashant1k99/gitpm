import { GithubClient } from "../core/github";
import { IPageInfo } from "@/types/common";
import { I_ItemQR, TItemInfo } from "@/types/items";
import { processItemResponse } from "./utils/processItemResponse";
import { TProjectV2Field } from "@/types/fields";
import { generateItemsQuery } from "./utils/generateItemsQuery";

export class ItemService {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  async allItemsForProject({
    orgLogin,
    projectNumber,
    fields,
    itemCount = 20,
    after = "",
    before = ""
  }: {
    orgLogin: string,
    projectNumber: number,
    fields: TProjectV2Field[]
    itemCount?: number,
    after?: string,
    before?: string
  }) {
    const items: TItemInfo[] = []
    let pageInfo: IPageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: before,
      endCursor: after
    }
    let totalCount: number = 0

    const generatedDynQuery = generateItemsQuery(fields)

    let hasMorePages: boolean = true
    while (hasMorePages) {
      const count: number = (totalCount > 0) ? totalCount - items.length : itemCount;
      const data = await this.github.executeGraph<I_ItemQR>(generatedDynQuery, {
        orgLogin,
        projectNumber,
        itemCount: count,
        after,
        before
      })

      if (data.success) {
        const queryResponse = data.data.viewer.organization.projectV2.items
        hasMorePages = queryResponse.pageInfo.hasNextPage
        after = data.data.viewer.organization.projectV2.items.pageInfo.endCursor

        queryResponse.nodes.map((item) => {
          items.push(processItemResponse(item))
        })
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
