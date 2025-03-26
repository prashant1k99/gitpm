import { Separator } from "@/components/ui/separator";
import DB from "@/db/organization";
import { loadAllFieldsForProject } from "@/state/fields";
import { loadItemsForProject } from "@/state/items";
import orgState from "@/state/organizations";
import { useSignalEffect } from "@preact/signals-react";
import { useLiveQuery } from 'dexie-react-hooks';
import { FolderKanban, FolderLock } from "lucide-react";
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

  const project = useLiveQuery(() => {
    return db.projects.get({
      "number": Number(projectNumber)
    })
  }, [projectNumber])

  if (!project) {
    return (
      <div>No Project Found</div>
    )
  }

  return (
    <div className="max-w-4xl w-full m-auto p-4">
      <div className="flex flex-col pt-8 gap-3">
        <div className="p-2 border-2 bg-accent w-fit rounded-lg">
          {project.public ? (
            <FolderKanban className="w-4 h-4" />
          ) : (
            <FolderLock className="w-4 h-4" />
          )}
        </div>
        <div>
          <h1 className="text-3xl">
            {project.title}
          </h1>
          <span className="mt-6">
            {project.shortDescription}
          </span>
          <Separator className="bg-accent my-4" />
          Get Milestones for all the repositories connected
          <br />
          {JSON.stringify(project, null, 2)}
        </div>
      </div>
    </div>
  )
}
