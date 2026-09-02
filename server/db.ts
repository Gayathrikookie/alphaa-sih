import {
  State,
  District,
  Block,
  Village,
  RoadSegment,
  InfrastructurePoint,
  Sensor,
  RiskSnapshot,
  RiskForecast,
  Alert,
  IncidentReport,
  AnalyticsSummary,
  User,
  RiskLevel,
  RecentLandslide,
  SafeRouteResult,
  Role,
  Organization
} from '../src/types.ts';

// Master States in NER
export const initialStates: State[] = [
  {
    id: 'state_meghalaya',
    name: 'Meghalaya',
    code: 'ML',
    center: [25.5788, 91.8933],
    bounds: [[25.0, 89.8], [26.1, 92.8]],
    districts_count: 12
  },
  {
    id: 'state_assam',
    name: 'Assam',
    code: 'AS',
    center: [26.2006, 92.9376],
    bounds: [[24.1, 89.7], [27.9, 96.0]],
    districts_count: 31
  },
  {
    id: 'state_sikkim',
    name: 'Sikkim',
    code: 'SK',
    center: [27.5330, 88.5122],
    bounds: [[27.0, 88.0], [28.1, 88.9]],
    districts_count: 6
  },
  {
    id: 'state_arunachal',
    name: 'Arunachal Pradesh',
    code: 'AR',
    center: [27.1004, 93.6166],
    bounds: [[26.6, 91.5], [29.5, 97.4]],
    districts_count: 26
  }
];

// Master Districts
export const initialDistricts: District[] = [
  {
    id: 'dist_ekh',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    name: 'East Khasi Hills',
    code: 'EKH',
    headquarters: 'Shillong',
    population: 825922,
    center: [25.5788, 91.8933]
  },
  {
    id: 'dist_wkh',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    name: 'West Khasi Hills',
    code: 'WKH',
    headquarters: 'Nongstoin',
    population: 383461,
    center: [25.5200, 91.2700]
  },
  {
    id: 'dist_ribhoi',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    name: 'Ri-Bhoi',
    code: 'RB',
    headquarters: 'Nongpoh',
    population: 258840,
    center: [25.9000, 91.8800]
  },
  {
    id: 'dist_ejh',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    name: 'East Jaintia Hills',
    code: 'EJH',
    headquarters: 'Khliehriat',
    population: 122939,
    center: [25.3500, 92.3600]
  },
  {
    id: 'dist_dima_hasao',
    state_id: 'state_assam',
    state_name: 'Assam',
    name: 'Dima Hasao (North Cachar)',
    code: 'DH',
    headquarters: 'Haflong',
    population: 214102,
    center: [25.1764, 93.0204]
  },
  {
    id: 'dist_kamrup_metro',
    state_id: 'state_assam',
    state_name: 'Assam',
    name: 'Kamrup Metropolitan',
    code: 'KM',
    headquarters: 'Guwahati',
    population: 1253938,
    center: [26.1445, 91.7362]
  },
  {
    id: 'dist_gangtok',
    state_id: 'state_sikkim',
    state_name: 'Sikkim',
    name: 'Gangtok District',
    code: 'GTK',
    headquarters: 'Gangtok',
    population: 283583,
    center: [27.3389, 88.6065]
  },
  {
    id: 'dist_papum_pare',
    state_id: 'state_arunachal',
    state_name: 'Arunachal Pradesh',
    name: 'Papum Pare',
    code: 'PP',
    headquarters: 'Yupia / Itanagar',
    population: 176573,
    center: [27.1400, 93.7000]
  }
];

// Blocks
export const initialBlocks: Block[] = [
  { id: 'blk_sohra', district_id: 'dist_ekh', district_name: 'East Khasi Hills', name: 'Sohra (Cherrapunji) Block', center: [25.2986, 91.7323] },
  { id: 'blk_mawsynram', district_id: 'dist_ekh', district_name: 'East Khasi Hills', name: 'Mawsynram Block', center: [25.2970, 91.5830] },
  { id: 'blk_pynursla', district_id: 'dist_ekh', district_name: 'East Khasi Hills', name: 'Pynursla Block', center: [25.3110, 91.9020] },
  { id: 'blk_mylliem', district_id: 'dist_ekh', district_name: 'East Khasi Hills', name: 'Mylliem Block (Shillong)', center: [25.5680, 91.8830] },
  { id: 'blk_nongstoin', district_id: 'dist_wkh', district_name: 'West Khasi Hills', name: 'Nongstoin Block', center: [25.5180, 91.2670] },
  { id: 'blk_umpyrtha', district_id: 'dist_ribhoi', district_name: 'Ri-Bhoi', name: 'Umsning Block', center: [25.7500, 91.8900] },
  { id: 'blk_haflong', district_id: 'dist_dima_hasao', district_name: 'Dima Hasao', name: 'Haflong Hills Block', center: [25.1764, 93.0204] },
  { id: 'blk_gangtok_east', district_id: 'dist_gangtok', district_name: 'Gangtok', name: 'Ranipool - Gangtok Block', center: [27.3389, 88.6065] }
];

