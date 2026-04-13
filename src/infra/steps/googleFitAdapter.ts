import { StepSource } from '../../domain/steps/types';

export interface GoogleFitDataPoint {
  startTimeNanos: string;
  endTimeNanos: string;
  value: Array<{ intVal?: number }>;
}

export function parseGoogleFitSteps(dataPoints: GoogleFitDataPoint[]): {
  steps: number;
  source: StepSource;
} {
  const steps = dataPoints.reduce((sum, dp) => {
    const val = dp.value[0]?.intVal ?? 0;
    return sum + val;
  }, 0);
  return { steps, source: 'google_fit' };
}
