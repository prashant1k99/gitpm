import { graphql, GraphqlResponseError } from "@octokit/graphql";
import type { GraphQlQueryResponseData } from "@octokit/graphql";

const query = `{
  viewer {
    id,
    url,
    databaseId,
    isEmployee,
    anyPinnableItems,
  }
}`;

export default async (authToken: string) => {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${authToken}`,
    },
  });

  try {
    const result = await graphqlWithAuth(query) as GraphQlQueryResponseData;
    console.log(result)
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      // do something with the error, allowing you to detect a graphql response error,
      // compared to accidentally catching unrelated errors.

      // server responds with an object like the following (as an example)
      // class GraphqlResponseError {
      //  "headers": {
      //    "status": "403",
      //  },
      //  "data": null,
      //  "errors": [{
      //   "message": "Field 'bioHtml' doesn't exist on type 'User'",
      //   "locations": [{
      //    "line": 3,
      //    "column": 5
      //   }]
      //  }]
      // }

      console.log("Error: ", error)
      console.log("Header: ", error.headers)
      console.log("Request failed:", error.request); // { query, variables: {}, headers: { authorization: 'token secret123' } }
      console.log(error.message); // Field 'bioHtml' doesn't exist on type 'User'
    } else {
      // handle non-GraphQL error
    }
  }
}
