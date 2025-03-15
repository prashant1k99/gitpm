import { Octokit, RequestError } from "octokit";
import { DocumentNode, print } from "graphql";

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
    query: string | DocumentNode,
    parameters: Record<string, unknown> = {}
  ): Promise<QueryResponse<T>> {
    try {
      // Convert DocumentNode to string if needed
      const queryString = typeof query === 'string' ? query : print(query);

      const response = await this.octokit.graphql<T>(queryString, parameters);
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
