import fs from 'node:fs/promises';
import path from 'node:path';

import { pathExists } from './pathExists';

const testOutputDir = path.join(process.cwd(), 'test-output');

export async function createTestOutputRoot(): Promise<void> {
  if (!(await pathExists(testOutputDir))) {
    await fs.mkdir(testOutputDir);
  }
}

export async function createTestOutputDirectory(
  directoryName: string
): Promise<string> {
  const directoryPath = path.join(testOutputDir, directoryName);

  if (await pathExists(directoryPath)) {
    await fs.rm(directoryPath, { recursive: true });
  }

  await fs.mkdir(directoryPath);

  return directoryPath;
}
