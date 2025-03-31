import { Separator } from "@/components/ui/separator";
import DB from "@/db/organization";
import { loadAllFieldsForProject } from "@/state/fields";
import { loadItemsForProject } from "@/state/items";
import orgState from "@/state/organizations";
import { useSignalEffect } from "@preact/signals-react";
import { useLiveQuery } from 'dexie-react-hooks';
import { Activity, Calendar, CirclePlus, FolderKanban, FolderLock, SquareChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRelativeTimeFromNow } from "@/lib/utils";
import { ProjectStatus } from "@/types/projects";
import { Badge } from "@/components/ui/badge";

function getStatusRenderDetails(status: ProjectStatus) {
  let value = {
    text: "Unknown",
    color: "#ffffff",
  }
  switch (status) {
    case ProjectStatus.AT_RISK:
      value = {
        text: "At Risk",
        color: "#eb8626",
      }
      break;
    case ProjectStatus.COMPLETE:
      value = {
        text: "Complete",
        color: "#b038f0",
      }
      break;
    case ProjectStatus.INACTIVE:
      value = {
        text: "Inactive",
        color: "#b0b0b0"
      }
      break;
    case ProjectStatus.OFF_TRACK:
      value = {
        text: "Off Track",
        color: "#f8412b"
      }
      break;
    case ProjectStatus.ON_TRACK:
      value = {
        text: "On Track",
        color: "#0cc829"
      }
      break;
  }

  return (
    <Badge
      className=" border border-accent-foreground bg-accent text-accent-foreground"
      style={{
        borderColor: value.color,
        backgroundColor: `${value.color}20`, // 20 is hex for 12% opacity
        color: value.color
      }}
    >
      {value.text}
    </Badge>
  )
}

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
          {project.readme && (
            <div
              className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl prose-h1:text-2xl dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:my-1 prose-blockquote:my-1"
            >
              <ReactMarkdown
                children={project.readme}
                remarkPlugins={[remarkGfm]}
              />
            </div>
          )}
          <Separator className="bg-accent my-4" />
          {project.statusUpdates.nodes.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Activity className="h-4 w-4" />
                Status Updates:
              </div>
              <div className="flex flex-col gap-2">
                {project.statusUpdates.nodes.map(update => (
                  <div key={update.id} className="p-2 border border-border rounded-md">
                    <div className="flex gap-2 items-center bg-background">
                      <div className="flex gap-2 items-center">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={update.creator.avatarUrl} alt={update.creator.login || "User Name"} />
                          <AvatarFallback className="rounded-lg">Github User</AvatarFallback>
                        </Avatar>
                        <p>{update.creator.login}</p>
                      </div>
                      <div>
                        updated {getRelativeTimeFromNow(update.updatedAt)}
                      </div>
                    </div>
                    <Separator className="bg-accent my-2" />
                    <div className="overflow-x-auto">
                      <table className="table-auto w-fit">
                        <tbody>
                          {update.targetDate && (
                            <tr>
                              <td className="font-bold px-4 py-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Target Date:
                              </td>
                              <td className="px-4 py-2">{update.targetDate}</td>
                            </tr>
                          )}
                          {update.startDate && (
                            <tr>
                              <td className="font-bold px-4 py-2 flex items-center gap-2">
                                <CirclePlus className="w-4 h-4" />
                                Start Date:
                              </td>
                              <td className="px-4 py-2">{update.startDate}</td>
                            </tr>
                          )}
                          {update.status && (
                            <tr>
                              <td className="font-bold px-4 py-2 flex items-center gap-2">
                                <SquareChevronDown className="w-4 h-4" />
                                Status:
                              </td>
                              <td className="px-4 py-2">{getStatusRenderDetails(update.status)}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="content" dangerouslySetInnerHTML={{ __html: update.bodyHTML }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
