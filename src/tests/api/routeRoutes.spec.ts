import request from 'supertest';
import { createApp } from '../../server';
import { db } from '../../infra/db';

const app = createApp();

async function registerAndLogin(): Promise<string> {
  const uniqueSuffix = Date.now() + Math.random().toString(36).slice(2);
  await request(app)
    .post('/api/auth/register')
    .send({
      username: `testuser-${uniqueSuffix}`,
      email: `test-${uniqueSuffix}@example.com`,
      password: 'password123',
      displayName: 'Test User',
      role: 'scout',
    });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: `test-${uniqueSuffix}@example.com`, password: 'password123' });

  return loginRes.body.token as string;
}

describe('Route API', () => {
  beforeEach(() => {
    db.routes.clear();
    db.pois.clear();
    db.milestones.clear();
  });

  it('POST /api/routes - creates a route', async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post('/api/routes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Route',
        start: { lat: 51.5074, lng: -0.1278, name: 'London' },
        destination: { lat: 48.8566, lng: 2.3522, name: 'Paris' },
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Route');
    expect(res.body.totalDistanceKm).toBeGreaterThan(0);
  });

  it('GET /api/routes - lists user routes', async () => {
    const token = await registerAndLogin();
    await request(app)
      .post('/api/routes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My Route',
        start: { lat: 51.5074, lng: -0.1278 },
        destination: { lat: 48.8566, lng: 2.3522 },
      });

    const res = await request(app)
      .get('/api/routes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/routes/:id - returns route details', async () => {
    const token = await registerAndLogin();
    const createRes = await request(app)
      .post('/api/routes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Detail Route',
        start: { lat: 51.5074, lng: -0.1278 },
        destination: { lat: 48.8566, lng: 2.3522 },
      });

    const routeId = createRes.body.id as string;
    const res = await request(app)
      .get(`/api/routes/${routeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(routeId);
  });

  it('POST /api/routes - returns 401 without token', async () => {
    const res = await request(app)
      .post('/api/routes')
      .send({ name: 'Test', start: { lat: 0, lng: 0 }, destination: { lat: 1, lng: 1 } });

    expect(res.status).toBe(401);
  });

  it('GET /api/routes/:id/progress - returns progress', async () => {
    const token = await registerAndLogin();
    const createRes = await request(app)
      .post('/api/routes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Progress Route',
        start: { lat: 51.5074, lng: -0.1278 },
        destination: { lat: 48.8566, lng: 2.3522 },
      });

    const routeId = createRes.body.id as string;
    const res = await request(app)
      .get(`/api/routes/${routeId}/progress`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.progressPercent).toBe(0);
  });
});
