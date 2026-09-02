import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  ClipboardList,
  FilePlus2,
  BarChart3,
  User,
  Globe,
  Navigation,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { Language, translations } from '../../i18n/translations.ts';

export type NavTab = 'dashboard' | 'map' | 'alerts' | 'incidents' | 'report' | 'safe-routes' | 'analytics' | 'landing' | 'profile';

interface SidebarProps {
  currentTab: NavTab;
  onTabSelect: (tab: NavTab) => void;
  activeLanguage: Language;
  unreadAlertsCount: number;
  openIncidentsCount: number;
  portalMode?: 'government' | 'public';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabSelect,
  activeLanguage,
  unreadAlertsCount,
  openIncidentsCount,
  portalMode = 'government'
}) => {
  const t = translations[activeLanguage] || translations.en;

  const govNavItems = [
    { id: 'dashboard' as NavTab, label: t.dashboard, icon: LayoutDashboard, badge: null },
    { id: 'map' as NavTab, label: t.riskMap, icon: MapPin, badge: 'Live GIS' },
    { id: 'alerts' as NavTab, label: t.alerts, icon: AlertTriangle, badge: unreadAlertsCount > 0 ? unreadAlertsCount.toString() : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'incidents' as NavTab, label: t.incidents, icon: ClipboardList, badge: openIncidentsCount > 0 ? openIncidentsCount.toString() : null, badgeColor: 'bg-amber-500 text-slate-900' },
    { id: 'safe-routes' as NavTab, label: t.safeRoutes, icon: Navigation, badge: 'Rescue' },
    { id: 'report' as NavTab, label: t.reportIncident, icon: FilePlus2, badge: 'Crowd' },
    { id: 'analytics' as NavTab, label: t.analytics, icon: BarChart3, badge: null },
    { id: 'landing' as NavTab, label: t.publicPortal, icon: Globe, badge: 'Public' },
    { id: 'profile' as NavTab, label: t.profile, icon: User, badge: null }
  ];

  const publicNavItems = [
    { id: 'landing' as NavTab, label: t.publicPortal, icon: Globe, badge: 'Safety' },
    { id: 'map' as NavTab, label: t.riskMap, icon: MapPin, badge: 'Live Map' },
    { id: 'safe-routes' as NavTab, label: t.safeRoutes, icon: Navigation, badge: 'Routes' },
    { id: 'report' as NavTab, label: t.reportIncident, icon: FilePlus2, badge: 'Report' },
    { id: 'dashboard' as NavTab, label: t.governmentPortal, icon: LayoutDashboard, badge: 'Gov' },
    { id: 'profile' as NavTab, label: t.profile, icon: User, badge: null }
  ];

  const items = portalMode === 'public' ? publicNavItems : govNavItems;

  return (
    <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0">
      {/* Navigation List */}
      <div className="p-3 space-y-1 overflow-y-auto flex-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>{portalMode === 'public' ? 'Public Safety Network' : 'Disaster Operations Hub'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-900/40 border border-rose-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-cyan-400 border border-slate-700')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-3 m-3 bg-slate-950/70 border border-slate-800/90 rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px] flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            BEACON AI Sensors
          </span>
          <span className="text-emerald-400 font-bold text-[10px]">98.2% LIVE</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>IMD Cloudburst Radar</span>
          <span className="text-slate-300 font-semibold">Active</span>
        </div>
        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <span>CAP v1.2 Protocol</span>
          <span>SRID 4326 PostGIS</span>
        </div>
      </div>
    </aside>
  );
};
