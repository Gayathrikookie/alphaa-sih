import React from 'react';
import {
  X,
  AlertTriangle,
  CloudRain,
  Activity,
  Mountain,
  Layers,
  MapPin,
  PhoneCall,
  Home,
  CheckCircle2,
  Share2,
  Compass,
  TrendingUp,
  FileWarning
} from 'lucide-react';
import { Village, RiskSnapshot, Alert, IncidentReport } from '../../types.ts';
import { Language, translations } from '../../i18n/translations.ts';

interface VillageDetailsDrawerProps {
  village: Village | null;
  riskSnapshot: RiskSnapshot | null;
  relatedAlerts: Alert[];
  relatedIncidents: IncidentReport[];
  onClose: () => void;
  activeLanguage: Language;
  onAcknowledgeAlert?: (alertId: string) => void;
  onOpenReportModal?: (village: Village) => void;
}

export const VillageDetailsDrawer: React.FC<VillageDetailsDrawerProps> = ({
  village,
  riskSnapshot,
  relatedAlerts,
  relatedIncidents,
  onClose,
  activeLanguage,
  onAcknowledgeAlert,
  onOpenReportModal
}) => {
  if (!village) return null;

  const t = translations[activeLanguage];
  const rawRiskLevel = riskSnapshot?.risk_level || 'LOW';
  const displayLevel = rawRiskLevel === 'CRITICAL' ? 'CRITICAL' : rawRiskLevel === 'LOW' ? 'LOW' : 'MEDIUM';

  const riskBadgeStyles: Record<string, string> = {
    CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    HIGH: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    MODERATE: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase border ${
                riskBadgeStyles[displayLevel] || riskBadgeStyles.LOW
              }`}
            >
              {displayLevel} RISK • SCORE {((riskSnapshot?.risk_score ?? 0) * 100).toFixed(0)}%
            </span>
            <span className="text-xs text-slate-400">Pop: {village.population.toLocaleString()}</span>
          </div>
          <h2 className="text-lg font-bold text-white leading-tight">{village.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" />
            Lat {village.lat.toFixed(4)}°, Lon {village.lon.toFixed(4)}° • Elev {village.elevation_m}m
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Real-time Dynamic AI Multi-Factor Matrix */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-400" />
              AI Risk Parameters & Geological Diagnostics
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">v2.4-HybridML</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                24h Cumulative Rain
              </span>
              <p className="text-base font-bold text-white mt-1">
                {village.current_rainfall_24h_mm.toFixed(1)} <span className="text-xs font-normal text-slate-400">mm</span>
              </p>
              <span className="text-[10px] text-slate-500">7-Day Total: {village.rainfall_7d_total_mm.toFixed(1)}mm</span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Slope Gradient
              </span>
              <p className="text-base font-bold text-white mt-1">
                {village.slope_deg.toFixed(1)}° <span className="text-xs font-normal text-slate-400">angle</span>
              </p>
              <span className="text-[10px] text-amber-400/80 font-medium">Critical Threshold: &gt;35°</span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Soil Saturation %
              </span>
              <p className="text-base font-bold text-white mt-1">
                {village.soil_moisture_pct.toFixed(1)}% <span className="text-xs font-normal text-slate-400">VWC</span>
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full ${village.soil_moisture_pct > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${village.soil_moisture_pct}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                Inclinometer Tilt
              </span>
              <p className="text-base font-bold text-white mt-1">
                {village.tilt_rate_deg_day.toFixed(2)} <span className="text-xs font-normal text-slate-400">°/day</span>
              </p>
              <span className="text-[10px] text-rose-400/90 font-medium">
                {village.tilt_rate_deg_day > 0.2 ? '⚠️ Ground Creep Detected' : 'Stable'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
            <p className="text-slate-400">
              <span className="text-slate-300 font-semibold">Lithology:</span> {village.lithology}
            </p>
            <p className="text-slate-400">
              <span className="text-slate-300 font-semibold">Soil Type:</span> {village.soil_type}
            </p>
          </div>
        </div>

        {/* Contributing AI Risk Factors */}
        {riskSnapshot?.contributing_factors && riskSnapshot.contributing_factors.length > 0 && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Primary Hazard Drivers
            </h3>
            <ul className="space-y-1.5">
              {riskSnapshot.contributing_factors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actionable SOP Recommendations */}
        {riskSnapshot?.recommended_actions && riskSnapshot.recommended_actions.length > 0 && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Standard Operating Procedure (SOP) Actions
            </h3>
            <div className="space-y-1.5">
              {riskSnapshot.recommended_actions.map((act, i) => (
                <div key={i} className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 text-xs flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">{i + 1}.</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Shelter & Contacts */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Home className="w-4 h-4 text-amber-400" />
            Designated Evacuation & Relief Post
          </h3>
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-1">
            <p className="font-semibold text-amber-200 text-xs">{village.evacuation_center || 'District Community Relief Center'}</p>
            <p className="text-[11px] text-amber-300/80 flex items-center gap-1">
              <PhoneCall className="w-3 h-3" />
              {village.emergency_contact || '1077 (District Emergency Control Room)'}
            </p>
          </div>
        </div>

        {/* Related Active Alerts */}
        {relatedAlerts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileWarning className="w-4 h-4 text-rose-400" />
              Active Bulletins for this Location ({relatedAlerts.length})
            </h3>
            {relatedAlerts.map(alt => (
              <div key={alt.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-400 uppercase bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                    {alt.severity}
                  </span>
                  <span className="text-[10px] text-slate-400">{new Date(alt.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="font-medium text-slate-200">{alt.title}</p>
                <p className="text-[11px] text-slate-400">{alt.description}</p>
                {alt.status === 'NEW' && onAcknowledgeAlert && (
                  <button
                    onClick={() => onAcknowledgeAlert(alt.id)}
                    className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs transition"
                  >
                    Acknowledge & Confirm Reception
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        {onOpenReportModal && (
          <button
            onClick={() => onOpenReportModal(village)}
            className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-rose-900/30"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Submit Geo-Report for {village.name}</span>
          </button>
        )}
      </div>
    </div>
  );
};
