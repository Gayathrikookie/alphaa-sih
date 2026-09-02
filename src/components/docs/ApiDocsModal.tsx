import React, { useState } from 'react';
import {
  X,
  Code,
  Database,
  Cpu,
  Layers,
  BookOpen,
  CheckCircle2,
  Copy,
  Terminal,
  Server,
  Zap
} from 'lucide-react';

interface ApiDocsModalProps {
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'formula' | 'apis' | 'schema'>('architecture');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">BEACON Technical Architecture & REST API Docs</h2>
              <p className="text-xs text-slate-400">Landslide Early Warning, Assessment, Communication & Observation Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 pt-2 gap-2 text-xs font-semibold">
          {[
            { id: 'architecture', label: 'System Architecture', icon: Server },
            { id: 'formula', label: 'AI Risk Engine & ML', icon: Zap },
            { id: 'apis', label: 'REST API Specification', icon: Terminal },
            { id: 'schema', label: 'Database Schema & GIS', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-sm">BEACON Four-Tier High Availability Architecture</h3>
                <p className="text-slate-300 leading-relaxed">
                  BEACON (Landslide Early Warning, Assessment, Communication and Observation Network) integrates multi-source geospatial observation data with real-time ground IoT sensors and automated Common Alerting Protocol (CAP) dispatches across the North Eastern Region.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-400">1. Data Ingestion Tier</span>
                    <p className="text-slate-400">
                      • IMD Doppler Radar Precipitation & Satellite GPM / INSAT-3D<br />
                      • IoT Field Telemetry (Inclinometers, Piezometers, Soil Probes)<br />
                      • Crowdsourced Geo-Tagged Citizen Reports (Mobile GPS & Media)
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-rose-400">2. AI & Geotechnical Analytics</span>
                    <p className="text-slate-400">
                      • Geospatial Slope Susceptibility Matrix (SRTM 30m DEM)<br />
                      • Dynamic Multi-Factor Weighted Risk Scoring Model<br />
                      • +6h to +72h Predictive Precipitation Horizon Engine
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-400">3. Multi-Channel Alerting (CAP)</span>
                    <p className="text-slate-400">
                      • OASIS CAP v1.2 Standardized XML/JSON Payloads<br />
                      • Automated SMS Cell Broadcast & Siren Triggers<br />
                      • District Disaster Officer Acknowledgment Verification
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400">4. Interactive GIS & Command</span>
                    <p className="text-slate-400">
                      • React 19 + Leaflet Topographic & Satellite GIS Layers<br />
                      • Multilingual Support (English, Hindi, Assamese, Khasi, Manipuri, Bengali)<br />
                      • Dual Portal Modes (Government Operations & Public Safety)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'formula' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-sm">BEACON Hybrid AI Risk Scoring Model</h3>
                <p className="text-slate-300 leading-relaxed">
                  The model evaluates static geotechnical susceptibility alongside real-time dynamic rainfall and IoT borehole sensor triggers:
                </p>

                <div className="p-4 bg-slate-900 rounded-xl border border-rose-500/30 text-rose-300 font-mono text-center text-sm">
                  Risk Score = 0.35 × R₂₄ + 0.25 × S_slope + 0.20 × M_soil + 0.15 × K_base + 0.05 × T_tilt
                </div>

                <div className="space-y-2 pt-2 text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">• R₂₄ (35% Weight):</span>
                    <span>Normalized 24-hour cumulative rainfall vs extreme 200mm threshold.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">• S_slope (25% Weight):</span>
                    <span>Topographic slope steepness gradient (angles &gt;35° critically weighted).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">• M_soil (20% Weight):</span>
                    <span>Volumetric water content (VWC) % from ground piezometers and moisture probes.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">• K_base (15% Weight):</span>
                    <span>Historical GSI Landslide Susceptibility Index & lithology fragility factor.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">• T_tilt (5% Weight):</span>
                    <span>IoT Inclinometer borehole angular displacement velocity (°/day).</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="space-y-3">
              {[
                { method: 'GET', path: '/api/v1/villages', desc: 'Fetch monitored settlement master data with coordinates & telemetry.' },
                { method: 'GET', path: '/api/v1/risk/current', desc: 'Compute real-time AI risk score and hazard level per village.' },
                { method: 'GET', path: '/api/v1/risk/forecast?horizon=24', desc: 'Forecasted risk level for +6h, +24h, +48h, +72h.' },
                { method: 'GET', path: '/api/v1/alerts', desc: 'Active multi-tier warning alerts formatted in CAP v1.2 schema.' },
                { method: 'POST', path: '/api/v1/alerts/:id/acknowledge', desc: 'Officer acknowledgment with operational dispatch note.' },
                { method: 'GET', path: '/api/v1/routes/safe', desc: 'Safe Route Finder avoidance engine avoiding active hazard zones.' },
                { method: 'POST', path: '/api/v1/incidents', desc: 'Submit geo-tagged field report with photo and coordinates.' },
                { method: 'POST', path: '/api/v1/simulate/heavy-rain', desc: 'Live trigger: inject 24h monsoon cloudburst data.' },
                { method: 'POST', path: '/api/v1/simulate/reset', desc: 'Reset baseline data state.' }
              ].map((api, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      api.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {api.method}
                    </span>
                    <span className="font-mono text-slate-200 text-xs truncate">{api.path}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(api.path, api.path)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition shrink-0"
                    title="Copy API Path"
                  >
                    {copiedEndpoint === api.path ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <h3 className="font-bold text-white text-sm font-sans">BEACON PostGIS Spatial Schema (SRID 4326)</h3>
              <pre className="text-slate-300 bg-slate-900 p-3 rounded-xl overflow-x-auto text-[11px] leading-relaxed border border-slate-800">
{`CREATE TABLE villages (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    district_id VARCHAR(32) REFERENCES districts(id),
    geom GEOMETRY(Point, 4326),
    elevation_m NUMERIC(6,2),
    slope_deg NUMERIC(4,2),
    susceptibility_score NUMERIC(3,2),
    soil_type VARCHAR(64)
);

CREATE TABLE incident_reports (
    id VARCHAR(32) PRIMARY KEY,
    village_id VARCHAR(32) REFERENCES villages(id),
    geom GEOMETRY(Point, 4326),
    title VARCHAR(256),
    severity VARCHAR(16),
    status VARCHAR(16),
    reporter_role VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
