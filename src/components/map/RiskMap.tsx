import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Map as MapIcon,
  Compass,
  Sliders,
  Filter,
  Eye,
  AlertTriangle,
  Hospital,
  Home,
  Activity,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  Village,
  RoadSegment,
  InfrastructurePoint,
  Sensor,
  IncidentReport,
  Alert,
  RiskSnapshot,
  District,
  Block
} from '../../types.ts';
import { VillageDetailsDrawer } from './VillageDetailsDrawer.tsx';
import { Language, translations } from '../../i18n/translations.ts';

interface RiskMapProps {
  villages: Village[];
  roads: RoadSegment[];
  infrastructure: InfrastructurePoint[];
  sensors: Sensor[];
  incidents: IncidentReport[];
  alerts: Alert[];
  districts: District[];
  blocks: Block[];
  activeLanguage: Language;
  selectedVillage: Village | null;
  onSelectVillage: (village: Village | null) => void;
  onAcknowledgeAlert?: (alertId: string) => void;
  onOpenReportModal?: (village: Village) => void;
}

export const RiskMap: React.FC<RiskMapProps> = ({
  villages,
  roads,
  infrastructure,
  sensors,
  incidents,
  alerts,
  districts,
  blocks,
  activeLanguage,
  selectedVillage,
  onSelectVillage,
  onAcknowledgeAlert,
  onOpenReportModal
}) => {
  const t = translations[activeLanguage];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Map Controls State
  const [baseLayer, setBaseLayer] = useState<'osm' | 'satellite' | 'terrain'>('terrain');
  const [selectedHorizon, setSelectedHorizon] = useState<number>(0); // 0 = Now, 6, 24, 48, 72
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('all');

  // Layer Visibility Toggles
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showInfrastructure, setShowInfrastructure] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);

  // Compute live risk snapshot per village based on time horizon
  const getRiskColor = (score: number) => {
    if (score >= 0.78) return '#ef4444'; // CRITICAL
    if (score >= 0.58) return '#f97316'; // HIGH
    if (score >= 0.35) return '#eab308'; // MODERATE
    return '#22c55e'; // LOW
  };

  const computeSnapshot = (v: Village, horizonHours: number): RiskSnapshot => {
    const rainMod = horizonHours === 0 ? 1 : horizonHours === 6 ? 1.25 : horizonHours === 24 ? 1.45 : horizonHours === 48 ? 1.15 : 0.85;
    const effRain = v.current_rainfall_24h_mm * rainMod;
    const effMoist = Math.min(100, v.soil_moisture_pct * (horizonHours > 0 ? 1.05 : 1.0));
    const score = Number((
      0.35 * Math.min(1, effRain / 200) +
      0.25 * Math.min(1, v.slope_deg / 60) +
      0.20 * (effMoist / 100) +
      0.15 * v.susceptibility_base_score +
      0.05 * Math.min(1, v.tilt_rate_deg_day / 0.5)
    ).toFixed(3));

    let risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 0.78) risk_level = 'CRITICAL';
    else if (score >= 0.58) risk_level = 'HIGH';
    else if (score >= 0.35) risk_level = 'MODERATE';

    const factors: string[] = [];
    if (effRain >= 140) factors.push(`Heavy Rainfall: ${effRain.toFixed(1)} mm`);
    if (v.slope_deg >= 40) factors.push(`Steep Escarpment: ${v.slope_deg}°`);
    if (effMoist >= 85) factors.push(`Soil Saturation: ${effMoist.toFixed(1)}%`);
    if (v.tilt_rate_deg_day >= 0.2) factors.push(`Inclinometer Tilt: ${v.tilt_rate_deg_day}°/day`);

    return {
      id: `RS-${v.id}-${horizonHours}`,
      village_id: v.id,
      village_name: v.name,
      district_name: districts.find(d => d.id === v.district_id)?.name || 'East Khasi Hills',
      lat: v.lat,
      lon: v.lon,
      timestamp: new Date().toISOString(),
      risk_score: score,
      risk_level,
      contributing_factors: factors,
      rainfall_24h_mm: effRain,
      slope_deg: v.slope_deg,
      soil_moisture_pct: effMoist,
      model_version: 'NER-LEWS-v2.4-HybridML',
      recommended_actions: risk_level === 'CRITICAL' ? ['Evacuate slope foothill settlements', 'Deploy SDRF teams'] : ['Routine monitoring']
    };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on East Khasi Hills / Meghalaya NER
      const map = L.map(mapContainerRef.current, {
        center: [25.4200, 91.7500],
        zoom: 11,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Ensure map tiles recalculate size after DOM layout stabilizes
      setTimeout(() => map.invalidateSize(), 150);
      setTimeout(() => map.invalidateSize(), 500);
    }

    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    const handleWindowResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layer
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (baseLayer === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri, Earthstar Geographics';
    } else if (baseLayer === 'terrain') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution
    }).addTo(map);
  }, [baseLayer]);

  // Render Overlays (Villages, Hazards, Roads, Infrastructure, Sensors, Incidents)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Filter villages based on district/block
    let filteredVillages = villages;
    if (selectedDistrictId !== 'all') {
      filteredVillages = filteredVillages.filter(v => v.district_id === selectedDistrictId);
    }
    if (selectedBlockId !== 'all') {
      filteredVillages = filteredVillages.filter(v => v.block_id === selectedBlockId);
    }

    // 1. Render Risk Heat Zones & Village Nodes
    if (showRiskHeatmap) {
      filteredVillages.forEach(v => {
        const snap = computeSnapshot(v, selectedHorizon);
        const color = getRiskColor(snap.risk_score);
        const radius = snap.risk_level === 'CRITICAL' ? 24 : snap.risk_level === 'HIGH' ? 18 : 14;

        // Outer Hazard Buffer (Influence Zone)
        const buffer = L.circle([v.lat, v.lon], {
          radius: snap.risk_level === 'CRITICAL' ? 2400 : snap.risk_level === 'HIGH' ? 1600 : 900,
          color,
          fillColor: color,
          fillOpacity: snap.risk_level === 'CRITICAL' ? 0.28 : snap.risk_level === 'HIGH' ? 0.20 : 0.12,
          weight: snap.risk_level === 'CRITICAL' ? 2 : 1,
          dashArray: snap.risk_level === 'CRITICAL' ? '4, 4' : undefined
        });

        // Center Village Marker Node
        const marker = L.circleMarker([v.lat, v.lon], {
          radius: snap.risk_level === 'CRITICAL' ? 11 : 8,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.95
        });

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 200px;">
            <div style="font-weight: bold; font-size: 13px; margin-bottom: 2px;">${v.name}</div>
            <div style="display: inline-block; padding: 2px 6px; font-size: 10px; font-weight: bold; border-radius: 4px; background: ${color}20; color: ${color}; border: 1px solid ${color}60; margin-bottom: 6px;">
              ${snap.risk_level} RISK (Score: ${snap.risk_score})
            </div>
            <div style="color: #475569; line-height: 1.4;">
              <div>🌧️ <b>Rain 24h:</b> ${snap.rainfall_24h_mm.toFixed(1)} mm</div>
              <div>📐 <b>Slope:</b> ${v.slope_deg}° | <b>Elev:</b> ${v.elevation_m}m</div>
              <div>💧 <b>Soil Moisture:</b> ${snap.soil_moisture_pct.toFixed(1)}%</div>
            </div>
            <div style="margin-top: 8px; font-size: 10px; color: #64748b;">
              Click marker for complete geological SOP drilldown
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          onSelectVillage(v);
        });
        buffer.on('click', () => {
          onSelectVillage(v);
        });

        layerGroup.addLayer(buffer);
        layerGroup.addLayer(marker);
      });
    }

    // 2. Render Roads
    if (showRoads) {
      roads.forEach(r => {
        const roadColor = r.status === 'BLOCKED' ? '#ef4444' : r.status === 'CAUTION' ? '#f59e0b' : '#3b82f6';
        const polyline = L.polyline(r.coordinates, {
          color: roadColor,
          weight: r.status === 'BLOCKED' ? 6 : 4,
          opacity: 0.85,
          dashArray: r.status === 'BLOCKED' ? '6, 6' : undefined
        });

        polyline.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
            <div style="font-weight: bold;">${r.name}</div>
            <div style="color: ${roadColor}; font-weight: bold; font-size: 11px; margin: 4px 0;">
              STATUS: ${r.status}
            </div>
            ${r.blockage_reason ? `<div style="color: #475569;">${r.blockage_reason}</div>` : ''}
            ${r.clearing_team ? `<div style="font-size: 10px; color: #64748b; margin-top: 4px;">Assigned: ${r.clearing_team}</div>` : ''}
          </div>
        `);

        layerGroup.addLayer(polyline);
      });
    }

    // 3. Render Infrastructure Points
    if (showInfrastructure) {
      infrastructure.forEach(inf => {
        const infColor = inf.type === 'HOSPITAL' ? '#ef4444' : inf.type === 'SHELTER' ? '#10b981' : '#8b5cf6';
        const marker = L.circleMarker([inf.lat, inf.lon], {
          radius: 6,
          fillColor: infColor,
          color: '#ffffff',
          weight: 1.5,
          fillOpacity: 1
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
            <div style="font-weight: bold;">🏥 ${inf.name}</div>
            <div style="font-size: 11px; color: #475569;">Type: <b>${inf.type}</b></div>
            ${inf.capacity ? `<div style="font-size: 11px; color: #10b981;">Shelter Capacity: <b>${inf.capacity} persons</b></div>` : ''}
            ${inf.contact ? `<div style="font-size: 10px; color: #64748b; margin-top: 4px;">Phone: ${inf.contact}</div>` : ''}
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // 4. Render IoT Real-time Sensors
    if (showSensors) {
      sensors.forEach(sens => {
        const sensMarker = L.circleMarker([sens.lat, sens.lon], {
          radius: 5,
          fillColor: sens.last_reading.status === 'ALERT' ? '#ef4444' : '#06b6d4',
          color: '#ffffff',
          weight: 1.5,
          fillOpacity: 0.95
        });

        sensMarker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
            <div style="font-weight: bold;">📡 IoT Sensor: ${sens.name}</div>
            <div style="font-size: 11px; color: #475569;">Type: <b>${sens.type}</b></div>
            <div style="font-size: 11px; font-weight: bold; color: ${sens.last_reading.status === 'ALERT' ? '#ef4444' : '#06b6d4'}; margin: 3px 0;">
              Value: ${sens.last_reading.value} ${sens.last_reading.unit} (${sens.last_reading.status})
            </div>
            <div style="font-size: 10px; color: #64748b;">Battery: ${sens.battery_pct}% | Signal: ${sens.signal_dbm} dBm</div>
          </div>
        `);

        layerGroup.addLayer(sensMarker);
      });
    }

    // 5. Render Crowd & Field Incidents
    if (showIncidents) {
      incidents.forEach(inc => {
        const incColor = inc.severity === 'CRITICAL' ? '#ef4444' : inc.severity === 'HIGH' ? '#f97316' : '#eab308';
        const incMarker = L.circleMarker([inc.lat, inc.lon], {
          radius: 7,
          fillColor: incColor,
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.9
        });

        incMarker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; max-width: 220px;">
            <div style="font-weight: bold; color: ${incColor};">⚠️ ${inc.title}</div>
            <div style="font-size: 11px; color: #334155; margin: 4px 0;">${inc.description.slice(0, 100)}...</div>
            <div style="font-size: 10px; color: #64748b;">Status: <b>${inc.status}</b> | Reporter: ${inc.reporter_name}</div>
          </div>
        `);

        layerGroup.addLayer(incMarker);
      });
    }
  }, [
    villages,
    roads,
    infrastructure,
    sensors,
    incidents,
    selectedHorizon,
    selectedDistrictId,
    selectedBlockId,
    showRiskHeatmap,
    showRoads,
    showInfrastructure,
    showSensors,
    showIncidents
  ]);

  // Auto-select highest risk settlement if none selected
  useEffect(() => {
    if (!selectedVillage && villages.length > 0) {
      const highestRisk = [...villages].sort((a, b) => (b.susceptibility_base_score || 0) - (a.susceptibility_base_score || 0))[0];
      onSelectVillage(highestRisk || villages[0]);
    }
  }, [villages, selectedVillage, onSelectVillage]);

  // Fly to selected village when selected
  useEffect(() => {
    if (selectedVillage && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedVillage.lat, selectedVillage.lon], 13, {
        duration: 1.2
      });
    }
  }, [selectedVillage]);

  // Fly to selected district when changed
  useEffect(() => {
    if (selectedDistrictId !== 'all' && mapInstanceRef.current) {
      const dist = districts.find(d => d.id === selectedDistrictId);
      if (dist && dist.center) {
        mapInstanceRef.current.flyTo([dist.center[0], dist.center[1]], 11, { duration: 1.0 });
      }
    }
  }, [selectedDistrictId, districts]);

  const activeSnapshot = selectedVillage ? computeSnapshot(selectedVillage, selectedHorizon) : null;
  const villageAlerts = selectedVillage ? alerts.filter(a => a.village_id === selectedVillage.id) : [];
  const villageIncidents = selectedVillage ? incidents.filter(i => i.village_id === selectedVillage.id) : [];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 flex flex-col overflow-hidden">
      {/* Top Floating GIS Control Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Filter & Geography Selectors */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
          {/* District Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-rose-400" />
            <select
              value={selectedDistrictId}
              onChange={(e) => {
                setSelectedDistrictId(e.target.value);
                setSelectedBlockId('all');
              }}
              className="bg-slate-800 text-xs font-semibold text-white border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="all">All Districts (NER)</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Block Filter */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 px-1">
            <select
              value={selectedBlockId}
              onChange={(e) => setSelectedBlockId(e.target.value)}
              className="bg-slate-800 text-xs font-semibold text-white border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="all">All Monitored Blocks</option>
              {blocks
                .filter(b => selectedDistrictId === 'all' || b.district_id === selectedDistrictId)
                .map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
            </select>
          </div>

          {/* Base Map Layer Picker */}
          <div className="flex items-center gap-1 border-l border-slate-700/80 pl-2">
            <button
              onClick={() => setBaseLayer('terrain')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition ${
                baseLayer === 'terrain' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Terrain Topo
            </button>
            <button
              onClick={() => setBaseLayer('satellite')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition ${
                baseLayer === 'satellite' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setBaseLayer('osm')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition ${
                baseLayer === 'osm' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Roadmap
            </button>
          </div>
        </div>

        {/* Right Layer Toggles Pill */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl text-xs">
          <button
            onClick={() => setShowRiskHeatmap(!showRiskHeatmap)}
            className={`px-2 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
              showRiskHeatmap ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Hazard Zones"
          >
            <AlertTriangle className="w-3 h-3" />
            <span className="hidden md:inline">Hazard Grids</span>
          </button>
          <button
            onClick={() => setShowRoads(!showRoads)}
            className={`px-2 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
              showRoads ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Highways & Road status"
          >
            <MapIcon className="w-3 h-3" />
            <span className="hidden md:inline">Highways</span>
          </button>
          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`px-2 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
              showSensors ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle IoT Telemetry Sensors"
          >
            <Activity className="w-3 h-3" />
            <span className="hidden md:inline">IoT Sensors</span>
          </button>
          <button
            onClick={() => setShowInfrastructure(!showInfrastructure)}
            className={`px-2 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
              showInfrastructure ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Shelters & Hospitals"
          >
            <Home className="w-3 h-3" />
            <span className="hidden md:inline">Relief Shelters</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Bottom Floating Time Slider (Now -> +6h -> +24h -> +48h -> +72h) */}
      <div className="absolute bottom-4 left-3 right-3 sm:left-6 sm:right-auto sm:w-[500px] z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            {t.timeHorizon}: <span className="text-cyan-300 uppercase tracking-wider">{selectedHorizon === 0 ? t.liveNow : `+${selectedHorizon} Hours Forecast`}</span>
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            IMD & GSI Ensemble Model
          </span>
        </div>

        {/* Horizon Pill Selector */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[0, 6, 24, 48, 72].map((hz) => (
            <button
              key={hz}
              onClick={() => setSelectedHorizon(hz)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex flex-col items-center ${
                selectedHorizon === hz
                  ? 'bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-md shadow-rose-900/40 border border-rose-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>{hz === 0 ? 'NOW' : `+${hz}h`}</span>
              <span className="text-[9px] opacity-75 font-normal">
                {hz === 0 ? 'Live Telemetry' : hz === 6 ? 'Short Alert' : hz === 24 ? 'Monsoon' : 'Trend'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Right Floating Map Legend */}
      <div className="hidden lg:block absolute bottom-4 right-14 z-30 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-xl text-xs space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk Class Legend</div>
        <div className="flex items-center gap-2 text-[11px] text-slate-200">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
          <span>Critical (&gt;0.78 score)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-200">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span>High (0.58 - 0.78)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-200">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Moderate (0.35 - 0.58)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-200">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>Low (&lt;0.35)</span>
        </div>
      </div>

      {/* Village Details Side Drawer */}
      <VillageDetailsDrawer
        village={selectedVillage}
        riskSnapshot={activeSnapshot}
        relatedAlerts={villageAlerts}
        relatedIncidents={villageIncidents}
        onClose={() => onSelectVillage(null)}
        activeLanguage={activeLanguage}
        onAcknowledgeAlert={onAcknowledgeAlert}
        onOpenReportModal={onOpenReportModal}
      />
    </div>
  );
};
