import { ValidationError } from '@src/errors/ValidationError';

export function parseId(rawId: string | string[]): number {
  const value = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = Number(value);

  if (Number.isNaN(id)) {
    throw new ValidationError('ID inválido');
  }

  return id;
}
