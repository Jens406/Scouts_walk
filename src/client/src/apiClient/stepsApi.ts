import { http } from './httpClient';

export interface IngestStepsData {
  routeId: string;
  steps: number;
  source: 'manual' | 'phone' | 'watch' | 'fitbit';
  recordedAt?: string;
}

export interface IngestStepsResponse {
  sample: { id: string; steps: number };
  aggregated: { totalSteps: number };
  progress: number;
}

export const stepsApi = {
  ingestSteps: (data: IngestStepsData) =>
    http.post<IngestStepsResponse>('/api/steps/ingest', data),
};
