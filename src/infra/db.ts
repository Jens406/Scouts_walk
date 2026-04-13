import { UserProfile } from '../domain/user/types';
import { Team } from '../domain/team/types';
import { ScoutCommunity } from '../domain/community/types';
import { Route } from '../domain/route/types';
import { PointOfInterest } from '../domain/poi/types';
import { StepSample } from '../domain/steps/types';
import { Milestone, MilestoneUnlock } from '../domain/milestone/types';
import { ChatMessage, ChatChannel } from '../domain/chat/types';
import { FriendPresence } from '../domain/friends/types';
import { Achievement, XPEvent } from '../domain/gamification/types';

export interface InMemoryDB {
  users: Map<string, UserProfile>;
  teams: Map<string, Team>;
  communities: Map<string, ScoutCommunity>;
  routes: Map<string, Route>;
  pois: Map<string, PointOfInterest>;
  stepSamples: Map<string, StepSample>;
  milestones: Map<string, Milestone>;
  milestoneUnlocks: Map<string, MilestoneUnlock>;
  chatMessages: Map<string, ChatMessage>;
  chatChannels: Map<string, ChatChannel>;
  presences: Map<string, FriendPresence>;
  achievements: Map<string, Achievement>;
  xpEvents: Map<string, XPEvent>;
}

export const db: InMemoryDB = {
  users: new Map(),
  teams: new Map(),
  communities: new Map(),
  routes: new Map(),
  pois: new Map(),
  stepSamples: new Map(),
  milestones: new Map(),
  milestoneUnlocks: new Map(),
  chatMessages: new Map(),
  chatChannels: new Map(),
  presences: new Map(),
  achievements: new Map(),
  xpEvents: new Map(),
};
