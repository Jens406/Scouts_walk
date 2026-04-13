import http from 'http';
import { createApp } from './server';
import { initWebSocketServer } from './infra/messaging/websocketServer';
import { config } from '../config/env';
import { logger } from './infra/logging';

const app = createApp();
const server = http.createServer(app);
initWebSocketServer(server);

server.listen(config.port, () => {
  logger.info(`Virtual Scout Walk server running on port ${config.port}`);
});

export { server };
