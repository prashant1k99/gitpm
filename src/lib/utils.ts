import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getNestedValue = <T>(obj: unknown, path: string): T | undefined => {
  if (!path) {
    return obj as T
  }

  const pathSegments = path.split('.').filter(Boolean);
  if (pathSegments.length === 0) {
    return obj as T;
  }

  const arrayAccessRegex = /^(.*?)\[(\d+)\]$/;

  let current: unknown = obj;

  for (const segment of pathSegments) {
    if (current === undefined || current === null) {
      return current as T;
    }

    const arrayMatch = segment.match(arrayAccessRegex);
    if (arrayMatch) {
      const [, arrayKey, index] = arrayMatch;
      const arr = (current as Record<string, unknown>)[arrayKey];
      if (!Array.isArray(arr)) {
        return undefined;
      }
      const idx = parseInt(index, 10);
      if (idx < 0 || idx >= arr.length) {
        return undefined;
      }
      current = arr[idx];
    } else {
      if (!Object.prototype.hasOwnProperty.call(current as object, segment)) {
        return undefined;
      }
      current = (current as Record<string, unknown>)[segment];
    }
  }

  return current as T;
};
