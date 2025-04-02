import { Separator } from "@/components/ui/separator";
import DB from "@/db/organization";
import { loadAllFieldsForProject } from "@/state/fields";
import { loadItemsForProject } from "@/state/items";
import orgState from "@/state/organizations";
import { useSignalEffect } from "@preact/signals-react";
import { useLiveQuery } from 'dexie-react-hooks';
import { FolderKanban, FolderLock, Info, UsersRound, View } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectStatusForDetailPage } from "@/components/project/detail-info-status";
import { Project } from "@/services/api/projects";
import authState from "@/state/auth";

export default function ProjectDetailPage() {
  const { projectNumber } = useParams();

  let db = DB.getDatabases(orgState.value.activeOrg?.login as string)

  useEffect(() => {
    const projectService = new Project(authState.value.githubToken as string)
    projectService.getProjectDetails({
      orgLogin: orgState.value.activeOrg?.login as string,
      projectNumber: Number(projectNumber)
    }).then(data => console.log(data)).catch(err => console.error(err))
  }, [authState.value.githubToken])

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
          {project.shortDescription && (
            <span className="mt-6">
              {project.shortDescription}
            </span>
          )}
          {project.readme && (
            <>
              <Separator className="bg-accent my-4" />
              <div
                className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl prose-h1:text-2xl dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:my-1 prose-blockquote:my-1"
              >
                <ReactMarkdown
                  children={project.readme}
                  remarkPlugins={[remarkGfm]}
                />
              </div>
            </>
          )}
          <Separator className="bg-accent my-4" />
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="gap-8">
              <TabsTrigger value="info">
                <Info className="h-4 w-4" />
                Info
              </TabsTrigger>
              <TabsTrigger value="views">
                <View className="h-4 w-4" />
                Views
              </TabsTrigger>
              <TabsTrigger value="teams">
                <UsersRound className="h-4 w-4" />
                Teams
              </TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="flex flex-col gap-2">
              <ProjectStatusForDetailPage statusUpdates={project.statusUpdates.nodes} />
            </TabsContent>
            <TabsContent value="views">Views for project</TabsContent>
            <TabsContent value="teams">Teams for Project</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
