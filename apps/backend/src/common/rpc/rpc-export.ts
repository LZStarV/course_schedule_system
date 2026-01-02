import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DiscoveryService } from '@nestjs/core';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function toUpperSnake(input: string) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\.\-]/g, '_')
    .toUpperCase();
}

function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

async function main() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  const discovery = app.get(DiscoveryService);

  const methods: Array<{
    domain: string;
    action: string;
    full: string;
    constName: string;
  }> = [];

  const providers: any[] =
    discovery.getProviders() as any[];
  for (const wrapper of providers) {
    const metatype = wrapper?.metatype;
    const instance = wrapper?.instance;
    if (!metatype || !instance) continue;
    const className: string = metatype.name;
    if (!className || !className.endsWith('Controller'))
      continue;
    if (className === 'AppController') continue;
    const domain = className.slice(0, -10);
    const proto = metatype.prototype;
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (
        key === 'constructor' ||
        key === 'onModuleInit' ||
        key === 'onApplicationBootstrap' ||
        key.startsWith('_')
      )
        continue;
      const fn = instance[key];
      if (typeof fn !== 'function') continue;
      const action = capitalize(key);
      const full = `${domain}.${action}`;
      const constName = `${toUpperSnake(domain)}_${toUpperSnake(action)}`;
      methods.push({ domain, action, full, constName });
    }
  }

  // de-duplicate
  const unique = new Map<
    string,
    { full: string; constName: string }
  >();
  for (const m of methods) {
    if (!unique.has(m.full))
      unique.set(m.full, {
        full: m.full,
        constName: m.constName,
      });
  }

  const here = fileURLToPath(import.meta.url);
  const dir = path.dirname(here);
  const repoRoot = path.resolve(dir, '../../../../..');
  const target = path.resolve(
    repoRoot,
    'packages/shared-types/src/rpc-methods.ts'
  );

  const lines: string[] = [];
  lines.push(
    '/** AUTO-GENERATED: Do not edit manually. */'
  );
  lines.push('export const RPC = {');
  const byDomain = new Map<string, string[]>();
  for (const { domain, action, full } of methods) {
    const arr = byDomain.get(domain) || [];
    arr.push(`    ${action}: '${full}',`);
    byDomain.set(domain, arr);
  }
  for (const [domain, arr] of byDomain) {
    lines.push(`  ${domain}: {`);
    for (const l of arr) lines.push(l);
    lines.push('  },');
  }
  lines.push('};');

  const content = lines.join('\n') + '\n';
  writeFileSync(target, content, { encoding: 'utf-8' });
  await app.close();
  // eslint-disable-next-line no-console
  console.log(
    `RPC methods exported: ${unique.size} → ${path.relative(
      repoRoot,
      target
    )}`
  );
}

main();
