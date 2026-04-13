export const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwtSecret: process.env.JWT_SECRET ?? 'scout-walk-dev-secret-key-change-in-prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  mapProvider: process.env.MAP_PROVIDER ?? 'internal',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  nodeEnv: process.env.NODE_ENV ?? 'development',
};

if (config.nodeEnv === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set in production');
}