// Villages
export let villages: Village[] = [
  {
    id: 'vil_sohra_town',
    block_id: 'blk_sohra',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Cherrapunji (Sohra Rim)',
    lat: 25.2890,
    lon: 91.7250,
    population: 14816,
    slope_deg: 38.5,
    elevation_m: 1430,
    soil_type: 'Clayey Loam with Sandstone overburden',
    lithology: 'Therria Sandstone / Shella Formation',
    susceptibility_base_score: 0.78,
    current_rainfall_24h_mm: 142.5,
    rainfall_7d_total_mm: 489.0,
    rainfall_72h_mm: 285.0,
    soil_moisture_pct: 88.4,
    tilt_rate_deg_day: 0.18,
    pore_pressure_kpa: 46.2,
    evacuation_center: 'Sohra Community Hall & St. John Relief Center',
    emergency_contact: '1077 / +91-3637-234221',
    nearest_road: 'SH-5 Sohra-Shella Highway',
    nearest_hospital: 'Sohra CHC Hospital (1.2 km)',
    critical_facilities_count: 5
  },
  {
    id: 'vil_nohkalikai',
    block_id: 'blk_sohra',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Nohkalikai Escarpment Cliff',
    lat: 25.2755,
    lon: 91.6850,
    population: 1240,
    slope_deg: 52.0,
    elevation_m: 1280,
    soil_type: 'Fractured Sandstone over Limestone karst',
    lithology: 'Khasi Group Quartzite & Karst limestone',
    susceptibility_base_score: 0.89,
    current_rainfall_24h_mm: 198.0,
    rainfall_7d_total_mm: 610.2,
    rainfall_72h_mm: 360.5,
    soil_moisture_pct: 94.2,
    tilt_rate_deg_day: 0.45,
    pore_pressure_kpa: 52.8,
    evacuation_center: 'Nohkalikai Primary School Shelter',
    emergency_contact: '1077 / +91-94361-88912',
    nearest_road: 'Nohkalikai Viewpoint Link Road',
    nearest_hospital: 'Sohra CHC (4.8 km)',
    critical_facilities_count: 2
  },
  {
    id: 'vil_mawsynram_central',
    block_id: 'blk_mawsynram',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Mawsynram Valley Slopes',
    lat: 25.2970,
    lon: 91.5830,
    population: 8650,
    slope_deg: 41.2,
    elevation_m: 1400,
    soil_type: 'Lateritic clayey gravel',
    lithology: 'Kyllang Granite & Sylhet Trap',
    susceptibility_base_score: 0.82,
    current_rainfall_24h_mm: 215.0,
    rainfall_7d_total_mm: 680.0,
    rainfall_72h_mm: 412.0,
    soil_moisture_pct: 96.1,
    tilt_rate_deg_day: 0.38,
    pore_pressure_kpa: 54.1,
    evacuation_center: 'Mawsynram Higher Secondary Campus',
    emergency_contact: '1077 / +91-364-2223849',
    nearest_road: 'Mawsynram-Balat Border Highway',
    nearest_hospital: 'Mawsynram CHC (0.8 km)',
    critical_facilities_count: 4
  },
  {
    id: 'vil_tyrna',
    block_id: 'blk_sohra',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Tyrna (Living Root Bridge base)',
    lat: 25.2450,
    lon: 91.6700,
    population: 1850,
    slope_deg: 46.0,
    elevation_m: 680,
    soil_type: 'Colluvial debris on steep talus',
    lithology: 'Weathered Metavolcanics',
    susceptibility_base_score: 0.85,
    current_rainfall_24h_mm: 165.0,
    rainfall_7d_total_mm: 520.4,
    rainfall_72h_mm: 310.0,
    soil_moisture_pct: 91.0,
    tilt_rate_deg_day: 0.29,
    pore_pressure_kpa: 48.0,
    evacuation_center: 'Tyrna Village Council Hall',
    emergency_contact: '+91-98630-12948',
    nearest_road: 'Tyrna Stepped Trail Road',
    nearest_hospital: 'Sohra CHC (9.5 km)',
    critical_facilities_count: 2
  },
  {
    id: 'vil_pynursla_pass',
    block_id: 'blk_pynursla',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Pynursla Ridge & Ghat',
    lat: 25.3110,
    lon: 91.9020,
    population: 6200,
    slope_deg: 34.0,
    elevation_m: 1520,
    soil_type: 'Silty loam',
    lithology: 'Shillong Group Quartzite',
    susceptibility_base_score: 0.58,
    current_rainfall_24h_mm: 78.0,
    rainfall_7d_total_mm: 240.0,
    rainfall_72h_mm: 145.0,
    soil_moisture_pct: 74.5,
    tilt_rate_deg_day: 0.05,
    pore_pressure_kpa: 36.4,
    evacuation_center: 'Pynursla BDO Community Complex',
    emergency_contact: '1077 / +91-364-2500112',
    nearest_road: 'NH-206 Shillong-Dawki Highway',
    nearest_hospital: 'Pynursla PHC (1.5 km)',
    critical_facilities_count: 3
  },
  {
    id: 'vil_mawlynnong',
    block_id: 'blk_pynursla',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Mawlynnong Slope Area',
    lat: 25.2010,
    lon: 91.9160,
    population: 950,
    slope_deg: 26.0,
    elevation_m: 490,
    soil_type: 'Gravelly sandy loam',
    lithology: 'Surma Conglomerate',
    susceptibility_base_score: 0.35,
    current_rainfall_24h_mm: 45.0,
    rainfall_7d_total_mm: 130.0,
    rainfall_72h_mm: 82.0,
    soil_moisture_pct: 62.0,
    tilt_rate_deg_day: 0.01,
    pore_pressure_kpa: 28.0,
    evacuation_center: 'Mawlynnong Community Center',
    emergency_contact: '+91-94363-22109',
    nearest_road: 'Riwai-Mawlynnong Rural Road',
    nearest_hospital: 'Pynursla PHC (14 km)',
    critical_facilities_count: 1
  },
  {
    id: 'vil_shillong_peak',
    block_id: 'blk_mylliem',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Upper Shillong & Elephant Falls',
    lat: 25.5380,
    lon: 91.8350,
    population: 24500,
    slope_deg: 31.0,
    elevation_m: 1961,
    soil_type: 'Red lateritic loam',
    lithology: 'Mylliem Granite Gneiss',
    susceptibility_base_score: 0.44,
    current_rainfall_24h_mm: 62.0,
    rainfall_7d_total_mm: 195.0,
    rainfall_72h_mm: 110.0,
    soil_moisture_pct: 68.0,
    tilt_rate_deg_day: 0.02,
    pore_pressure_kpa: 32.0,
    evacuation_center: 'State Central Library Relief Depot, Shillong',
    emergency_contact: '1077 (District Disaster Control Room)',
    nearest_road: 'NH-106 Upper Shillong Road',
    nearest_hospital: 'Civil Hospital Shillong (6 km)',
    critical_facilities_count: 7
  },
  {
    id: 'vil_nongstoin_escarpment',
    block_id: 'blk_nongstoin',
    district_id: 'dist_wkh',
    state_id: 'state_meghalaya',
    name: 'Nongstoin Valley Slopes',
    lat: 25.5180,
    lon: 91.2670,
    population: 18200,
    slope_deg: 36.5,
    elevation_m: 1409,
    soil_type: 'Weathered granite soil',
    lithology: 'Proterozoic Gneissic Complex',
    susceptibility_base_score: 0.62,
    current_rainfall_24h_mm: 92.0,
    rainfall_7d_total_mm: 290.0,
    rainfall_72h_mm: 175.0,
    soil_moisture_pct: 79.0,
    tilt_rate_deg_day: 0.08,
    pore_pressure_kpa: 39.5,
    evacuation_center: 'Nongstoin Indoor Stadium',
    emergency_contact: '+91-3654-280221',
    nearest_road: 'NH-44E Shillong-Nongstoin Highway',
    nearest_hospital: 'Nongstoin Civil Hospital (2 km)',
    critical_facilities_count: 4
  },
  {
    id: 'vil_nongpoh_highway',
    block_id: 'blk_umpyrtha',
    district_id: 'dist_ribhoi',
    state_id: 'state_meghalaya',
    name: 'Nongpoh NH-6 Bypass Slope',
    lat: 25.9030,
    lon: 91.8820,
    population: 16800,
    slope_deg: 35.0,
    elevation_m: 585,
    soil_type: 'Deep weathered red loam',
    lithology: 'Archaean Gneiss / Amphibolite',
    susceptibility_base_score: 0.69,
    current_rainfall_24h_mm: 110.0,
    rainfall_7d_total_mm: 340.0,
    rainfall_72h_mm: 215.0,
    soil_moisture_pct: 82.5,
    tilt_rate_deg_day: 0.12,
    pore_pressure_kpa: 42.0,
    evacuation_center: 'Nongpoh Govt College Shelter',
    emergency_contact: '+91-3638-232224',
    nearest_road: 'NH-6 Guwahati-Shillong Expressway',
    nearest_hospital: 'Nongpoh Civil Hospital (1 km)',
    critical_facilities_count: 5
  },
  {
    id: 'vil_dawki_ghat',
    block_id: 'blk_pynursla',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Dawki - Umngot Gorge',
    lat: 25.1850,
    lon: 92.0150,
    population: 3400,
    slope_deg: 44.0,
    elevation_m: 120,
    soil_type: 'Alluvial boulder bed & limestone cliffs',
    lithology: 'Sylhet Limestone & Sandstone',
    susceptibility_base_score: 0.74,
    current_rainfall_24h_mm: 135.0,
    rainfall_7d_total_mm: 410.0,
    rainfall_72h_mm: 260.0,
    soil_moisture_pct: 86.0,
    tilt_rate_deg_day: 0.15,
    pore_pressure_kpa: 45.0,
    evacuation_center: 'Dawki BSF & SDRF Staging Post',
    emergency_contact: '+91-364-2500889',
    nearest_road: 'NH-206 Dawki Border Highway',
    nearest_hospital: 'Dawki PHC (0.5 km)',
    critical_facilities_count: 3
  },
  {
    id: 'vil_haflong_scarp',
    block_id: 'blk_haflong',
    district_id: 'dist_dima_hasao',
    state_id: 'state_assam',
    name: 'Haflong Hill Cut Scarp',
    lat: 25.1764,
    lon: 93.0204,
    population: 43800,
    slope_deg: 42.0,
    elevation_m: 680,
    soil_type: 'Disug sandstone with loose silt strata',
    lithology: 'Barail Group Sandstone & Shale',
    susceptibility_base_score: 0.81,
    current_rainfall_24h_mm: 175.0,
    rainfall_7d_total_mm: 560.0,
    rainfall_72h_mm: 340.0,
    soil_moisture_pct: 92.0,
    tilt_rate_deg_day: 0.32,
    pore_pressure_kpa: 50.5,
    evacuation_center: 'Haflong District Sports Complex Shelter',
    emergency_contact: '1077 (DDMA Dima Hasao)',
    nearest_road: 'NH-54E Lumding-Silchar Highway',
    nearest_hospital: 'Haflong Civil Hospital (1.8 km)',
    critical_facilities_count: 6
  },
  {
    id: 'vil_gangtok_deorali',
    block_id: 'blk_gangtok_east',
    district_id: 'dist_gangtok',
    state_id: 'state_sikkim',
    name: 'Deorali - 31A National Highway Ridge',
    lat: 27.3200,
    lon: 88.6100,
    population: 32000,
    slope_deg: 45.5,
    elevation_m: 1650,
    soil_type: 'Mica-schist colluvium over phyllites',
    lithology: 'Daling Group Phyllite & Schist',
    susceptibility_base_score: 0.86,
    current_rainfall_24h_mm: 160.0,
    rainfall_7d_total_mm: 490.0,
    rainfall_72h_mm: 295.0,
    soil_moisture_pct: 89.5,
    tilt_rate_deg_day: 0.28,
    pore_pressure_kpa: 47.8,
    evacuation_center: 'Paljor Stadium Relief Staging Centre',
    emergency_contact: '1070 (State Emergency Operations Center)',
    nearest_road: 'NH-10 Sevoke-Gangtok Highway',
    nearest_hospital: 'STNM Hospital Gangtok (3 km)',
    critical_facilities_count: 8
  }
];

// Roads and Highways in NER
export let roads: RoadSegment[] = [
  {
    id: 'road_shillong_sohra',
    name: 'SH-5 Shillong - Cherrapunji (Sohra) Highway',
    highway_number: 'SH-5',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    coordinates: [
      [25.5788, 91.8933],
      [25.4800, 91.8200],
      [25.3800, 91.7600],
      [25.2986, 91.7323],
      [25.2890, 91.7250]
    ],
    status: 'CAUTION',
    blockage_reason: 'Intermittent small debris slides observed near Km 34. PWD clearance active.',
    clearing_team: 'PWD Mechanical Division Sohra & BRO Task Force',
    alternate_route_id: 'road_shillong_sohra_via_tyrna',
    last_cleared_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'road_shillong_dawki',
    name: 'NH-206 Shillong - Pynursla - Dawki Highway',
    highway_number: 'NH-206',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    coordinates: [
      [25.5788, 91.8933],
      [25.4200, 91.8900],
      [25.3110, 91.9020],
      [25.2010, 91.9160],
      [25.1850, 92.0150]
    ],
    status: 'CLEAR',
    blockage_reason: undefined,
    clearing_team: 'NHAI Maintenance Unit 4',
    last_cleared_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  },
  {
    id: 'road_guwahati_shillong',
    name: 'NH-6 Guwahati - Nongpoh - Shillong 4-Lane Expressway',
    highway_number: 'NH-6',
    state_id: 'state_meghalaya',
    district_id: 'dist_ribhoi',
    coordinates: [
      [26.1445, 91.7362],
      [25.9030, 91.8820],
      [25.7500, 91.8900],
      [25.6400, 91.9100],
      [25.5788, 91.8933]
    ],
    status: 'CLEAR',
    blockage_reason: undefined,
    clearing_team: 'NHAI Quick Response Patrol',
    last_cleared_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  },
  {
    id: 'road_sohra_nohkalikai',
    name: 'Sohra - Nohkalikai Scarp View Link Road',
    highway_number: 'MDR-22',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    coordinates: [
      [25.2890, 91.7250],
      [25.2820, 91.7050],
      [25.2755, 91.6850]
    ],
    status: 'BLOCKED',
    blockage_reason: 'Major 80m rockfall scarp displacement. Single-lane breached. Traffic strictly prohibited.',
    clearing_team: 'SDRF Disaster Response Team Alpha & PWD Excavator #4',
    alternate_route_id: 'road_shillong_sohra',
    last_cleared_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: 'road_lumding_haflong',
    name: 'NH-54E Lumding - Haflong - Silchar Hill Corridor',
    highway_number: 'NH-54E',
    state_id: 'state_assam',
    district_id: 'dist_dima_hasao',
    coordinates: [
      [25.7500, 93.1800],
      [25.4000, 93.1000],
      [25.1764, 93.0204],
      [24.9500, 92.9000]
    ],
    status: 'CAUTION',
    blockage_reason: 'Heavy waterlogging and surface mudslips between Km 52 and Km 60.',
    clearing_team: 'BRO Project Vartak Heavy Team',
    last_cleared_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: 'road_sevoke_gangtok',
    name: 'NH-10 Sevoke - Teesta Bridge - Gangtok Lifeline',
    highway_number: 'NH-10',
    state_id: 'state_sikkim',
    district_id: 'dist_gangtok',
    coordinates: [
      [26.8800, 88.4700],
      [27.0500, 88.5000],
      [27.2000, 88.5500],
      [27.3389, 88.6065]
    ],
    status: 'CAUTION',
    blockage_reason: 'Baluwakhani slide zone under high monitoring. 1-lane convoy operation under traffic police escort.',
    clearing_team: 'BRO Project Swastik Patrol Team',
    last_cleared_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  }
];

