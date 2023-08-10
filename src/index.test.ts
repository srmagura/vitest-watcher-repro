import fs from 'node:fs/promises';
import path from 'node:path';

import { spawn } from 'cross-spawn';
import { beforeAll, test } from 'vitest';

import {
  createTestOutputDirectory,
  createTestOutputRoot,
} from './createTestOutputDirectory';

async function writePackageJson(cwd: string): Promise<void> {
  const packageJson = {
    private: true,
    type: "module",
    devDependencies: {
      typescript: "5.1.6",
      prettier: "3.0.1",
    },
  };

  const text = JSON.stringify(packageJson, undefined, 2);

  await fs.writeFile(path.join(cwd, "package.json"), text);
}

async function npmInstall(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["install", "--prefix", cwd]);

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm exited with code ${code ?? "?"}.`));
      }
    });

    child.stderr?.on("data", (data) => {
      reject(new Error(data.toString()));
    });
  });
}

async function unpack(cwd: string): Promise<void> {
  await writePackageJson(cwd);
  await npmInstall(cwd);
}

beforeAll(async () => {
  await createTestOutputRoot();
});

test("repro case", async () => {
  const outDir = await createTestOutputDirectory("repro-case");

  await unpack(outDir);
});

test("repro case 2", async () => {
  const outDir = await createTestOutputDirectory("repro-case-2");

  await unpack(outDir);
});
