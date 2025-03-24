import { TProjectV2Field } from "@/types/fields";

export function transformFieldNameForQuery(fieldName: string) {
  return fieldName.replace(/\s+(.)/g, (_, c) => c.toLowerCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, c => c.toLowerCase())
    .replace(/[^\w]/g, ''); // Remove any non-word characters
}

export function generateItemsQuery(fields: TProjectV2Field[]): string {
  const fieldValueQueries = fields.map(field => {
    return `
    _field_${field.fieldQueryName}: fieldValueByName(name: "${field.name}") {
      ...FieldValueArguments
    }`;
  }).join('\n');

  return `
    query GetItemsForProjectV2($orgLogin: String!, $projectNumber: Int!, $itemCount: Int!, $after: String, $before: String) {
      viewer {
        organization(login: $orgLogin) {
          projectV2(number: $projectNumber) {
            items(first: $itemCount, after: $after, before: $before, orderBy: { direction: DESC, field: POSITION }) {
              totalCount
              pageInfo {
                hasNextPage
                endCursor
                hasPreviousPage
                startCursor
              }
              nodes {
                id
                isArchived
                updatedAt
                type
                content {
                  ... on Issue {
                    number
                    id
                    title
                    state
                    body
                    closed
                    createdAt
                    milestone {
                      number
                      title
                      id
                    }
                    assignees(first: 100) {
                      nodes {
                        name
                        id
                        avatarUrl
                      }
                    }
                    author {
                      avatarUrl
                      login
                    }
                    authorAssociation
                    linkedBranches(first: 10) {
                      nodes {
                        id
                        ref {
                          id
                          name
                          prefix
                        }
                      }
                    }
                    parent {
                      id
                    }
                    reactions(first: 100) {
                      nodes {
                        id
                        content
                        user {
                          id
                          name
                          login
                          avatarUrl
                        }
                      }
                    }
                    state
                    viewerCanClose
                    viewerCanDelete
                    viewerCanLabel
                    viewerCanReopen
                    viewerCanUpdate
                    labels(first: 100) {
                      totalCount
                      nodes {
                        color
                        id
                        name
                      }
                    }
                    repository {
                      name
                      id
                    }
                  }
                  ... on DraftIssue {
                    id
                    title
                    body
                    createdAt
                    assignees(first: 100) {
                      nodes {
                        name
                        id
                        avatarUrl
                      }
                    }
                  }
                }
                ${fieldValueQueries}
              }
            }
          }
        }
      }
    }
    
    fragment FieldValueArguments on ProjectV2ItemFieldValue {
      __typename
      ... on ProjectV2ItemFieldValueCommon {
        id
        field {
          ... on ProjectV2FieldCommon {
            id
            name
          }
        }
      }
      ... on ProjectV2ItemFieldDateValue {
        date
      }
      ... on ProjectV2ItemFieldIterationValue {
        iterationId
        title
        startDate
        duration
      }
      ... on ProjectV2ItemFieldLabelValue {
        labels(first: 10) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            name
            color
          }
        }
      }
      ... on ProjectV2ItemFieldMilestoneValue {
        milestone {
          id
          title
          state
        }
      }
      ... on ProjectV2ItemFieldPullRequestValue {
        pullRequests(first: 100) {
          nodes {
            id
            closed
            title
          }
        }
      }
      ... on ProjectV2ItemFieldRepositoryValue {
        repository {
          name
          id
        }
      }
      ... on ProjectV2ItemFieldReviewerValue {
        reviewers(first: 10) {
          pageInfo {
            hasNextPage
            endCursor
          }
          totalCount
          nodes {
            __typename
            ... on Bot {
              id
              login
              avatarUrl
            }
            ... on Mannequin {
              avatarUrl
              id
              login
            }
            ... on Team {
              id
              name
              avatarUrl
            }
            ... on User {
              id
              name
              avatarUrl
            }
          }
        }
      }
      ... on ProjectV2ItemFieldSingleSelectValue {
        color
        id
        name
      }
      ... on ProjectV2ItemFieldTextValue {
        id
        text
        field {
          ... on ProjectV2FieldCommon {
            name
            id
          }
        }
      }
      ... on ProjectV2ItemFieldUserValue {
        field {
          ... on ProjectV2FieldCommon {
            name
            id
          }
        }
        users(first: 10) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            name
            avatarUrl
          }
        }
      }
      ... on ProjectV2ItemFieldNumberValue {
        number
      }
    }
  `;
}
