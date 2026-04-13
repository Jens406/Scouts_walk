import { Router, Response } from 'express';
import { ingestSteps, aggregateStepsByUserAndRoute } from '../../domain/steps/services';
import { stepsRepo } from '../../infra/repositories/stepsRepo';
import { routeRepo } from '../../infra/repositories/routeRepo';
import { userRepo } from '../../infra/repositories/userRepo';
import { authMiddleware, AuthenticatedRequest } from '../../infra/auth/authMiddleware';
import { recalcProgress } from '../../domain/route/services';
import { emitProgressUpdate } from '../../infra/messaging/websocketServer';

const router = Router();

router.post('/ingest', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { routeId, steps, source, recordedAt } = req.body as {
    routeId: string;
    steps: number;
    source: string;
    recordedAt?: string;
  };

  if (!routeId || steps === undefined || !source) {
    res.status(400).json({ error: 'routeId, steps, and source are required' });
    return;
  }

  const route = routeRepo.findById(routeId);
  if (!route || route.userId !== req.userId) {
    res.status(404).json({ error: 'Route not found' });
    return;
  }

  const sample = ingestSteps({
    userId: req.userId!,
    routeId,
    steps,
    source: source as any,
    recordedAt: recordedAt ? new Date(recordedAt) : undefined,
  });

  stepsRepo.save(sample);

  const aggregated = aggregateStepsByUserAndRoute(
    stepsRepo.findAll(),
    req.userId!,
    routeId
  );

  const updatedRoute = recalcProgress(route, aggregated.totalSteps);
  routeRepo.save(updatedRoute);

  const user = userRepo.findById(req.userId!);
  if (user) {
    userRepo.save({ ...user, totalSteps: user.totalSteps + steps, updatedAt: new Date() });
  }

  emitProgressUpdate(routeId, req.userId!, updatedRoute.progressPercent);

  res.status(201).json({ sample, aggregated, progress: updatedRoute.progressPercent });
});

export default router;
