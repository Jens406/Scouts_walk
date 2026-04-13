import { Router, Response } from 'express';
import { communityRepo } from '../../infra/repositories/communityRepo';
import { listCommunitiesInArea, getCommunityById } from '../../domain/community/services';

const router = Router();

router.get('/', (_req, res: Response) => {
  res.json(communityRepo.findAll());
});

router.get('/nearby', (req, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const radius = parseFloat(req.query.radius as string) || 50;

  if (isNaN(lat) || isNaN(lng)) {
    res.status(400).json({ error: 'lat and lng are required' });
    return;
  }

  const communities = listCommunitiesInArea(communityRepo.findAll(), lat, lng, radius);
  res.json(communities);
});

router.get('/:id', (req, res: Response) => {
  const community = getCommunityById(communityRepo.findAll(), req.params.id);
  if (!community) {
    res.status(404).json({ error: 'Community not found' });
    return;
  }
  res.json(community);
});

export default router;
