import { ProjectV2ItemFieldValue, TItemInfo, TItemNodeQR } from "@/types/items";

export function processItemResponse(item: TItemNodeQR): TItemInfo {
  // Create a new fields object
  const fields: Record<string, ProjectV2ItemFieldValue> = {};

  // Find all properties that start with _field_ and move them to the fields object
  Object.keys(item).forEach(key => {
    if (key.startsWith('_field_')) {
      const fieldName = key.substring(7); // Remove the '_field_' prefix
      fields[fieldName] = item[key];
      delete item[key]; // Remove the original property
    }
  });

  // Add the fields object to the item
  return {
    ...item,
    fields
  } as TItemInfo;
}
