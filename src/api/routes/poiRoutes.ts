import { Router, Response } from 'express';
import { addPoiToRoute, listPoisOnRoute } from '../../domain/poi/services';
import { poiRepo } from '../../infra/repositories/poiRepo';
import { routeRepo } from '../../infra/repositories/routeRepo';
import { authMiddleware, AuthenticatedRequest } from '../../infra/auth/authMiddleware';

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const route = routeRepo.findById(req.params.id);
  if (!route || route.userId !== req.userId) {
    res.status(404).json({ error: 'Route not found' });
    return;
  }

  const { name, description, category, location } = req.body as {
    name: string;
    description?: string;
    category: string;
    location: { lat: number; lng: number };
  };

  if (!name || !category || !location) {
    res.status(400).json({ error: 'name, category, and location are required' });
    return;
  }

  const poi = addPoiToRoute({
    routeId: route.id,
    name,
    description,
    category: category as any,
    location,
    addedByUserId: req.userId!,
  });

  poiRepo.save(poi);

  const updatedRoute = { ...route, poiIds: [...route.poiIds, poi.id], updatedAt: new Date() };
  routeRepo.save(updatedRoute);

  res.status(201).json(poi);
});

router.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const route = routeRepo.findById(req.params.id);
  if (!route || route.userId !== req.userId) {
    res.status(404).json({ error: 'Route not found' });
    return;
  }
  res.json(listPoisOnRoute(poiRepo.findAll(), route.id));
});

export default router;
