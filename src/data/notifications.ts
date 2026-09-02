export interface SystemNotification {
  id: string;
  category: 'CAP_ALERT' | 'IOT_TRIGGER' | 'FIELD_SITREP' | 'WEATHER_INSAR' | 'AGENCY_DISPATCH';
  title: string;
  message: string;
  timestamp: string;
  source: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  read: boolean;
  targetVillageId?: string;
  targetAlertId?: string;
  targetIncidentId?: string;
}

export const initialSystemNotifications: SystemNotification[] = [
  {
    id: 'NOTIF-2026-0901',
    category: 'CAP_ALERT',
    title: 'RED ALERT: Impending Slope Failure Bulletin Disseminated',
    message: 'CAP v1.2 Mass Broadcast triggered for Sohra (Cherrapunji) Cliffside settlement. 24h rainfall exceeded 186.4mm threshold. Evacuation corridors to Ramakrishna Mission Relief Shelter activated.',
    timestamp: '2 mins ago',
    source: 'State Emergency Operations Center (SEOC Shillong)',
    severity: 'CRITICAL',
    read: false,
    targetAlertId: 'alt_001',
    targetVillageId: 'v_sohra'
  },
  {
    id: 'NOTIF-2026-0902',
    category: 'IOT_TRIGGER',
    title: 'IoT Telemetry: Continuous Inclinometer Tilt Exceeded (>0.38°/day)',
    message: 'Sensor INCL-EKH-03 at NH-206 km 42 registered accelerated downslope shear displacement for 3 consecutive 15-minute sampling windows.',
    timestamp: '14 mins ago',
    source: 'NESAC / GSI Real-Time Sensor Array',
    severity: 'HIGH',
    read: false,
    targetVillageId: 'v_mawphlang'
  },
  {
    id: 'NOTIF-2026-0903',
    category: 'FIELD_SITREP',
    title: 'Highway Cleared: BRO Swastik Excavator Unit Restores Single-Lane NH-6',
    message: 'Taskforce Unit #4 successfully pushed 450 cubic meters of boulder debris off NH-6 near Sonapur Tunnel. Caution advisory in place for heavy transport vehicles.',
    timestamp: '32 mins ago',
    source: 'Border Roads Organisation (BRO Project Swastik)',
    severity: 'MEDIUM',
    read: false,
    targetIncidentId: 'inc_002',
    targetVillageId: 'v_nongpoh'
  },
  {
    id: 'NOTIF-2026-0904',
    category: 'WEATHER_INSAR',
    title: 'IMD Flash Flood & Cloudburst Alert: Meghalaya Escarpments',
    message: 'Regional Met Centre Guwahati predicts intense rain bands (120-210mm/24h) over East & West Khasi Hills for next 36 hours. Moisture saturation at 94% VWC.',
    timestamp: '1 hour ago',
    source: 'India Meteorological Department (IMD)',
    severity: 'HIGH',
    read: true,
    targetVillageId: 'v_mawsynram'
  },
  {
    id: 'NOTIF-2026-0905',
    category: 'AGENCY_DISPATCH',
    title: 'SDRF 1st Battalion Pre-Positioned at Pynursla Sub-Divisional Base',
    message: '2 inflatable rescue boats, 4 earth-cutting chain saws, and medical trauma unit stationed at Pynursla Community Hall for rapid deployment.',
    timestamp: '2 hours ago',
    source: 'State Disaster Management Authority (SDMA)',
    severity: 'INFO',
    read: true,
    targetVillageId: 'v_pynursla'
  },
  {
    id: 'NOTIF-2026-0906',
    category: 'WEATHER_INSAR',
    title: 'InSAR Satellite Interferometry Confirms Slope Creep Rate: 5.4mm LOS',
    message: 'Sentinel-1 ascending pass analysis processed by NESAC confirms subsidence line-of-sight velocity of 5.4mm/week along Nongstoin ridge.',
    timestamp: '3 hours ago',
    source: 'North Eastern Space Applications Centre (NESAC / ISRO)',
    severity: 'MEDIUM',
    read: true,
    targetVillageId: 'v_nongstoin'
  }
];
