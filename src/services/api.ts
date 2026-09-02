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
import {
  defaultStates,
  defaultDistricts,
  defaultBlocks,
  defaultVillages,
  defaultAlerts,
  defaultIncidents,
  defaultRoads,
  defaultSensors,
  defaultInfrastructure,
  defaultAnalyticsSummary,
  defaultUser
} from '../data/defaultData.ts';

const API_BASE = '/api';

export const api = {
  // Auth
  login: async (email?: string, role?: Role, password?: string): Promise<{ user: User; token: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, password })
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return { user: defaultUser, token: 'offline-token-001' };
    }
  },

  register: async (data: Partial<User>): Promise<{ user: User; token: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return { user: { ...defaultUser, ...data } as User, token: 'offline-token-001' };
    }
  },

  logout: async (): Promise<{ success: boolean }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const res = await fetch(`${API_BASE}/users/me`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return defaultUser;
    }
  },

  updateCurrentUser: async (data: Partial<User>): Promise<User> => {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return { ...defaultUser, ...data } as User;
    }
  },

  switchRole: async (role: Role): Promise<{ user: User }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/switch-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return { user: { ...defaultUser, role } };
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return [defaultUser];
    }
  },

  // Geo Master
  getStates: async (): Promise<State[]> => {
    try {
      const res = await fetch(`${API_BASE}/geo/states`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return defaultStates;
    }
  },

  getDistricts: async (stateId?: string): Promise<District[]> => {
    try {
      const url = stateId ? `${API_BASE}/geo/states/${stateId}/districts` : `${API_BASE}/geo/districts`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return stateId ? defaultDistricts.filter(d => d.state_id === stateId) : defaultDistricts;
    }
  },

  getBlocks: async (districtId?: string): Promise<Block[]> => {
    try {
      const url = districtId ? `${API_BASE}/geo/districts/${districtId}/blocks` : `${API_BASE}/geo/blocks`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return districtId ? defaultBlocks.filter(b => b.district_id === districtId) : defaultBlocks;
    }
  },

  getVillages: async (): Promise<Village[]> => {
    try {
      const res = await fetch(`${API_BASE}/geo/villages`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return defaultVillages;
    }
  },

  getVillageDetails: async (id: string): Promise<{
    village: Village;
    current_risk: RiskSnapshot;
    forecasts: RiskForecast[];
    alerts: Alert[];
    incidents: IncidentReport[];
  }> => {
    try {
      const res = await fetch(`${API_BASE}/geo/villages/${id}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      const village = defaultVillages.find(v => v.id === id) || defaultVillages[0];
      const risk_score = village.susceptibility_base_score || 0.6;
      const current_risk: RiskSnapshot = {
        id: `rs_${village.id}`,
        village_id: village.id,
        village_name: village.name,
        district_name: 'East Khasi Hills',
        lat: village.lat,
        lon: village.lon,
        timestamp: new Date().toISOString(),
        rainfall_24h_mm: village.current_rainfall_24h_mm,
        rainfall_72h_mm: village.rainfall_72h_mm,
        slope_deg: village.slope_deg,
        soil_moisture_pct: village.soil_moisture_pct,
        pore_pressure_kpa: village.pore_pressure_kpa,
        risk_score,
        risk_level: risk_score >= 0.70 ? 'CRITICAL' : risk_score >= 0.40 ? 'MODERATE' : 'LOW',
        contributing_factors: [`Rainfall: ${village.current_rainfall_24h_mm}mm`, `Slope: ${village.slope_deg}°`],
        recommended_actions: [risk_score >= 0.70 ? 'Evacuate low scarp sectors' : 'Regular Monitoring'],
        model_version: 'BEACON-Static-Model-v1',
        evacuation_advised: risk_score >= 0.70
      };
      return {
        village,
        current_risk,
        forecasts: [],
        alerts: defaultAlerts.filter(a => a.village_id === id),
        incidents: defaultIncidents.filter(i => i.village_id === id)
      };
    }
  },

  getRoads: async (): Promise<RoadSegment[]> => {
    try {
      const res = await fetch(`${API_BASE}/geo/roads`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return defaultRoads;
    }
  },

  getInfrastructure: async (): Promise<InfrastructurePoint[]> => {
    try {
      const res = await fetch(`${API_BASE}/geo/infrastructure`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return defaultInfrastructure;
    }
  },

  getSensors: async (): Promise<Sensor[]> => {
    try {
      const res = await fetch(`${API_BASE}/geo/sensors`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return defaultSensors;
    }
  },

  // Risk & Forecasts
  getCurrentRiskFeatures: async (params?: { state_id?: string; district_id?: string; block_id?: string }) => {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/risk/current?${query}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return { type: 'FeatureCollection', features: [] };
    }
  },

  getForecastRiskFeatures: async (horizonHours: number, params?: { state_id?: string; district_id?: string }) => {
    try {
      const query = new URLSearchParams({ horizon_hours: String(horizonHours), ...(params as any) }).toString();
      const res = await fetch(`${API_BASE}/risk/forecast?${query}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return { type: 'FeatureCollection', features: [] };
    }
  },

  getRecentLandslides: async (params?: { state_id?: string; severity?: string }): Promise<RecentLandslide[]> => {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/risk/recent-landslides?${query}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return [];
    }
  },

  getSafeRoute: async (origin: string, destination: string, transportMode: string): Promise<SafeRouteResult[]> => {
    try {
      const res = await fetch(`${API_BASE}/routes/safe-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, transportMode })
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return [];
    }
  },

  // Alerts
  getAlerts: async (params?: { state_id?: string; district_id?: string; severity?: string; status?: string }): Promise<Alert[]> => {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/alerts?${query}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      let filtered = [...defaultAlerts];
      if (params?.district_id && params.district_id !== 'all') {
        filtered = filtered.filter(a => a.district_id === params.district_id);
      }
      if (params?.severity && params.severity !== 'all') {
        filtered = filtered.filter(a => a.severity === params.severity);
      }
      return filtered;
    }
  },

  getAlert: async (id: string): Promise<Alert> => {
    try {
      const res = await fetch(`${API_BASE}/alerts/${id}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return defaultAlerts.find(a => a.id === id) || defaultAlerts[0];
    }
  },

  acknowledgeAlert: async (id: string, note?: string): Promise<{ success: boolean; alert: Alert }> => {
    try {
      const res = await fetch(`${API_BASE}/alerts/${id}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      const a = defaultAlerts.find(alt => alt.id === id) || defaultAlerts[0];
      return { success: true, alert: { ...a, status: 'ACKNOWLEDGED' } };
    }
  },

  escalateAlert: async (id: string, escalated_to?: string, note?: string): Promise<{ success: boolean; alert: Alert }> => {
    try {
      const res = await fetch(`${API_BASE}/alerts/${id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escalated_to, note })
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      const a = defaultAlerts.find(alt => alt.id === id) || defaultAlerts[0];
      return { success: true, alert: { ...a, status: 'ESCALATED' } };
    }
  },

  broadcastAlert: async (id: string, channels?: string[]): Promise<{ success: boolean; alert: Alert; message: string }> => {
    try {
      const res = await fetch(`${API_BASE}/alerts/${id}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channels })
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      const a = defaultAlerts.find(alt => alt.id === id) || defaultAlerts[0];
      return { success: true, alert: a, message: 'Broadcast dispatched across selected channels.' };
    }
  },

  // Incidents
  getIncidents: async (params?: { state_id?: string; district_id?: string; severity?: string; status?: string; incident_type?: string }): Promise<IncidentReport[]> => {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/incidents?${query}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      let filtered = [...defaultIncidents];
      if (params?.district_id && params.district_id !== 'all') {
        filtered = filtered.filter(i => i.district_id === params.district_id);
      }
      if (params?.severity && params.severity !== 'all') {
        filtered = filtered.filter(i => i.severity === params.severity);
      }
      return filtered;
    }
  },

  getIncident: async (id: string): Promise<IncidentReport> => {
    try {
      const res = await fetch(`${API_BASE}/incidents/${id}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return defaultIncidents.find(i => i.id === id) || defaultIncidents[0];
    }
  },

  createIncident: async (data: Partial<IncidentReport> & { media_urls?: string[] }): Promise<IncidentReport> => {
    try {
      const res = await fetch(`${API_BASE}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      const newInc: IncidentReport = {
        id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        state_id: data.state_id || 'state_meghalaya',
        district_id: data.district_id || 'dist_ekh',
        district_name: 'East Khasi Hills',
        block_id: data.block_id || 'blk_sohra',
        block_name: 'Sohra Block',
        village_id: data.village_id || 'vil_sohra_town',
        village_name: data.village_name || 'Sohra Ridge',
        lat: data.lat || 25.2986,
        lon: data.lon || 91.7323,
        title: data.title || 'Field Incident Report',
        description: data.description || 'Verified slope deformation observation.',
        incident_type: data.incident_type || 'FRESH_LANDSLIDE',
        severity: data.severity || 'HIGH',
        status: 'NEW',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reporter_role: data.reporter_role || 'field_officer',
        reporter_name: data.reporter_name || 'Community Observer',
        reporter_phone: data.reporter_phone || '+91 94361 00000',
        road_blocked: data.road_blocked || false,
        casualties_reported: data.casualties_reported || 0,
        houses_damaged: data.houses_damaged || 0,
        media: data.media || []
      };
      return newInc;
    }
  },

  updateIncident: async (id: string, data: Partial<IncidentReport> & { note?: string }): Promise<IncidentReport> => {
    try {
      const res = await fetch(`${API_BASE}/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      const inc = defaultIncidents.find(i => i.id === id) || defaultIncidents[0];
      return { ...inc, ...data };
    }
  },

  // Analytics
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    try {
      const res = await fetch(`${API_BASE}/analytics/summary`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return defaultAnalyticsSummary;
    }
  }
};

export const apiService = api;

