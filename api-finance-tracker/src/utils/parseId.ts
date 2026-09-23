import { ValidationError } from '@src/errors/ValidationError';

export function parseId(
  rawId: string | string[],
  entityName: string = 'expenses',
): number {
  const value = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw ValidationError.invalidId(entityName);
  }

  return id;
}
