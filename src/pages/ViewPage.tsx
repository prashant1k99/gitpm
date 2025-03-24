import DB, { OrganizationDB } from "@/db/organization"
import orgState from "@/state/organizations"
import { useSignalEffect } from "@preact/signals-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLiveQuery } from "dexie-react-hooks"
import { getNestedValue } from "@/lib/utils"
import { Tasks } from "@/db/schema"

function getValuePath(typeName: string) {
  switch (typeName) {
    case "ProjectV2ItemFieldUserValue":
      return "users.nodes[0].name";
    case "ProjectV2ItemFieldDateValue":
      return "date";
    case "ProjectV2ItemFieldIterationValue":
      return "title";
    case "ProjectV2ItemFieldMilestoneValue":
      return "milestone.title";
    case "ProjectV2ItemFieldRepositoryValue":
      return "repository.name";
    case "ProjectV2ItemFieldReviewerValue":
      return "reviewers.nodes[0].name";
    case "ProjectV2ItemFieldSingleSelectValue":
      return "name";
    case "ProjectV2ItemFieldTextValue":
      return "text";
    case "ProjectV2ItemFieldNumberValue":
      return "number"
    default:
      return ""
  }
}

function RenderGroupedItems({ groupByField, projectNumber, db }: {
  groupByField: string,
  projectNumber: number,
  db: OrganizationDB
}) {
  const groupedData = useLiveQuery(async () => {
    // Perform your query and grouping here
    const results = await db.tasks.where("projectId").equals(Number(projectNumber)).toArray();

    if (!results) {
      return null;
    }

    // Also Maintain the complete value here
    const fieldValueIndex: { id: string, name: string, image: string | null }[] = []

    // Example: Grouping by a 'category' field
    const grouped = results.reduce((acc, item) => {
      const fieldValues = item.fields[groupByField]

      if (!fieldValues) {
        if (!acc["Not Assigned"]) {
          fieldValueIndex.push({
            id: "N/A",
            name: "Not Assigned",
            image: null
          })
          acc["Not Assigned"] = []
        }
        acc["Not Assigned"].push(item)
        return acc;
      }
      const valuePath = getValuePath(item.fields[groupByField].__typename)

      const key = getNestedValue(item.fields[groupByField], valuePath)
      // const key = item.fields[groupByField]; // Replace 'category' with your grouping field
      if (!acc[key]) {
        // fieldValueIndex.push({
        //   name: 
        // })
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, Tasks[]>);

    return grouped;
  }, [groupByField]);

  if (!groupedData) {
    return (
      <h1>Invalid Data</h1>
    )
  }
  return (
    <div>
      <h1>
        Rendered Group Items
      </h1>
      {Object.keys(groupedData).map((key) => (
        <div key={key}>
          <h1>Key: {key}</h1>
          <div>{JSON.stringify(groupedData[key], null, 2)}</div>
        </div>
      ))}
    </div>
  )
}

function RenderItems() {
  return (
    <h1>
      Render normmal Items
    </h1>
  )
}

// Render function based on the groupByField

export default function ProjectViewPage() {
  const { projectNumber, viewNumber } = useParams()
  let db = DB.getDatabases(orgState.value.activeOrg?.login as string)

  const [groupByField, setGroupByField] = useState("")

  useSignalEffect(() => {
    if (orgState.value.activeOrg) {
      db = DB.getDatabases(orgState.value.activeOrg?.login as string)
    }
  })

  useEffect(() => {
    db.views
      .where("id")
      .equals(Number(viewNumber))
      .filter(view => view.projectId == Number(projectNumber))
      .first().then((view) => {
        console.log("ViewInfo: ", view)
      })
  }, [orgState, projectNumber, viewNumber])

  const fields = useLiveQuery(() => {
    return db.fields.where("projectId").equals(Number(projectNumber)).filter(field => !["title", "labels", "linkedpullrequests", "reviewers", "parentissue"].includes(field.fieldQueryName)).filter(field => field.dataType != "DATE").toArray()
  })

  const handleGroupByChange = (value: string) => {
    console.log("Updated group by field, ", value)
    setGroupByField(value)
  }

  return (
    <div className="p-4">
      <div className="flex flex-row gap-2">
        <Select onValueChange={handleGroupByChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Group By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group By Field</SelectLabel>
              {fields?.map(field => (
                <SelectItem key={field.id} value={field.fieldQueryName}>{field.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {groupByField}
      </div>
      {groupByField ? (
        <RenderGroupedItems db={db} groupByField={groupByField} projectNumber={Number(projectNumber)} />
      ) : (
        <RenderItems />
      )}
    </div>
  )
}
