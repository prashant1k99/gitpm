import { OrganizationDB } from "@/db/organization";
import { Field, Tasks } from "@/db/schema";
import { getNestedValue } from "@/lib/utils";
import { IViewLayout } from "@/types/common"
import { MilestoneNode, ProjectV2ItemFieldDateValue, ProjectV2ItemFieldIterationValue, ProjectV2ItemFieldNumberValue, ProjectV2ItemFieldSingleSelectValue, ProjectV2ItemFieldTextValue, ProjectV2ItemFieldValue, RepositoryNode, ReviewerNode, FieldColors, UserNode } from "@/types/items";
import { useLiveQuery } from "dexie-react-hooks";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import TaskListing from "./tasks-listing";

type GroupByTaskField = {
  id: string,
  name: string,
  color?: FieldColors,
  image?: string,
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

      return {
        id: iteration.iterationId,
        name: iteration.title
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
        name: reviewer["name"] as string || reviewer["login"] as string,
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

export function RenderGroupedListing({
  projectNumber,
  groupByField,
  layout,
  db
}: {
  projectNumber: number,
  groupByField: Field,
  layout: IViewLayout,
  db: OrganizationDB
}) {
  console.log(projectNumber, groupByField, layout)
  const groupedData = useLiveQuery(async () => {
    // Perform your query and grouping here
    const results = await db.tasks.where("projectId").equals(projectNumber).toArray();

    if (!results) {
      return null;
    }

    // Example: Grouping by a 'category' field
    const grouped = results.reduce((acc, item) => {
      const fieldValues = item.fields[groupByField.fieldQueryName]

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
      <h1>Invalid Data</h1>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-7 pt-4">
      {Object.keys(groupedData).map((key) => {
        const info = groupedData[key].info
        const tasks = groupedData[key].values
        return (
          <div key={key}>
            <div>
              <span className="mr-3">
                {groupByField.name} :
              </span>
              <Badge backgroundColor={info.color && getColorHexCode(info.color)}>
                {info.image && (
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={info.image} />
                    <AvatarFallback>GPM</AvatarFallback>
                  </Avatar>
                )}
                {info.name}
              </Badge>
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
