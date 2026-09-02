import {
  State,
  District,
  Block,
  Village,
  RoadSegment,
  InfrastructurePoint,
  Sensor,
  RiskSnapshot,
  RiskForecast,
  Alert,
  IncidentReport,
  AnalyticsSummary,
  User,
  RecentLandslide,
  SafeRouteResult,
  Role
} from '../types.ts';

const API_BASE = '/api';

export const api = {
  // Auth
  login: async (email?: string, role?: Role, password?: string): Promise<{ user: User; token: string }> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, password })
    });
    return res.json();
  },

  register: async (data: Partial<User>): Promise<{ user: User; token: string }> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  logout: async (): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    return res.json();
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await fetch(`${API_BASE}/users/me`);
    return res.json();
  },

  updateCurrentUser: async (data: Partial<User>): Promise<User> => {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  switchRole: async (role: Role): Promise<{ user: User }> => {
    const res = await fetch(`${API_BASE}/auth/switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },

  // Geo Master
  getStates: async (): Promise<State[]> => {
    const res = await fetch(`${API_BASE}/geo/states`);
    return res.json();
  },

  getDistricts: async (stateId?: string): Promise<District[]> => {
    const url = stateId ? `${API_BASE}/geo/states/${stateId}/districts` : `${API_BASE}/geo/districts`;
    const res = await fetch(url);
    return res.json();
  },

  getBlocks: async (districtId?: string): Promise<Block[]> => {
    const url = districtId ? `${API_BASE}/geo/districts/${districtId}/blocks` : `${API_BASE}/geo/blocks`;
    const res = await fetch(url);
    return res.json();
  },

  getVillages: async (): Promise<Village[]> => {
    const res = await fetch(`${API_BASE}/geo/villages`);
    return res.json();
  },

  getVillageDetails: async (id: string): Promise<{
    village: Village;
    current_risk: RiskSnapshot;
    forecasts: RiskForecast[];
    alerts: Alert[];
    incidents: IncidentReport[];
  }> => {
    const res = await fetch(`${API_BASE}/geo/villages/${id}`);
    return res.json();
  },

  getRoads: async (): Promise<RoadSegment[]> => {
    const res = await fetch(`${API_BASE}/geo/roads`);
    return res.json();
  },

  getInfrastructure: async (): Promise<InfrastructurePoint[]> => {
    const res = await fetch(`${API_BASE}/geo/infrastructure`);
    return res.json();
  },

  getSensors: async (): Promise<Sensor[]> => {
    const res = await fetch(`${API_BASE}/geo/sensors`);
    return res.json();
  },

  // Risk & Forecasts
  getCurrentRiskFeatures: async (params?: { state_id?: string; district_id?: string; block_id?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/risk/current?${query}`);
    return res.json();
  },

  getForecastRiskFeatures: async (horizonHours: number, params?: { state_id?: string; district_id?: string }) => {
    const query = new URLSearchParams({ horizon_hours: String(horizonHours), ...(params as any) }).toString();
    const res = await fetch(`${API_BASE}/risk/forecast?${query}`);
    return res.json();
  },

  getRecentLandslides: async (params?: { state_id?: string; severity?: string }): Promise<RecentLandslide[]> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/risk/recent-landslides?${query}`);
    return res.json();
  },

  getSafeRoute: async (origin: string, destination: string, transportMode: string): Promise<SafeRouteResult[]> => {
    const res = await fetch(`${API_BASE}/routes/safe-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination, transportMode })
    });
    return res.json();
  },

  // Alerts
  getAlerts: async (params?: { state_id?: string; district_id?: string; severity?: string; status?: string }): Promise<Alert[]> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/alerts?${query}`);
    return res.json();
  },

  getAlert: async (id: string): Promise<Alert> => {
    const res = await fetch(`${API_BASE}/alerts/${id}`);
    return res.json();
  },

  acknowledgeAlert: async (id: string, note?: string): Promise<{ success: boolean; alert: Alert }> => {
    const res = await fetch(`${API_BASE}/alerts/${id}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    });
    return res.json();
  },

  escalateAlert: async (id: string, escalated_to?: string, note?: string): Promise<{ success: boolean; alert: Alert }> => {
    const res = await fetch(`${API_BASE}/alerts/${id}/escalate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ escalated_to, note })
    });
    return res.json();
  },

  broadcastAlert: async (id: string, channels?: string[]): Promise<{ success: boolean; alert: Alert; message: string }> => {
    const res = await fetch(`${API_BASE}/alerts/${id}/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channels })
    });
    return res.json();
  },

  // Incidents
  getIncidents: async (params?: { state_id?: string; district_id?: string; severity?: string; status?: string; incident_type?: string }): Promise<IncidentReport[]> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/incidents?${query}`);
    return res.json();
  },

  getIncident: async (id: string): Promise<IncidentReport> => {
    const res = await fetch(`${API_BASE}/incidents/${id}`);
    return res.json();
  },

  createIncident: async (data: Partial<IncidentReport> & { media_urls?: string[] }): Promise<IncidentReport> => {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateIncident: async (id: string, data: Partial<IncidentReport> & { note?: string }): Promise<IncidentReport> => {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Simulation
  simulateHeavyRain: async (target_village_ids?: string[]) => {
    const res = await fetch(`${API_BASE}/simulation/heavy-rain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_village_ids })
    });
    return res.json();
  },

  resetSimulation: async () => {
    const res = await fetch(`${API_BASE}/simulation/reset`, {
      method: 'POST'
    });
    return res.json();
  },

  // Analytics
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    return res.json();
  }
};

export const apiService = api;

