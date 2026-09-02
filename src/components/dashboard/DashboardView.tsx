import React from 'react';
import {
  AlertTriangle,
  CloudRain,
  ShieldAlert,
  Activity,
  Users,
  Home,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Radio,
  MapPin,
  Flame,
  Compass,
  Zap,
  Sparkles,
  Navigation,
  ExternalLink
} from 'lucide-react';
import {
  Village,
  Alert,
  IncidentReport,
  Sensor,
  AnalyticsSummary,
  User,
  RoadSegment,
  RecentLandslide
} from '../../types.ts';
import {
  defaultVillages,
  defaultAlerts,
  defaultIncidents,
  defaultSensors,
  defaultRoads,
  defaultAnalyticsSummary,
  defaultUser
} from '../../data/defaultData.ts';
import { Language, translations } from '../../i18n/translations.ts';

interface DashboardViewProps {
  summary?: AnalyticsSummary | null;
  alerts?: Alert[];
  incidents?: IncidentReport[];
  villages?: Village[];
  sensors?: Sensor[];
  roads?: RoadSegment[];
  recentLandslides?: RecentLandslide[];
  user?: User;
  activeLanguage: Language;
  onNavigateToMap: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToIncidents: () => void;
  onNavigateToReport: () => void;
  onNavigateToSafeRoutes?: () => void;
  onSelectVillage: (village: Village) => void;
  onAcknowledgeAlert?: (alertId: string) => void;
  onSimulateRain?: () => void;
  isSimulating?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary = defaultAnalyticsSummary,
  alerts = defaultAlerts,
  incidents = defaultIncidents,
  villages = defaultVillages,
  sensors = defaultSensors,
  roads = defaultRoads,
  recentLandslides = [],
  user = defaultUser,
  activeLanguage,
  onNavigateToMap,
  onNavigateToAlerts,
  onNavigateToIncidents,
  onNavigateToReport,
  onNavigateToSafeRoutes,
  onSelectVillage,
  onAcknowledgeAlert
}) => {
  const t = translations[activeLanguage] || translations.en;

  const criticalVillages = villages.filter(v => v.current_rainfall_24h_mm > 140 || v.slope_deg > 45);
  const blockedRoads = roads.filter(r => r.status === 'BLOCKED');
  const alertSensors = sensors.filter(s => s.last_reading?.status === 'ALERT');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse text-rose-400" />
              BEACON Multi-Hazard Command Hub
            </span>
            <span className="text-xs text-slate-400">North Eastern Region (NER)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {user.designation || 'Disaster Operations Officer'} • {user.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {onNavigateToSafeRoutes && (
            <button
              onClick={onNavigateToSafeRoutes}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold rounded-xl text-xs transition"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Safe Routes</span>
            </button>
          )}
          <button
            onClick={onNavigateToReport}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Submit Geo-Report</span>
          </button>
        </div>
      </div>

      {/* 4 Core Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Critical/High Risk Villages */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t.activeVillages}</span>
            <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{summary?.high_critical_villages_count ?? 4}</span>
            <span className="text-xs font-medium text-rose-400">/ {villages.length} monitored</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Critical: Sohra, Mawsynram, Laitkynsew</span>
            <button onClick={onNavigateToMap} className="text-rose-400 hover:underline flex items-center gap-0.5">
              Map <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 24h Active Early Warning Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t.newAlerts}</span>
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{summary?.new_alerts_24h ?? 2}</span>
            <span className="text-xs font-medium text-amber-400">Unacknowledged</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Multi-channel CAP broadcast active</span>
            <button onClick={onNavigateToAlerts} className="text-amber-400 hover:underline flex items-center gap-0.5">
              Alerts <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Active Field Incidents */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t.openIncidents}</span>
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{summary?.open_incidents_count ?? 3}</span>
            <span className="text-xs font-medium text-cyan-400">Active in Field</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>{blockedRoads.length} Highway blockage reported</span>
            <button onClick={onNavigateToIncidents} className="text-cyan-400 hover:underline flex items-center gap-0.5">
              Queue <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Max 24h Rainfall Peak */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t.rainfall24h}</span>
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{summary?.rainfall_max_24h_mm ?? 215}</span>
            <span className="text-xs font-medium text-blue-400">mm Peak</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate pt-1 border-t border-slate-800/80">
            📍 {summary?.rainfall_max_location ?? 'Mawsynram Valley'}
          </div>
        </div>
      </div>

      {/* Center Grid: Watchlist + Urgent Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Watchlist & Quick Hotspots */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-rose-500" />
                {t.vulnerableWatchlist}
              </h2>
              <p className="text-xs text-slate-400">Real-time ranking by rainfall accumulation, slope angle, and IoT pore water saturation</p>
            </div>
            <button
              onClick={onNavigateToMap}
              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              Open Full GIS Map <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {villages.slice(0, 4).map((v) => {
              const isCrit = v.current_rainfall_24h_mm > 150 || v.slope_deg > 45;
              return (
                <div
                  key={v.id}
                  onClick={() => onSelectVillage(v)}
                  className="p-3.5 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition flex flex-col justify-between group space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-rose-400 transition">{v.name}</h3>
                      <p className="text-[11px] text-slate-400">Elev {v.elevation_m}m • Slope {v.slope_deg}°</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCrit ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}>
                      {isCrit ? 'CRITICAL' : 'HIGH RISK'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-400">Rainfall</span>
                      <p className="font-bold text-cyan-400">{v.current_rainfall_24h_mm} mm</p>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-400">Moisture</span>
                      <p className="font-bold text-emerald-400">{v.soil_moisture_pct}%</p>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-400">Tilt Rate</span>
                      <p className="font-bold text-amber-400">{v.tilt_rate_deg_day}°/d</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Blocked Roads Alert Card */}
          {blockedRoads.length > 0 && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-xs text-red-200">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-300">Highway Obstruction Active: </span>
                <span>{blockedRoads[0].name} – {blockedRoads[0].blockage_reason}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Urgent Alerts & Ingestion Telemetry Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                Urgent Early Warning Feed
              </h2>
              <button onClick={onNavigateToAlerts} className="text-xs text-slate-400 hover:text-white">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alt) => (
                <div key={alt.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-400 text-[10px] uppercase bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30">
                      {alt.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">{new Date(alt.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="font-semibold text-slate-200 leading-snug">{alt.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{alt.description}</p>
                  
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">📍 {alt.village_name}</span>
                    {alt.status === 'NEW' ? (
                      <button
                        onClick={() => onAcknowledgeAlert(alt.id)}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[10px] transition"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IoT Telemetry Mini Widget */}
          <div className="pt-3 border-t border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Inclinometers & Piezometers
              </span>
              <span className="text-emerald-400 font-bold">{sensors.length} Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Sohra-Laitkynsew Slope 01: <b>0.28°/d</b> (Threshold Monitored)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Field Incident Reports Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Recent Field & Crowdsourced Incident Logs
            </h2>
            <p className="text-xs text-slate-400">Submitted by local field officers, revenue inspectors, and citizens</p>
          </div>
          <button
            onClick={onNavigateToIncidents}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
          >
            All Reports ({incidents.length}) <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Incident Ref</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Observation Title</th>
                <th className="pb-3 font-semibold">Severity</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Reporter</th>
                <th className="pb-3 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidents.slice(0, 4).map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-bold text-slate-300">{inc.id}</td>
                  <td className="py-3 text-slate-300 font-medium">
                    {inc.village_name}, <span className="text-slate-400">{inc.district_name}</span>
                  </td>
                  <td className="py-3 text-slate-200 max-w-xs truncate">{inc.title}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      inc.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      inc.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' :
                      inc.status === 'IN_PROGRESS' ? 'bg-cyan-500/20 text-cyan-400' :
                      inc.status === 'NEW' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{inc.reporter_name}</td>
                  <td className="py-3 text-right text-slate-500 text-[11px] font-mono">
                    {new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
