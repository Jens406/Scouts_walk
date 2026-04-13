import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './api/routes/userRoutes';
import teamRoutes from './api/routes/teamRoutes';
import communityRoutes from './api/routes/communityRoutes';
import routeRoutes from './api/routes/routeRoutes';
import poiRoutes from './api/routes/poiRoutes';
import stepsRoutes from './api/routes/stepsRoutes';
import milestoneRoutes from './api/routes/milestoneRoutes';
import chatRoutes from './api/routes/chatRoutes';
import { logger } from './infra/logging';
import { defaultLimiter, authLimiter } from './infra/rateLimiter';

export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authLimiter);
  app.use('/api', defaultLimiter);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api', userRoutes);
  app.use('/api/teams', teamRoutes);
  app.use('/api/communities', communityRoutes);
  app.use('/api/routes', routeRoutes);
  app.use('/api/routes/:id/pois', poiRoutes);
  app.use('/api/routes/:id/milestones', milestoneRoutes);
  app.use('/api/steps', stepsRoutes);
  app.use('/api/chat', chatRoutes);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Unhandled error', { message: err.message });
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
