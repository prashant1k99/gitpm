import DB from "@/db/organization";
import { loadAllFieldsForProject } from "@/state/fields";
import { loadItemsForProject } from "@/state/items";
import orgState from "@/state/organizations";
import { useSignalEffect } from "@preact/signals-react";
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetailPage() {
  const [orgLogin, setOrgLogin] = useState<string>(orgState.value.activeOrg?.login || "")
  const { projectNumber } = useParams();

  useEffect(() => {
    loadAllFieldsForProject(Number(projectNumber)).then(() => {
      loadItemsForProject(Number(projectNumber))
    })
  }, [projectNumber])

  useSignalEffect(() => {
    if (orgState.value.activeOrg?.login)
      setOrgLogin(orgState.value.activeOrg?.login)
  })

  const items = useLiveQuery(() => {
    const db = DB.getDatabases(orgLogin)
    return db.tasks.where("projectId").equals(Number(projectNumber)).toArray()
  }, [orgLogin, projectNumber])

  return (
    <div>
      <h1>
        Project Detail Page: {projectNumber}
      </h1>
      {items?.map((item) => {
        return (
          <p key={item.id}>{item.content.title}</p>
        )
      })}
    </div>
  )
}
