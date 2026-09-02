export type AppMode = 'government' | 'public';

export type Role =
  | 'super_admin'
  | 'mdoner_admin'
  | 'sdma_officer'
  | 'ddma_officer'
  | 'ndrf_sdrf_officer'
  | 'bro_nhai_officer'
  | 'scientist'
  | 'field_officer'
  | 'public_user'
  // Backward compatibility aliases
  | 'state_admin'
  | 'district_admin';

export type Organization =
  | 'MDoNER'
  | 'SDMA Assam'
  | 'DDMA Assam'
  | 'SDMA Meghalaya'
  | 'DDMA Meghalaya'
  | 'SDMA Sikkim'
  | 'DDMA Sikkim'
  | 'SDMA Arunachal Pradesh'
  | 'DDMA Arunachal Pradesh'
  | 'NDRF'
  | 'SDRF'
  | 'BRO'
  | 'NHAI'
  | 'IMD'
  | 'ISRO / NRSC'
  | 'District Administration'
  | 'General Public'
  | string;

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type AlertSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type AlertCategory = 'ADVISORY' | 'WATCH' | 'WARNING' | 'CRITICAL_EMERGENCY';
export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'ESCALATED' | 'BROADCASTED' | 'CLOSED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED'
  | 'CLOSED';

export type IncidentType =
  | 'FRESH_LANDSLIDE'
  | 'ROAD_BLOCKAGE'
  | 'SLOPE_CRACK'
  | 'ROCKFALL'
  | 'SOIL_MOVEMENT'
  | 'FLOODED_ROAD'
  | 'BRIDGE_DAMAGE'
  | 'SENSOR_WARNING'
  | 'UTILITY_DISRUPTION'
  | 'OTHER';

export type Channel = 'SMS' | 'EMAIL' | 'PUSH' | 'IVR' | 'WHATSAPP' | 'SIREN' | 'WEB_BANNER';
export type DataSourceType = 'LIVE' | 'CACHED' | 'DEMO';
export type ConnectionStatus = 'connected' | 'updating' | 'delayed' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  organization?: Organization;
  designation?: string;
  department?: string;
  allowed_regions: string[];
  state_id?: string;
  state_name?: string;
  district_id?: string;
  district_name?: string;
  preferred_language?: string;
  avatar_initials?: string;
  profile_photo_url?: string;
  is_verified?: boolean;
  registered_at?: string;
  notifications_enabled?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    whatsapp: boolean;
  };
}

export interface State {
  id: string;
  name: string;
  code: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
  districts_count?: number;
}

export interface District {
  id: string;
  state_id: string;
  state_name?: string;
  name: string;
  code: string;
  headquarters: string;
  population: number;
  center: [number, number];
}

export interface Block {
  id: string;
  district_id: string;
  district_name?: string;
  name: string;
  center: [number, number];
}

export interface Village {
  id: string;
  block_id: string;
  district_id: string;
  state_id: string;
  name: string;
  lat: number;
  lon: number;
  population: number;
  slope_deg: number;
  elevation_m: number;
  soil_type: string;
  lithology: string;
  susceptibility_base_score: number; // 0 to 1
  current_rainfall_24h_mm: number;
  rainfall_7d_total_mm: number;
  rainfall_72h_mm?: number;
  soil_moisture_pct: number;
  tilt_rate_deg_day: number;
  pore_pressure_kpa?: number;
  evacuation_center?: string;
  emergency_contact?: string;
  nearest_road?: string;
  nearest_hospital?: string;
  critical_facilities_count?: number;
}

export interface RoadSegment {
  id: string;
  name: string;
  highway_number?: string;
  state_id: string;
  district_id: string;
  coordinates: [number, number][];
  status: 'CLEAR' | 'CAUTION' | 'BLOCKED';
  blockage_reason?: string;
  clearing_team?: string;
  alternate_route_id?: string;
  last_cleared_at?: string;
}

export interface InfrastructurePoint {
  id: string;
  type: 'HOSPITAL' | 'SHELTER' | 'HELIPAD' | 'FIRE_STATION' | 'POLICE_STATION' | 'SCHOOL' | 'RELIEF_DEPOT';
  name: string;
  district_id: string;
  district_name?: string;
  lat: number;
  lon: number;
  capacity?: number;
  occupancy_current?: number;
  status?: 'OPEN' | 'FULL' | 'STANDBY';
  contact?: string;
  facilities?: string[];
}

export interface Sensor {
  id: string;
  name: string;
  type: 'PIEZOMETER' | 'INCLINOMETER' | 'RAIN_GAUGE' | 'SOIL_MOISTURE' | 'GNSS_DISPLACEMENT' | 'SEISMIC_ACCELEROMETER';
  village_id: string;
  village_name?: string;
  district_id?: string;
  lat: number;
  lon: number;
  battery_pct: number;
  signal_dbm: number;
  is_online: boolean;
  last_reading: {
    timestamp: string;
    value: number;
    unit: string;
    status: 'NORMAL' | 'WARNING' | 'ALERT';
  };
}

export interface RiskSnapshot {
  id: string;
  village_id: string;
  village_name: string;
  district_name: string;
  state_name?: string;
  lat: number;
  lon: number;
  timestamp: string;
  risk_score: number; // 0 to 1.0 (or 0 to 100)
  risk_level: RiskLevel;
  contributing_factors: string[];
  rainfall_24h_mm: number;
  rainfall_72h_mm?: number;
  slope_deg: number;
  soil_moisture_pct: number;
  pore_pressure_kpa?: number;
  model_version: string;
  recommended_actions: string[];
  exposed_population?: number;
  evacuation_advised?: boolean;
}

