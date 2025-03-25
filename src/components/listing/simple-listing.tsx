import { OrganizationDB } from "@/db/organization"
import { useLiveQuery } from "dexie-react-hooks"
import TaskListing from "./tasks-listing"

export function SimpleTaskListing({
  projectNumber,
  db
}: {
  projectNumber: number,
  db: OrganizationDB
}) {
  const tasks = useLiveQuery(() => {
    return db.tasks.where("projectId").equals(projectNumber).toArray()
  })

  if (!tasks) {
    return (
      <div>No Tasks Found</div>
    )
  }

  return (
    <TaskListing tasks={tasks} />
  )
}
