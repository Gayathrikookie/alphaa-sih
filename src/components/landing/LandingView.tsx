import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  PhoneCall,
  Search,
  Home,
  CheckCircle2,
  AlertTriangle,
  FilePlus2,
  ArrowRight,
  Info,
  Radio,
  ExternalLink,
  ChevronRight,
  Navigation,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';
import { Village, Alert, InfrastructurePoint } from '../../types.ts';
import { Language, translations } from '../../i18n/translations.ts';

interface LandingViewProps {
  villages: Village[];
  alerts: Alert[];
  infrastructure: InfrastructurePoint[];
  activeLanguage: Language;
  onNavigateToMap: (villageId?: string) => void;
  onNavigateToReport: () => void;
  onNavigateToSafeRoutes?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  villages,
  alerts,
  infrastructure,
  activeLanguage,
  onNavigateToMap,
  onNavigateToReport,
  onNavigateToSafeRoutes
}) => {
  const t = translations[activeLanguage] || translations.en;
  const [searchVillage, setSearchVillage] = useState<string>('');

  const searchedVillage = villages.find(v =>
    v.name.toLowerCase().includes(searchVillage.toLowerCase().trim())
  );

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
  const reliefShelters = infrastructure.filter(inf => inf.type === 'SHELTER');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Public Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold border border-rose-500/30">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>BEACON Citizen Safety & Early Warning Network</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            BEACON Public Safety Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            {t.appFullName}. Providing real-time slope hazard monitoring, rainfall alerts, safe evacuation corridors, and crowdsourced reporting across Meghalaya, Assam, Sikkim, and the North Eastern Region.
          </p>
        </div>

        {/* Citizen Search Your Village Hazard Status */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Check Landslide Safety Status for Your Locality / Village
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Type village name (e.g., Sohra, Nohkalikai, Mawsynram, Nongstoin, Haflong)..."
                value={searchVillage}
                onChange={(e) => setSearchVillage(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <button
              onClick={() => onNavigateToMap(searchedVillage?.id)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
            >
              <span>Inspect Safety Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {searchVillage && searchedVillage && (
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs flex items-center justify-between animate-in fade-in">
              <div className="space-y-0.5">
                <span className="font-bold text-white text-sm">{searchedVillage.name}</span>
                <p className="text-slate-400">
                  24h Rain: <b>{searchedVillage.current_rainfall_24h_mm} mm</b> • Soil Moisture: <b>{searchedVillage.soil_moisture_pct}%</b>
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  searchedVillage.current_rainfall_24h_mm > 150 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {searchedVillage.current_rainfall_24h_mm > 150 ? 'CRITICAL EVACUATION WARNING' : 'NORMAL / MONITORING'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Helpline & Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-rose-900/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">State Emergency Operations (SEOC)</span>
            <p className="text-xl font-black text-rose-400">1070 / 1077</p>
            <span className="text-[10px] text-slate-500">24x7 National & State Dispatch</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-900/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Safe Route Finder</span>
            {onNavigateToSafeRoutes ? (
              <button
                onClick={onNavigateToSafeRoutes}
                className="text-sm font-bold text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
              >
                Plan Safe Evacuation <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <p className="text-sm font-bold text-emerald-400 mt-0.5">Active Avoidance Engine</p>
            )}
            <span className="text-[10px] text-slate-500">Avoid active landslide blockages</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-cyan-900/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
            <FilePlus2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Report Field Observation</span>
            <button
              onClick={onNavigateToReport}
              className="text-sm font-bold text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
            >
              Submit Photo Report <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-500">Geo-Tagged Citizen Reporting</span>
          </div>
        </div>
      </div>

      {/* Safety Advisories & Evacuation Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Do's & Don'ts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Monsoon Landslide Safety Guidelines (Do's & Don'ts)
          </h2>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Listen for unusual sounds like trees cracking, rushing water, or boulders knocking together.</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Watch for new tension cracks appearing in plaster, tile, brick, retaining walls, or foundations.</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Do not remain in valley floors or near steep hill cuts during heavy continuous rainfall (&gt;100mm/24h).</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Do not drive across flooded mountain culverts or roads showing asphalt subsidence and debris.</span>
            </div>
          </div>
        </div>

        {/* Designated Shelters in NER */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-amber-400" />
            Designated Community Relief Shelters
          </h2>
          <div className="space-y-2.5 text-xs">
            {reliefShelters.map((shelter) => (
              <div key={shelter.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-200">{shelter.name}</h3>
                  <p className="text-[11px] text-slate-400">Capacity: <b>{shelter.capacity} persons</b> • Contact: {shelter.contact}</p>
                </div>
                <button
                  onClick={() => onNavigateToMap()}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold"
                >
                  Locate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