export interface RiskForecast {
  id: string;
  village_id: string;
  horizon_hours: number;
  valid_time: string;
  risk_score: number;
  risk_level: RiskLevel;
  predicted_rainfall_mm: number;
  predicted_soil_moisture?: number;
  confidence_pct?: number;
}

export interface AlertRecipient {
  id: string;
  user_name: string;
  role: string;
  channel: Channel;
  address: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  sent_at?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  category?: AlertCategory;
  risk_snapshot_id?: string;
  state_id?: string;
  state_name?: string;
  district_id: string;
  district_name: string;
  block_id?: string;
  block_name?: string;
  village_id?: string;
  village_name: string;
  lat?: number;
  lon?: number;
  severity: AlertSeverity;
  status: AlertStatus;
  trigger_condition?: string;
  created_at: string;
  valid_until?: string;
  source?: string;
  affected_population?: number;
  acknowledged_by?: string;
  acknowledged_at?: string;
  escalated_to?: string;
  broadcast_channels?: Channel[];
  notes?: string[];
  contributing_factors: string[];
  recommended_actions?: string[];
  evacuation_advised: boolean;
  recipients: AlertRecipient[];
}

export interface IncidentMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO';
  url: string;
  caption?: string;
  uploaded_at: string;
  file_name?: string;
  file_size_kb?: number;
}

export interface IncidentReport {
  id: string;
  reporter_name: string;
  reporter_phone?: string;
  reporter_email?: string;
  reporter_role: Role;
  incident_type?: IncidentType;
  state_id: string;
  district_id: string;
  district_name: string;
  block_id?: string;
  block_name?: string;
  village_id?: string;
  village_name: string;
  lat: number;
  lon: number;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  created_at: string;
  updated_at: string;
  media: IncidentMedia[];
  officer_assigned?: string;
  assigned_team?: string;
  internal_notes?: string[];
  road_blocked: boolean;
  casualties_reported: number;
  houses_damaged: number;
  people_affected?: number;
  source?: 'FIELD_OFFICER' | 'CITIZEN' | 'SENSOR_TRIGGER' | 'PATROL_TEAM';
  is_verified?: boolean;
}

export interface RecentLandslide {
  event_id: string;
  date_time: string;
  location_name: string;
  state_id: string;
  state_name: string;
  district_id: string;
  district_name: string;
  lat: number;
  lon: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  trigger: string;
  road_affected?: string;
  infrastructure_affected?: string;
  people_affected: number;
  casualties: number;
  houses_damaged: number;
  verification_status: 'VERIFIED' | 'UNDER_INVESTIGATION' | 'REPORTED';
  source: string;
  media_urls?: string[];
  is_demo?: boolean;
}

export interface SafeRouteRequest {
  origin: string;
  originCoords?: [number, number];
  destination: string;
  destinationCoords?: [number, number];
  transportMode: 'light_vehicle' | 'heavy_truck' | 'ambulance' | 'pedestrian';
}

export interface SafeRouteSegment {
  from: string;
  to: string;
  road_name: string;
  status: 'CLEAR' | 'CAUTION' | 'BLOCKED';
  risk_level: RiskLevel;
  rainfall_intensity_mm: number;
  slope_stability_index: number;
  warning_message?: string;
  distance_km: number;
  est_time_mins: number;
}

export interface SafeRouteResult {
  route_id: string;
  title: string;
  type: 'SAFEST' | 'FASTEST';
  distance_km: number;
  est_duration_mins: number;
  overall_safety_rating: 'VERY_SAFE' | 'CAUTION_ADVISED' | 'HIGH_HAZARD_AVOID';
  hazard_points_count: number;
  blockages_avoided: number;
  segments: SafeRouteSegment[];
  coordinates: [number, number][];
  emergency_shelters_along_path: InfrastructurePoint[];
  emergency_contacts_along_path: { name: string; phone: string; station: string }[];
}

export interface AnalyticsSummary {
  total_villages_monitored: number;
  high_critical_villages_count: number;
  new_alerts_24h: number;
  open_incidents_count: number;
  acknowledged_alerts_24h: number;
  avg_acknowledgment_time_mins: number;
  evacuation_shelters_active: number;
  total_shelter_capacity?: number;
  current_shelter_occupancy?: number;
  sensors_online_pct: number;
  sensors_total_count?: number;
  sensors_warning_count?: number;
  roads_at_risk_count?: number;
  roads_blocked_count?: number;
  estimated_exposed_population?: number;
  rainfall_max_24h_mm: number;
  rainfall_max_location: string;
  data_source_mode?: DataSourceType;
  last_synced_at?: string;
  risk_distribution: {
    LOW: number;
    MODERATE: number;
    HIGH: number;
    CRITICAL: number;
  };
  incidents_by_status: {
    NEW: number;
    VERIFIED: number;
    IN_PROGRESS: number;
    CLOSED: number;
    REJECTED: number;
  };
  alerts_trend: {
    date: string;
    critical: number;
    high: number;
    moderate: number;
    low?: number;
    rainfall_avg: number;
  }[];
}
