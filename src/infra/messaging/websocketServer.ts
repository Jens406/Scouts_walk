import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../logging';

let io: SocketIOServer | null = null;

export function initWebSocketServer(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    socket.on('join-route', (routeId: string) => {
      void socket.join(`route:${routeId}`);
      logger.info(`Socket ${socket.id} joined route:${routeId}`);
    });

    socket.on('join-channel', (channelId: string) => {
      void socket.join(`channel:${channelId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`WebSocket client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function emitProgressUpdate(routeId: string, userId: string, progressPercent: number): void {
  if (!io) return;
  io.to(`route:${routeId}`).emit('progress-update', { routeId, userId, progressPercent });
}

export function emitNewMessage(channelId: string, message: object): void {
  if (!io) return;
  io.to(`channel:${channelId}`).emit('new-message', message);
}

export function emitMilestoneUnlocked(routeId: string, userId: string, milestoneId: string): void {
  if (!io) return;
  io.to(`route:${routeId}`).emit('milestone-unlocked', { routeId, userId, milestoneId });
}

export function getIO(): SocketIOServer | null {
  return io;
}
