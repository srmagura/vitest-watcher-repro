import fs from 'node:fs/promises';
import path from 'node:path';

import { pathExists } from './pathExists';

async function ensureDirectoryExists(
  cwd: string,
  relativeDirPath: string
): Promise<void> {
  const absolutePath = path.resolve(cwd, relativeDirPath);

  // I considered optimizing this to not repeatedly check the existence of the
  // same directory, but it is an extremely cheap operation and therefore not
  // worth optimizing
  if (!(await pathExists(absolutePath))) {
    await fs.mkdir(absolutePath);
  }
}

/**
 * @param relativeFilePath the path of the file we want to create or update. If
 * the requisite directories do not exist, this function will create them.
 */
export async function ensureDirectoriesExists(
  cwd: string,
  relativeFilePath: string
): Promise<void> {
  // Split the file path on forward/backward slash (backslash is for Windows
  // compatibility)
  const relativePathParts = relativeFilePath.split(/[/\\]/);
  const dirs = relativePathParts.slice(0, -1);

  // I tried using `fs.mkdir(absolutePath, { recursive: true })`, but that
  // caused Vitest's file watcher to freak out. So, we are doing basically the
  // same thing manually instead.

  for (let i = 1; i <= dirs.length; i++) {
    const relativeDirPath = path.join(...dirs.slice(0, i));

    await ensureDirectoryExists(cwd, relativeDirPath);
  }
}
