import { ProjectV2ItemFieldValue } from "@/types/items";

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
  return 'unknown';
}

