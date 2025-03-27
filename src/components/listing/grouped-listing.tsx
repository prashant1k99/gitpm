import { OrganizationDB } from "@/db/organization";
import { Field, Tasks } from "@/db/schema";
import { getNestedValue } from "@/lib/utils";
import { MilestoneNode, ProjectV2ItemFieldDateValue, ProjectV2ItemFieldIterationValue, ProjectV2ItemFieldNumberValue, ProjectV2ItemFieldSingleSelectValue, ProjectV2ItemFieldTextValue, ProjectV2ItemFieldValue, RepositoryNode, ReviewerNode, FieldColors, UserNode } from "@/types/items";
import { useLiveQuery } from "dexie-react-hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import TaskListing from "./tasks-listing";
import { Badge } from "../ui/badge";
import { DataType } from "@/types/fields";
import { useState } from "react";
import { viewOptionState } from "@/state/views";
import { useSignalEffect } from "@preact/signals-react";

type GroupByTaskField = {
  id: string,
  name: string,
  color?: FieldColors,
  image?: string,
}

let currentIterationId: string

function isCurrentIteration(iteration: ProjectV2ItemFieldIterationValue) {
  if (iteration.iterationId == currentIterationId) {
    return true
  }

  const startDate = iteration.startDate ? new Date(iteration.startDate) : null;
  const endDate = startDate && iteration.duration
    ? new Date(startDate.getTime() + (iteration.duration * 24 * 60 * 60 * 1000))
    : null;
  const now = new Date();
  const isCurrentIter = startDate && endDate
    ? now >= startDate && now <= endDate
    : false;

  if (isCurrentIter) {
    currentIterationId = iteration.iterationId
  }
  return isCurrentIter
}

function getFieldType(field: ProjectV2ItemFieldValue): string {
  if ('users' in field) return 'user';
  if ('date' in field) return 'date';
  if ('iterationId' in field) return 'iteration';
  if ('milestone' in field) return 'milestone';
  if ('repository' in field) return 'repository';
  if ('reviewers' in field) return 'reviewer';
  if ('color' in field && 'name' in field) return 'singleSelect';
  if ('text' in field) return 'text';
  if ('number' in field) return 'number';
  return 'unknown';
}

function getReviewerName(reviewer: ReviewerNode) {
  if (reviewer.__typename === "Bot" || reviewer.__typename === "Mannequin") {
    return reviewer.login;
  }
  return reviewer.name;
}

/* eslint-disable no-case-declarations */
function formulateFieldResponse(field: ProjectV2ItemFieldValue): GroupByTaskField {
  const defaultValue: GroupByTaskField = {
    id: "undefined",
    name: "Not Assigned"
  };

  switch (getFieldType(field)) {
    case 'user':
      const user = getNestedValue<UserNode>(field, "users.nodes[0]");
      if (!user) return defaultValue;
      return {
        id: user.id,
        name: user.name,
        image: user.avatarUrl
      };
    case 'date':
      const date = getNestedValue<ProjectV2ItemFieldDateValue>(field, "");
      if (!date) return defaultValue;
      return {
        id: date.date,
        name: date.date,
      }
    case 'iteration':
      const iteration = getNestedValue<ProjectV2ItemFieldIterationValue>(field, "");
      if (!iteration) return defaultValue;

      const isCurrentIter = isCurrentIteration(iteration)
      return {
        id: iteration.iterationId,
        name: isCurrentIter ? `[Current] ${iteration.title}` : iteration.title
      }
    case 'milestone':
      const milestone = getNestedValue<MilestoneNode>(field, "milestone");
      if (!milestone) return defaultValue;

      return {
        id: milestone.id,
        name: milestone.title
      }
    case 'repository':
      const repository = getNestedValue<RepositoryNode>(field, "repository");
      if (!repository) return defaultValue

      return {
        id: repository.id,
        name: repository.name
      }
    case 'reviewer':
      const reviewer = getNestedValue<ReviewerNode>(field, "reviewers.nodes[0]");
      if (!reviewer) return defaultValue

      return {
        id: reviewer.id,
        name: getReviewerName(reviewer),
        image: reviewer.avatarUrl
      }
    case 'singleSelect':
      const singleSelectValue = getNestedValue<ProjectV2ItemFieldSingleSelectValue>(field, "")
      if (!singleSelectValue) return defaultValue
      return {
        id: singleSelectValue.name,
        name: singleSelectValue.name,
        color: singleSelectValue.color
      }
    case 'text':
      const textValue = getNestedValue<ProjectV2ItemFieldTextValue>(field, "")
      if (!textValue) return defaultValue
      return {
        id: textValue.text,
        name: textValue.text,
      }
    case 'number':
      const numberValue = getNestedValue<ProjectV2ItemFieldNumberValue>(field, "")
      if (!numberValue) return defaultValue
      return {
        id: numberValue.number.toString(),
        name: numberValue.number.toString(),
      }
    default:
      return defaultValue;
  }
}

