import { GithubClient } from "../core/github";

export class User {
  private github: GithubClient;

  constructor(authToken: string) {
    this.github = new GithubClient(authToken)
  }

  get self() {
    return this.github.request("GET /user", {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }
}
