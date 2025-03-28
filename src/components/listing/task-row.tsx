import { Tasks } from "@/db/schema";
import { TableCell, TableRow } from "../ui/table";
import { Badge } from "@/components/ui/badge"
import { MilestoneNode, ProjectV2ItemFieldDateValue, ProjectV2ItemFieldIterationValue, ProjectV2ItemFieldNumberValue, ProjectV2ItemFieldSingleSelectValue, ProjectV2ItemFieldTextValue } from "@/types/items";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { CircleCheck, CircleDashed, CircleDot, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ReactElement, useState } from "react";
import { useSignalEffect } from "@preact/signals-react";
import { ConstVisibleFields, viewOptionState } from "@/state/views";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"; import { getColorHexCode, getFieldType, isCurrentIteration, isIssueContent } from "./utils";
import { getNestedValue } from "@/lib/utils";

//   DataType.SUB_ISSUES_PROGRESS,

/* eslint-disable no-case-declarations */
function renderField(field: string, task: Tasks) {
  const fieldValue = task.fields[field]
  if (!fieldValue) return null
  let childComponent: ReactElement;

  console.log(fieldValue)

  switch (getFieldType(fieldValue)) {
    case 'date':
      const date = getNestedValue<ProjectV2ItemFieldDateValue>(fieldValue, "");
      if (!date) return null
      childComponent = (
        <span>
          {
            new Date(date.date).toLocaleDateString(undefined, {
              day: '2-digit',
              month: '2-digit'
            })
          }
        </span>
      )
      break;
    case 'number':
      const numberValue = getNestedValue<ProjectV2ItemFieldNumberValue>(fieldValue, "")
      if (!numberValue) return null
      childComponent = (
        <Badge>
          {numberValue.number.toString()}
        </Badge>
      )
      break;
    case 'text':
      const textValue = getNestedValue<ProjectV2ItemFieldTextValue>(fieldValue, "")
      if (!textValue) return null
      childComponent = (
        <Badge>
          {textValue.text}
        </Badge>
      )
      break;
    case 'singleSelect':
      const singleSelectValue = getNestedValue<ProjectV2ItemFieldSingleSelectValue>(fieldValue, "")
      if (!singleSelectValue) return null
      childComponent = (
        <Badge
          className=" border border-accent-foreground bg-accent text-accent-foreground"
          style={singleSelectValue.color && {
            borderColor: getColorHexCode(singleSelectValue.color),
            backgroundColor: `${getColorHexCode(singleSelectValue.color)}20`, // 20 is hex for 12% opacity
            color: getColorHexCode(singleSelectValue.color)
          }}
        >
          {singleSelectValue.name}
        </Badge>
      )
      break;
    case 'iteration':
      const iteration = getNestedValue<ProjectV2ItemFieldIterationValue>(fieldValue, "");
      console.log(iteration)
      if (!iteration) return null;

      const isCurrentIter = isCurrentIteration(iteration)
      childComponent = (
        <Badge>
          {isCurrentIter ? `[Current] ${iteration.title}` : iteration.title}
        </Badge>
      )
      break;
    case 'milestone':
      const milestone = getNestedValue<MilestoneNode>(fieldValue, "milestone");
      if (!milestone) return null;

      childComponent = (
        <Badge>{milestone.title}</Badge>
      )
      break;
    default:
      return null
  }

  if (childComponent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {childComponent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{fieldValue.field.name || "Something"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
}

export default function TaskRowListing({ task }: {
  task: Tasks
}) {
  const [visibleFields, setVisibleFields] = useState<string[]>([])
  const [constVisibleFields, setConstVisibleFields] = useState<ConstVisibleFields[]>([])

  useSignalEffect(() => setVisibleFields(viewOptionState.value.fieldsVisible))

  useSignalEffect(() => setConstVisibleFields(viewOptionState.value.fieldsVisibleConst))

  const { projectNumber } = useParams();

  if (isIssueContent(task.content)) {
    return (
      <TableRow key={task.id} className="w-full border-0 p-0" >
        <TableCell className="medium flex flex-row justify-between items-center p-1 px-4 ">
          <div className="flex flex-row items-center">
            {task.content.closed ? (
              <CircleCheck className="h-4 w-4 text-purple-800" />
            ) : (
              <CircleDot className="h-4 w-4 text-green-500" />
            )}
            <Link to={`/project/${projectNumber}/task/${task.id}`} className="flex flex-row items-center cursor-pointer">
              <span className="font-medium m-2">
                {task.content.title}
              </span>
              {constVisibleFields.includes(ConstVisibleFields.Description) && (
                <span className="font-normal text-gray-500 max-w-[350px] truncate inline-block">
                  {task.content.body}
                </span>
              )}
            </Link>
          </div>
          <div className="flex flex-row gap-3 items-center">
            {visibleFields.map(field => (
              <div key={field}>{renderField(field, task)}</div>
            ))}
            {constVisibleFields.includes(ConstVisibleFields.Labels) && (
              <>
                {task.content.labels.totalCount > 0 && task.content.labels.nodes.slice(0, 2).map(label => (
                  <Badge key={label.id} backgroundColor={`#${label.color}`} className="text-white">{label.name}</Badge>
                ))}
                {task.content.labels.totalCount > 2 && (
                  <Badge variant="outline" className="text-xs">+{task.content.labels.totalCount - 2}</Badge>
                )}
              </>
            )}
            {constVisibleFields.includes(ConstVisibleFields.CreatedAt) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-accent-foreground font-light text-xs">
                      {new Date(task.content.createdAt).toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </span>

                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Task Created At Date</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {constVisibleFields.includes(ConstVisibleFields.UpdatedAt) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-accent-foreground font-light text-xs">
                      {new Date(task.updatedAt).toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </span>

                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Task Updated At Date</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {
              constVisibleFields.includes(ConstVisibleFields.Assignee) && (
                task.content.assignees.nodes.length > 0 ? task.content.assignees.nodes.map(user => (
                  <Avatar className="w-5 h-5" key={user.id}>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>
                )) : (
                  <User className="font-light h-5 w-5 border-2 border-dashed bg-primary-foreground rounded-4xl p-0.5" />
                ))
            }
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
        {visibleFields.includes("const_description") && (
          <span className="font-normal text-gray-500 max-w-[250px] truncate inline-block">
            {task.content.body}
          </span>
        )}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Badge variant={"secondary"}>Draft</Badge>
        {constVisibleFields.includes(ConstVisibleFields.CreatedAt) && (
          <span className="text-accent-foreground font-light text-xs">
            {new Date(task.content.createdAt).toLocaleDateString(undefined, {
              day: '2-digit',
              month: '2-digit'
            })}
          </span>
        )}
        {
          constVisibleFields.includes(ConstVisibleFields.Assignee) && (
            task.content.assignees.nodes.length > 0 ? task.content.assignees.nodes.map(user => (
              <Avatar className="w-5 h-5" key={user.id}>
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            )) : (
              <User className="font-light h-5 w-5 border-2 border-dashed bg-primary-foreground rounded-4xl p-0.5" />
            )
          )
        }
      </div>
    </TableRow>
  )
}
