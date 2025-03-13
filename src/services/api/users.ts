import { GithubClient } from "../core/github";

export class Users {
  private github: GithubClient;

  constructor(authToken: string) {
    console.log("AuthToken: ", authToken)
    this.github = new GithubClient(authToken)
  }

  get getCurrentUser() {
    return this.github.request("GET /user")
  }
}
