import { ProjectStatus, ProjectStatusUpdates } from "@/types/projects"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRelativeTimeFromNow } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, CirclePlus, SquareChevronDown } from "lucide-react";
import { Separator } from "../ui/separator";

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

export function ProjectStatusForDetailPage({ statusUpdates }: {
  statusUpdates: ProjectStatusUpdates[]
}) {
  return (
    <div className="py-2">
      {/* Get Milestones for all the repositories connected */}
      <div className="flex items-center gap-2 p-4">
        <Activity className="h-4 w-4" />
        Status Updates
      </div>
      {statusUpdates.length > 0 ? (
        <div className="flex flex-col gap-2">
          {statusUpdates.map(update => (
            <div key={update.id} className="p-3 border border-border rounded-md">
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
                        <td className="font-bold  py-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Target Date:
                        </td>
                        <td className="px-4 py-2">{update.targetDate}</td>
                      </tr>
                    )}
                    {update.startDate && (
                      <tr>
                        <td className="font-bold  py-2 flex items-center gap-2">
                          <CirclePlus className="w-4 h-4" />
                          Start Date:
                        </td>
                        <td className="px-4 py-2">{update.startDate}</td>
                      </tr>
                    )}
                    {update.status && (
                      <tr>
                        <td className="font-bold  py-2 flex items-center gap-2">
                          <SquareChevronDown className="w-4 h-4" />
                          Status:
                        </td>
                        <td className="px-4 py-2">{getStatusRenderDetails(update.status)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="content py-2" dangerouslySetInnerHTML={{ __html: update.bodyHTML }}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center min-h-[100px] border border-border rounded-md">No Updates found, write one</div>
      )}
    </div>
  )
}
