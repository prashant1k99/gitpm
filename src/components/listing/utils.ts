import { FieldColors, IssueContent, ItemContent, ProjectV2ItemFieldIterationValue, ProjectV2ItemFieldValue } from "@/types/items";

let currentIterationId: string

export function isCurrentIteration(iteration: ProjectV2ItemFieldIterationValue) {
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

export function getFieldType(field: ProjectV2ItemFieldValue): string {
  if ('users' in field) return 'user';
  if ('date' in field) return 'date';
  if ('iterationId' in field) return 'iteration';
  if ('milestone' in field) return 'milestone';
  if ('repository' in field) return 'repository';
  if ('reviewers' in field) return 'reviewer';
  if ('color' in field && 'name' in field) return 'singleSelect';
  if ('text' in field) return 'text';
  if ('number' in field) return 'number';
  // if () return 'subIssueProgress';
  return 'unknown';
}

export function getColorHexCode(color: FieldColors) {
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

export function isIssueContent(content: ItemContent): content is IssueContent {
  return 'number' in content;
}

