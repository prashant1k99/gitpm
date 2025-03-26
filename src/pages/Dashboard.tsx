import ProjectListing from "@/components/dashboard/project-listing"
import DB from "@/db/organization"
import orgState from "@/state/organizations"
import projectState from "@/state/projects"
import { useSignalEffect } from "@preact/signals-react"
import { useLiveQuery } from "dexie-react-hooks"
import { useState } from "react"

export default function DashboardPage() {
  const [orgLogin, setOrgLogin] = useState(orgState.value.activeOrg?.login)
  const [isLoading, setIsLoading] = useState(true)

  const projects = useLiveQuery(() => {
    const db = DB.getDatabases(orgState.value.activeOrg?.login as string)
    return db.projects.filter(project => !project.template).toArray()
  }, [orgLogin])

  useSignalEffect(() => {
    if (orgState.value.activeOrg) {
      setOrgLogin(orgState.value.activeOrg.login)
    }
  })

  useSignalEffect(() => {
    if (projectState.value.isLoading) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  })
  if (!projects) {
    return (
      <div>
        No projects found
      </div>
    )
  }

  return (
    <div className="p-4">
      {isLoading && (
        <div>Loading</div>
      )}
      <div className="flex flex-col gap-4 w-full">
        {projects.length > 0 ? projects.map(project => (
          <ProjectListing key={project.id} project={project} />
        )) : (
          <div>
            No Projects found
          </div>
        )}
      </div>
    </div>
  )
}
