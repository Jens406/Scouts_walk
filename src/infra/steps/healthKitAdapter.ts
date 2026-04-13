import { StepSource } from '../../domain/steps/types';

export interface HealthKitSample {
  startDate: string;
  endDate: string;
  value: number;
  unit: string;
}

export function parseHealthKitSteps(samples: HealthKitSample[]): {
  steps: number;
  source: StepSource;
} {
  const steps = samples
    .filter(s => s.unit === 'count')
    .reduce((sum, s) => sum + s.value, 0);
  return { steps, source: 'healthkit' };
}
