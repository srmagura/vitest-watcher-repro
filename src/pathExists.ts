import fs from 'node:fs/promises';

export async function pathExists(_path: string): Promise<boolean> {
  try {
    await fs.stat(_path);
    return true;
  } catch {
    return false;
  }
}
