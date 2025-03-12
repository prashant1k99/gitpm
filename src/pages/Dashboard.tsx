import { Button } from "@/components/ui/button";
import { Organization } from "@/services/api/organizations";
import { GithubClient } from "@/services/core/github";
import authState from "@/state/auth";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  useEffect(() => {
    if (authState.value.githubToken) {
      const org = new Organization(authState.value.githubToken)
      org.organizations.then((orgs) => {
        const key = `${authState.value.user?.uid}:activeOrg`
        localStorage.setItem(key, JSON.stringify(orgs.data[0]))
        console.log(orgs)
      })
    }
  }, [])
  const [res, setRes] = useState("")
  const [res1, setRes1] = useState("")
  const test = async () => {
    const query = `{
  viewer {
    id,
    url,
    databaseId,
    isEmployee,
    anyPinnableItems,
organizations(first: 10) {
      nodes {
        name,
        repositories (first: 10) {
          totalCount,
          nodes {
            name,
            description,
            discussions (first: 10) {
              totalCount,
              nodes {
                id,
                title,
                isAnswered
              }
            }
          }
        },
        repositoryDiscussions(first: 10) {
          totalCount,
          nodes {
            title
          }
        }
      }
    }
  },
  rateLimit (dryRun: false) {
cost,
limit,
remaining
}
}`;
    const client = new GithubClient("auth token here")
    const response = await client.executeGraph<{ name: string }>(query)
    console.log("Res: ", response)
    if (response.success) {
      console.log(response.data)
      setRes(JSON.stringify(response.data, null, 2))
    }

    const orgs = await client.rest.orgs.listForUser({
      username: "prashant1k99"
    })
    console.log("orgs", orgs)
    setRes1(JSON.stringify(orgs.data, null, 2))

    const org = await client.request("GET /user/orgs", {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    console.log("REst ORgs: ", org)

    const results = await client.paginate("GET /user/orgs", {
      per_page: 1
    })
    console.log("Results 3: ", results)

    const res = await client.executeGraph<{ name: string }>(query)
    console.log("Res: ", res)
    if (res.success) {
      console.log(res.data)
      setRes(JSON.stringify(res.data, null, 2))
    }
  }

  return (
    <div>
      <h1>
        Dashboard Page
      </h1>
      <Button onClick={test}>Load</Button>
      <p>{res}</p>
      <p>{res1}</p>
    </div>
  )
}
