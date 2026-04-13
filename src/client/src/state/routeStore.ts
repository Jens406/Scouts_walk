import { create } from 'zustand';
import { routeApi } from '../apiClient/routeApi';
import type { RouteDTO, MilestoneDTO, PoiDTO, PlanRouteData, AddPoiData } from '../apiClient/routeApi';
import { stepsApi } from '../apiClient/stepsApi';

interface RouteStore {
  routes: RouteDTO[];
  activeRoute: RouteDTO | null;
  milestones: MilestoneDTO[];
  pois: PoiDTO[];
  isLoading: boolean;
  error: string | null;
  loadRoutes: () => Promise<void>;
  planRoute: (data: PlanRouteData) => Promise<void>;
  selectRoute: (routeId: string) => void;
  loadMilestones: (routeId: string) => Promise<void>;
  loadPois: (routeId: string) => Promise<void>;
  logSteps: (steps: number, source?: string) => Promise<void>;
  addPoi: (data: AddPoiData) => Promise<void>;
  refreshProgress: () => Promise<void>;
  clearError: () => void;
}

export const useRouteStore = create<RouteStore>((set, get) => ({
  routes: [],
  activeRoute: null,
  milestones: [],
  pois: [],
  isLoading: false,
  error: null,

  loadRoutes: async () => {
    set({ isLoading: true, error: null });
    try {
      const routes = await routeApi.getRoutes();
      set({ routes, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  planRoute: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const route = await routeApi.planRoute(data);
      set((s) => ({ routes: [...s.routes, route], activeRoute: route, isLoading: false }));
      await get().loadMilestones(route.id);
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  selectRoute: (routeId) => {
    const route = get().routes.find((r) => r.id === routeId) ?? null;
    set({ activeRoute: route });
    if (route) {
      get().loadMilestones(route.id);
      get().loadPois(route.id);
    }
  },

  loadMilestones: async (routeId) => {
    try {
      const milestones = await routeApi.getMilestones(routeId);
      set({ milestones });
    } catch {
      // non-fatal
    }
  },

  loadPois: async (routeId) => {
    try {
      const pois = await routeApi.getPois(routeId);
      set({ pois });
    } catch {
      // non-fatal
    }
  },

  logSteps: async (steps, source = 'manual') => {
    const { activeRoute } = get();
    if (!activeRoute) throw new Error('No active route');
    const result = await stepsApi.ingestSteps({
      routeId: activeRoute.id,
      steps,
      source: source as any,
    });
    set((s) => ({
      activeRoute: s.activeRoute
        ? { ...s.activeRoute, progressPercent: result.progress }
        : null,
    }));
  },

  addPoi: async (data) => {
    const { activeRoute } = get();
    if (!activeRoute) throw new Error('No active route');
    const poi = await routeApi.addPoi(activeRoute.id, data);
    set((s) => ({ pois: [...s.pois, poi] }));
  },

  refreshProgress: async () => {
    const { activeRoute } = get();
    if (!activeRoute) return;
    try {
      const progress = await routeApi.getProgress(activeRoute.id);
      set((s) => ({
        activeRoute: s.activeRoute
          ? {
              ...s.activeRoute,
              totalDistanceKm: progress.totalDistanceKm,
              completedDistanceKm: progress.completedDistanceKm,
              progressPercent: progress.progressPercent,
              status: progress.status as RouteDTO['status'],
            }
          : null,
      }));
    } catch {
      // non-fatal
    }
  },

  clearError: () => set({ error: null }),
}));
