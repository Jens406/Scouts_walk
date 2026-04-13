import { Router, Response } from 'express';
import { planRoute, recalcProgress } from '../../domain/route/services';
import { routeRepo } from '../../infra/repositories/routeRepo';
import { communityRepo } from '../../infra/repositories/communityRepo';
import { authMiddleware, AuthenticatedRequest } from '../../infra/auth/authMiddleware';
import { toRouteDTO } from '../mappers/routeMapper';

const router = Router();

router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { name, start, destination } = req.body as {
    name: string;
    start: { lat: number; lng: number; name?: string };
    destination: { lat: number; lng: number; name?: string };
  };

  if (!name || !start || !destination) {
    res.status(400).json({ error: 'name, start, and destination are required' });
    return;
  }

  const route = planRoute({
    userId: req.userId!,
    name,
    start,
    destination,
    communities: communityRepo.findAll(),
  });

  routeRepo.save(route);
  res.status(201).json(toRouteDTO(route));
});

router.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const routes = routeRepo.findByUserId(req.userId!);
  res.json(routes.map(toRouteDTO));
});

router.get('/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const route = routeRepo.findById(req.params.id);
  if (!route || route.userId !== req.userId) {
    res.status(404).json({ error: 'Route not found' });
    return;
  }
  res.json(toRouteDTO(route));
});

router.get('/:id/progress', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const route = routeRepo.findById(req.params.id);
  if (!route || route.userId !== req.userId) {
    res.status(404).json({ error: 'Route not found' });
    return;
  }
  res.json({
    routeId: route.id,
    totalDistanceKm: route.totalDistanceKm,
    completedDistanceKm: route.completedDistanceKm,
    progressPercent: route.progressPercent,
    status: route.status,
  });
});

export default router;
