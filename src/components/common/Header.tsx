import React, { useState } from 'react';
import {
  ShieldAlert,
  Bell,
  Languages,
  UserCheck,
  Radio,
  CloudRain,
  Volume2,
  VolumeX,
  RefreshCw,
  Info,
  Building2,
  Users,
  Compass,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { User, Role, Alert } from '../../types.ts';
import { Language, translations } from '../../i18n/translations.ts';

interface HeaderProps {
  user: User;
  activeLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onRoleChange: (role: Role) => void;
  portalMode: 'government' | 'public';
  onTogglePortalMode: (mode: 'government' | 'public') => void;
  alerts: Alert[];
  onOpenDocs: () => void;
  onSimulateRain: () => void;
  onResetSimulation: () => void;
  isSimulating: boolean;
  onSelectAlert: (alert: Alert) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeLanguage,
  onLanguageChange,
  onRoleChange,
  portalMode,
  onTogglePortalMode,
  alerts,
  onOpenDocs,
  onSimulateRain,
  onResetSimulation,
  isSimulating,
  onSelectAlert
}) => {
  const t = translations[activeLanguage] || translations.en;
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'NEW');
  const totalNewAlerts = alerts.filter(a => a.status === 'NEW').length;

  const roleLabels: Record<Role, { title: string; subtitle: string; org: string }> = {
    super_admin: { title: 'Super Administrator', subtitle: 'Joint Secretary (DRR Division)', org: 'MDoNER & NDMA' },
    mdoner_admin: { title: 'MDoNER Regional Officer', subtitle: 'Director (Regional Operations)', org: 'MDoNER' },
    sdma_officer: { title: 'State Disaster Director', subtitle: 'Executive Director (SDMA)', org: 'SDMA Meghalaya' },
    ddma_officer: { title: 'District Disaster Officer', subtitle: 'District Collector & Chairman DDMA', org: 'DDMA East Khasi Hills' },
    field_officer: { title: 'Field Disaster Nodal Officer', subtitle: 'Revenue & Disaster Inspector', org: 'Sub-Division (Sohra)' },
    scientist: { title: 'Earth Observation Scientist', subtitle: 'Lead Scientist (Geohazards & InSAR)', org: 'NESAC / ISRO' },
    ndrf_sdrf_officer: { title: 'Disaster Response Commander', subtitle: 'Commandant (1st Bn NDRF)', org: 'NDRF / SDRF' },
    bro_nhai_officer: { title: 'Highway Taskforce Commander', subtitle: 'Superintending Engineer', org: 'BRO Project Swastik' },
    public_user: { title: 'Citizen / Community Volunteer', subtitle: 'Village Defense Taskforce', org: 'General Public' },
    state_admin: { title: 'State Disaster Director', subtitle: 'Executive Director (SDMA)', org: 'SDMA Meghalaya' },
    district_admin: { title: 'District Disaster Officer', subtitle: 'District Collector & Chairman DDMA', org: 'DDMA East Khasi Hills' }
  };

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
      {/* Top Emergency Ticker if Critical Alerts Exist */}
      {criticalAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 px-4 py-1.5 flex items-center justify-between text-xs font-medium text-rose-100 border-b border-rose-800/80 shadow-inner">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-bold tracking-wider uppercase text-white bg-rose-950 px-2 py-0.5 rounded border border-rose-500/50">
              BEACON EMERGENCY BROADCAST
            </span>
            <div className="truncate flex items-center gap-3">
              {criticalAlerts.slice(0, 2).map((ca) => (
                <button
                  key={ca.id}
                  onClick={() => onSelectAlert(ca)}
                  className="hover:underline flex items-center gap-1.5 truncate text-rose-100 hover:text-white"
                >
                  <span className="font-semibold text-amber-300">[{ca.village_name}]</span> {ca.title}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <span className="hidden md:inline text-rose-200/80 text-[11px]">
              CAP v1.2 Protocol • NDMA / MDoNER Control Cell
            </span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute alert siren' : 'Enable alert siren'}
              className="text-rose-200 hover:text-white p-1 rounded hover:bg-rose-800/50"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-rose-300/60" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Emblem & BEACON Branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-600 via-amber-600 to-rose-700 p-0.5 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>BEACON</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded">
                  NER Network
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-md hidden sm:block">
              {t.appFullName}
            </p>
          </div>
        </div>

        {/* Portal Mode Switcher (Government vs Public) */}
        <div className="hidden md:flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => onTogglePortalMode('government')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              portalMode === 'government'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.governmentPortal}</span>
          </button>
          <button
            onClick={() => onTogglePortalMode('public')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              portalMode === 'public'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.publicPortal}</span>
          </button>
        </div>

        {/* Right Action Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SIH Fast Demo Simulation Controller */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/80">
            <button
              onClick={onSimulateRain}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition active:scale-95 disabled:opacity-50"
              title="Simulate 24h heavy monsoon cloudburst across NER districts"
            >
              <CloudRain className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>{isSimulating ? 'Simulating Cloudburst...' : 'Simulate Heavy Rain'}</span>
            </button>
            <button
              onClick={onResetSimulation}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition"
              title="Reset baseline conditions"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Architecture & AI/ML Docs Modal Trigger */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/50 rounded-lg transition"
            title="BEACON Architecture, PostGIS & Model Docs"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Architecture & Model</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowRoleMenu(false);
                setShowAlertsDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition"
            >
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase font-semibold">{activeLanguage}</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-slate-400 border-b border-slate-700">
                  Select Language / भाषा
                </div>
                {[
                  { code: 'en', name: 'English (Official)', short: 'EN' },
                  { code: 'hi', name: 'हिन्दी (Hindi)', short: 'HI' },
                  { code: 'as', name: 'অসমীয়া (Assamese)', short: 'AS' },
                  { code: 'kha', name: 'Khasi (Meghalaya)', short: 'KHA' },
                  { code: 'mni', name: 'মৈতৈলোন্ (Manipuri)', short: 'MNI' },
                  { code: 'bn', name: 'বাংলা (Bengali)', short: 'BN' }
                ].map(l => (
                  <button
                    key={l.code}
                    onClick={() => { onLanguageChange(l.code as Language); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                      activeLanguage === l.code ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    <span>{l.name}</span>
                    <span className="text-[10px] text-slate-400">{l.short}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Alerts Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAlertsDropdown(!showAlertsDropdown);
                setShowRoleMenu(false);
                setShowLangMenu(false);
              }}
              className="relative p-2 text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition"
              title="Early Warning Feed"
            >
              <Bell className="w-4 h-4" />
              {totalNewAlerts > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-pulse">
                  {totalNewAlerts}
                </span>
              )}
            </button>
            {showAlertsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Early Warning Queue</span>
                  </div>
                  <span className="text-[11px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30">
                    {alerts.length} Total
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-700/60">
                  {alerts.slice(0, 5).map((alt) => (
                    <div
                      key={alt.id}
                      onClick={() => {
                        onSelectAlert(alt);
                        setShowAlertsDropdown(false);
                      }}
                      className="p-3 hover:bg-slate-700/50 cursor-pointer transition flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          alt.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          alt.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {alt.severity}
                        </span>
                        <span className="text-[10px] text-slate-400">{alt.status}</span>
                      </div>
                      <p className="font-medium text-slate-200 leading-snug">{alt.title}</p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        📍 {alt.village_name}, {alt.district_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher Dropdown (No hardcoded names!) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowLangMenu(false);
                setShowAlertsDropdown(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-slate-800 to-slate-850 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            >
              <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 font-bold text-[10px]">
                {user.avatar_initials || 'BO'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[11px] font-semibold text-slate-200 leading-none truncate max-w-[130px]">{user.name}</p>
                <p className="text-[9px] text-rose-400 capitalize truncate max-w-[130px]">{user.designation || user.role.replace('_', ' ')}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-2 border-b border-slate-700 bg-slate-900/60">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Switch BEACON Role / Persona</p>
                  <p className="text-xs text-slate-300 mt-0.5">{user.designation}</p>
                </div>
                <div className="p-1 space-y-0.5 max-h-80 overflow-y-auto">
                  {(Object.keys(roleLabels) as Role[]).map((r) => {
                    const info = roleLabels[r];
                    const isCurrent = user.role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => { onRoleChange(r); setShowRoleMenu(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex flex-col transition ${
                          isCurrent ? 'bg-rose-600/20 text-rose-300 font-semibold border border-rose-500/30' : 'text-slate-300 hover:bg-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{info.title}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-slate-900 rounded text-slate-400">{info.org}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{info.subtitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
