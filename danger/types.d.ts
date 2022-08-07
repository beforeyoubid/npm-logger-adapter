import { DangerDSLType } from 'danger/distribution/dsl/DangerDSL';
import { DangerContext } from 'danger/distribution/runner/Dangerfile';

export type globalWithDanger = typeof globalThis &
  typeof globalThis & {
    danger: DangerDSLType;
    message: DangerContext['message'];
    warn: DangerContext['warn'];
    fail: DangerContext['fail'];
    markdown: DangerContext['markdown'];
  };
