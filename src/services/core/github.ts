import { Octokit, RequestError } from "octokit";

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  statusCode: number;
  errors: string[];
}

type QueryResponse<T> = SuccessResponse<T> | ErrorResponse;


export class GithubClient {
  private octokit: Octokit;

  constructor(authToken: string) {
    this.octokit = new Octokit({
      auth: authToken
    })
  }

  async executeGraph<T>(
    query: string,
    parameters: Record<string, string> = {}
  ): Promise<QueryResponse<T>> {
    try {
      const response = await this.octokit.graphql<T>(query, parameters);
      console.log(response)
      return {
        success: true,
        data: response
      };
    } catch (error) {
      if (error instanceof RequestError) {
        console.log("Request Error", error.status)
        return {
          success: false,
          statusCode: 300,
          errors: [error.message]
        };
      }
      console.log(error)
      return {
        success: false,
        statusCode: 500,
        errors: ['Unknown error occurred']
      };
    }
  }

  get rest() {
    return this.octokit.rest
  }

  get request() {
    return this.octokit.request
  }

  get paginate() {
    return this.octokit.paginate
  }
}