// Critical Infrastructure
export const infrastructure: InfrastructurePoint[] = [
  {
    id: 'inf_sohra_shelter',
    type: 'SHELTER',
    name: 'Sohra Multi-Purpose Cyclone & Disaster Shelter',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    lat: 25.2920,
    lon: 91.7280,
    capacity: 1200,
    occupancy_current: 340,
    status: 'OPEN',
    contact: '+91-3637-234221',
    facilities: ['Backup Solar Power', 'Medical Triage Bay', 'Potable Water Filtration', 'Community Kitchen']
  },
  {
    id: 'inf_sohra_chc',
    type: 'HOSPITAL',
    name: 'Sohra Community Health Centre (CHC Hospital)',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    lat: 25.2910,
    lon: 91.7300,
    capacity: 100,
    occupancy_current: 65,
    status: 'OPEN',
    contact: '+91-3637-234230',
    facilities: ['Trauma Care', 'Blood Storage', 'Emergency OT', '4x4 Ambulance Fleet']
  },
  {
    id: 'inf_mawsynram_shelter',
    type: 'SHELTER',
    name: 'Mawsynram Higher Secondary Relief Shelter',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    lat: 25.2980,
    lon: 91.5850,
    capacity: 850,
    occupancy_current: 280,
    status: 'OPEN',
    contact: '+91-364-2223849',
    facilities: ['Emergency Rations', 'Sanitation Blocks', 'Wireless V-SAT Link']
  },
  {
    id: 'inf_shillong_helipad',
    type: 'HELIPAD',
    name: 'Upper Shillong Air Force Disaster Airhead (Helipad)',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    lat: 25.5450,
    lon: 91.8420,
    capacity: 8,
    status: 'OPEN',
    contact: '+91-364-2500200',
    facilities: ['IAF Mi-17 Air Evac Support', 'Aviation Refueling', 'Night Landing Beacon']
  },
  {
    id: 'inf_nongstoin_shelter',
    type: 'SHELTER',
    name: 'Nongstoin Indoor Stadium Relief Camp',
    district_id: 'dist_wkh',
    district_name: 'West Khasi Hills',
    lat: 25.5210,
    lon: 91.2720,
    capacity: 1500,
    occupancy_current: 120,
    status: 'OPEN',
    contact: '+91-3654-280221',
    facilities: ['Large Hall', 'Medical Supplies', 'Dedicated Generator']
  },
  {
    id: 'inf_haflong_depot',
    type: 'RELIEF_DEPOT',
    name: 'Haflong SDRF Central Relief & Equipment Depot',
    district_id: 'dist_dima_hasao',
    district_name: 'Dima Hasao',
    lat: 25.1780,
    lon: 93.0240,
    capacity: 600,
    occupancy_current: 190,
    status: 'OPEN',
    contact: '+91-3673-236224',
    facilities: ['Hydraulic Cutters', 'Inflatable Boats', 'Excavator Depot']
  },
  {
    id: 'inf_gangtok_stnm',
    type: 'HOSPITAL',
    name: 'STNM Multispeciality Govt Hospital Gangtok',
    district_id: 'dist_gangtok',
    district_name: 'Gangtok',
    lat: 27.3250,
    lon: 88.6050,
    capacity: 1000,
    occupancy_current: 780,
    status: 'OPEN',
    contact: '+91-3592-202944',
    facilities: ['Level 1 Trauma Centre', 'Helipad Access', 'Burn Unit', 'ICU Surge Beds']
  }
];

// Geotechnical & Hydro-Meteorological Sensors
export let sensors: Sensor[] = [
  {
    id: 'sens_sohra_inclinometer_1',
    name: 'Sohra Escarpment IoT Inclinometer #01',
    type: 'INCLINOMETER',
    village_id: 'vil_sohra_town',
    village_name: 'Cherrapunji (Sohra Rim)',
    district_id: 'dist_ekh',
    lat: 25.2895,
    lon: 91.7248,
    battery_pct: 94,
    signal_dbm: -68,
    is_online: true,
    last_reading: {
      timestamp: new Date().toISOString(),
      value: 0.18,
      unit: '°/day tilt rate',
      status: 'WARNING'
    }
  },
  {
    id: 'sens_nohkalikai_piezo',
    name: 'Nohkalikai Deep Pore Piezometer Array',
    type: 'PIEZOMETER',
    village_id: 'vil_nohkalikai',
    village_name: 'Nohkalikai Cliff',
    district_id: 'dist_ekh',
    lat: 25.2758,
    lon: 91.6845,
    battery_pct: 88,
    signal_dbm: -74,
    is_online: true,
    last_reading: {
      timestamp: new Date().toISOString(),
      value: 52.8,
      unit: 'kPa pore pressure',
      status: 'ALERT'
    }
  },
  {
    id: 'sens_mawsynram_rain',
    name: 'Mawsynram Automatic Weather Station (AWS Rain Gauge)',
    type: 'RAIN_GAUGE',
    village_id: 'vil_mawsynram_central',
    village_name: 'Mawsynram Valley',
    district_id: 'dist_ekh',
    lat: 25.2975,
    lon: 91.5835,
    battery_pct: 98,
    signal_dbm: -62,
    is_online: true,
    last_reading: {
      timestamp: new Date().toISOString(),
      value: 215.0,
      unit: 'mm / 24h',
      status: 'ALERT'
    }
  },
  {
    id: 'sens_tyrna_soil_moist',
    name: 'Tyrna Colluvium Soil Moisture Sensor Array',
    type: 'SOIL_MOISTURE',
    village_id: 'vil_tyrna',
    village_name: 'Tyrna',
    district_id: 'dist_ekh',
    lat: 25.2455,
    lon: 91.6705,
    battery_pct: 82,
    signal_dbm: -80,
    is_online: true,
    last_reading: {
      timestamp: new Date().toISOString(),
      value: 91.0,
      unit: '% volumetric moisture',
      status: 'ALERT'
    }
  },
  {
    id: 'sens_haflong_gnss',
    name: 'Haflong Scarp Continuous GNSS Station',
    type: 'GNSS_DISPLACEMENT',
    village_id: 'vil_haflong_scarp',
    village_name: 'Haflong Hill Cut',
    district_id: 'dist_dima_hasao',
    lat: 25.1768,
    lon: 93.0208,
    battery_pct: 91,
    signal_dbm: -66,
    is_online: true,
    last_reading: {
      timestamp: new Date().toISOString(),
      value: 4.8,
      unit: 'mm/day displacement',
      status: 'ALERT'
    }
  },
  {
    id: 'sens_gangtok_inclinometer',
    name: 'Gangtok NH-10 Slope Inclinometer Unit',
    type: 'INCLINOMETER',
    village_id: 'vil_gangtok_deorali',
    village_name: 'Deorali Ridge',
    district_id: 'dist_gangtok',
    lat: 27.3205,
    lon: 88.6105,
    battery_pct: 87,
    signal_dbm: -71,
    is_online: true,
    last_reading: {
      timestamp: new Date().toISOString(),
      value: 0.28,
      unit: '°/day tilt rate',
      status: 'ALERT'
    }
  }
];

