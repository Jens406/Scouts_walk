import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, updateProfile, verifyPassword } from '../../domain/user/services';
import { userRepo } from '../../infra/repositories/userRepo';
import { authMiddleware, AuthenticatedRequest } from '../../infra/auth/authMiddleware';
import { toUserDTO } from '../mappers/userMapper';
import { config } from '../../../config/env';

const router = Router();

router.post('/auth/register', async (req, res: Response) => {
  try {
    const { username, email, password, displayName, role, areasOfInterest } = req.body as {
      username: string;
      email: string;
      password: string;
      displayName: string;
      role: string;
      areasOfInterest?: string[];
    };

    if (!username || !email || !password || !displayName) {
      res.status(400).json({ error: 'username, email, password, and displayName are required' });
      return;
    }

    if (userRepo.findByEmail(email)) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    if (userRepo.findByUsername(username)) {
      res.status(409).json({ error: 'Username already taken' });
      return;
    }

    const user = await createUser({
      username,
      email,
      password,
      displayName,
      role: (role as any) ?? 'scout',
      areasOfInterest: (areasOfInterest as any) ?? [],
    });

    userRepo.save(user);
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions);

    res.status(201).json({ token, user: toUserDTO(user) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    const user = userRepo.findByEmail(email);
    if (!user || !(await verifyPassword(user, password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions);

    res.json({ token, user: toUserDTO(user) });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = userRepo.findById(req.userId!);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(toUserDTO(user));
});

router.put('/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = userRepo.findById(req.userId!);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const updated = updateProfile(user, req.body as any);
  userRepo.save(updated);
  res.json(toUserDTO(updated));
});

export default router;
