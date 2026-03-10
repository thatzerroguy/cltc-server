/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
//import { join } from 'node:path';
import { resolve } from 'node:path';

const YAML_CONFIG_FILENAME = 'configuration.yaml';

function expandEnvironmentVariables(obj: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/\$\{([^}]+)\}/g, (_, envVar) => {
      return process.env[envVar] || '';
    });
  }

  if (Array.isArray(obj)) {
    return obj.map(expandEnvironmentVariables);
  }

  if (obj !== null && typeof obj === 'object') {
    const expanded: any = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const [key, value] of Object.entries(obj)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expanded[key] = expandEnvironmentVariables(value);
    }
    return expanded;
  }

  return obj;
}

export default () => {
  const filePath = resolve(process.cwd(), YAML_CONFIG_FILENAME);
  const config = yaml.load(readFileSync(filePath, 'utf8')) as Record<
    string,
    any
  >;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return expandEnvironmentVariables(config);
};
