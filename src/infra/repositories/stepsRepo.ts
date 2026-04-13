import { db } from '../db';
import { StepSample } from '../../domain/steps/types';

export const stepsRepo = {
  save(sample: StepSample): void {
    db.stepSamples.set(sample.id, sample);
  },
  findById(id: string): StepSample | undefined {
    return db.stepSamples.get(id);
  },
  findByUserAndRoute(userId: string, routeId: string): StepSample[] {
    return Array.from(db.stepSamples.values()).filter(
      s => s.userId === userId && s.routeId === routeId
    );
  },
  findAll(): StepSample[] {
    return Array.from(db.stepSamples.values());
  },
  delete(id: string): void {
    db.stepSamples.delete(id);
  },
};
