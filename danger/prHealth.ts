import { globalWithDanger } from './types';

const { danger, warn } = global as globalWithDanger;

const { github } = danger;
const { pr } = github;

export function prHealth(): void {
  const packageJson = danger.git.fileMatch('package.json');
  const lockfile = danger.git.fileMatch('yarn.lock');

  if (packageJson.modified && !lockfile.modified) {
    warn('This PR modified package.json, but not the lockfile');
  }

  if (!pr.body?.length) {
    warn('Please add a description to your PR.');
  }
}
