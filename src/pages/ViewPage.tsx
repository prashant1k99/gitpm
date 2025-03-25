import DB from "@/db/organization"
import orgState from "@/state/organizations"
import { useSignalEffect } from "@preact/signals-react"
import { useState } from "react"
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
import { RenderGroupedListing } from "@/components/listing/grouped-listing"
import { IViewLayout } from "@/types/common"
import { Field } from "@/db/schema"
import { SimpleTaskListing } from "@/components/listing/simple-listing"

// Render function based on the groupByField
export default function ProjectViewPage() {
  const { projectNumber, viewNumber } = useParams()
  let db = DB.getDatabases(orgState.value.activeOrg?.login as string)

  const [groupByField, setGroupByField] = useState<Field | null>(null)

  useSignalEffect(() => {
    if (orgState.value.activeOrg) {
      db = DB.getDatabases(orgState.value.activeOrg?.login as string)
    }
  })
  console.log("View Number: ", viewNumber)

  // useEffect(() => {
  //   db.views
  //     .where("id")
  //     .equals(Number(viewNumber))
  //     .filter(view => view.projectId == Number(projectNumber))
  //     .first().then((view) => {
  //       console.log("ViewInfo: ", view)
  //     })
  // }, [orgState, projectNumber, viewNumber])

  const fields = useLiveQuery(() => {
    return db.fields.where("projectId").equals(Number(projectNumber)).filter(field => !["title", "labels", "linkedpullrequests", "reviewers", "parentissue"].includes(field.fieldQueryName)).filter(field => field.dataType != "DATE").toArray()
  })

  const handleGroupByChange = (value: string) => {
    if (value == "null") {
      setGroupByField(null)
    }
    console.log("Updated group by field, ", value)
    setGroupByField(fields?.find((field) => field.fieldQueryName == value) || null)
  }

  return (
    <div className="p-4">
      <div className="flex flex-row gap-2 pb-4">
        <Select onValueChange={handleGroupByChange} value={groupByField?.fieldQueryName || ''}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Group By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group By Field</SelectLabel>
              {fields?.map(field => (
                <SelectItem key={field.id} value={field.fieldQueryName}>{field.name}</SelectItem>
              ))}
              {groupByField && (
                <SelectItem value="null">Remove GroupBy</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {groupByField ? (
        <RenderGroupedListing db={db} groupByField={groupByField} projectNumber={Number(projectNumber)} layout={IViewLayout.TABLE_LAYOUT} />
      ) : (
        <SimpleTaskListing projectNumber={Number(projectNumber)} db={db} />
      )}
    </div>
  )
}
