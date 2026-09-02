import React, { useState, useRef } from 'react';
import {
  FilePlus2,
  MapPin,
  Camera,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Navigation,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Village, District, Block, IncidentReport, User } from '../../types.ts';
import { Language, translations } from '../../i18n/translations.ts';

interface ReportIncidentViewProps {
  villages: Village[];
  districts: District[];
  blocks: Block[];
  user: User;
  activeLanguage: Language;
  initialVillage?: Village | null;
  onSubmitSuccess: (incident: IncidentReport) => void;
  onNavigateToIncidents: () => void;
}

export const ReportIncidentView: React.FC<ReportIncidentViewProps> = ({
  villages,
  districts,
  blocks,
  user,
  activeLanguage,
  initialVillage,
  onSubmitSuccess,
  onNavigateToIncidents
}) => {
  const t = translations[activeLanguage] || translations.en;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedVillageId, setSelectedVillageId] = useState<string>(initialVillage?.id || villages[0]?.id || '');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [roadBlocked, setRoadBlocked] = useState<boolean>(true);
  const [housesDamaged, setHousesDamaged] = useState<number>(0);
  const [casualtiesReported, setCasualtiesReported] = useState<number>(0);
  const [reporterName, setReporterName] = useState<string>(user.name || 'Disaster Duty Officer');
  const [reporterPhone, setReporterPhone] = useState<string>(user.phone || '+91 94361 00000');
  const [customLat, setCustomLat] = useState<number>(initialVillage?.lat || 25.2986);
  const [customLon, setCustomLon] = useState<number>(initialVillage?.lon || 91.7088);
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Dynamic Photo Upload State
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ id: string; url: string; caption: string }>>([
    {
      id: 'photo-default',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600&auto=format&fit=crop&q=80',
      caption: 'Escarpment tension crack & rockfall debris'
    }
  ]);

  // When village changes, auto-update coordinates
  const handleVillageChange = (vId: string) => {
    setSelectedVillageId(vId);
    const v = villages.find(vil => vil.id === vId);
    if (v) {
      setCustomLat(v.lat);
      setCustomLon(v.lon);
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCustomLat(Number(pos.coords.latitude.toFixed(5)));
          setCustomLon(Number(pos.coords.longitude.toFixed(5)));
          setIsLocating(false);
        },
        () => {
          // fallback to standard East Khasi Hills coordinates
          setCustomLat(25.3021);
          setCustomLon(91.7145);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setUploadedPhotos(prev => [
            ...prev,
            {
              id: `img-${Date.now()}-${i}`,
              url: uploadEvent.target!.result as string,
              caption: file.name
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (id: string) => {
    setUploadedPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selVillage = villages.find(v => v.id === selectedVillageId) || villages[0];
    const newInc: IncidentReport = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      state_id: selVillage.state_id || 'ST-MEG',
      district_id: selVillage.district_id || 'DIST-EKH',
      block_id: selVillage.block_id || 'BLK-SOH',
      village_id: selVillage.id,
      village_name: selVillage.name,
      district_name: districts.find(d => d.id === selVillage.district_id)?.name || 'East Khasi Hills',
      lat: customLat,
      lon: customLon,
      title: title || `Landslide Slope Failure near ${selVillage.name}`,
      description: description || 'Severe slope slippage observed with debris spilling across road. Requires immediate clearance and SDRF deployment.',
      severity,
      status: 'NEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reporter_name: reporterName || user.name || 'Disaster Duty Officer',
      reporter_role: user.role,
      reporter_phone: reporterPhone || '+91 94361 00000',
      road_blocked: roadBlocked,
      houses_damaged: housesDamaged,
      casualties_reported: casualtiesReported,
      media: uploadedPhotos.map((p, idx) => ({
        id: p.id || `M-${Date.now()}-${idx}`,
        url: p.url,
        media_type: 'IMAGE',
        caption: p.caption || `Geo-tagged field observation photo #${idx + 1}`,
        uploaded_at: new Date().toISOString()
      }))
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedReport(newInc);
      onSubmitSuccess(newInc);
    }, 600);
  };

  if (submittedReport) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Report Successfully Transmitted to BEACON Network
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-3">Incident Receipt #{submittedReport.id}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Your field report has been routed to the District Disaster Control Room, SDMA, and SDRF quick reaction teams.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold">{submittedReport.village_name} ({submittedReport.district_name})</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Coordinates:</span>
              <span className="font-mono">Lat {submittedReport.lat.toFixed(4)}°, Lon {submittedReport.lon.toFixed(4)}°</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Severity Tier:</span>
              <span className="font-bold text-rose-400">{submittedReport.severity}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Road Blockage:</span>
              <span className="font-semibold">{submittedReport.road_blocked ? 'Yes (Obstruction Logged)' : 'No'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Photos Attached:</span>
              <span className="font-semibold text-cyan-400">{submittedReport.media?.length || 0} Media Files</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setSubmittedReport(null);
                setTitle('');
                setDescription('');
              }}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition"
            >
              Submit Another Observation
            </button>
            <button
              onClick={onNavigateToIncidents}
              className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40"
            >
              <span>View Incident Feed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <FilePlus2 className="w-6 h-6 text-rose-500" />
          {t.reportIncident}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          BEACON Crowdsourced Citizen & Field Officer Geo-Tagged Hazard Observation Portal
        </p>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl">
        {/* Village & Location Picker */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-400" />
            Affected Settlement / Sector
          </label>
          <select
            value={selectedVillageId}
            onChange={(e) => handleVillageChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-sm font-semibold text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            {villages.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} (Slope {v.slope_deg}°, Rain {v.current_rainfall_24h_mm}mm)
              </option>
            ))}
          </select>

          {/* GPS Coordinates & Auto Location */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 flex-1 w-full">
              <span className="text-slate-400 font-semibold">GPS:</span>
              <input
                type="number"
                step="0.0001"
                value={customLat}
                onChange={(e) => setCustomLat(parseFloat(e.target.value))}
                className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white font-mono text-xs"
              />
              <span className="text-slate-500">°N</span>
              <input
                type="number"
                step="0.0001"
                value={customLon}
                onChange={(e) => setCustomLon(parseFloat(e.target.value))}
                className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white font-mono text-xs"
              />
              <span className="text-slate-500">°E</span>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg font-semibold transition shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isLocating ? 'Detecting GPS...' : 'Auto-Detect GPS'}</span>
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Incident Headline / Observation
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Major mudflow blocking NH-106 near Sohra-Shella junction"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl px-3.5 py-2.5 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Detailed Ground Description & Terrain Condition
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe soil cracking, water seepage, rockfall size, powerline disruption, or settlement risk..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl px-3.5 py-2.5 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Severity Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Observed Severity Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'LOW', label: 'Low Risk', color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' },
              { id: 'MEDIUM', label: 'Medium Risk', color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
              { id: 'HIGH', label: 'High Risk', color: 'border-orange-500 text-orange-400 bg-orange-500/10' },
              { id: 'CRITICAL', label: 'Critical / Urgent', color: 'border-rose-500 text-rose-400 bg-rose-500/10' }
            ].map((sev) => (
              <button
                key={sev.id}
                type="button"
                onClick={() => setSeverity(sev.id as any)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  severity === sev.id ? sev.color : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{sev.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Impact Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={roadBlocked}
              onChange={(e) => setRoadBlocked(e.target.checked)}
              className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-0"
            />
            <span className="font-semibold text-slate-200">Road / Highway Blocked</span>
          </label>

          <div className="space-y-1">
            <span className="text-slate-400">Damaged Houses:</span>
            <input
              type="number"
              min="0"
              value={housesDamaged}
              onChange={(e) => setHousesDamaged(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white"
            />
          </div>

          <div className="space-y-1">
            <span className="text-slate-400">Casualties Reported:</span>
            <input
              type="number"
              min="0"
              value={casualtiesReported}
              onChange={(e) => setCasualtiesReported(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white"
            />
          </div>
        </div>

        {/* Real Dynamic Photo / Media Upload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-cyan-400" />
              Field Evidence & Media ({uploadedPhotos.length})
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/60 rounded-lg text-xs font-semibold transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Picture</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uploadedPhotos.map((photo) => (
              <div key={photo.id} className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 bg-slate-900/90 text-xs flex items-center justify-between border-t border-slate-800">
                  <span className="truncate text-slate-300 text-[11px]">{photo.caption}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reporter Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Reporter Name</label>
            <input
              type="text"
              required
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Contact Phone Number</label>
            <input
              type="text"
              required
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2"
            />
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-2xl text-sm transition shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
        >
          <ShieldAlert className="w-5 h-5 text-rose-200" />
          <span>{isSubmitting ? 'Uploading to BEACON Command...' : 'Transmit Official Incident Alert'}</span>
        </button>
      </form>
    </div>
  );
};
