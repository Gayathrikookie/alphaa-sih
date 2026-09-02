import React, { useState } from 'react';
import {
  AlertTriangle,
  Filter,
  CheckCircle2,
  Clock,
  Radio,
  Send,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Search,
  MessageSquare,
  Volume2,
  Share2,
  PhoneCall,
  Download,
  AlertOctagon,
  ArrowUpRight,
  BellRing,
  Check,
  Flame,
  CloudRain
} from 'lucide-react';
import { Alert, District, User } from '../../types.ts';
import { Language, translations } from '../../i18n/translations.ts';

interface AlertsViewProps {
  alerts: Alert[];
  districts: District[];
  user: User;
  activeLanguage: Language;
  onAcknowledgeAlert: (alertId: string, note?: string) => void;
  onNavigateToMap: (villageId?: string) => void;
  onSimulateRain?: () => void;
  isSimulating?: boolean;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  districts,
  user,
  activeLanguage,
  onAcknowledgeAlert,
  onNavigateToMap,
  onSimulateRain,
  isSimulating = false
}) => {
  const t = translations[activeLanguage];
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAlertDetail, setActiveAlertDetail] = useState<Alert | null>(alerts[0] || null);
  const [ackNote, setAckNote] = useState<string>('');
  const [broadcastModalOpen, setBroadcastModalOpen] = useState<boolean>(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['SMS', 'WHATSAPP', 'SIREN', 'PUSH', 'IVR']);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredAlerts = alerts.filter(a => {
    if (selectedDistrict !== 'all' && a.district_id !== selectedDistrict) return false;
    if (selectedSeverity !== 'all' && a.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.village_name.toLowerCase().includes(q) ||
        a.district_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const showToast = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleAcknowledge = () => {
    if (activeAlertDetail) {
      onAcknowledgeAlert(activeAlertDetail.id, ackNote);
      setActiveAlertDetail({
        ...activeAlertDetail,
        status: 'ACKNOWLEDGED',
        acknowledged_by: user.name,
        acknowledged_at: new Date().toISOString(),
        notes: ackNote ? [...(activeAlertDetail.notes || []), ackNote] : activeAlertDetail.notes
      });
      setAckNote('');
      showToast(`Bulletin #${activeAlertDetail.id} acknowledged. Incident protocols activated.`);
    }
  };

  const handleTriggerBroadcast = () => {
    if (activeAlertDetail) {
      const updatedRecipients = [
        ...activeAlertDetail.recipients,
        {
          id: `bc_${Date.now()}`,
          user_name: `All Citizens & First Responders (${activeAlertDetail.village_name})`,
          role: 'public_user' as any,
          channel: selectedChannels.join('/') as any,
          address: 'Broadband / Cellular Towers / Sirens',
          status: 'DELIVERED' as const,
          sent_at: new Date().toISOString()
        }
      ];

      setActiveAlertDetail({
        ...activeAlertDetail,
        status: 'BROADCASTED',
        broadcast_channels: selectedChannels,
        recipients: updatedRecipients
      });
      setBroadcastModalOpen(false);
      showToast(`CAP Emergency Broadcast dispatched over ${selectedChannels.join(', ')} to ${activeAlertDetail.village_name}.`);
    }
  };

  const handleEscalate = () => {
    if (activeAlertDetail) {
      const note = `[ESCALATED TO SEOC & NDRF] Requested heavy earthmoving battalion & SDRF boat squad.`;
      setActiveAlertDetail({
        ...activeAlertDetail,
        status: 'ESCALATED',
        escalated_to: 'State Emergency Operations Center (SEOC Shillong) & NDRF 1st Bn',
        notes: [...(activeAlertDetail.notes || []), note]
      });
      showToast(`Hazard Alert #${activeAlertDetail.id} escalated to State Disaster Operations Center.`);
    }
  };

  const handleExportCAP = (format: 'json' | 'xml') => {
    if (!activeAlertDetail) return;
    const content = format === 'json'
      ? JSON.stringify({
          capVersion: '1.2',
          identifier: activeAlertDetail.id,
          sender: 'BEACON-EarlyWarning-System@mdoner.gov.in',
          sent: activeAlertDetail.created_at,
          status: 'Actual',
          msgType: 'Alert',
          scope: 'Public',
          info: {
            category: 'Geo',
            event: 'Landslide Warning',
            urgency: activeAlertDetail.severity === 'CRITICAL' ? 'Immediate' : 'Expected',
            severity: activeAlertDetail.severity === 'CRITICAL' ? 'Severe' : 'Moderate',
            certainty: 'Observed',
            headline: activeAlertDetail.title,
            description: activeAlertDetail.description,
            instruction: activeAlertDetail.recommended_actions?.join(' ') || 'Follow SDMA evacuation advisories.',
            area: {
              areaDesc: `${activeAlertDetail.village_name}, ${activeAlertDetail.district_name}`,
              circle: `${activeAlertDetail.lat},${activeAlertDetail.lon},3.0`
            }
          }
        }, null, 2)
      : `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${activeAlertDetail.id}</identifier>
  <sender>BEACON-System@mdoner.gov.in</sender>
  <sent>${activeAlertDetail.created_at}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Geo</category>
    <event>Landslide Disaster Early Warning</event>
    <urgency>${activeAlertDetail.severity === 'CRITICAL' ? 'Immediate' : 'Expected'}</urgency>
    <severity>${activeAlertDetail.severity}</severity>
    <certainty>Observed</certainty>
    <headline>${activeAlertDetail.title}</headline>
    <description>${activeAlertDetail.description}</description>
    <area>
      <areaDesc>${activeAlertDetail.village_name}, ${activeAlertDetail.district_name}</areaDesc>
      <circle>${activeAlertDetail.lat},${activeAlertDetail.lon},3.0</circle>
    </area>
  </info>
</alert>`;

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CAP-v1.2-${activeAlertDetail.id}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${format.toUpperCase()} CAP v1.2 bulletin.`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom border border-emerald-400/40 text-xs font-bold">
          <Check className="w-4 h-4 text-white" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-rose-500 animate-pulse" />
            {t.alerts}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Multi-Tier Early Warning Bulletins • Common Alerting Protocol (CAP v1.2) Broadcast Matrix
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {onSimulateRain && (
            <button
              onClick={onSimulateRain}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition"
            >
              <CloudRain className="w-3.5 h-3.5 animate-bounce" />
              <span>{isSimulating ? 'Simulating Surge...' : 'Simulate Cloudburst'}</span>
            </button>
          )}

          {/* Search Box */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search settlement or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Districts</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical (Red)</option>
            <option value="HIGH">High (Orange)</option>
            <option value="MODERATE">Moderate (Yellow)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Statuses</option>
            <option value="NEW">New (Unacknowledged)</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="BROADCASTED">Broadcasted</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Alert Cards List + Right In-Depth Detail Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Alert Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredAlerts.length} Active Bulletins</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Broadcast Stream
            </span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredAlerts.map((alt) => {
              const isSelected = activeAlertDetail?.id === alt.id;
              const isCrit = alt.severity === 'CRITICAL';
              return (
                <div
                  key={alt.id}
                  onClick={() => setActiveAlertDetail(alt)}
                  className={`p-4 rounded-2xl cursor-pointer transition border text-xs space-y-2 relative ${
                    isSelected
                      ? 'bg-slate-800 border-rose-500 shadow-xl shadow-rose-950/40 ring-1 ring-rose-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isCrit ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      }`}
                    >
                      {alt.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm leading-snug">{alt.title}</h3>
                  <p className="text-slate-400 line-clamp-2 text-xs">{alt.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {alt.village_name} ({alt.district_name})
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        alt.status === 'NEW' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        alt.status === 'BROADCASTED' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        alt.status === 'ESCALATED' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {alt.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Full Alert Dossier & Action Terminal */}
        <div className="lg:col-span-7">
          {activeAlertDetail ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-2xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        activeAlertDetail.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      }`}
                    >
                      {activeAlertDetail.severity} HAZARD BULLETIN
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {activeAlertDetail.id}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white leading-tight">{activeAlertDetail.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Issued: {new Date(activeAlertDetail.created_at).toLocaleString()} • Block: {activeAlertDetail.block_name}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigateToMap(activeAlertDetail.village_id)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>View Map</span>
                  </button>

                  <button
                    onClick={() => handleExportCAP('json')}
                    title="Export Common Alerting Protocol JSON"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs transition"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>

              {/* Warning Narrative */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Hazard Assessment Narrative</h3>
                <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
                  {activeAlertDetail.description}
                </p>
              </div>

              {/* Contributing Factors */}
              {activeAlertDetail.contributing_factors && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    AI Deterministic Trigger Drivers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeAlertDetail.contributing_factors.map((f, i) => (
                      <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {activeAlertDetail.recommended_actions && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Mandated Disaster Response SOP</h3>
                  <div className="space-y-1.5">
                    {activeAlertDetail.recommended_actions.map((act, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-amber-200 flex items-start gap-2">
                        <ArrowUpRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-Channel Distribution Grid (CAP) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-cyan-400" />
                    CAP Multi-Channel Automated Broadcast Matrix
                  </h3>
                  <button
                    onClick={() => setBroadcastModalOpen(true)}
                    className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Trigger Broadcast</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {activeAlertDetail.recipients.map((rec) => (
                    <div key={rec.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 text-[11px]">{rec.channel}</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">{rec.status}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{rec.user_name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acknowledgment & Escalation Actions */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Official Acknowledgment & Dispatch SOP
                  </h3>
                  {activeAlertDetail.status !== 'NEW' && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Status: {activeAlertDetail.status}
                    </span>
                  )}
                </div>

                {activeAlertDetail.notes && activeAlertDetail.notes.length > 0 && (
                  <div className="space-y-1.5">
                    {activeAlertDetail.notes.map((n, idx) => (
                      <p key={idx} className="text-xs text-slate-300 italic bg-slate-900 p-2 rounded-lg border border-slate-800">
                        "{n}"
                      </p>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add operational dispatch note (e.g. SDRF unit deployed, Sirens sounded)..."
                    value={ackNote}
                    onChange={(e) => setAckNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={handleAcknowledge}
                      className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{activeAlertDetail.status === 'NEW' ? 'Acknowledge Bulletin' : 'Append Dispatch Note'}</span>
                    </button>

                    <button
                      onClick={handleEscalate}
                      className="py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      <span>Escalate to SEOC / NDRF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
              Select an alert from the list to view full telemetry and dispatch controls.
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Modal */}
      {broadcastModalOpen && activeAlertDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BellRing className="w-5 h-5 text-rose-500 animate-pulse" />
                <span>CAP Mass Warning Broadcast</span>
              </h2>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Disseminating priority early warning bulletin to all registered mobile devices, local siren towers, and disaster command cells for <b>{activeAlertDetail.village_name}</b>.
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">Select Active Broadcast Channels:</span>
              <div className="grid grid-cols-2 gap-2">
                {['SMS', 'WHATSAPP', 'SIREN', 'PUSH', 'IVR', 'CELL_BROADCAST'].map((ch) => {
                  const isChecked = selectedChannels.includes(ch);
                  return (
                    <label
                      key={ch}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                        isChecked ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedChannels(selectedChannels.filter(c => c !== ch));
                          } else {
                            setSelectedChannels([...selectedChannels, ch]);
                          }
                        }}
                        className="rounded accent-rose-500"
                      />
                      <span>{ch} Network</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerBroadcast}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Disseminate Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
