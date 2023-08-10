import fs from 'node:fs/promises';
import path from 'node:path';

import { pathExists } from './pathExists';

const PACKAGE_DIRECTORY = path.resolve(process.cwd(), "..");

const testOutputDir = path.join(PACKAGE_DIRECTORY, "test-output");

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
