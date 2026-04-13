import request from 'supertest';
import { createApp } from '../../server';
import { db } from '../../infra/db';

const app = createApp();

async function registerAndLogin(): Promise<{ token: string; userId: string }> {
  const uniqueSuffix = Date.now() + Math.random().toString(36).slice(2);
  const regRes = await request(app)
    .post('/api/auth/register')
    .send({
      username: `chatuser-${uniqueSuffix}`,
      email: `chat-${uniqueSuffix}@example.com`,
      password: 'password123',
      displayName: 'Chat User',
      role: 'scout',
    });

  return { token: regRes.body.token as string, userId: regRes.body.user.id as string };
}

describe('Chat API', () => {
  const channelId = 'test-channel-001';

  beforeEach(() => {
    db.chatMessages.clear();
  });

  it('POST /api/chat/:channelId/messages - posts a message', async () => {
    const { token } = await registerAndLogin();
    const res = await request(app)
      .post(`/api/chat/${channelId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Hello, fellow scouts!',
        channelType: 'route',
      });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Hello, fellow scouts!');
    expect(res.body.channelId).toBe(channelId);
  });

  it('GET /api/chat/:channelId/messages - lists messages', async () => {
    const { token } = await registerAndLogin();
    await request(app)
      .post(`/api/chat/${channelId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Message 1', channelType: 'route' });

    await request(app)
      .post(`/api/chat/${channelId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Message 2', channelType: 'route' });

    const res = await request(app)
      .get(`/api/chat/${channelId}/messages`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('POST /api/chat/:channelId/messages - returns 401 without token', async () => {
    const res = await request(app)
      .post(`/api/chat/${channelId}/messages`)
      .send({ content: 'Test', channelType: 'route' });

    expect(res.status).toBe(401);
  });

  it('messages are sorted by time', async () => {
    const { token } = await registerAndLogin();
    await request(app)
      .post(`/api/chat/${channelId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'First', channelType: 'route' });

    await new Promise(r => setTimeout(r, 10));

    await request(app)
      .post(`/api/chat/${channelId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Second', channelType: 'route' });

    const res = await request(app)
      .get(`/api/chat/${channelId}/messages`)
      .set('Authorization', `Bearer ${token}`);

    const messages = res.body as Array<{ content: string; createdAt: string }>;
    const filtered = messages.filter(m => m.content === 'First' || m.content === 'Second');
    expect(filtered[0].content).toBe('First');
    expect(filtered[1].content).toBe('Second');
  });
});
