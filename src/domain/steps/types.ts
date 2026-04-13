export type StepSource = 'healthkit' | 'google_fit' | 'manual' | 'garmin';

export interface StepSample {
  id: string;
  userId: string;
  routeId: string;
  steps: number;
  source: StepSource;
  recordedAt: Date;
}

export interface AggregatedSteps {
  userId: string;
  routeId: string;
  totalSteps: number;
  distanceKm: number;
}
