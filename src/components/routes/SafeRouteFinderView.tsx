import React, { useState, useEffect } from 'react';
import {
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Truck,
  Car,
  HeartPulse,
  Footprints,
  PhoneCall,
  Home,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  CloudRain
} from 'lucide-react';
import { SafeRouteResult, RoadSegment } from '../../types.ts';
import { Language, translations } from '../../i18n/translations.ts';
import { api } from '../../services/api.ts';

interface SafeRouteFinderProps {
  activeLanguage: Language;
  onNavigateToMap?: () => void;
}

export const SafeRouteFinderView: React.FC<SafeRouteFinderProps> = ({
  activeLanguage,
  onNavigateToMap
}) => {
  const t = translations[activeLanguage] || translations.en;

  const [origin, setOrigin] = useState('Shillong Bypass / City Center');
  const [destination, setDestination] = useState('Cherrapunji (Sohra Rim)');
  const [transportMode, setTransportMode] = useState<'light_vehicle' | 'heavy_truck' | 'ambulance' | 'pedestrian'>('ambulance');
  const [routes, setRoutes] = useState<SafeRouteResult[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const predefinedCorridors = [
    { origin: 'Shillong (East Khasi Hills)', dest: 'Cherrapunji (Sohra Rim)', label: 'Shillong ➔ Sohra Escarpment Corridor' },
    { origin: 'Shillong City', dest: 'Mawsynram Valley', label: 'Shillong ➔ Mawsynram Valley Slopes' },
    { origin: 'Shillong Peak', dest: 'Dawki - Umngot Gorge', label: 'Shillong ➔ Dawki International Border' },
    { origin: 'Guwahati (Kamrup Metro)', dest: 'Haflong (Dima Hasao)', label: 'Guwahati ➔ Haflong Hills Route' },
    { origin: 'Sevoke Bridge', dest: 'Gangtok (East Sikkim)', label: 'NH-10 Sevoke ➔ Gangtok Corridor' }
  ];

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSafeRoute(origin, destination, transportMode);
      setRoutes(data);
      setSelectedRouteIndex(0);
    } catch (err) {
      console.error('Failed to calculate safe routes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [origin, destination, transportMode]);

  const activeRoute = routes[selectedRouteIndex] || routes[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Navigation className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {t.safeRoutes}
              </h1>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                NDRF / SDRF & Citizen Navigation
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Real-time dynamic route optimizer avoiding active landslide zones, cliff scarps, cut failures, and blocked national highways in the North Eastern Region.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRoutes}
              disabled={isLoading}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isLoading ? 'Recomputing...' : 'Refresh Route Risk'}</span>
            </button>
            {onNavigateToMap && (
              <button
                onClick={onNavigateToMap}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on GIS Map</span>
              </button>
            )}
          </div>
        </div>

        {/* Corridor Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
            Quick Corridors:
          </span>
          {predefinedCorridors.map((c, i) => (
            <button
              key={i}
              onClick={() => {
                setOrigin(c.origin);
                setDestination(c.dest);
              }}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Query Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Origin Point / Hub</span>
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            placeholder="Enter starting location..."
          />
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Destination / Target Shelter</span>
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            placeholder="Enter destination village or shelter..."
          />
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transport & Mission Profile</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'ambulance', label: 'Emergency', icon: HeartPulse },
              { id: 'heavy_truck', label: 'Heavy/JCB', icon: Truck },
              { id: 'light_vehicle', label: 'Light 4x4', icon: Car },
              { id: 'pedestrian', label: 'Evac Foot', icon: Footprints }
            ].map(m => {
              const Icon = m.icon;
              const isSelected = transportMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setTransportMode(m.id as any)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg text-[10px] font-bold transition border ${
                    isSelected
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Route Options Selector */}
      {routes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((r, idx) => {
            const isSelected = selectedRouteIndex === idx;
            const isSafe = r.type === 'SAFEST';
            return (
              <div
                key={r.route_id}
                onClick={() => setSelectedRouteIndex(idx)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? isSafe
                      ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-500/50'
                      : 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-amber-500 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        isSafe ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {isSafe ? 'RECOMMENDED SAFE CORRIDOR' : 'DIRECT MOUNTAIN HIGHWAY'}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Selection
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                      {r.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-white tracking-tight">{r.distance_km} km</p>
                    <p className="text-xs text-slate-400 flex items-center justify-end gap-1 font-medium">
                      <Clock className="w-3 h-3" /> ~{r.est_duration_mins} mins
                    </p>
                  </div>
                </div>

                {/* Key Metrics Chips */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Safety Rating</span>
                    <span className={`font-bold ${isSafe ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {r.overall_safety_rating.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Hazards on Path</span>
                    <span className={`font-bold ${r.hazard_points_count === 0 ? 'text-emerald-400' : r.hazard_points_count > 2 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {r.hazard_points_count} Warning Points
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Blockages Avoided</span>
                    <span className="font-bold text-cyan-400">
                      {r.blockages_avoided} Active Slides
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Route Detailed Breakdown */}
      {activeRoute && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Segment by Segment Journey */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
                <span>Detailed Corridor Navigation Leg ({activeRoute.segments.length} Waypoints)</span>
                <span className="text-xs text-slate-500 font-normal">Updated via Geotechnical Sensors</span>
              </h3>

              <div className="space-y-3">
                {activeRoute.segments.map((seg, idx) => {
                  const isClear = seg.status === 'CLEAR';
                  const isCaution = seg.status === 'CAUTION';
                  const isBlocked = seg.status === 'BLOCKED';

                  return (
                    <div
                      key={idx}
                      className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center border border-slate-700">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {seg.from} ➔ {seg.to}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isClear ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            isCaution ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {seg.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{seg.road_name}</p>
                        {seg.warning_message && (
                          <p className="text-xs text-amber-300/90 font-medium flex items-center gap-1.5 mt-1">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>{seg.warning_message}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-right text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Rain Intensity</span>
                          <span className="font-semibold text-slate-300 flex items-center justify-end gap-1">
                            <CloudRain className="w-3 h-3 text-cyan-400" /> {seg.rainfall_intensity_mm} mm
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Stability</span>
                          <span className={`font-bold ${seg.slope_stability_index > 0.7 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {Math.round(seg.slope_stability_index * 100)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Est. Time</span>
                          <span className="font-bold text-white">{seg.est_time_mins} min</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side Panel: Designated Shelters & Emergency Numbers along Path */}
          <div className="space-y-4">
            {/* Safe Shelters */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Home className="w-4 h-4 text-emerald-400" />
                <span>Designated Evacuation Shelters</span>
              </h3>

              {activeRoute.emergency_shelters_along_path.length === 0 ? (
                <p className="text-xs text-slate-500">No official shelters listed on this segment.</p>
              ) : (
                <div className="space-y-2">
                  {activeRoute.emergency_shelters_along_path.map((sh) => (
                    <div
                      key={sh.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{sh.name}</span>
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {sh.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{sh.district_name}</p>
                      <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                        <span>Capacity: <strong className="text-white">{sh.capacity}</strong></span>
                        <span>Occupancy: <strong className="text-amber-400">{sh.occupancy_current || 0}</strong></span>
                      </div>
                      {sh.contact && (
                        <p className="text-[11px] text-cyan-400 pt-1 flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" /> {sh.contact}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Contacts */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>Incident Response Helplines</span>
              </h3>

              <div className="space-y-2">
                {activeRoute.emergency_contacts_along_path.map((c, i) => (
                  <div
                    key={i}
                    className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{c.name}</p>
                      <p className="text-[11px] text-slate-400">{c.station}</p>
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 hover:bg-rose-500/30 transition text-xs"
                    >
                      {c.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