function getColorHexCode(color: FieldColors) {
  switch (color) {
    case FieldColors.BLUE:
      return "#262df0"
    case FieldColors.YELLOW:
      return "#fcb138"
    case FieldColors.RED:
      return "#e8352c"
    case FieldColors.PURPLE:
      return "#800080"
    case FieldColors.PINK:
      return "#FFC0CB"
    case FieldColors.ORANGE:
      return "#ed682f"
    case FieldColors.GREEN:
      return "#00FF00"
    case FieldColors.GRAY:
      return "#808080"
  }
}

function countNumericField(tasks: Tasks[], field: string) {
  return tasks.reduce((acc, task) => {
    const value = task.fields[field] as ProjectV2ItemFieldNumberValue
    if (!value) {
      return acc
    }
    return acc + value.number
  }, 0)
}

export function RenderGroupedListing({
  projectNumber,
  db,
}: {
  projectNumber: number,
  db: OrganizationDB,
}) {
  const [groupByField, setHasGroupByField] = useState<Field | null>(viewOptionState.value?.groupByField || null)

  useSignalEffect(() => {
    setHasGroupByField(viewOptionState.value.groupByField || null)
  })

  const fields = useLiveQuery(() => {
    return db.fields.where("projectId").equals(projectNumber).toArray()
  }, [projectNumber])

  const numberTypeField = fields?.filter(field => field.dataType == DataType.NUMBER)

  const groupedData = useLiveQuery(async () => {
    // Perform your query and grouping here
    const results = await db.tasks.where("projectId").equals(projectNumber).toArray();

    if (!results) {
      return null;
    }

    // Example: Grouping by a 'category' field
    const grouped = results.reduce((acc, item) => {
      const fieldValues = item.fields[groupByField?.fieldQueryName as string]

      if (!fieldValues) {
        if (!acc["undefined"]) {
          acc["undefined"] = {
            info: {
              id: "undefined",
              name: "Not Assigned"
            },
            values: []
          }
        }
        acc["undefined"].values.push(item)
        return acc;
      }

      const key = formulateFieldResponse(fieldValues)
      if (!acc[key.id]) {
        acc[key.id] = {
          info: key,
          values: []
        };
      }
      acc[key.id].values.push(item);
      return acc;
    }, {} as Record<string, {
      info: GroupByTaskField,
      values: Tasks[]
    }>);

    return grouped;
  }, [groupByField]);

  if (!groupedData) {
    return (
      <h1>No Tasks found</h1>
    )
  }

  return (
    <div className="flex flex-col gap-4 ">
      {Object.keys(groupedData).map((key) => {
        const info = groupedData[key].info
        const tasks = groupedData[key].values
        return (
          <div key={key}>
            <div className="flex justify-between items-center w-full bg-accent p-2 pr-3 pl-4 rounded-lg">
              <div className=" flex items-center">
                <span className="mr-3">
                  {groupByField?.name} :
                </span>
                <Badge
                  className=" border border-accent-foreground bg-accent text-accent-foreground"
                  style={info.color && {
                    borderColor: getColorHexCode(info.color),
                    backgroundColor: `${getColorHexCode(info.color)}20`, // 20 is hex for 12% opacity
                    color: getColorHexCode(info.color)
                  }}
                >
                  {info.image && (
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={info.image} />
                      <AvatarFallback>GPM</AvatarFallback>
                    </Avatar>
                  )}
                  {info.name}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Badge className="bg-accent text-secondary-foreground border border-accent-foreground/20">Count: {tasks.length}</Badge>
                {numberTypeField?.map(field => (
                  <Badge key={field.id} className="bg-accent text-accent-foreground border border-accent-foreground/20">{field.name}: {countNumericField(tasks, field.fieldQueryName)}</Badge>
                ))}
              </div>
            </div>
            <div>
              <TaskListing tasks={tasks} />
            </div>
          </div>
        )
      })}
    </div >
  )
}