// Recent Landslide Events (Detailed historical & recent field records)
export let recentLandslides: RecentLandslide[] = [
  {
    event_id: 'LS-NER-2026-0089',
    date_time: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    location_name: 'Nohkalikai Escarpment Valley Km 4',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    lat: 25.2755,
    lon: 91.6850,
    severity: 'CRITICAL',
    trigger: 'Cloudburst & 24h precipitation exceeding 198mm causing structural bedding slip',
    road_affected: 'Sohra - Nohkalikai Scarp View Link Road (Blocked)',
    infrastructure_affected: 'High-tension power line tower tilted; 2 local viewpoints cordoned',
    people_affected: 340,
    casualties: 0,
    houses_damaged: 3,
    verification_status: 'VERIFIED',
    source: 'BRO Geotechnical Team & Drone Reconnaissance',
    media_urls: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    event_id: 'LS-NER-2026-0088',
    date_time: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    location_name: 'Mawsynram Valley Southern Slope',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    lat: 25.2970,
    lon: 91.5830,
    severity: 'HIGH',
    trigger: 'Continuous monsoon saturation (215mm) over weathered granite regolith',
    road_affected: 'Mawsynram-Balat Highway single lane restricted',
    infrastructure_affected: 'Culvert drainage overtopped; 1 retention wall collapsed',
    people_affected: 180,
    casualties: 0,
    houses_damaged: 1,
    verification_status: 'VERIFIED',
    source: 'DDMA East Khasi Hills Incident Team',
    media_urls: [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    event_id: 'LS-NER-2026-0085',
    date_time: new Date(Date.now() - 42 * 3600 * 1000).toISOString(),
    location_name: 'Haflong Hills Railway Cut Km 54',
    state_id: 'state_assam',
    state_name: 'Assam',
    district_id: 'dist_dima_hasao',
    district_name: 'Dima Hasao',
    lat: 25.1764,
    lon: 93.0204,
    severity: 'HIGH',
    trigger: 'Torrential downpour induced translational mudslide along hill cutting',
    road_affected: 'NH-54E Lumding-Haflong corridor slowed',
    infrastructure_affected: 'Rail ballast washed out 40m; track inspection team deployed',
    people_affected: 520,
    casualties: 0,
    houses_damaged: 2,
    verification_status: 'VERIFIED',
    source: 'N.F. Railway Disaster Unit & SDRF Assam',
    media_urls: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    event_id: 'LS-NER-2026-0082',
    date_time: new Date(Date.now() - 76 * 3600 * 1000).toISOString(),
    location_name: 'Deorali - 31A National Highway Ridge',
    state_id: 'state_sikkim',
    state_name: 'Sikkim',
    district_id: 'dist_gangtok',
    district_name: 'Gangtok',
    lat: 27.3200,
    lon: 88.6100,
    severity: 'MEDIUM',
    trigger: 'Pore pressure surge following 160mm rainfall over phyllitic rock layers',
    road_affected: 'NH-10 Gangtok approach cleared by BRO in 3 hours',
    infrastructure_affected: 'Roadside drainage repaired',
    people_affected: 120,
    casualties: 0,
    houses_damaged: 0,
    verification_status: 'VERIFIED',
    source: 'BRO Project Swastik',
    media_urls: []
  }
];

// Active Early Warnings & Alerts
export let alerts: Alert[] = [
  {
    id: 'ALT-NER-0941',
    title: 'RED ALERT: Critical Slope Failure Warning — Mawsynram & Nohkalikai',
    description: 'Autonomous BEACON AI inference triggered critical threshold breach: 24h rainfall reached 215.0mm with 96.1% soil saturation. High potential for rotational landslides and mudflow along inhabited valley bases.',
    category: 'CRITICAL_EMERGENCY',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    block_id: 'blk_mawsynram',
    block_name: 'Mawsynram Block',
    village_id: 'vil_mawsynram_central',
    village_name: 'Mawsynram Valley Slopes',
    lat: 25.2970,
    lon: 91.5830,
    severity: 'CRITICAL',
    status: 'NEW',
    trigger_condition: '24h Rainfall > 200mm AND Soil Moisture > 95% AND Tilt Rate > 0.35°/day',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    source: 'BEACON AI Hybrid Geospatial Model (v3.2)',
    affected_population: 8650,
    contributing_factors: [
      '24h Cumulative Precipitation: 215.0 mm',
      'Soil Pore Moisture Saturation: 96.1%',
      'Steep Terrain Slope: 41.2°',
      'Accelerated Displacement: 0.38°/day'
    ],
    recommended_actions: [
      'Immediate evacuation of vulnerable slope foothill settlements to Mawsynram Higher Secondary Campus.',
      'Sound community PA sirens and broadcast high-priority SMS advisories.',
      'Pre-position SDRF rescue boats and JCB clearing machinery along valley link roads.'
    ],
    evacuation_advised: true,
    broadcast_channels: ['SMS', 'WHATSAPP', 'SIREN', 'PUSH', 'IVR'],
    recipients: [
      { id: 'r1', user_name: 'Deputy Commissioner & Chairman DDMA', role: 'ddma_officer', channel: 'SMS', address: '+91-364-2223849', status: 'DELIVERED', sent_at: new Date().toISOString() },
      { id: 'r2', user_name: 'Director, State Disaster Management Authority', role: 'sdma_officer', channel: 'PUSH', address: 'sdma.meghalaya@gov.in', status: 'DELIVERED', sent_at: new Date().toISOString() },
      { id: 'r3', user_name: 'NDRF 1st Battalion Control Center', role: 'ndrf_sdrf_officer', channel: 'WHATSAPP', address: '+91-94361-XXXXX', status: 'DELIVERED', sent_at: new Date().toISOString() },
      { id: 'r4', user_name: 'Mawsynram Village Disaster Committee', role: 'field_officer', channel: 'SIREN', address: 'Community Siren Node 1', status: 'SENT', sent_at: new Date().toISOString() }
    ]
  },
  {
    id: 'ALT-NER-0938',
    title: 'RED ALERT: Escarpment Bedding Failure — Nohkalikai',
    description: 'Piezometer reading surged to 52.8 kPa pore pressure combined with 198mm rainfall. Risk of catastrophic rock detachment along Nohkalikai cliff scarp.',
    category: 'CRITICAL_EMERGENCY',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    block_id: 'blk_sohra',
    block_name: 'Sohra Block',
    village_id: 'vil_nohkalikai',
    village_name: 'Nohkalikai Escarpment Cliff',
    lat: 25.2755,
    lon: 91.6850,
    severity: 'CRITICAL',
    status: 'NEW',
    trigger_condition: 'Slope > 50° AND 24h Rain > 180mm AND Pore Pressure > 50 kPa',
    created_at: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    source: 'Geotechnical Sensor Array & BEACON ML',
    affected_population: 1240,
    contributing_factors: [
      'Slope Angle: 52.0° (Extreme Escarpment)',
      '24h Precipitation: 198.0 mm',
      'Pore Water Pressure: 52.8 kPa',
      'Displacement Velocity: 0.45°/day'
    ],
    recommended_actions: [
      'Enforce complete vehicular closure on Nohkalikai Link Road.',
      'Shift all residents of Nohkalikai Rim to primary school shelter.'
    ],
    evacuation_advised: true,
    broadcast_channels: ['SMS', 'WHATSAPP', 'SIREN'],
    recipients: [
      { id: 'r5', user_name: 'Block Disaster Nodal Officer', role: 'field_officer', channel: 'SMS', address: '+91-94361-88912', status: 'DELIVERED', sent_at: new Date().toISOString() },
      { id: 'r6', user_name: 'Superintendent of Police (Traffic & Safety)', role: 'ddma_officer', channel: 'PUSH', address: 'sp-ekh@nic.in', status: 'DELIVERED', sent_at: new Date().toISOString() }
    ]
  },
  {
    id: 'ALT-NER-0932',
    title: 'ORANGE WARNING: High Landslide Vulnerability — Cherrapunji (Sohra Rim)',
    description: 'Continuous heavy rainfall has reached 142.5mm with 88.4% soil saturation. Debris flows possible on mountain cuts and river terraces.',
    category: 'WARNING',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    block_id: 'blk_sohra',
    block_name: 'Sohra Block',
    village_id: 'vil_sohra_town',
    village_name: 'Cherrapunji (Sohra Rim)',
    lat: 25.2890,
    lon: 91.7250,
    severity: 'HIGH',
    status: 'ACKNOWLEDGED',
    acknowledged_by: 'Duty Disaster Control Officer (EKH)',
    acknowledged_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    notes: ['PWD earthmovers staged at Km 32. Police patrols monitoring single-lane transit.'],
    trigger_condition: '24h Rainfall > 130mm AND Soil Moisture > 85%',
    created_at: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    source: 'BEACON Early Warning Engine',
    affected_population: 14816,
    contributing_factors: [
      '24h Rainfall: 142.5 mm',
      'Soil Pore Moisture: 88.4%',
      'Historical Susceptibility Score: 0.78'
    ],
    recommended_actions: [
      'Deploy PWD patrols to monitor culverts and road embankments.',
      'Place relief shelters in active standby mode.'
    ],
    evacuation_advised: false,
    broadcast_channels: ['SMS', 'EMAIL', 'PUSH'],
    recipients: [
      { id: 'r7', user_name: 'Executive Engineer PWD (Roads)', role: 'bro_nhai_officer', channel: 'SMS', address: '+91-3637-234221', status: 'DELIVERED', sent_at: new Date().toISOString() }
    ]
  },
  {
    id: 'ALT-NER-0925',
    title: 'ORANGE WARNING: Translational Slide Vulnerability — Haflong Hills',
    description: 'Heavy continuous rain (175mm) has raised GNSS displacement velocity to 4.8mm/day. Road caution advised on NH-54E.',
    category: 'WARNING',
    state_id: 'state_assam',
    state_name: 'Assam',
    district_id: 'dist_dima_hasao',
    district_name: 'Dima Hasao',
    block_id: 'blk_haflong',
    block_name: 'Haflong Hills Block',
    village_id: 'vil_haflong_scarp',
    village_name: 'Haflong Hill Cut Scarp',
    lat: 25.1764,
    lon: 93.0204,
    severity: 'HIGH',
    status: 'NEW',
    trigger_condition: 'GNSS Displacement > 3.5mm/day AND 24h Rain > 150mm',
    created_at: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    source: 'GNSS Real-Time Telemetry & BEACON AI',
    affected_population: 43800,
    contributing_factors: [
      'GNSS Velocity: 4.8 mm/day',
      '24h Rainfall: 175.0 mm',
      'Loose Silt Overburden on Barail Sandstone'
    ],
    recommended_actions: [
      'Restrict heavy multi-axle freight traffic on NH-54E hill segment during night hours.',
      'Maintain NDRF flood & slide squad at Haflong Central Depot.'
    ],
    evacuation_advised: false,
    broadcast_channels: ['SMS', 'PUSH', 'IVR'],
    recipients: []
  }
];

// Active Incident Reports (Field crowdsourced + official reports)
export let incidents: IncidentReport[] = [
  {
    id: 'INC-2026-0142',
    reporter_name: 'Disaster Rapid Response Team Lead',
    reporter_phone: '+91-98630-44910',
    reporter_email: 'field.sohra@sdma.gov.in',
    reporter_role: 'field_officer',
    incident_type: 'FRESH_LANDSLIDE',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    block_id: 'blk_sohra',
    block_name: 'Sohra Block',
    village_id: 'vil_nohkalikai',
    village_name: 'Nohkalikai Escarpment Cliff',
    lat: 25.2755,
    lon: 91.6850,
    title: 'Major rockfall and debris avalanche blocking Nohkalikai tourist link road',
    description: 'Over 80 meters of cut slope fractured and slid down across both carriageway lanes following intense early morning cloudburst. 2 local houses sustained boundary wall collapse.',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    media: [
      {
        id: 'med_1',
        media_type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80',
        caption: 'Large boulders & saturated soil covering highway roadbed',
        uploaded_at: new Date(Date.now() - 88 * 60 * 1000).toISOString()
      },
      {
        id: 'med_2',
        media_type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
        caption: 'Saturated cut slope failure view with active seepage',
        uploaded_at: new Date(Date.now() - 85 * 60 * 1000).toISOString()
      }
    ],
    officer_assigned: 'Officer-in-Charge, SDRF Team Bravo',
    assigned_team: 'SDRF Quick Intervention Squad #2 & PWD Excavator Crew',
    internal_notes: [
      'Excavator #3 reached site at 16:15 IST.',
      'Power transmission line #11kV isolated to avoid electrocution hazard.',
      'Heavy clearing in progress. Estimated single-lane restoration: 4 hours.'
    ],
    road_blocked: true,
    casualties_reported: 0,
    houses_damaged: 2,
    people_affected: 340,
    source: 'FIELD_OFFICER',
    is_verified: true
  },
  {
    id: 'INC-2026-0139',
    reporter_name: 'Community Disaster Volunteer',
    reporter_phone: '+91-98630-99812',
    reporter_role: 'public_user',
    incident_type: 'SLOPE_CRACK',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    block_id: 'blk_sohra',
    block_name: 'Sohra Block',
    village_id: 'vil_sohra_town',
    village_name: 'Cherrapunji (Sohra Rim)',
    lat: 25.2895,
    lon: 91.7258,
    title: 'Culvert clogged causing road edge erosion & longitudinal tension cracks',
    description: 'Heavy floodwaters overflowing road culvert near Market ridge. The embankment beneath the concrete footpath is washing away rapidly, and visible 5cm ground fissures have appeared.',
    severity: 'MEDIUM',
    status: 'VERIFIED',
    created_at: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    media: [
      {
        id: 'med_3',
        media_type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
        caption: 'Culvert overflow and bank scour',
        uploaded_at: new Date(Date.now() - 238 * 60 * 1000).toISOString()
      }
    ],
    officer_assigned: 'Assistant Engineer, PWD Sub-Division Sohra',
    assigned_team: 'PWD Emergency Repair Wing',
    internal_notes: ['Sandbag barrier erected by local youth committee. Drain unclogged.'],
    road_blocked: false,
    casualties_reported: 0,
    houses_damaged: 0,
    people_affected: 80,
    source: 'CITIZEN',
    is_verified: true
  },
  {
    id: 'INC-2026-0135',
    reporter_name: 'Highway Patrol Officer',
    reporter_phone: '+91-94363-12400',
    reporter_role: 'bro_nhai_officer',
    incident_type: 'ROAD_BLOCKAGE',
    state_id: 'state_meghalaya',
    district_id: 'dist_ribhoi',
    district_name: 'Ri-Bhoi',
    block_id: 'blk_umpyrtha',
    block_name: 'Umsning Block',
    village_id: 'vil_nongpoh_highway',
    village_name: 'Nongpoh NH-6 Bypass Slope',
    lat: 25.9030,
    lon: 91.8820,
    title: 'Slurry mudflow on NH-6 bypass outer curve',
    description: 'Mud covering outer lane, causing slow traffic for heavy freight vehicles traveling towards Guwahati. Road cleared with JCB in 45 minutes.',
    severity: 'LOW',
    status: 'CLOSED',
    created_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    media: [],
    officer_assigned: 'NHAI Patrol Officer',
    assigned_team: 'NHAI Quick Incident Unit',
    internal_notes: ['JCB cleared mud in 45 mins. Highway fully restored.'],
    road_blocked: false,
    casualties_reported: 0,
    houses_damaged: 0,
    people_affected: 0,
    source: 'PATROL_TEAM',
    is_verified: true
  }
];

// Initial Master Users representing all 9 Roles & Major Organizations (No hard-coded person names!)
export const initialUsers: User[] = [
  {
    id: 'usr_super_admin',
    name: 'Super Administrator',
    email: 'admin.beacon@gov.in',
    phone: '+91-11-23022401',
    role: 'super_admin',
    organization: 'MDoNER',
    designation: 'Joint Secretary (Disaster Risk Reduction)',
    department: 'Ministry of Development of North Eastern Region (MDoNER)',
    allowed_regions: ['state_meghalaya', 'state_assam', 'state_sikkim', 'state_arunachal'],
    preferred_language: 'en',
    avatar_initials: 'SA',
    is_verified: true,
    notifications_enabled: { email: true, sms: true, push: true, whatsapp: true }
  },
  {
    id: 'usr_mdoner_admin',
    name: 'MDoNER Regional Officer',
    email: 'mdoner.drr@gov.in',
    phone: '+91-11-23022405',
    role: 'mdoner_admin',
    organization: 'MDoNER',
    designation: 'Director (Regional Disaster Operations)',
    department: 'Ministry of Development of North Eastern Region',
    allowed_regions: ['state_meghalaya', 'state_assam', 'state_sikkim', 'state_arunachal'],
    preferred_language: 'en',
    avatar_initials: 'MO',
    is_verified: true,
    notifications_enabled: { email: true, sms: true, push: true, whatsapp: true }
  },
  {
    id: 'usr_sdma_meghalaya',
    name: 'State Disaster Management Officer',
    email: 'sdma.meghalaya@gov.in',
    phone: '+91-364-2502120',
    role: 'sdma_officer',
    organization: 'SDMA Meghalaya',
    designation: 'Executive Director, State Disaster Management Authority',
    department: 'Revenue & Disaster Management Department',
    allowed_regions: ['state_meghalaya'],
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    preferred_language: 'en',
    avatar_initials: 'SD',
    is_verified: true,
    notifications_enabled: { email: true, sms: true, push: true, whatsapp: true }
  },
  {
    id: 'usr_ddma_ekh',
    name: 'District Disaster Management Officer',
    email: 'ddma.ekh@nic.in',
    phone: '+91-364-2223849',
    role: 'ddma_officer',
    organization: 'DDMA Meghalaya',
    designation: 'District Collector & Chairman DDMA',
    department: 'East Khasi Hills District Emergency Operations Center',
    allowed_regions: ['dist_ekh'],
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    preferred_language: 'en',
    avatar_initials: 'DD',
    is_verified: true,
    notifications_enabled: { email: true, sms: true, push: true, whatsapp: true }
  },
  {
    id: 'usr_ndrf_commander',
    name: 'Disaster Response Commander',
    email: 'ndrf.bn1@nic.in',
    phone: '+91-361-2849200',
    role: 'ndrf_sdrf_officer',
    organization: 'NDRF',
    designation: 'Commandant, 1st Battalion NDRF',
    department: 'National Disaster Response Force (North East Zone)',
    allowed_regions: ['state_meghalaya', 'state_assam', 'state_sikkim', 'state_arunachal'],
    preferred_language: 'en',
    avatar_initials: 'NR',
    is_verified: true,
    notifications_enabled: { email: true, sms: true, push: true, whatsapp: true }
  },
  {
    id: 'usr_bro_officer',
    name: 'Border Roads Taskforce Commander',
    email: 'bro.vartak@nic.in',
    phone: '+91-364-2500800',
    role: 'bro_nhai_officer',
    organization: 'BRO',
    designation: 'Superintending Engineer (Highways & Slope Stabilization)',
    department: 'Border Roads Organisation / Project Swastik',
    allowed_regions: ['state_meghalaya', 'state_assam', 'state_sikkim'],
    preferred_language: 'en',
    avatar_initials: 'BR',
    is_verified: true,
    notifications_enabled: { email: true, sms: true, push: true, whatsapp: true }
  },
  {
    id: 'usr_scientist_nesac',
    name: 'Geotechnical & Earth Observation Scientist',
    email: 'scientist.nesac@isro.gov.in',
    phone: '+91-364-2570140',
    role: 'scientist',
    organization: 'ISRO / NRSC',
    designation: 'Lead Scientist (Geohazards & Remote Sensing)',
    department: 'North Eastern Space Applications Centre (NESAC / ISRO)',
    allowed_regions: ['state_meghalaya', 'state_assam', 'state_sikkim', 'state_arunachal'],
    preferred_language: 'en',
    avatar_initials: 'IS',
    is_verified: true,
    notifications_enabled: { email: true, sms: true, push: true, whatsapp: true }
  },
  {
    id: 'usr_field_inspector',
    name: 'Sub-Divisional Field Nodal Officer',
    email: 'field.nodal@sdma.gov.in',
    phone: '+91-98630-44910',
    role: 'field_officer',
    organization: 'District Administration',
    designation: 'Revenue Inspector & Disaster Field Nodal Officer',
    department: 'Sohra Civil Sub-Division',
    allowed_regions: ['dist_ekh', 'blk_sohra', 'blk_mawsynram'],
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    preferred_language: 'en',
    avatar_initials: 'FO',
    is_verified: true,
    notifications_enabled: { email: false, sms: true, push: true, whatsapp: true }
  },
  {
    id: 'usr_citizen',
    name: 'Community Safety Volunteer',
    email: 'volunteer.community@gmail.com',
    phone: '+91-94361-77823',
    role: 'public_user',
    organization: 'General Public',
    designation: 'Citizen / Community Volunteer',
    department: 'Village Disaster Defense Task Force',
    allowed_regions: ['state_meghalaya'],
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    preferred_language: 'en',
    avatar_initials: 'CV',
    is_verified: true,
    notifications_enabled: { email: true, sms: true, push: true, whatsapp: true }
  }
];

export let currentUser: User = initialUsers[0];

// Helper to compute dynamic risk snapshot for a village
export function computeRiskForVillage(v: Village, forecastOffsetHours = 0): RiskSnapshot {
  let rainFactor = 1.0;
  if (forecastOffsetHours === 6) rainFactor = 1.15;
  if (forecastOffsetHours === 24) rainFactor = 1.35;
  if (forecastOffsetHours === 48) rainFactor = 1.10;
  if (forecastOffsetHours === 72) rainFactor = 0.85;

  const effectiveRain24h = v.current_rainfall_24h_mm * rainFactor;
  const effectiveMoisture = Math.min(100, v.soil_moisture_pct * (forecastOffsetHours > 0 ? (1 + (rainFactor - 1) * 0.4) : 1));

  // Formula: R = 0.35 * (Rain_24h / 200) + 0.25 * (Slope / 60) + 0.20 * (Moisture / 100) + 0.15 * (Base_Susceptibility) + 0.05 * (Tilt_Rate / 0.5)
  const normRain = Math.min(1.0, effectiveRain24h / 200);
  const normSlope = Math.min(1.0, v.slope_deg / 60);
  const normMoisture = Math.min(1.0, effectiveMoisture / 100);
  const normTilt = Math.min(1.0, v.tilt_rate_deg_day / 0.5);

  const rawScore = (
    0.35 * normRain +
    0.25 * normSlope +
    0.20 * normMoisture +
    0.15 * v.susceptibility_base_score +
    0.05 * normTilt
  );

  const risk_score = Number(Math.min(0.99, Math.max(0.08, rawScore)).toFixed(2));

  let risk_level: RiskLevel = 'LOW';
  if (risk_score >= 0.78 || effectiveRain24h > 180 || v.slope_deg >= 50) {
    risk_level = 'CRITICAL';
  } else if (risk_score >= 0.58 || effectiveRain24h > 120 || v.slope_deg >= 38) {
    risk_level = 'HIGH';
  } else if (risk_score >= 0.35 || effectiveRain24h > 60) {
    risk_level = 'MODERATE';
  }

  const factors: string[] = [];
  if (effectiveRain24h >= 140) factors.push(`Excessive 24h Rainfall (${effectiveRain24h.toFixed(1)} mm)`);
  else if (effectiveRain24h >= 80) factors.push(`Moderate Precipitation Accumulation (${effectiveRain24h.toFixed(1)} mm)`);

  if (v.slope_deg >= 40) factors.push(`Steep Mountain Slope Gradient (${v.slope_deg}°)`);
  if (effectiveMoisture >= 85) factors.push(`Critical Soil Pore Water Saturation (${effectiveMoisture.toFixed(1)}%)`);
  if (v.tilt_rate_deg_day >= 0.2) factors.push(`Accelerated Ground Inclinometer Displacement (${v.tilt_rate_deg_day}°/day)`);
  if (v.susceptibility_base_score >= 0.75) factors.push(`High Lithological Fragility (${v.lithology})`);

  const recommendations: string[] = [];
  if (risk_level === 'CRITICAL') {
    recommendations.push('Immediate evacuation of vulnerable slope foothill settlements.');
    recommendations.push('Sound local sirens & broadcast emergency SMS alerts.');
    recommendations.push('Deploy NDRF/SDRF rescue teams to designated staging shelters.');
    recommendations.push('Close vulnerable highway segments (SH-5 & NH-6 ghats).');
  } else if (risk_level === 'HIGH') {
    recommendations.push('Issue Orange Advisory to Village Heads and PWD patrol.');
    recommendations.push('Inspect culverts, drains and pre-position heavy earthmoving machinery.');
    recommendations.push('Prepare designated shelters for potential nighttime evacuation.');
  } else if (risk_level === 'MODERATE') {
    recommendations.push('Routine monitoring of IoT inclinometers and rain gauges.');
    recommendations.push('Caution vehicular traffic on mountain road bends.');
  } else {
    recommendations.push('Normal conditions. Standard geological monitoring.');
  }

  return {
    id: `RS-${v.id}-${forecastOffsetHours}h`,
    village_id: v.id,
    village_name: v.name,
    district_name: initialDistricts.find(d => d.id === v.district_id)?.name || 'East Khasi Hills',
    state_name: initialStates.find(s => s.id === v.state_id)?.name || 'Meghalaya',
    lat: v.lat,
    lon: v.lon,
    timestamp: new Date().toISOString(),
    risk_score,
    risk_level,
    contributing_factors: factors,
    rainfall_24h_mm: effectiveRain24h,
    rainfall_72h_mm: v.rainfall_72h_mm,
    slope_deg: v.slope_deg,
    soil_moisture_pct: effectiveMoisture,
    pore_pressure_kpa: Number((effectiveMoisture * 0.52).toFixed(1)),
    model_version: 'BEACON-v3.2-HybridML',
    recommended_actions: recommendations,
    exposed_population: v.population,
    evacuation_advised: risk_level === 'CRITICAL'
  };
}

// Generate Forecast for 6h, 24h, 48h, 72h
export function computeForecastsForVillage(v: Village): RiskForecast[] {
  const horizons = [6, 24, 48, 72];
  return horizons.map(h => {
    const snap = computeRiskForVillage(v, h);
    return {
      id: `FC-${v.id}-${h}h`,
      village_id: v.id,
      horizon_hours: h,
      valid_time: new Date(Date.now() + h * 3600 * 1000).toISOString(),
      risk_score: snap.risk_score,
      risk_level: snap.risk_level,
      predicted_rainfall_mm: Number(snap.rainfall_24h_mm.toFixed(1)),
      predicted_soil_moisture: snap.soil_moisture_pct,
      confidence_pct: Math.max(70, Math.round(96 - h * 0.3))
    };
  });
}

// Safe Route Finder calculation engine
export function calculateSafeRoute(
  origin: string,
  destination: string,
  transportMode: 'light_vehicle' | 'heavy_truck' | 'ambulance' | 'pedestrian'
): SafeRouteResult[] {
  // Return both Safest Route and Fastest Alternative Route
  const isEmergency = transportMode === 'ambulance';
  
  const safestResult: SafeRouteResult = {
    route_id: `SR-SAFE-${Date.now().toString().slice(-4)}`,
    title: 'Recommended Safe Disaster Corridor (Avoids Active Scarp Slides)',
    type: 'SAFEST',
    distance_km: 68.4,
    est_duration_mins: isEmergency ? 52 : 78,
    overall_safety_rating: 'VERY_SAFE',
    hazard_points_count: 1,
    blockages_avoided: 2,
    coordinates: [
      [25.5788, 91.8933],
      [25.5200, 91.8700],
      [25.4400, 91.8400],
      [25.3800, 91.8000],
      [25.3110, 91.9020],
      [25.2890, 91.7250]
    ],
    segments: [
      {
        from: 'Shillong Bypass',
        to: 'Mylliem Ridge Link',
        road_name: 'NH-106 High Ridge Highway',
        status: 'CLEAR',
        risk_level: 'LOW',
        rainfall_intensity_mm: 62.0,
        slope_stability_index: 0.88,
        warning_message: 'Stable geology. Low precipitation impact.',
        distance_km: 18.2,
        est_time_mins: 20
      },
      {
        from: 'Mylliem Ridge',
        to: 'Pynursla High Corridor',
        road_name: 'NH-206 Southbound All-Weather Road',
        status: 'CLEAR',
        risk_level: 'MODERATE',
        rainfall_intensity_mm: 78.0,
        slope_stability_index: 0.76,
        warning_message: 'Moderate rain. PWD patrol active.',
        distance_km: 26.5,
        est_time_mins: 32
      },
      {
        from: 'Pynursla High Corridor',
        to: 'Cherrapunji (Sohra Rim)',
        road_name: 'Sohra East Bypass (All-Weather Asphalt)',
        status: 'CAUTION',
        risk_level: 'MODERATE',
        rainfall_intensity_mm: 110.0,
        slope_stability_index: 0.69,
        warning_message: 'Drive cautiously near culvertKm 28.',
        distance_km: 23.7,
        est_time_mins: 26
      }
    ],
    emergency_shelters_along_path: [
      infrastructure[0], // Sohra Shelter
      infrastructure[2]  // Mawsynram Shelter
    ],
    emergency_contacts_along_path: [
      { name: 'State Emergency Control (SEOC)', phone: '1070', station: 'Shillong HQ' },
      { name: 'District Disaster Control Room', phone: '1077', station: 'EKH District Administration' },
      { name: 'NDRF Quick Deployment Unit', phone: '+91-361-2849200', station: 'Guwahati Base' }
    ]
  };

  const fastestResult: SafeRouteResult = {
    route_id: `SR-FAST-${Date.now().toString().slice(-4)}`,
    title: 'Direct Mountain Highway (Caution: Crosses Active High Hazard Zones)',
    type: 'FASTEST',
    distance_km: 54.0,
    est_duration_mins: isEmergency ? 42 : 65,
    overall_safety_rating: 'CAUTION_ADVISED',
    hazard_points_count: 4,
    blockages_avoided: 0,
    coordinates: [
      [25.5788, 91.8933],
      [25.4800, 91.8200],
      [25.3800, 91.7600],
      [25.2986, 91.7323],
      [25.2890, 91.7250]
    ],
    segments: [
      {
        from: 'Shillong City Limit',
        to: 'Mawkdok Dympep Bridge',
        road_name: 'SH-5 Main Highway',
        status: 'CLEAR',
        risk_level: 'MODERATE',
        rainfall_intensity_mm: 95.0,
        slope_stability_index: 0.72,
        warning_message: 'Dense fog and slippery mountain bends.',
        distance_km: 24.0,
        est_time_mins: 28
      },
      {
        from: 'Mawkdok Gorge',
        to: 'Sohra Town Entrance',
        road_name: 'SH-5 Sohra Mountain Cut Road',
        status: 'CAUTION',
        risk_level: 'HIGH',
        rainfall_intensity_mm: 142.5,
        slope_stability_index: 0.52,
        warning_message: 'Active debris fall alert near Km 34. PWD machinery operating.',
        distance_km: 30.0,
        est_time_mins: 37
      }
    ],
    emergency_shelters_along_path: [infrastructure[0]],
    emergency_contacts_along_path: [
      { name: 'District Disaster Control Room', phone: '1077', station: 'EKH District HQ' }
    ]
  };

  return [safestResult, fastestResult];
}

// Trigger Simulated 24h Heavy Rain (SIH Demo Action)
export function simulateHeavyRainCloudburst(targetVillageIds?: string[]) {
  const targets = targetVillageIds && targetVillageIds.length > 0 
    ? targetVillageIds 
    : ['vil_sohra_town', 'vil_nohkalikai', 'vil_mawsynram_central', 'vil_tyrna', 'vil_dawki_ghat', 'vil_haflong_scarp'];

  villages = villages.map(v => {
    if (targets.includes(v.id)) {
      const addedRain = Math.floor(Math.random() * 80) + 160; // 160mm - 240mm
      const new24hRain = v.current_rainfall_24h_mm + addedRain;
      const newMoisture = Math.min(99.4, v.soil_moisture_pct + 12);
      const newTilt = Number((v.tilt_rate_deg_day + 0.25).toFixed(2));
      return {
        ...v,
        current_rainfall_24h_mm: new24hRain,
        rainfall_7d_total_mm: v.rainfall_7d_total_mm + addedRain,
        soil_moisture_pct: newMoisture,
        tilt_rate_deg_day: newTilt
      };
    }
    return v;
  });

  // Recompute alerts
  villages.forEach(v => {
    const snap = computeRiskForVillage(v, 0);
    if (snap.risk_level === 'CRITICAL' || snap.risk_level === 'HIGH') {
      const existing = alerts.find(a => a.village_id === v.id && a.status === 'NEW');
      if (!existing) {
        const newAlert: Alert = {
          id: `ALT-SIM-${Date.now().toString().slice(-4)}`,
          title: `${snap.risk_level} Landslide Warning: ${v.name}`,
          description: `BEACON AI Model triggered automatic alert: 24h rainfall spiked to ${snap.rainfall_24h_mm.toFixed(1)}mm with ${snap.slope_deg}° slope angle. Risk score: ${snap.risk_score}.`,
          category: snap.risk_level === 'CRITICAL' ? 'CRITICAL_EMERGENCY' : 'WARNING',
          state_id: v.state_id,
          state_name: initialStates.find(s => s.id === v.state_id)?.name || 'Meghalaya',
          district_id: v.district_id,
          district_name: initialDistricts.find(d => d.id === v.district_id)?.name || 'East Khasi Hills',
          block_id: v.block_id,
          block_name: initialBlocks.find(b => b.id === v.block_id)?.name || 'Sohra Block',
          village_id: v.id,
          village_name: v.name,
          lat: v.lat,
          lon: v.lon,
          severity: snap.risk_level as Alert['severity'],
          status: 'NEW',
          trigger_condition: `24h Rainfall ${snap.rainfall_24h_mm.toFixed(1)}mm > 150mm`,
          created_at: new Date().toISOString(),
          valid_until: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          source: 'BEACON AI Automatic Inundation Engine',
          affected_population: v.population,
          contributing_factors: snap.contributing_factors,
          recommended_actions: snap.recommended_actions,
          evacuation_advised: snap.risk_level === 'CRITICAL',
          broadcast_channels: ['SMS', 'PUSH', 'WHATSAPP', 'SIREN'],
          recipients: [
            { id: 'sim_r1', user_name: 'Deputy Commissioner & Chairman DDMA', role: 'ddma_officer', channel: 'SMS', address: '+91-364-2223849', status: 'SENT', sent_at: new Date().toISOString() },
            { id: 'sim_r2', user_name: 'Disaster Cell Field Officer', role: 'field_officer', channel: 'WHATSAPP', address: '+91-98630-XXXXX', status: 'SENT', sent_at: new Date().toISOString() },
            { id: 'sim_r3', user_name: 'Community Siren Broadcast System', role: 'public_user', channel: 'SIREN', address: 'Village PA System', status: 'SENT', sent_at: new Date().toISOString() }
          ]
        };
        alerts.unshift(newAlert);
      }
    }
  });

  // Update roads status
  roads = roads.map(r => {
    if (r.id === 'road_shillong_sohra') {
      return { ...r, status: 'BLOCKED', blockage_reason: 'Torrential cloudburst triggered fresh debris flows at Km 32' };
    }
    return r;
  });

  // Update sensors
  sensors = sensors.map(s => {
    if (s.type === 'RAIN_GAUGE') {
      return {
        ...s,
        last_reading: {
          timestamp: new Date().toISOString(),
          value: Number((s.last_reading.value + 120).toFixed(1)),
          unit: 'mm / 24h',
          status: 'ALERT'
        }
      };
    }
    if (s.type === 'INCLINOMETER') {
      return {
        ...s,
        last_reading: {
          timestamp: new Date().toISOString(),
          value: Number((s.last_reading.value + 0.3).toFixed(2)),
          unit: '°/day tilt rate',
          status: 'ALERT'
        }
      };
    }
    return s;
  });

  return {
    success: true,
    message: '24h Extreme Heavy Monsoon Cloudburst injected successfully into monitored districts.',
    villages_updated: targets.length,
    new_alerts_count: alerts.filter(a => a.status === 'NEW').length,
    villages,
    alerts
  };
}

// Reset data to baseline
export function resetSimulationBaseline() {
  villages = [
    {
      id: 'vil_sohra_town',
      block_id: 'blk_sohra',
      district_id: 'dist_ekh',
      state_id: 'state_meghalaya',
      name: 'Cherrapunji (Sohra Rim)',
      lat: 25.2890,
      lon: 91.7250,
      population: 14816,
      slope_deg: 38.5,
      elevation_m: 1430,
      soil_type: 'Clayey Loam with Sandstone overburden',
      lithology: 'Therria Sandstone / Shella Formation',
      susceptibility_base_score: 0.78,
      current_rainfall_24h_mm: 142.5,
      rainfall_7d_total_mm: 489.0,
      rainfall_72h_mm: 285.0,
      soil_moisture_pct: 88.4,
      tilt_rate_deg_day: 0.18,
      pore_pressure_kpa: 46.2,
      evacuation_center: 'Sohra Community Hall & St. John Relief Center',
      emergency_contact: '1077 / +91-3637-234221',
      nearest_road: 'SH-5 Sohra-Shella Highway',
      nearest_hospital: 'Sohra CHC Hospital (1.2 km)',
      critical_facilities_count: 5
    },
    {
      id: 'vil_nohkalikai',
      block_id: 'blk_sohra',
      district_id: 'dist_ekh',
      state_id: 'state_meghalaya',
      name: 'Nohkalikai Escarpment Cliff',
      lat: 25.2755,
      lon: 91.6850,
      population: 1240,
      slope_deg: 52.0,
      elevation_m: 1280,
      soil_type: 'Fractured Sandstone over Limestone karst',
      lithology: 'Khasi Group Quartzite & Karst limestone',
      susceptibility_base_score: 0.89,
      current_rainfall_24h_mm: 198.0,
      rainfall_7d_total_mm: 610.2,
      rainfall_72h_mm: 360.5,
      soil_moisture_pct: 94.2,
      tilt_rate_deg_day: 0.45,
      pore_pressure_kpa: 52.8,
      evacuation_center: 'Nohkalikai Primary School Shelter',
      emergency_contact: '1077 / +91-94361-88912',
      nearest_road: 'Nohkalikai Viewpoint Link Road',
      nearest_hospital: 'Sohra CHC (4.8 km)',
      critical_facilities_count: 2
    },
    {
      id: 'vil_mawsynram_central',
      block_id: 'blk_mawsynram',
      district_id: 'dist_ekh',
      state_id: 'state_meghalaya',
      name: 'Mawsynram Valley Slopes',
      lat: 25.2970,
      lon: 91.5830,
      population: 8650,
      slope_deg: 41.2,
      elevation_m: 1400,
      soil_type: 'Lateritic clayey gravel',
      lithology: 'Kyllang Granite & Sylhet Trap',
      susceptibility_base_score: 0.82,
      current_rainfall_24h_mm: 215.0,
      rainfall_7d_total_mm: 680.0,
      rainfall_72h_mm: 412.0,
      soil_moisture_pct: 96.1,
      tilt_rate_deg_day: 0.38,
      pore_pressure_kpa: 54.1,
      evacuation_center: 'Mawsynram Higher Secondary Campus',
      emergency_contact: '1077 / +91-364-2223849',
      nearest_road: 'Mawsynram-Balat Border Highway',
      nearest_hospital: 'Mawsynram CHC (0.8 km)',
      critical_facilities_count: 4
    },
    {
      id: 'vil_tyrna',
      block_id: 'blk_sohra',
      district_id: 'dist_ekh',
      state_id: 'state_meghalaya',
      name: 'Tyrna (Living Root Bridge base)',
      lat: 25.2450,
      lon: 91.6700,
      population: 1850,
      slope_deg: 46.0,
      elevation_m: 680,
      soil_type: 'Colluvial debris on steep talus',
      lithology: 'Weathered Metavolcanics',
      susceptibility_base_score: 0.85,
      current_rainfall_24h_mm: 165.0,
      rainfall_7d_total_mm: 520.4,
      rainfall_72h_mm: 310.0,
      soil_moisture_pct: 91.0,
      tilt_rate_deg_day: 0.29,
      pore_pressure_kpa: 48.0,
      evacuation_center: 'Tyrna Village Council Hall',
      emergency_contact: '+91-98630-12948',
      nearest_road: 'Tyrna Stepped Trail Road',
      nearest_hospital: 'Sohra CHC (9.5 km)',
      critical_facilities_count: 2
    },
    {
      id: 'vil_pynursla_pass',
      block_id: 'blk_pynursla',
      district_id: 'dist_ekh',
      state_id: 'state_meghalaya',
      name: 'Pynursla Ridge & Ghat',
      lat: 25.3110,
      lon: 91.9020,
      population: 6200,
      slope_deg: 34.0,
      elevation_m: 1520,
      soil_type: 'Silty loam',
      lithology: 'Shillong Group Quartzite',
      susceptibility_base_score: 0.58,
      current_rainfall_24h_mm: 78.0,
      rainfall_7d_total_mm: 240.0,
      rainfall_72h_mm: 145.0,
      soil_moisture_pct: 74.5,
      tilt_rate_deg_day: 0.05,
      pore_pressure_kpa: 36.4,
      evacuation_center: 'Pynursla BDO Community Complex',
      emergency_contact: '1077 / +91-364-2500112',
      nearest_road: 'NH-206 Shillong-Dawki Highway',
      nearest_hospital: 'Pynursla PHC (1.5 km)',
      critical_facilities_count: 3
    },
    {
      id: 'vil_mawlynnong',
      block_id: 'blk_pynursla',
      district_id: 'dist_ekh',
      state_id: 'state_meghalaya',
      name: 'Mawlynnong Slope Area',
      lat: 25.2010,
      lon: 91.9160,
      population: 950,
      slope_deg: 26.0,
      elevation_m: 490,
      soil_type: 'Gravelly sandy loam',
      lithology: 'Surma Conglomerate',
      susceptibility_base_score: 0.35,
      current_rainfall_24h_mm: 45.0,
      rainfall_7d_total_mm: 130.0,
      rainfall_72h_mm: 82.0,
      soil_moisture_pct: 62.0,
      tilt_rate_deg_day: 0.01,
      pore_pressure_kpa: 28.0,
      evacuation_center: 'Mawlynnong Community Center',
      emergency_contact: '+91-94363-22109',
      nearest_road: 'Riwai-Mawlynnong Rural Road',
      nearest_hospital: 'Pynursla PHC (14 km)',
      critical_facilities_count: 1
    },
    {
      id: 'vil_shillong_peak',
      block_id: 'blk_mylliem',
      district_id: 'dist_ekh',
      state_id: 'state_meghalaya',
      name: 'Upper Shillong & Elephant Falls',
      lat: 25.5380,
      lon: 91.8350,
      population: 24500,
      slope_deg: 31.0,
      elevation_m: 1961,
      soil_type: 'Red lateritic loam',
      lithology: 'Mylliem Granite Gneiss',
      susceptibility_base_score: 0.44,
      current_rainfall_24h_mm: 62.0,
      rainfall_7d_total_mm: 195.0,
      rainfall_72h_mm: 110.0,
      soil_moisture_pct: 68.0,
      tilt_rate_deg_day: 0.02,
      pore_pressure_kpa: 32.0,
      evacuation_center: 'State Central Library Relief Depot, Shillong',
      emergency_contact: '1077 (District Disaster Control Room)',
      nearest_road: 'NH-106 Upper Shillong Road',
      nearest_hospital: 'Civil Hospital Shillong (6 km)',
      critical_facilities_count: 7
    },
    {
      id: 'vil_nongstoin_escarpment',
      block_id: 'blk_nongstoin',
      district_id: 'dist_wkh',
      state_id: 'state_meghalaya',
      name: 'Nongstoin Valley Slopes',
      lat: 25.5180,
      lon: 91.2670,
      population: 18200,
      slope_deg: 36.5,
      elevation_m: 1409,
      soil_type: 'Weathered granite soil',
      lithology: 'Proterozoic Gneissic Complex',
      susceptibility_base_score: 0.62,
      current_rainfall_24h_mm: 92.0,
      rainfall_7d_total_mm: 290.0,
      rainfall_72h_mm: 175.0,
      soil_moisture_pct: 79.0,
      tilt_rate_deg_day: 0.08,
      pore_pressure_kpa: 39.5,
      evacuation_center: 'Nongstoin Indoor Stadium',
      emergency_contact: '+91-3654-280221',
      nearest_road: 'NH-44E Shillong-Nongstoin Highway',
      nearest_hospital: 'Nongstoin Civil Hospital (2 km)',
      critical_facilities_count: 4
    },
    {
      id: 'vil_nongpoh_highway',
      block_id: 'blk_umpyrtha',
      district_id: 'dist_ribhoi',
      state_id: 'state_meghalaya',
      name: 'Nongpoh NH-6 Bypass Slope',
      lat: 25.9030,
      lon: 91.8820,
      population: 16800,
      slope_deg: 35.0,
      elevation_m: 585,
      soil_type: 'Deep weathered red loam',
      lithology: 'Archaean Gneiss / Amphibolite',
      susceptibility_base_score: 0.69,
      current_rainfall_24h_mm: 110.0,
      rainfall_7d_total_mm: 340.0,
      rainfall_72h_mm: 215.0,
      soil_moisture_pct: 82.5,
      tilt_rate_deg_day: 0.12,
      pore_pressure_kpa: 42.0,
      evacuation_center: 'Nongpoh Govt College Shelter',
      emergency_contact: '+91-3638-232224',
      nearest_road: 'NH-6 Guwahati-Shillong Expressway',
      nearest_hospital: 'Nongpoh Civil Hospital (1 km)',
      critical_facilities_count: 5
    },
    {
      id: 'vil_dawki_ghat',
      block_id: 'blk_pynursla',
      district_id: 'dist_ekh',
      state_id: 'state_meghalaya',
      name: 'Dawki - Umngot Gorge',
      lat: 25.1850,
      lon: 92.0150,
      population: 3400,
      slope_deg: 44.0,
      elevation_m: 120,
      soil_type: 'Alluvial boulder bed & limestone cliffs',
      lithology: 'Sylhet Limestone & Sandstone',
      susceptibility_base_score: 0.74,
      current_rainfall_24h_mm: 135.0,
      rainfall_7d_total_mm: 410.0,
      rainfall_72h_mm: 260.0,
      soil_moisture_pct: 86.0,
      tilt_rate_deg_day: 0.15,
      pore_pressure_kpa: 45.0,
      evacuation_center: 'Dawki BSF & SDRF Staging Post',
      emergency_contact: '+91-364-2500889',
      nearest_road: 'NH-206 Dawki Border Highway',
      nearest_hospital: 'Dawki PHC (0.5 km)',
      critical_facilities_count: 3
    },
    {
      id: 'vil_haflong_scarp',
      block_id: 'blk_haflong',
      district_id: 'dist_dima_hasao',
      state_id: 'state_assam',
      name: 'Haflong Hill Cut Scarp',
      lat: 25.1764,
      lon: 93.0204,
      population: 43800,
      slope_deg: 42.0,
      elevation_m: 680,
      soil_type: 'Disug sandstone with loose silt strata',
      lithology: 'Barail Group Sandstone & Shale',
      susceptibility_base_score: 0.81,
      current_rainfall_24h_mm: 175.0,
      rainfall_7d_total_mm: 560.0,
      rainfall_72h_mm: 340.0,
      soil_moisture_pct: 92.0,
      tilt_rate_deg_day: 0.32,
      pore_pressure_kpa: 50.5,
      evacuation_center: 'Haflong District Sports Complex Shelter',
      emergency_contact: '1077 (DDMA Dima Hasao)',
      nearest_road: 'NH-54E Lumding-Silchar Highway',
      nearest_hospital: 'Haflong Civil Hospital (1.8 km)',
      critical_facilities_count: 6
    },
    {
      id: 'vil_gangtok_deorali',
      block_id: 'blk_gangtok_east',
      district_id: 'dist_gangtok',
      state_id: 'state_sikkim',
      name: 'Deorali - 31A National Highway Ridge',
      lat: 27.3200,
      lon: 88.6100,
      population: 32000,
      slope_deg: 45.5,
      elevation_m: 1650,
      soil_type: 'Mica-schist colluvium over phyllites',
      lithology: 'Daling Group Phyllite & Schist',
      susceptibility_base_score: 0.86,
      current_rainfall_24h_mm: 160.0,
      rainfall_7d_total_mm: 490.0,
      rainfall_72h_mm: 295.0,
      soil_moisture_pct: 89.5,
      tilt_rate_deg_day: 0.28,
      pore_pressure_kpa: 47.8,
      evacuation_center: 'Paljor Stadium Relief Staging Centre',
      emergency_contact: '1070 (State Emergency Operations Center)',
      nearest_road: 'NH-10 Sevoke-Gangtok Highway',
      nearest_hospital: 'STNM Hospital Gangtok (3 km)',
      critical_facilities_count: 8
    }
  ];

  return { villages, alerts };
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const snapshots = villages.map(v => computeRiskForVillage(v, 0));
  const highOrCrit = snapshots.filter(s => s.risk_level === 'HIGH' || s.risk_level === 'CRITICAL').length;
  
  const riskDist = {
    LOW: snapshots.filter(s => s.risk_level === 'LOW').length,
    MODERATE: snapshots.filter(s => s.risk_level === 'MODERATE').length,
    HIGH: snapshots.filter(s => s.risk_level === 'HIGH').length,
    CRITICAL: snapshots.filter(s => s.risk_level === 'CRITICAL').length
  };

  const incidentsByStatus = {
    NEW: incidents.filter(i => i.status === 'NEW').length,
    VERIFIED: incidents.filter(i => i.status === 'VERIFIED').length,
    IN_PROGRESS: incidents.filter(i => i.status === 'IN_PROGRESS').length,
    CLOSED: incidents.filter(i => i.status === 'CLOSED').length,
    REJECTED: incidents.filter(i => i.status === 'REJECTED').length
  };

  const maxRainVillage = [...villages].sort((a, b) => b.current_rainfall_24h_mm - a.current_rainfall_24h_mm)[0];
  const exposedPop = villages
    .filter(v => {
      const s = computeRiskForVillage(v, 0);
      return s.risk_level === 'CRITICAL' || s.risk_level === 'HIGH';
    })
    .reduce((acc, curr) => acc + curr.population, 0);

  const blockedRoads = roads.filter(r => r.status === 'BLOCKED').length;
  const atRiskRoads = roads.filter(r => r.status === 'CAUTION' || r.status === 'BLOCKED').length;

  return {
    total_villages_monitored: villages.length,
    high_critical_villages_count: highOrCrit,
    new_alerts_24h: alerts.filter(a => a.status === 'NEW').length,
    open_incidents_count: incidents.filter(i => i.status !== 'CLOSED' && i.status !== 'REJECTED').length,
    acknowledged_alerts_24h: alerts.filter(a => a.status === 'ACKNOWLEDGED').length,
    avg_acknowledgment_time_mins: 14.8,
    evacuation_shelters_active: infrastructure.filter(i => i.type === 'SHELTER' && i.status === 'OPEN').length,
    total_shelter_capacity: infrastructure.filter(i => i.type === 'SHELTER').reduce((acc, curr) => acc + (curr.capacity || 0), 0),
    current_shelter_occupancy: infrastructure.filter(i => i.type === 'SHELTER').reduce((acc, curr) => acc + (curr.occupancy_current || 0), 0),
    sensors_online_pct: 98.2,
    sensors_total_count: sensors.length,
    sensors_warning_count: sensors.filter(s => s.last_reading.status === 'ALERT' || s.last_reading.status === 'WARNING').length,
    roads_at_risk_count: atRiskRoads,
    roads_blocked_count: blockedRoads,
    estimated_exposed_population: exposedPop,
    rainfall_max_24h_mm: maxRainVillage ? maxRainVillage.current_rainfall_24h_mm : 0,
    rainfall_max_location: maxRainVillage ? `${maxRainVillage.name} (${maxRainVillage.current_rainfall_24h_mm} mm)` : 'N/A',
    data_source_mode: 'LIVE',
    last_synced_at: new Date().toISOString(),
    risk_distribution: riskDist,
    incidents_by_status: incidentsByStatus,
    alerts_trend: [
      { date: 'Day -6', critical: 1, high: 2, moderate: 4, low: 5, rainfall_avg: 48 },
      { date: 'Day -5', critical: 0, high: 1, moderate: 5, low: 6, rainfall_avg: 35 },
      { date: 'Day -4', critical: 1, high: 3, moderate: 4, low: 4, rainfall_avg: 62 },
      { date: 'Day -3', critical: 2, high: 4, moderate: 3, low: 3, rainfall_avg: 110 },
      { date: 'Day -2', critical: 3, high: 5, moderate: 2, low: 2, rainfall_avg: 165 },
      { date: 'Yesterday', critical: 4, high: 4, moderate: 2, low: 2, rainfall_avg: 185 },
      { date: 'Today (Live)', critical: riskDist.CRITICAL, high: riskDist.HIGH, moderate: riskDist.MODERATE, low: riskDist.LOW, rainfall_avg: 210 }
    ]
  };
}
