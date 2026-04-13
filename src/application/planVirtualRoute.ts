import { planRoute } from '../domain/route/services';
import { defineMilestonesForRoute } from '../domain/milestone/services';
import { routeRepo } from '../infra/repositories/routeRepo';
import { communityRepo } from '../infra/repositories/communityRepo';
import { milestoneRepo } from '../infra/repositories/milestoneRepo';
import { RoutePoint, Route } from '../domain/route/types';
import { Milestone } from '../domain/milestone/types';

export interface PlanVirtualRouteInput {
  userId: string;
  name: string;
  start: RoutePoint;
  destination: RoutePoint;
}

export function planVirtualRoute(input: PlanVirtualRouteInput): { route: Route; milestones: Milestone[] } {
  const communities = communityRepo.findAll();
  const route = planRoute({ ...input, communities });
  routeRepo.save(route);

  const milestones = defineMilestonesForRoute(route, communities);
  milestones.forEach(m => milestoneRepo.save(m));

  const updatedRoute = { ...route, milestoneIds: milestones.map(m => m.id) };
  routeRepo.save(updatedRoute);

  return { route: updatedRoute, milestones };
}
