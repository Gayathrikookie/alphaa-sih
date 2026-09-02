import express from 'express';
import path from 'path';
import fs from 'fs';

import {
  initialStates,
  initialDistricts,
  initialBlocks,
  villages,
  roads,
  infrastructure,
  sensors,
  recentLandslides,
  alerts,
  incidents,
  initialUsers,
  currentUser,
  computeRiskForVillage,
  computeForecastsForVillage,
  calculateSafeRoute,
  simulateHeavyRainCloudburst,
  resetSimulationBaseline,
  getAnalyticsSummary
} from './server/db.ts';
import { Alert, IncidentReport, User } from './src/types.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // In-memory active session user
  let activeUser: User = { ...currentUser };

  // ===================== HEALTH CHECKS (Cloud Run & Proxy Probes) =====================
  const healthResponse = (req: express.Request, res: express.Response) => {
    res.status(200).json({
      status: 'HEALTHY',
      service: 'BEACON — Landslide Early Warning, Assessment, Communication and Observation Network',
      version: '3.2.0-AI',
      timestamp: new Date().toISOString(),
      region: 'North Eastern Region (Meghalaya, Assam, Sikkim, Arunachal Pradesh)'
    });
  };

  app.get('/api/health', healthResponse);
  app.get('/health', healthResponse);
  app.get('/healthz', healthResponse);

  // ===================== AUTH & USERS =====================
  app.post('/api/auth/login', (req, res) => {
    const { email, role, password } = req.body;
    let found = initialUsers.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!found && role) {
      found = initialUsers.find(u => u.role === role);
    }
    if (!found) {
      found = initialUsers[0];
    }
    activeUser = { ...found };
    res.json({
      user: activeUser,
      token: `jwt_beacon_token_${activeUser.id}_${Date.now()}`
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, role, organization, designation, department, state_id, district_id, preferred_language } = req.body;
    
    // Generate initials
    const parts = (name || 'User').trim().split(/\s+/);
    const initials = parts.length > 1 
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : (name || 'US').slice(0, 2).toUpperCase();

    const matchedDistrict = initialDistricts.find(d => d.id === district_id);
    const matchedState = initialStates.find(s => s.id === state_id);

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name || 'Authorized Officer',
      email: email || `user_${Date.now()}@beacon.gov.in`,
      phone: phone || '+91-98765-43210',
      role: role || 'field_officer',
      organization: organization || 'District Administration',
      designation: designation || 'Disaster Response Officer',
      department: department || 'Emergency Services Cell',
      allowed_regions: district_id ? [district_id] : (state_id ? [state_id] : ['dist_ekh']),
      state_id: state_id || 'state_meghalaya',
      state_name: matchedState?.name || 'Meghalaya',
      district_id: district_id || 'dist_ekh',
      district_name: matchedDistrict?.name || 'East Khasi Hills',
      preferred_language: preferred_language || 'en',
      avatar_initials: initials,
      is_verified: true,
      registered_at: new Date().toISOString(),
      notifications_enabled: { email: true, sms: true, push: true, whatsapp: true }
    };

    initialUsers.push(newUser);
    activeUser = newUser;
    res.json({ user: newUser, token: `jwt_beacon_${newUser.id}` });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  app.get('/api/users/me', (req, res) => {
    res.json(activeUser);
  });

  app.patch('/api/users/me', (req, res) => {
    activeUser = { ...activeUser, ...req.body };
    if (req.body.name) {
      const parts = req.body.name.trim().split(/\s+/);
      activeUser.avatar_initials = parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : req.body.name.slice(0, 2).toUpperCase();
    }
    res.json(activeUser);
  });

  app.get('/api/users', (req, res) => {
    res.json(initialUsers);
  });

  // Switch role for quick testing
  app.post('/api/auth/switch-role', (req, res) => {
    const { role } = req.body;
    const target = initialUsers.find(u => u.role === role) || initialUsers[0];
    activeUser = { ...target };
    res.json({ user: activeUser });
  });

  // ===================== GEO & MASTER DATA =====================
  app.get('/api/geo/states', (req, res) => {
    res.json(initialStates);
  });

  app.get('/api/geo/states/:id/districts', (req, res) => {
    const stateDistricts = initialDistricts.filter(d => d.state_id === req.params.id);
    res.json(stateDistricts);
  });

  app.get('/api/geo/districts', (req, res) => {
    res.json(initialDistricts);
  });

  app.get('/api/geo/districts/:id/blocks', (req, res) => {
    const distBlocks = initialBlocks.filter(b => b.district_id === req.params.id);
    res.json(distBlocks);
  });

  app.get('/api/geo/blocks', (req, res) => {
    res.json(initialBlocks);
  });

  app.get('/api/geo/blocks/:id/villages', (req, res) => {
    const blkVillages = villages.filter(v => v.block_id === req.params.id);
    res.json(blkVillages);
  });

  app.get('/api/geo/villages', (req, res) => {
    res.json(villages);
  });

  app.get('/api/geo/villages/:id', (req, res) => {
    const v = villages.find(item => item.id === req.params.id);
    if (!v) return res.status(404).json({ error: 'Village not found' });
    const snapshot = computeRiskForVillage(v, 0);
    const forecasts = computeForecastsForVillage(v);
    const relatedAlerts = alerts.filter(a => a.village_id === v.id);
    const relatedIncidents = incidents.filter(i => i.village_id === v.id);
    res.json({
      village: v,
      current_risk: snapshot,
      forecasts,
      alerts: relatedAlerts,
      incidents: relatedIncidents
    });
  });

  app.get('/api/geo/roads', (req, res) => {
    res.json(roads);
  });

  app.get('/api/geo/infrastructure', (req, res) => {
    res.json(infrastructure);
  });

  app.get('/api/geo/sensors', (req, res) => {
    res.json(sensors);
  });

  // ===================== AI/ML RISK ENGINE =====================
  app.get('/api/risk/current', (req, res) => {
    const { district_id, block_id, state_id } = req.query;
    let filtered = villages;
    if (state_id) filtered = filtered.filter(v => v.state_id === state_id);
    if (district_id) filtered = filtered.filter(v => v.district_id === district_id);
    if (block_id) filtered = filtered.filter(v => v.block_id === block_id);

    const features = filtered.map(v => {
      const snap = computeRiskForVillage(v, 0);
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [v.lon, v.lat]
        },
        properties: {
          village_id: v.id,
          name: v.name,
          state_id: v.state_id,
          state_name: snap.state_name,
          district_id: v.district_id,
          district_name: snap.district_name,
          block_id: v.block_id,
          slope_deg: v.slope_deg,
          elevation_m: v.elevation_m,
          population: v.population,
          rainfall_24h_mm: snap.rainfall_24h_mm,
          rainfall_72h_mm: snap.rainfall_72h_mm,
          soil_moisture_pct: snap.soil_moisture_pct,
          pore_pressure_kpa: snap.pore_pressure_kpa,
          risk_score: snap.risk_score,
          risk_level: snap.risk_level,
          contributing_factors: snap.contributing_factors,
          recommended_actions: snap.recommended_actions,
          emergency_contact: v.emergency_contact,
          evacuation_center: v.evacuation_center,
          nearest_road: v.nearest_road,
          nearest_hospital: v.nearest_hospital
        }
      };
    });

    res.json({
      type: 'FeatureCollection',
      metadata: {
        generated_at: new Date().toISOString(),
        model_version: 'BEACON-v3.2-HybridML',
        total_features: features.length,
        source: 'BEACON Real-Time Multi-Hazard Engine'
      },
      features
    });
  });

  // Forecast for +6h, +24h, +48h, +72h
  app.get('/api/risk/forecast', (req, res) => {
    const horizon = Number(req.query.horizon_hours || 24);
    const { district_id, state_id } = req.query;
    let filtered = villages;
    if (state_id) filtered = filtered.filter(v => v.state_id === state_id);
    if (district_id) filtered = filtered.filter(v => v.district_id === district_id);

    const features = filtered.map(v => {
      const snap = computeRiskForVillage(v, horizon);
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [v.lon, v.lat]
        },
        properties: {
          village_id: v.id,
          name: v.name,
          horizon_hours: horizon,
          valid_time: new Date(Date.now() + horizon * 3600 * 1000).toISOString(),
          risk_score: snap.risk_score,
          risk_level: snap.risk_level,
          predicted_rainfall_mm: snap.rainfall_24h_mm,
          predicted_soil_moisture: snap.soil_moisture_pct,
          contributing_factors: snap.contributing_factors,
          confidence_pct: Math.max(70, Math.round(96 - horizon * 0.3))
        }
      };
    });

    res.json({
      type: 'FeatureCollection',
      metadata: {
        horizon_hours: horizon,
        generated_at: new Date().toISOString(),
        model_version: 'BEACON-v3.2-PredictiveML'
      },
      features
    });
  });

  // Recent Landslides History
  app.get('/api/risk/recent-landslides', (req, res) => {
    const { state_id, severity } = req.query;
    let list = recentLandslides;
    if (state_id) list = list.filter(l => l.state_id === state_id);
    if (severity) list = list.filter(l => l.severity === severity);
    res.json(list);
  });

  // Safe Route Finder
  app.post('/api/routes/safe-route', (req, res) => {
    const { origin, destination, transportMode } = req.body;
    const routes = calculateSafeRoute(origin || 'Shillong', destination || 'Cherrapunji', transportMode || 'light_vehicle');
    res.json(routes);
  });

  // ===================== DATA INGESTION APIS =====================
  app.post('/api/ingest/rainfall', (req, res) => {
    const { station_id, village_id, rainfall_mm } = req.body;
    if (village_id) {
      const target = villages.find(v => v.id === village_id);
      if (target) {
        target.current_rainfall_24h_mm = Number(rainfall_mm || 0);
      }
    }
    res.json({
      status: 'SUCCESS',
      message: `Rainfall record of ${rainfall_mm}mm ingested successfully for station/village ${station_id || village_id}.`,
      ingested_at: new Date().toISOString()
    });
  });

  app.post('/api/ingest/sensor-readings', (req, res) => {
    const { sensor_id, value, unit } = req.body;
    const sens = sensors.find(s => s.id === sensor_id);
    if (sens) {
      sens.last_reading = {
        timestamp: new Date().toISOString(),
        value: Number(value),
        unit: unit || sens.last_reading.unit,
        status: Number(value) > 100 ? 'ALERT' : 'NORMAL'
      };
    }
    res.json({ status: 'SUCCESS', message: 'Sensor telemetry parsed and saved' });
  });

  // ===================== LIVE DEMO SIMULATION =====================
  app.post('/api/simulation/heavy-rain', (req, res) => {
    const result = simulateHeavyRainCloudburst(req.body.target_village_ids);
    res.json(result);
  });

  app.post('/api/simulation/reset', (req, res) => {
    const result = resetSimulationBaseline();
    res.json({ success: true, message: 'Simulation reset to baseline.', ...result });
  });

  // ===================== ALERTS =====================
  app.get('/api/alerts', (req, res) => {
    const { district_id, state_id, severity, status } = req.query;
    let list = alerts;
    if (state_id) list = list.filter(a => a.state_id === state_id);
    if (district_id) list = list.filter(a => a.district_id === district_id);
    if (severity) list = list.filter(a => a.severity === severity);
    if (status) list = list.filter(a => a.status === status);
    res.json(list);
  });

  app.get('/api/alerts/:id', (req, res) => {
    const a = alerts.find(item => item.id === req.params.id);
    if (!a) return res.status(404).json({ error: 'Alert not found' });
    res.json(a);
  });

  app.post('/api/alerts/:id/acknowledge', (req, res) => {
    const a = alerts.find(item => item.id === req.params.id);
    if (!a) return res.status(404).json({ error: 'Alert not found' });
    a.status = 'ACKNOWLEDGED';
    a.acknowledged_by = req.body.acknowledged_by || activeUser.name;
    a.acknowledged_at = new Date().toISOString();
    if (req.body.note) {
      a.notes = a.notes || [];
      a.notes.push(req.body.note);
    }
    res.json({ success: true, alert: a });
  });

  app.post('/api/alerts/:id/escalate', (req, res) => {
    const a = alerts.find(item => item.id === req.params.id);
    if (!a) return res.status(404).json({ error: 'Alert not found' });
    a.status = 'ESCALATED';
    a.escalated_to = req.body.escalated_to || 'State Operations Center (SEOC)';
    if (req.body.note) {
      a.notes = a.notes || [];
      a.notes.push(`[ESCALATED] ${req.body.note}`);
    }
    res.json({ success: true, alert: a });
  });

  app.post('/api/alerts/:id/broadcast', (req, res) => {
    const a = alerts.find(item => item.id === req.params.id);
    if (!a) return res.status(404).json({ error: 'Alert not found' });
    a.status = 'BROADCASTED';
    a.broadcast_channels = req.body.channels || ['SMS', 'WHATSAPP', 'SIREN', 'PUSH', 'IVR'];
    res.json({ success: true, alert: a, message: `Emergency broadcast dispatched across ${a.broadcast_channels.join(', ')}.` });
  });

  app.patch('/api/alerts/:id', (req, res) => {
    const a = alerts.find(item => item.id === req.params.id);
    if (!a) return res.status(404).json({ error: 'Alert not found' });
    if (req.body.status) a.status = req.body.status;
    if (req.body.note) {
      a.notes = a.notes || [];
      a.notes.push(req.body.note);
    }
    res.json(a);
  });

  app.get('/api/users/me/alerts', (req, res) => {
    res.json(alerts.slice(0, 5));
  });

  // ===================== INCIDENTS =====================
  app.get('/api/incidents', (req, res) => {
    const { district_id, state_id, severity, status, incident_type } = req.query;
    let list = incidents;
    if (state_id) list = list.filter(i => i.state_id === state_id);
    if (district_id) list = list.filter(i => i.district_id === district_id);
    if (severity) list = list.filter(i => i.severity === severity);
    if (status) list = list.filter(i => i.status === status);
    if (incident_type) list = list.filter(i => i.incident_type === incident_type);
    res.json(list);
  });

  app.get('/api/incidents/:id', (req, res) => {
    const inc = incidents.find(item => item.id === req.params.id);
    if (!inc) return res.status(404).json({ error: 'Incident report not found' });
    res.json(inc);
  });

  app.post('/api/incidents', (req, res) => {
    const {
      title,
      description,
      severity,
      incident_type,
      lat,
      lon,
      village_id,
      village_name,
      district_id,
      state_id,
      reporter_name,
      reporter_phone,
      reporter_email,
      road_blocked,
      casualties_reported,
      houses_damaged,
      people_affected,
      media_urls
    } = req.body;

    const matchedVillage = village_id ? villages.find(v => v.id === village_id) : undefined;
    const finalDistrictId = district_id || matchedVillage?.district_id || 'dist_ekh';
    const finalDistrict = initialDistricts.find(d => d.id === finalDistrictId)?.name || 'East Khasi Hills';
    const finalStateId = state_id || matchedVillage?.state_id || 'state_meghalaya';

    const newReport: IncidentReport = {
      id: `INC-2026-0${Math.floor(Math.random() * 800) + 150}`,
      reporter_name: reporter_name || activeUser.name || 'Citizen Reporter',
      reporter_phone: reporter_phone || activeUser.phone,
      reporter_email: reporter_email || activeUser.email,
      reporter_role: activeUser.role || 'public_user',
      incident_type: incident_type || 'FRESH_LANDSLIDE',
      state_id: finalStateId,
      district_id: finalDistrictId,
      district_name: finalDistrict,
      block_id: matchedVillage?.block_id,
      block_name: initialBlocks.find(b => b.id === matchedVillage?.block_id)?.name || 'Sohra Block',
      village_id: matchedVillage?.id,
      village_name: village_name || matchedVillage?.name || 'Unmapped Location',
      lat: Number(lat || matchedVillage?.lat || 25.289),
      lon: Number(lon || matchedVillage?.lon || 91.725),
      title: title || 'Field Landslide Observation',
      description: description || 'Reported landslide incident',
      severity: severity || 'MEDIUM',
      status: 'NEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      media: Array.isArray(media_urls) && media_urls.length > 0 
        ? media_urls.map((url: string, idx: number) => ({
            id: `med_${Date.now()}_${idx}`,
            media_type: 'IMAGE',
            url,
            caption: 'Geo-tagged field photo',
            uploaded_at: new Date().toISOString()
          }))
        : [
            {
              id: `med_${Date.now()}`,
              media_type: 'IMAGE',
              url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80',
              caption: 'Crowdsourced field photo',
              uploaded_at: new Date().toISOString()
            }
          ],
      road_blocked: Boolean(road_blocked),
      casualties_reported: Number(casualties_reported || 0),
      houses_damaged: Number(houses_damaged || 0),
      people_affected: Number(people_affected || 0),
      internal_notes: ['Awaiting verification from nearest Field Inspector'],
      source: activeUser.role === 'public_user' ? 'CITIZEN' : 'FIELD_OFFICER',
      is_verified: false
    };

    incidents.unshift(newReport);
    res.status(201).json(newReport);
  });

  app.patch('/api/incidents/:id', (req, res) => {
    const inc = incidents.find(item => item.id === req.params.id);
    if (!inc) return res.status(404).json({ error: 'Incident not found' });
    if (req.body.status) inc.status = req.body.status;
    if (req.body.severity) inc.severity = req.body.severity;
    if (req.body.officer_assigned) inc.officer_assigned = req.body.officer_assigned;
    if (req.body.assigned_team) inc.assigned_team = req.body.assigned_team;
    if (req.body.is_verified !== undefined) inc.is_verified = req.body.is_verified;
    if (req.body.note) {
      inc.internal_notes = inc.internal_notes || [];
      inc.internal_notes.push(req.body.note);
    }
    inc.updated_at = new Date().toISOString();
    res.json(inc);
  });

  app.post('/api/incidents/:id/media', (req, res) => {
    const inc = incidents.find(item => item.id === req.params.id);
    if (!inc) return res.status(404).json({ error: 'Incident not found' });
    const { url, caption, media_type } = req.body;
    inc.media.push({
      id: `med_${Date.now()}`,
      media_type: media_type || 'IMAGE',
      url: url || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      caption: caption || 'Attached incident media',
      uploaded_at: new Date().toISOString()
    });
    res.json(inc);
  });

  // ===================== ANALYTICS =====================
  app.get('/api/analytics/summary', (req, res) => {
    res.json(getAnalyticsSummary());
  });

  app.get('/api/analytics/risk-distribution', (req, res) => {
    const summary = getAnalyticsSummary();
    res.json(summary.risk_distribution);
  });

  // ===================== VITE MIDDLEWARE / SPA SERVING =====================
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('[BEACON] Vite dev server failed to initialize, falling back to static build:', err);
    }
  }

  // Static files handling in production or fallback
  const possibleDistPaths = [
    path.join(process.cwd(), 'dist'),
    path.resolve(process.cwd(), 'dist')
  ];

  const distPath = possibleDistPaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || path.join(process.cwd(), 'dist');

  app.use(express.static(distPath));

  // Express 4 catch-all route for SPA client routing
  app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(200).send(`<!DOCTYPE html><html><head><title>BEACON</title></head><body style="background:#0f172a;color:#f8fafc;font-family:sans-serif;padding:40px;text-align:center;"><h2>BEACON — Landslide Early Warning, Assessment, Communication and Observation Network</h2><p>Initializing service...</p></body></html>`);
    }
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BEACON Backend] Disaster Early Warning Server running on http://0.0.0.0:${PORT}`);
  });

  process.on('SIGTERM', () => {
    console.log('[BEACON] SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('[BEACON] HTTP server closed');
      process.exit(0);
    });
  });
}

startServer();
