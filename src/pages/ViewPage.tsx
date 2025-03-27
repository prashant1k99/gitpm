import DB from "@/db/organization"
import orgState from "@/state/organizations"
import { useSignalEffect } from "@preact/signals-react"
import { useParams } from "react-router-dom"
import { RenderGroupedListing } from "@/components/listing/grouped-listing"
import { SimpleTaskListing } from "@/components/listing/simple-listing"
import { ViewOptions } from "@/components/listing/view-options"
import { useState } from "react"
import { viewOptionState } from "@/state/views"
import { Button } from "@/components/ui/button"
import { ListFilter } from "lucide-react"

export default function ProjectViewPage() {
  const { projectNumber, viewNumber } = useParams()
  const [hasGroupBy, setHasGroupBy] = useState<boolean>(false);
  let db = DB.getDatabases(orgState.value.activeOrg?.login as string)

  useSignalEffect(() => {
    if (orgState.value.activeOrg) {
      db = DB.getDatabases(orgState.value.activeOrg?.login as string)
    }
  })

  useSignalEffect(() => {
    setHasGroupBy(viewOptionState.value.groupByField ? true : false)
  })

  // useEffect(() => {
  //   db.views
  //     .where("id")
  //     .equals(Number(viewNumber))
  //     .filter(view => view.projectId == Number(projectNumber))
  //     .first().then((view) => {
  //       console.log("ViewInfo: ", view)
  //     })

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Button variant={"outline"}>
          <ListFilter />
          Filter
        </Button>
        <ViewOptions projectNumber={Number(projectNumber)} db={db} viewNumber={Number(viewNumber)} />
      </div>
      {hasGroupBy ? (
        <RenderGroupedListing db={db} projectNumber={Number(projectNumber)} />
      ) : (
        <SimpleTaskListing projectNumber={Number(projectNumber)} db={db} />
      )}
    </div>
  )
}
