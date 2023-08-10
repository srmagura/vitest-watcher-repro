import fs from 'node:fs/promises';
import path from 'node:path';

import { spawn } from 'cross-spawn';
import { test } from 'vitest';

import {
  createTestOutputDirectory,
  createTestOutputRoot,
} from './createTestOutputDirectory';

async function writePackageJson(cwd: string): Promise<void> {
  const packageJson = {
    private: true,
    type: 'module',
    dependencies: {
      // THIS BREAKS VITEST:
      'lodash-es': '4.17.21',

      // THIS DOES NOT:
      // typescript: '5.1.6',
    },
  };

  const text = JSON.stringify(packageJson, undefined, 2);

  await fs.writeFile(path.join(cwd, 'package.json'), text);
}

async function npmInstall(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['install', '--prefix', cwd]);

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm exited with code ${code ?? '?'}.`));
      }
    });

    child.stderr?.on('data', (data) => {
      reject(new Error(data.toString()));
    });
  });
}

test('repro case', async () => {
  await createTestOutputRoot();

  const outDir = await createTestOutputDirectory('repro-case');

  await writePackageJson(outDir);
  await npmInstall(outDir);
});
