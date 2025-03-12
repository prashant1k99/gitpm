import { GithubClient } from "../core/github";

export class Organization {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  get organizations() {
    return this.github.request("GET /user/orgs")
  }
}
