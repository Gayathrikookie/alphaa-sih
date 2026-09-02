import React, { useState } from 'react';
import {
  ClipboardList,
  Filter,
  Search,
  MapPin,
  Camera,
  AlertTriangle,
  User,
  Phone,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Shield,
  Plus,
  Check,
  X,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { IncidentReport, District, User as UserType } from '../../types.ts';
import { Language, translations } from '../../i18n/translations.ts';

interface IncidentsViewProps {
  incidents: IncidentReport[];
  districts: District[];
  user: UserType;
  activeLanguage: Language;
  onUpdateIncidentStatus: (id: string, status: IncidentReport['status'], note?: string) => void;
  onNavigateToReport: () => void;
  onNavigateToMap: (villageId?: string) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  districts,
  user,
  activeLanguage,
  onUpdateIncidentStatus,
  onNavigateToReport,
  onNavigateToMap
}) => {
  const t = translations[activeLanguage];
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeIncident, setActiveIncident] = useState<IncidentReport | null>(incidents[0] || null);
  const [updateNote, setUpdateNote] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption?: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredIncidents = incidents.filter(inc => {
    if (selectedDistrict !== 'all' && inc.district_id !== selectedDistrict) return false;
    if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && inc.status !== selectedStatus) return false;
    if (selectedType !== 'all' && inc.incident_type !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.village_name.toLowerCase().includes(q) ||
        inc.district_name.toLowerCase().includes(q) ||
        inc.reporter_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Automatically keep activeIncident populated when incidents load or change
  React.useEffect(() => {
    if (filteredIncidents.length > 0) {
      if (!activeIncident || !filteredIncidents.some(inc => inc.id === activeIncident.id)) {
        setActiveIncident(filteredIncidents[0]);
      }
    }
  }, [incidents, filteredIncidents, activeIncident]);

  const handleStatusChange = (newStatus: IncidentReport['status']) => {
    if (activeIncident) {
      onUpdateIncidentStatus(activeIncident.id, newStatus, updateNote);
      setActiveIncident({
        ...activeIncident,
        status: newStatus,
        internal_notes: updateNote ? [...(activeIncident.internal_notes || []), updateNote] : activeIncident.internal_notes
      });
      setUpdateNote('');
      showToast(`Incident #${activeIncident.id} status transitioned to ${newStatus}.`);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom border border-emerald-400/40 text-xs font-bold">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-amber-500" />
            {t.incidents}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Ground Observations, Damage Assessments & Multi-Agency Action Queue
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={onNavigateToReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Geo-Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incident title, settlement, reporter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Districts</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Incident Types</option>
            <option value="FRESH_LANDSLIDE">Fresh Landslide</option>
            <option value="SLOPE_CRACK">Slope Tension Crack</option>
            <option value="ROCKFALL">Rockfall / Boulder Roll</option>
            <option value="ROAD_BLOCKAGE">Road Blockage</option>
            <option value="MUDFLOW">Mudflow / Debris Wash</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Statuses</option>
            <option value="NEW">New</option>
            <option value="VERIFIED">Verified</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed / Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Incident List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>{filteredIncidents.length} Ground Reports Found</span>
            <span>Field Observation Registry</span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredIncidents.map((inc) => {
              const isSelected = activeIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setActiveIncident(inc)}
                  className={`p-4 rounded-2xl cursor-pointer transition border text-xs space-y-2 ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 shadow-xl shadow-amber-950/40 ring-1 ring-amber-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        inc.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {inc.severity} SEVERITY
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{inc.id}</span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm leading-snug">{inc.title}</h3>
                  <p className="text-slate-400 line-clamp-2 text-xs">{inc.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {inc.village_name} ({inc.district_name})
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        inc.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        inc.status === 'IN_PROGRESS' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        inc.status === 'CLOSED' ? 'bg-slate-700 text-slate-300' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Incident Dossier & Status Update Terminal */}
        <div className="lg:col-span-7">
          {activeIncident ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-2xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      STATUS: {activeIncident.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {activeIncident.id}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white leading-tight">{activeIncident.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Location: {activeIncident.village_name}, {activeIncident.district_name} (Lat {activeIncident.lat.toFixed(4)}°, Lon {activeIncident.lon.toFixed(4)}°)
                  </p>
                </div>

                <button
                  onClick={() => onNavigateToMap(activeIncident.village_id)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
                >
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Inspect on Map</span>
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Observation Report</h3>
                <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
                  {activeIncident.description}
                </p>
              </div>

              {/* Geo Photo Gallery */}
              {activeIncident.media && activeIncident.media.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    Field Geo-Tagged Evidence & Media ({activeIncident.media.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {activeIncident.media.map((med) => (
                      <div
                        key={med.id}
                        onClick={() => setLightboxImage({ url: med.url, caption: med.caption })}
                        className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group cursor-pointer"
                      >
                        <img
                          src={med.url}
                          alt={med.caption || 'Field Landslide Media'}
                          className="w-full h-36 object-cover group-hover:scale-105 transition duration-300"
                        />
                        {med.caption && (
                          <div className="absolute bottom-0 inset-x-0 p-2 bg-slate-900/90 text-[10px] text-slate-200 backdrop-blur-sm truncate">
                            {med.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact / Damage Metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Road Status</span>
                  <p className="font-bold text-white mt-1">
                    {activeIncident.road_blocked ? '⛔ Road Blocked' : '✅ Road Clear'}
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Houses Damaged</span>
                  <p className="font-bold text-amber-400 mt-1">{activeIncident.houses_damaged} Structures</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Casualties</span>
                  <p className="font-bold text-rose-400 mt-1">{activeIncident.casualties_reported} Reported</p>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Reported by: <b>{activeIncident.reporter_name}</b> ({activeIncident.reporter_role})</span>
                </div>
                {activeIncident.reporter_phone && (
                  <span className="text-slate-400 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {activeIncident.reporter_phone}
                  </span>
                )}
              </div>

              {/* Internal Logs & Status Update */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Disaster Authority Workflow & Verification
                </h3>

                {activeIncident.internal_notes && activeIncident.internal_notes.length > 0 && (
                  <div className="space-y-1">
                    {activeIncident.internal_notes.map((note, i) => (
                      <p key={i} className="text-xs text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                        • {note}
                      </p>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add field dispatch note (e.g. Excavator unit #4 on site, 1 lane cleared)..."
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleStatusChange('VERIFIED')}
                      className="py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition"
                    >
                      Mark Verified
                    </button>
                    <button
                      onClick={() => handleStatusChange('IN_PROGRESS')}
                      className="py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange('CLOSED')}
                      className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
                    >
                      Close / Cleared
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
              Select an incident to view details and update workflow status.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900">
            <img
              src={lightboxImage.url}
              alt={lightboxImage.caption || 'Field Evidence'}
              className="max-h-[75vh] w-auto object-contain"
            />
            {lightboxImage.caption && (
              <div className="p-3 bg-slate-950 text-xs text-slate-200 font-semibold text-center border-t border-slate-800">
                {lightboxImage.caption}
              </div>
            )}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-1.5 bg-slate-950/80 hover:bg-slate-900 text-white rounded-full text-xs font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
