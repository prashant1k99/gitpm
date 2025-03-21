import { Tasks } from "@/db/schema";
import { TableCell, TableRow } from "../ui/table";
import { Badge } from "@/components/ui/badge"
import { IssueContent, ItemContent } from "@/types/items";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { CircleCheck, CircleDashed, CircleDot, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function isIssueContent(content: ItemContent): content is IssueContent {
  return 'number' in content;
}

export default function TaskRowListing({ task }: {
  task: Tasks
}) {
  const { projectNumber } = useParams();

  if (isIssueContent(task.content)) {
    return (
      <TableRow key={task.id} className="cursor-pointer">
        <TableCell className="medium flex flex-row justify-between items-center mx-2 rounded-xl">
          <div className="flex flex-row items-center">
            {task.content.closed ? (
              <CircleCheck className="h-4 w-4 text-purple-800" />
            ) : (
              <CircleDot className="h-4 w-4 text-green-500" />
            )}
            <span className="font-medium m-2">
              <Link to={`/project/${projectNumber}/task/${task.id}`}>
                {task.content.title}
              </Link>
            </span>
            <span className="font-normal text-gray-500 max-w-[250px] truncate inline-block">
              {task.content.body}
            </span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            {task.content.labels.totalCount > 0 && task.content.labels.nodes.map(label => (
              <Badge key={label.id} backgroundColor={`#${label.color}`} className="text-white">{label.name}</Badge>
            ))}
            <span className="text-accent-foreground font-light text-xs">
              {new Date(task.content.createdAt).toLocaleDateString(undefined, {
                day: '2-digit',
                month: '2-digit'
              })}
            </span>
            {task.content.assignees.nodes.length > 0 ? task.content.assignees.nodes.map(user => (
              <Avatar className="w-5 h-5" key={user.id}>
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            )) : (
              <User className="font-light h-5 w-5 border-2 border-dashed bg-primary-foreground rounded-4xl p-0.5" />
            )}
          </div>
        </TableCell>
      </TableRow >
    )
  }

  return (
    <TableRow key={task.id} className="cursor-pointer">
      <div className="flex flex-row items-center">
        <CircleDashed className="h-4 w-4 text-gray-500" />
        <span className="font-medium m-2">
          {task.content.title}
        </span>
        <span className="font-normal text-gray-500 max-w-[250px] truncate inline-block">
          {task.content.body}
        </span>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Badge variant={"secondary"}>Draft</Badge>
        <span className="text-accent-foreground font-light text-xs">
          {new Date(task.content.createdAt).toLocaleDateString(undefined, {
            day: '2-digit',
            month: '2-digit'
          })}
        </span>
        {task.content.assignees.nodes.length > 0 ? task.content.assignees.nodes.map(user => (
          <Avatar className="w-5 h-5" key={user.id}>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        )) : (
          <User className="font-light h-5 w-5 border-2 border-dashed bg-primary-foreground rounded-4xl p-0.5" />
        )}
      </div>
    </TableRow>
  )
}
