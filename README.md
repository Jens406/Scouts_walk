# 🏕️ Virtual Scout Walk

A **virtual step-challenge platform** for Boy Scouts and Girl Scouts that lets participants pick a start point and destination on a map, follow a route that passes by real scout communities, collect points of interest, find friends along the virtual trail, and post milestone greetings to every community they virtually visit.

---

## Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Map-based route planning** | Pick start & destination on a Leaflet map; the routing engine snaps the path through nearby scout communities |
| 🏘️ **Scout community discovery** | 20 seed communities across Europe & North America; find any within a given bounding box or radius |
| 📍 **Points of Interest** | Scouts add POIs (historic sites, campsites, viewpoints …) at any point along their route |
| 👣 **Step tracking** | Ingest steps from HealthKit, Google Fit, or manual entry; progress is recalculated automatically (0.8 m per step) |
| 🏆 **Milestone achievements** | Auto-generated milestones at every community visit and at 25 / 50 / 75 / 100 % distance |
| 💬 **Milestone chat** | Each milestone has its own chat channel; post a "greeting" to the virtually visited community |
| 👫 **Find friends along the route** | Real-time presence via Socket.IO shows which friends are on the same segments |
| 🎖️ **Gamification** | Badges and XP awarded for first steps, distance records, community visits, greetings sent, and more |
| 👤 **Scout profiles & teams** | Register with role (scout / patrol leader / …), areas of interest, avatar; join or create a patrol / troop |

---

## Architecture

```
virtual-scout-walk/
├─ config/                  # env.ts, featureFlags.ts
├─ src/
│  ├─ domain/               # Pure domain logic (types + services)
│  │  ├─ user/  team/  community/  route/  poi/  steps/
│  │  ├─ milestone/  chat/  friends/  gamification/
│  ├─ infra/                # Adapters (in-memory DB, JWT auth, maps, WebSocket)
│  │  ├─ repositories/      # userRepo, teamRepo, routeRepo, chatRepo …
│  │  ├─ auth/              # JWT middleware, scout-org SSO stub
│  │  ├─ maps/              # mapProvider, routingEngine (haversine)
│  │  ├─ steps/             # HealthKit, Google Fit, manual adapters
│  │  └─ messaging/         # Socket.IO server, push notifications
│  ├─ api/                  # Express route handlers + DTO mappers
│  ├─ application/          # Use-cases orchestrating domain + infra
│  ├─ utils/                # geo.ts (haversineKm)
│  ├─ server.ts             # Express app wiring
│  ├─ index.ts              # HTTP + WebSocket server entrypoint
│  ├─ tests/                # Jest unit + supertest integration tests
│  └─ client/               # Vite + React 18 + TypeScript SPA
│     ├─ components/        # MapPicker, RouteProgressBar, MilestoneChat …
│     ├─ screens/           # Onboarding, RouteSetup, Dashboard, CommunityFeed
│     ├─ state/             # Zustand stores (user, route, chat)
│     └─ apiClient/         # Typed fetch wrappers for every endpoint
├─ package.json             # Backend (Node/Express/TypeScript/Jest)
└─ tsconfig.json
```

---

## Quick Start

### Prerequisites
- Node.js ≥ 18

### Backend

```bash
npm install
npm run dev          # ts-node watch on port 3000
# or
npm run build && npm start
```

### Frontend

```bash
cd src/client
npm install
npm run dev          # Vite dev server on port 5173 (proxies /api → localhost:3000)
```

### Tests (backend)

```bash
npm test             # Jest – 27 tests across 5 suites
```

---

## REST API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Create scout account |
| `POST` | `/api/auth/login` | Login → JWT |
| `GET` | `/api/profile` | Get own profile |
| `PUT` | `/api/profile` | Update profile |
| `POST` | `/api/teams` | Create team |
| `POST` | `/api/teams/:id/join` | Join team |
| `GET` | `/api/communities` | List all communities |
| `GET` | `/api/communities/nearby` | Communities within radius (`lat`, `lng`, `radius` query params) |
| `POST` | `/api/routes` | Plan a virtual route (start + destination + name) |
| `GET` | `/api/routes` | My routes |
| `GET` | `/api/routes/:id/progress` | Current progress |
| `POST` | `/api/routes/:id/pois` | Add POI |
| `GET` | `/api/routes/:id/milestones` | List milestones |
| `POST` | `/api/routes/:id/milestones/:milestoneId/greet` | Post greeting |
| `POST` | `/api/steps/ingest` | Log steps |
| `GET` | `/api/chat/:channelId/messages` | Chat history |
| `POST` | `/api/chat/:channelId/messages` | Send message |

All authenticated endpoints require `Authorization: Bearer <token>`.

---

## WebSocket Events (Socket.IO)

| Event | Direction | Payload |
|-------|-----------|---------|
| `join-route` | Client → Server | `{ routeId }` |
| `progress-update` | Server → Client | `FriendPresence` |
| `join-channel` | Client → Server | `{ channelId }` |
| `new-message` | Server → Client | `ChatMessage` |
| `milestone-unlocked` | Server → Client | `MilestoneUnlock` |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `JWT_SECRET` | `dev-secret` | JWT signing secret (**change in production**) |
| `NODE_ENV` | `development` | `production` enables secret validation |
| `MAP_PROVIDER` | `osm` | `osm` / `mapbox` / `google` |

Copy `.env.example` (if provided) or set these in your environment.

---

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| **Onboarding** | `/` | Register / login with scout role & interests |
| **Route Setup** | `/routes` | Map picker to plan a new virtual route |
| **Dashboard** | `/dashboard` | Progress bar, milestone timeline, friends, POIs, step logger |
| **Community Feed** | `/community` | Chat channels for every community along your active route |

---

## Seeded Data

The backend seeds **20 scout communities** at startup:
London, Paris, Berlin, Amsterdam, Brussels, New York, Toronto, Chicago, Los Angeles, Madrid, Rome, Vienna, Zurich, Stockholm, Oslo, Copenhagen, Dublin, Lisbon, Warsaw, Prague.

---

## License

MIT