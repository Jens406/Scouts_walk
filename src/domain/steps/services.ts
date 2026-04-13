import { v4 as uuidv4 } from 'uuid';
import { StepSample, AggregatedSteps, StepSource } from './types';

const KM_PER_STEP = 0.0008;

export interface IngestStepsInput {
  userId: string;
  routeId: string;
  steps: number;
  source: StepSource;
  recordedAt?: Date;
}

export function ingestSteps(input: IngestStepsInput): StepSample {
  return {
    id: uuidv4(),
    userId: input.userId,
    routeId: input.routeId,
    steps: input.steps,
    source: input.source,
    recordedAt: input.recordedAt ?? new Date(),
  };
}

export function aggregateStepsByUserAndRoute(
  samples: StepSample[],
  userId: string,
  routeId: string
): AggregatedSteps {
  const filtered = samples.filter(s => s.userId === userId && s.routeId === routeId);
  const totalSteps = filtered.reduce((sum, s) => sum + s.steps, 0);
  return {
    userId,
    routeId,
    totalSteps,
    distanceKm: totalSteps * KM_PER_STEP,
  };
}
