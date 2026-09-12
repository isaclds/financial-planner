import path from 'node:path';
import fs from 'node:fs';
import yaml from 'js-yaml';

const candidates = [
  __dirname,
  path.resolve(__dirname, '..', '..', 'src', 'docs'),
];

const found = candidates.find((d) =>
  fs.existsSync(path.join(d, 'openapi.yaml')),
);

if (!found) {
  throw new Error(
    `openapi.yaml não encontrado. Tentou:\n  - ${candidates.join('\n  - ')}`,
  );
}

const docsDir: string = found;

function resolveRefs(node: any, baseDir: string, seen: Set<string>): any {
  if (Array.isArray(node))
    return node.map((n) => resolveRefs(n, baseDir, seen));
  if (node && typeof node === 'object') {
    if (typeof node.$ref === 'string' && node.$ref.includes('.yaml')) {
      const [filePart, pointer] = node.$ref.split('#');
      const abs = path.resolve(baseDir, filePart);
      if (seen.has(abs)) return {};
      seen.add(abs);
      const doc = yaml.load(fs.readFileSync(abs, 'utf8')) as any;
      let target = doc;
      if (pointer) {
        for (const seg of pointer.split('/').filter(Boolean))
          target = target?.[seg];
      }
      const resolved = resolveRefs(target, path.dirname(abs), seen);
      seen.delete(abs);
      return resolved;
    }
    const out: any = {};
    for (const [k, v] of Object.entries(node))
      out[k] = resolveRefs(v, baseDir, seen);
    return out;
  }
  return node;
}

export function getOpenApiSpec() {
  const doc = yaml.load(
    fs.readFileSync(path.join(docsDir, 'openapi.yaml'), 'utf8'),
  ) as any;
  return resolveRefs(doc, docsDir, new Set());
}
