import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  CloudRain,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { Village, AnalyticsSummary, IncidentReport, Alert } from '../../types.ts';
import {
  defaultAnalyticsSummary,
  defaultVillages,
  defaultIncidents,
  defaultAlerts
} from '../../data/defaultData.ts';
import { Language, translations } from '../../i18n/translations.ts';

interface AnalyticsViewProps {
  summary?: AnalyticsSummary | null;
  villages?: Village[];
  incidents?: IncidentReport[];
  alerts?: Alert[];
  activeLanguage: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  summary = defaultAnalyticsSummary,
  villages = defaultVillages,
  incidents = defaultIncidents,
  alerts = defaultAlerts,
  activeLanguage
}) => {
  const t = translations[activeLanguage] || translations.en;
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  const [activeAnalysisScope, setActiveAnalysisScope] = useState<'REGIONAL' | 'DISTRICT' | 'GEOTECHNICAL'>('REGIONAL');

  // Settlement-wise Rainfall and Susceptibility Correlation Data
  const rainfallRiskData = (villages && villages.length > 0 ? villages : [
    { name: 'Sohra', current_rainfall_24h_mm: 186.4, slope_deg: 46.5, soil_moisture_pct: 92.5, susceptibility_base_score: 0.85, tilt_rate_deg_day: 0.38 },
    { name: 'Mawsynram', current_rainfall_24h_mm: 215.0, slope_deg: 41.2, soil_moisture_pct: 96.1, susceptibility_base_score: 0.88, tilt_rate_deg_day: 0.38 },
    { name: 'Laitkynsew', current_rainfall_24h_mm: 148.0, slope_deg: 44.0, soil_moisture_pct: 86.4, susceptibility_base_score: 0.76, tilt_rate_deg_day: 0.28 },
    { name: 'Nongpoh', current_rainfall_24h_mm: 92.0, slope_deg: 26.5, soil_moisture_pct: 68.0, susceptibility_base_score: 0.48, tilt_rate_deg_day: 0.08 },
    { name: 'Nongstoin', current_rainfall_24h_mm: 114.5, slope_deg: 32.0, soil_moisture_pct: 74.2, susceptibility_base_score: 0.58, tilt_rate_deg_day: 0.12 },
    { name: 'Haflong', current_rainfall_24h_mm: 162.0, slope_deg: 48.0, soil_moisture_pct: 89.5, susceptibility_base_score: 0.82, tilt_rate_deg_day: 0.34 },
    { name: 'Champhai', current_rainfall_24h_mm: 88.0, slope_deg: 36.5, soil_moisture_pct: 62.0, susceptibility_base_score: 0.52, tilt_rate_deg_day: 0.09 },
    { name: 'Kurung Kumey', current_rainfall_24h_mm: 135.0, slope_deg: 45.0, soil_moisture_pct: 81.0, susceptibility_base_score: 0.72, tilt_rate_deg_day: 0.22 }
  ]).map(v => ({
    name: v.name.split(' ')[0],
    rainfall: v.current_rainfall_24h_mm,
    slope: v.slope_deg,
    soilMoisture: v.soil_moisture_pct,
    riskScore: Number((
      0.35 * Math.min(1, v.current_rainfall_24h_mm / 200) +
      0.25 * Math.min(1, v.slope_deg / 60) +
      0.20 * (v.soil_moisture_pct / 100) +
      0.15 * (v.susceptibility_base_score || 0.7) +
      0.05 * Math.min(1, (v.tilt_rate_deg_day || 0.2) / 0.5)
    ).toFixed(2)) * 100
  }));

  const riskPieData = [
    { name: 'Critical Risk (>70%)', value: 3, color: '#ef4444' },
    { name: 'Medium Risk (40-70%)', value: 5, color: '#f59e0b' },
    { name: 'Low Risk (<40%)', value: 2, color: '#10b981' }
  ];

  const monsoonTrendData = [
    { day: 'Day 1', rainfall: 45, incidents: 0, saturation: 58 },
    { day: 'Day 2', rainfall: 62, incidents: 1, saturation: 64 },
    { day: 'Day 3', rainfall: 90, incidents: 1, saturation: 72 },
    { day: 'Day 4', rainfall: 125, incidents: 2, saturation: 81 },
    { day: 'Day 5', rainfall: 160, incidents: 3, saturation: 88 },
    { day: 'Day 6', rainfall: 185, incidents: 4, saturation: 93 },
    { day: 'Day 7', rainfall: 215, incidents: 5, saturation: 96 }
  ];

  const districtComparisonData = [
    { district: 'East Khasi Hills', avgRainfall: 182, highRiskVillages: 4, sensorAlerts: 3 },
    { district: 'Dima Hasao', avgRainfall: 162, highRiskVillages: 2, sensorAlerts: 2 },
    { district: 'Kurung Kumey', avgRainfall: 135, highRiskVillages: 2, sensorAlerts: 1 },
    { district: 'West Khasi Hills', avgRainfall: 114, highRiskVillages: 1, sensorAlerts: 1 },
    { district: 'Ri-Bhoi', avgRainfall: 92, highRiskVillages: 0, sensorAlerts: 0 },
    { district: 'Champhai', avgRainfall: 88, highRiskVillages: 0, sensorAlerts: 0 }
  ];

  const handleDownloadSITREP = () => {
    setReportGenerated(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Export Action */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-rose-500" />
            {t.analytics}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Multi-Source Precipitation, Geotechnical Inclinometer & Incident Correlation Engine
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadSITREP}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-950/40"
          >
            <Printer className="w-4 h-4" />
            <span>Export Official SITREP Bulletin</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-cyan-400" />
            Cumulative 7-Day Precipitation
          </span>
          <p className="text-2xl font-bold text-white">
            {summary?.rainfall_max_24h_mm ?? 215.0} <span className="text-xs font-normal text-slate-400">mm max recorded in 24h</span>
          </p>
          <span className="text-[10px] text-rose-400 font-medium">185% Above Normal Seasonal Average</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            Active Slope Tilt Exceedances
          </span>
          <p className="text-2xl font-bold text-white">
            4 / 12 <span className="text-xs font-normal text-slate-400">IoT Sensors Triggered</span>
          </p>
          <span className="text-[10px] text-amber-400 font-medium">Mean Velocity: 0.38° / 24h</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            CAP Warning Delivery Rate
          </span>
          <p className="text-2xl font-bold text-white">
            99.4% <span className="text-xs font-normal text-slate-400">SMS / Siren Dispatch</span>
          </p>
          <span className="text-[10px] text-emerald-400 font-medium">Mean Alert Latency: 1.8 seconds</span>
        </div>
      </div>

      {/* Primary Chart: Rainfall vs Landslide Risk Score */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              Settlement-wise Rainfall vs AI Landslide Risk Index (%)
            </h2>
            <p className="text-xs text-slate-400">Comparing 24-hour rainfall (mm) against composite susceptibility index</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="rainfall" name="24h Rainfall (mm)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="riskScore" name="Risk Score (0-100)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Row: 7-Day Monsoon Surge Trend + Risk Class Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              7-Day Rainfall Accumulation vs Field Incidents
            </h2>
            <p className="text-xs text-slate-400">Direct relationship between cumulative rain and ground ruptures</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monsoonTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="incidents" name="Incidents Logged" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Village Vulnerability Tier Breakdown
            </h2>
            <p className="text-xs text-slate-400">Proportion of surveyed settlements in critical hazard categories</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tertiary Row: District Risk & Sensor Alert Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Inter-District Rainfall Accumulation vs Triggered Sensor Count
            </h2>
            <p className="text-xs text-slate-400">Comparing regional district rainfall averages with early warning sensor threshold exceedances</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="district" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="avgRainfall" name="Avg 24h Rainfall (mm)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="highRiskVillages" name="High Risk Settlements" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sensorAlerts" name="Active IoT Alerts" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
