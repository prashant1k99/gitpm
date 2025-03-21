import TaskListing from "@/components/listing/tasks-listing";
import DB from "@/db/organization";
import { loadAllFieldsForProject } from "@/state/fields";
import { loadItemsForProject } from "@/state/items";
import orgState from "@/state/organizations";
import { useSignalEffect } from "@preact/signals-react";
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetailPage() {
  const { projectNumber } = useParams();
  let db = DB.getDatabases(orgState.value.activeOrg?.login as string)

  useEffect(() => {
    loadAllFieldsForProject(Number(projectNumber)).then(() => {
      loadItemsForProject(Number(projectNumber))
    })
  }, [projectNumber])

  useSignalEffect(() => {
    if (orgState.value.activeOrg?.login) {
      db = DB.getDatabases(orgState.value.activeOrg?.login as string)
    }
  })

  const items = useLiveQuery(() => {
    return db.tasks.where("projectId").equals(Number(projectNumber)).reverse().sortBy("updatedAt")
  }, [projectNumber])

  return (
    <div>
      <h1>
        Project Detail Page: {projectNumber}
      </h1>
      <br />
      {items && (
        <TaskListing tasks={items} />
      )}
    </div>
  )
}
