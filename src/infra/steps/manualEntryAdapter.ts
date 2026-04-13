import { StepSource } from '../../domain/steps/types';

export function parseManualEntry(steps: number): {
  steps: number;
  source: StepSource;
} {
  if (steps < 0) throw new Error('Steps cannot be negative');
  return { steps, source: 'manual' };
}
