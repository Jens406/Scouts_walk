import { db } from '../db';
import { Route } from '../../domain/route/types';

export const routeRepo = {
  save(route: Route): void {
    db.routes.set(route.id, route);
  },
  findById(id: string): Route | undefined {
    return db.routes.get(id);
  },
  findByUserId(userId: string): Route[] {
    return Array.from(db.routes.values()).filter(r => r.userId === userId);
  },
  findAll(): Route[] {
    return Array.from(db.routes.values());
  },
  delete(id: string): void {
    db.routes.delete(id);
  },
};
