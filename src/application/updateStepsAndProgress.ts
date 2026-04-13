import { ingestSteps, aggregateStepsByUserAndRoute } from '../domain/steps/services';
import { recalcProgress } from '../domain/route/services';
import { checkUnlockedMilestones } from '../domain/milestone/services';
import { stepsRepo } from '../infra/repositories/stepsRepo';
import { routeRepo } from '../infra/repositories/routeRepo';
import { milestoneRepo } from '../infra/repositories/milestoneRepo';
import { StepSource } from '../domain/steps/types';
import { emitProgressUpdate, emitMilestoneUnlocked } from '../infra/messaging/websocketServer';

export interface UpdateStepsInput {
  userId: string;
  routeId: string;
  steps: number;
  source: StepSource;
}

export function updateStepsAndProgress(input: UpdateStepsInput): void {
  const sample = ingestSteps(input);
  stepsRepo.save(sample);

  const route = routeRepo.findById(input.routeId);
  if (!route) return;

  const aggregated = aggregateStepsByUserAndRoute(stepsRepo.findAll(), input.userId, input.routeId);
  const updatedRoute = recalcProgress(route, aggregated.totalSteps);
  routeRepo.save(updatedRoute);

  emitProgressUpdate(input.routeId, input.userId, updatedRoute.progressPercent);

  const milestones = milestoneRepo.findByRouteId(input.routeId);
  const existingUnlocks = milestoneRepo.findUnlocksByUser(input.userId);
  const newUnlocks = checkUnlockedMilestones(milestones, existingUnlocks, input.userId, updatedRoute.progressPercent);

  for (const unlock of newUnlocks) {
    milestoneRepo.saveUnlock(unlock);
    emitMilestoneUnlocked(input.routeId, input.userId, unlock.milestoneId);
  }
}
