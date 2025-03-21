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

  const fields = useLiveQuery(() => {
    return db.fields.where("projectId").equals(Number(projectNumber)).toArray()
  }, [projectNumber])


  const assignees = useLiveQuery(async () => {
    const items = await db.tasks.where("projectId").equals(Number(projectNumber)).toArray()

    // Extract unique assignees
    const uniqueAssignees = new Map<string, { name: string, id: string }>();
    items.map(item => {
      console.log(item.fields)
      item.content.assignees?.nodes?.forEach(assignee => {
        uniqueAssignees.set(assignee.id, assignee)
      });
    });
    return Array.from(uniqueAssignees.values());
  })

  return (
    <div>
      <h1>
        Project Detail Page: {projectNumber}
      </h1>
      {items?.map((item) => {
        return (
          <p key={item.id}>{item.content.title} - {item.content.body}</p>
        )
      })}

      <h1>Assignees:</h1>
      {assignees?.map(assignee => (
        <p key={assignee.id}>
          {assignee.name}
        </p>
      ))}

      <br />
      <br />
      <h1>Fields</h1>
      {fields?.map((field) => (
        <div key={field.id}>
          <p>{field.name} - {field.dataType} </p>
          {JSON.stringify(field, null, 2)}
          <br />
          <br />
        </div>
      ))}
    </div>
  )
}
