import { IOrganizationQR } from "@/types/organizations";
import { GithubClient } from "../core/github";
import organizationsQuery from "@/graphql/queries/organizations.graphql";

export class Organization {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  organizations(after = "", before = "") {
    return this.github.executeGraph<{
      viewer: IOrganizationQR
    }>(organizationsQuery, {
      after,
      before
    })
  }

  orgs() {
    return this.github.paginate(this.github.rest.orgs.listForAuthenticatedUser)
  }

  orgInfo(name: string) {
    return this.github.rest.orgs.get({
      org: name
    })
  }
}
