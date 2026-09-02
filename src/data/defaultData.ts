import {
  State,
  District,
  Block,
  Village,
  RoadSegment,
  InfrastructurePoint,
  Sensor,
  Alert,
  IncidentReport,
  AnalyticsSummary,
  User,
  Role
} from '../types.ts';

// 1. Master States
export const defaultStates: State[] = [
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

// 2. Master Districts
export const defaultDistricts: District[] = [
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
  }
];

// 3. Master Blocks
export const defaultBlocks: Block[] = [
  { id: 'blk_sohra', district_id: 'dist_ekh', district_name: 'East Khasi Hills', name: 'Sohra (Cherrapunji) Block', center: [25.2986, 91.7323] },
  { id: 'blk_mawsynram', district_id: 'dist_ekh', district_name: 'East Khasi Hills', name: 'Mawsynram Block', center: [25.2970, 91.5830] },
  { id: 'blk_pynursla', district_id: 'dist_ekh', district_name: 'East Khasi Hills', name: 'Pynursla Block', center: [25.3110, 91.9020] },
  { id: 'blk_mylliem', district_id: 'dist_ekh', district_name: 'East Khasi Hills', name: 'Mylliem Block (Shillong)', center: [25.5680, 91.8830] },
  { id: 'blk_nongstoin', district_id: 'dist_wkh', district_name: 'West Khasi Hills', name: 'Nongstoin Block', center: [25.5180, 91.2670] },
  { id: 'blk_umpyrtha', district_id: 'dist_ribhoi', district_name: 'Ri-Bhoi', name: 'Umsning Block', center: [25.7500, 91.8900] },
  { id: 'blk_haflong', district_id: 'dist_dima_hasao', district_name: 'Dima Hasao', name: 'Haflong Hills Block', center: [25.1764, 93.0204] }
];

// 4. 10 Master Settlements (3 Critical Red, 5 Medium Amber/Yellow, 2 Low Green)
export const defaultVillages: Village[] = [
  // CRITICAL RISK (Red)
  {
    id: 'vil_sohra_town',
    block_id: 'blk_sohra',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Sohra Cherrapunji Ridge',
    lat: 25.2986,
    lon: 91.7323,
    population: 14816,
    slope_deg: 46.5,
    elevation_m: 1430,
    soil_type: 'Clay Loam with Fractured Sandstone',
    lithology: 'Tertiary Jaintia Group Sandstone & Shale',
    susceptibility_base_score: 0.85,
    current_rainfall_24h_mm: 186.4,
    rainfall_7d_total_mm: 580.4,
    rainfall_72h_mm: 342.1,
    soil_moisture_pct: 92.5,
    tilt_rate_deg_day: 0.38,
    pore_pressure_kpa: 48.2,
    evacuation_center: 'Sohra Multi-Purpose Cyclone & Landslide Shelter, Block Office Ground',
    emergency_contact: '1077 (Toll Free) / +91-94361-00281',
    nearest_road: 'State Highway 5 (Sohra-Shella Highway)',
    nearest_hospital: 'Sohra Community Health Centre (CHC)',
    critical_facilities_count: 5
  },
  {
    id: 'vil_mawsynram_central',
    block_id: 'blk_mawsynram',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Mawsynram Valley Slopes',
    lat: 25.2970,
    lon: 91.5830,
    population: 8900,
    slope_deg: 41.2,
    elevation_m: 1400,
    soil_type: 'Silty Clay Loam over Karstic Limestone',
    lithology: 'Sylhet Limestone Formation & Therria Sandstone',
    susceptibility_base_score: 0.88,
    current_rainfall_24h_mm: 215.0,
    rainfall_7d_total_mm: 685.0,
    rainfall_72h_mm: 410.0,
    soil_moisture_pct: 96.1,
    tilt_rate_deg_day: 0.38,
    pore_pressure_kpa: 56.4,
    evacuation_center: 'Mawsynram Higher Secondary School & BDO Hall',
    emergency_contact: '1077 / +91-94361-99812',
    nearest_road: 'Mawsynram - Balat Major District Road (MDR)',
    nearest_hospital: 'Mawsynram CHC (0.8 km)',
    critical_facilities_count: 4
  },
  {
    id: 'vil_tyrna',
    block_id: 'blk_sohra',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Tyrna Foothill Base',
    lat: 25.2420,
    lon: 91.6810,
    population: 1850,
    slope_deg: 49.0,
    elevation_m: 680,
    soil_type: 'Colluvial Boulder Debris with Sandy Silt',
    lithology: 'Shella Formation & Basal Conglomerates',
    susceptibility_base_score: 0.82,
    current_rainfall_24h_mm: 172.0,
    rainfall_7d_total_mm: 540.0,
    rainfall_72h_mm: 310.0,
    soil_moisture_pct: 91.0,
    tilt_rate_deg_day: 0.32,
    pore_pressure_kpa: 44.0,
    evacuation_center: 'Tyrna Village Council Hall (Dorbar Shnong)',
    emergency_contact: '1077 / +91-94361-44321',
    nearest_road: 'Tyrna - Nongriat Steps Route',
    nearest_hospital: 'Sohra CHC (12 km by road)',
    critical_facilities_count: 2
  },

  // MEDIUM RISK (Amber / Yellow)
  {
    id: 'vil_laitkynsew',
    block_id: 'blk_sohra',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Laitkynsew Ridge Slopes',
    lat: 25.2155,
    lon: 91.6650,
    population: 1420,
    slope_deg: 44.0,
    elevation_m: 1120,
    soil_type: 'Fractured Sandstone over Limestone karst',
    lithology: 'Khasi Group Quartzite & Karst limestone',
    susceptibility_base_score: 0.62,
    current_rainfall_24h_mm: 148.0,
    rainfall_7d_total_mm: 420.2,
    rainfall_72h_mm: 220.5,
    soil_moisture_pct: 78.4,
    tilt_rate_deg_day: 0.18,
    pore_pressure_kpa: 34.5,
    evacuation_center: 'Laitkynsew Community Hall Shelter',
    emergency_contact: '1077 / +91-94361-88912',
    nearest_road: 'Laitkynsew Viewpoint Link Road',
    nearest_hospital: 'Sohra CHC (6.2 km)',
    critical_facilities_count: 3
  },
  {
    id: 'vil_pynursla_scarp',
    block_id: 'blk_pynursla',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Pynursla Escarpment Base',
    lat: 25.3110,
    lon: 91.9020,
    population: 5600,
    slope_deg: 38.0,
    elevation_m: 1350,
    soil_type: 'Clay Loam with Weathered Sandstone',
    lithology: 'Jaintia Group Sandstone',
    susceptibility_base_score: 0.58,
    current_rainfall_24h_mm: 128.0,
    rainfall_7d_total_mm: 380.0,
    rainfall_72h_mm: 210.0,
    soil_moisture_pct: 74.0,
    tilt_rate_deg_day: 0.14,
    pore_pressure_kpa: 28.0,
    evacuation_center: 'Pynursla Higher Secondary School',
    emergency_contact: '1077 / +91-94361-77890',
    nearest_road: 'NH-206 (Shillong - Dawki International Road)',
    nearest_hospital: 'Pynursla CHC',
    critical_facilities_count: 3
  },
  {
    id: 'vil_dawki_ghat',
    block_id: 'blk_pynursla',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Dawki Umngot Gorge',
    lat: 25.1850,
    lon: 92.0230,
    population: 3100,
    slope_deg: 35.0,
    elevation_m: 110,
    soil_type: 'Alluvial Gravel and Colluvium',
    lithology: 'Meghalaya Craton Crystalline Basement & Sylhet Trap',
    susceptibility_base_score: 0.52,
    current_rainfall_24h_mm: 105.0,
    rainfall_7d_total_mm: 310.0,
    rainfall_72h_mm: 175.0,
    soil_moisture_pct: 69.5,
    tilt_rate_deg_day: 0.10,
    pore_pressure_kpa: 22.0,
    evacuation_center: 'Dawki Border Trade Centre Pavilion',
    emergency_contact: '1077 / +91-94361-33211',
    nearest_road: 'NH-206 Border Crossing Point',
    nearest_hospital: 'Dawki Primary Health Centre (PHC)',
    critical_facilities_count: 3
  },
  {
    id: 'vil_nongstoin_valley',
    block_id: 'blk_nongstoin',
    district_id: 'dist_wkh',
    state_id: 'state_meghalaya',
    name: 'Nongstoin Hill Township',
    lat: 25.5180,
    lon: 91.2670,
    population: 28742,
    slope_deg: 32.0,
    elevation_m: 1409,
    soil_type: 'Lateritic Red Loam over Granite Gneiss',
    lithology: 'Precambrian Granite Gneiss Complex',
    susceptibility_base_score: 0.48,
    current_rainfall_24h_mm: 114.5,
    rainfall_7d_total_mm: 290.0,
    rainfall_72h_mm: 160.0,
    soil_moisture_pct: 68.0,
    tilt_rate_deg_day: 0.09,
    pore_pressure_kpa: 19.5,
    evacuation_center: 'Nongstoin Indoor Stadium & DC Office Compound',
    emergency_contact: '1077 / +91-94361-12345',
    nearest_road: 'NH-127B (Nongstoin - Tura Highway)',
    nearest_hospital: 'Nongstoin Civil Hospital',
    critical_facilities_count: 6
  },
  {
    id: 'vil_nongpoh_highway',
    block_id: 'blk_umpyrtha',
    district_id: 'dist_ribhoi',
    state_id: 'state_meghalaya',
    name: 'Nongpoh Highway Corridor',
    lat: 25.9000,
    lon: 91.8800,
    population: 17000,
    slope_deg: 26.5,
    elevation_m: 550,
    soil_type: 'Red Gravelly Loam',
    lithology: 'Shillong Group Quartzite & Granite Gneiss',
    susceptibility_base_score: 0.42,
    current_rainfall_24h_mm: 92.0,
    rainfall_7d_total_mm: 220.0,
    rainfall_72h_mm: 130.0,
    soil_moisture_pct: 62.0,
    tilt_rate_deg_day: 0.06,
    pore_pressure_kpa: 14.0,
    evacuation_center: 'Nongpoh District Sports Complex',
    emergency_contact: '1077 / +91-94361-66789',
    nearest_road: 'NH-6 (Guwahati - Shillong 4-Lane Highway)',
    nearest_hospital: 'Nongpoh Civil Hospital',
    critical_facilities_count: 5
  },

  // LOW RISK (Green)
  {
    id: 'vil_mawlynnong',
    block_id: 'blk_pynursla',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Mawlynnong Plateau',
    lat: 25.2015,
    lon: 91.9160,
    population: 950,
    slope_deg: 14.0,
    elevation_m: 490,
    soil_type: 'Well Drained Loamy Silt over Stable Bedrock',
    lithology: 'Stable Quartzite Bedding',
    susceptibility_base_score: 0.22,
    current_rainfall_24h_mm: 58.0,
    rainfall_7d_total_mm: 140.0,
    rainfall_72h_mm: 82.0,
    soil_moisture_pct: 48.0,
    tilt_rate_deg_day: 0.02,
    pore_pressure_kpa: 8.0,
    evacuation_center: 'Mawlynnong Eco Community Hall',
    emergency_contact: '1077 / +91-94361-55443',
    nearest_road: 'Pynursla-Mawlynnong Rural Link Road',
    nearest_hospital: 'Pynursla CHC (18 km)',
    critical_facilities_count: 2
  },
  {
    id: 'vil_upper_shillong',
    block_id: 'blk_mylliem',
    district_id: 'dist_ekh',
    state_id: 'state_meghalaya',
    name: 'Upper Shillong Pine Plateau',
    lat: 25.5350,
    lon: 91.8480,
    population: 12500,
    slope_deg: 18.5,
    elevation_m: 1860,
    soil_type: 'Brown Forest Soil over Shillong Quartzite',
    lithology: 'Precambrian Shillong Group Meta-sediments',
    susceptibility_base_score: 0.28,
    current_rainfall_24h_mm: 42.0,
    rainfall_7d_total_mm: 110.0,
    rainfall_72h_mm: 64.0,
    soil_moisture_pct: 42.0,
    tilt_rate_deg_day: 0.01,
    pore_pressure_kpa: 6.5,
    evacuation_center: 'State Agriculture Training Centre / EAC Ground',
    emergency_contact: '1077 / +91-94361-11223',
    nearest_road: 'Shillong - Elephant Falls Road',
    nearest_hospital: 'Civil Hospital Shillong & NEIGRIHMS',
    critical_facilities_count: 8
  }
];

// 5. Default Warning Bulletins (Early Warning)
export const defaultAlerts: Alert[] = [
  {
    id: 'ALT-NER-0941',
    title: 'RED ALERT: Critical Slope Failure Warning — Mawsynram & Sohra Ridge',
    description: 'Autonomous BEACON AI inference triggered critical threshold breach: 24h rainfall reached 215.0mm with 96.1% soil saturation. High potential for rotational landslides and debris mudflow along inhabited valley bases.',
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
    trigger_condition: '24h Precipitation > 200mm AND Soil Moisture > 92% AND Piezometer > 50 kPa',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    source: 'IMD AWS Radar + BEACON Early Warning Model',
    affected_population: 8900,
    contributing_factors: [
      '24h Precipitation: 215.0 mm (Extreme Monsoon Downpour)',
      'Soil Saturation: 96.1% (Pore fluid pressure critical)',
      'Slope Gradient: 41.2° with active toe erosion',
      'Telemetry Tilt Rate: 0.38°/day'
    ],
    recommended_actions: [
      'Trigger immediate preventive evacuation of vulnerable households in low-lying scarp sectors.',
      'Deploy State Disaster Response Force (SDRF) Unit 2 to Mawsynram BDO Ground.',
      'Halt all heavy vehicular movement along Balat-Mawsynram MDR.',
      'Broadcast regional voice sirens and emergency SMS bulletins via SEOC Gateway.'
    ],
    evacuation_advised: true,
    broadcast_channels: ['SMS', 'WHATSAPP', 'SIREN', 'WEB_BANNER', 'IVR'],
    recipients: [
      {
        id: 'rec_01',
        user_name: 'District Magistrate EKH',
        role: 'district_admin',
        channel: 'SMS',
        address: '+91 94361 88291',
        status: 'DELIVERED',
        sent_at: new Date(Date.now() - 24 * 60 * 1000).toISOString()
      },
      {
        id: 'rec_02',
        user_name: 'SDRF 1st Bn Commandant',
        role: 'ndrf_sdrf_officer',
        channel: 'WHATSAPP',
        address: '+91 94361 00281',
        status: 'DELIVERED',
        sent_at: new Date(Date.now() - 24 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'ALT-NER-0938',
    title: 'RED ALERT: Escarpment Bedding Failure — Laitkynsew Ridge',
    description: 'Piezometer readings indicate pore water pressure surge to 42.5 kPa following cumulative precipitation. High risk of planar bedding rockfall detachment along fractured scarp face.',
    category: 'CRITICAL_EMERGENCY',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    block_id: 'blk_sohra',
    block_name: 'Sohra Block',
    village_id: 'vil_laitkynsew',
    village_name: 'Laitkynsew Ridge Slopes',
    lat: 25.2155,
    lon: 91.6650,
    severity: 'CRITICAL',
    status: 'ACKNOWLEDGED',
    trigger_condition: 'Slope > 40° AND 24h Rain > 140mm AND Pore Pressure > 35 kPa',
    created_at: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    source: 'Geotechnical Sensor Array & BEACON ML',
    affected_population: 1420,
    contributing_factors: [
      'Slope Angle: 44.0° (Steep Gradient)',
      '24h Precipitation: 148.0 mm',
      'Pore Water Pressure: 42.5 kPa',
      'Displacement Velocity: 0.18°/day'
    ],
    recommended_actions: [
      'Enforce complete vehicular closure on Laitkynsew Link Road.',
      'Shift all residents of Laitkynsew Rim to community shelter.',
      'Station excavator and JCB payload at Sohra CHC junction.'
    ],
    evacuation_advised: true,
    broadcast_channels: ['SMS', 'WHATSAPP', 'SIREN'],
    acknowledged_by: 'BDO Sohra Emergency Cell',
    acknowledged_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    recipients: [
      {
        id: 'rec_03',
        user_name: 'BDO Sohra Emergency Cell',
        role: 'field_officer',
        channel: 'SMS',
        address: '+91 98622 77109',
        status: 'DELIVERED',
        sent_at: new Date(Date.now() - 100 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'ALT-NER-0935',
    title: 'ORANGE WARNING: High Soil Saturation — Tyrna Foothill Slopes',
    description: '72-hour cumulative precipitation reached 310mm. Subsurface drainage saturation at 91.0%. Moderate debris wash and toe instability predicted on road cuts.',
    category: 'WARNING',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    block_id: 'blk_sohra',
    block_name: 'Sohra Block',
    village_id: 'vil_tyrna',
    village_name: 'Tyrna Foothill Base',
    lat: 25.2420,
    lon: 91.6810,
    severity: 'HIGH',
    status: 'NEW',
    trigger_condition: '72h Precipitation > 280mm AND Soil Moisture > 85%',
    created_at: new Date(Date.now() - 190 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    source: 'BEACON Hydrological Ensemble',
    affected_population: 1850,
    contributing_factors: [
      '72h Cumulative Rain: 310.0 mm',
      'Soil Saturation: 91.0%',
      'Slope: 49.0° Colluvial Valley'
    ],
    recommended_actions: [
      'Restrict foot travel and tourist visits on Nongriat steps.',
      'Inspect road culverts and clear rock debris along village perimeter.'
    ],
    evacuation_advised: false,
    broadcast_channels: ['SMS', 'WHATSAPP'],
    recipients: []
  },
  {
    id: 'ALT-NER-0929',
    title: 'YELLOW ADVISORY: Sustained Rain Slope Watch — Nongstoin Corridor',
    description: 'Light-to-moderate sustained precipitation forecasted for next 48 hours. Soil moisture holding at 68%. Maintain regular visual patrols.',
    category: 'WATCH',
    state_id: 'state_meghalaya',
    state_name: 'Meghalaya',
    district_id: 'dist_wkh',
    district_name: 'West Khasi Hills',
    block_id: 'blk_nongstoin',
    block_name: 'Nongstoin Block',
    village_id: 'vil_nongstoin_valley',
    village_name: 'Nongstoin Hill Township',
    lat: 25.5180,
    lon: 91.2670,
    severity: 'MODERATE',
    status: 'NEW',
    trigger_condition: 'Sustained rain advisory for NH-127B corridor',
    created_at: new Date(Date.now() - 320 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    source: 'Regional Met Centre (RMC Guwahati)',
    affected_population: 28742,
    contributing_factors: [
      '24h Rain: 114.5 mm',
      'Soil Moisture: 68.0%',
      'Highway Corridor Slope Cuts'
    ],
    recommended_actions: [
      'Highway patrol to monitor drainage culverts at Km 14 to 22.',
      'Alert PWD road maintenance teams for standby deployment.'
    ],
    evacuation_advised: false,
    broadcast_channels: ['SMS'],
    recipients: []
  }
];

// 6. Default Field Incidents (Field Observations Registry)
export const defaultIncidents: IncidentReport[] = [
  {
    id: 'INC-2026-0041',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    block_id: 'blk_sohra',
    block_name: 'Sohra Block',
    village_id: 'vil_laitkynsew',
    village_name: 'Laitkynsew Ridge Slopes',
    lat: 25.2155,
    lon: 91.6650,
    title: 'Major rockfall and debris avalanche blocking Laitkynsew link road',
    description: 'Over 65 meters of cut slope fractured and slid down across both carriageway lanes following intense morning downpour. 2 local houses sustained boundary wall collapse.',
    incident_type: 'FRESH_LANDSLIDE',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    reporter_role: 'field_officer',
    reporter_name: 'Sub-Inspector B. Marbaniang',
    reporter_phone: '+91 94361 88442',
    road_blocked: true,
    casualties_reported: 0,
    houses_damaged: 2,
    people_affected: 120,
    assigned_team: 'Public Works Department (PWD Roads) & BRO Task Force',
    media: [
      {
        id: 'med_01',
        media_type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        caption: 'Debris blocking carriageway',
        uploaded_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      },
      {
        id: 'med_02',
        media_type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
        caption: 'Fractured crown scarp',
        uploaded_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      }
    ],
    internal_notes: [
      'PWD heavy earthmover on site; clearing expected within 4 hours.',
      'Electricity poles damaged in Sector 3; MeECL alerted.'
    ]
  },
  {
    id: 'INC-2026-0039',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    block_id: 'blk_mawsynram',
    block_name: 'Mawsynram Block',
    village_id: 'vil_mawsynram_central',
    village_name: 'Mawsynram Valley Slopes',
    lat: 25.2970,
    lon: 91.5830,
    title: 'Slump and road shoulder subsidence on NH-206 Mawphlang-Mawsynram section',
    description: 'Continuous heavy rainfall caused rotational slump of the downhill road embankment at Km 34. Approximately 30 meters of outer road shoulder collapsed.',
    incident_type: 'SOIL_MOVEMENT',
    severity: 'HIGH',
    status: 'ASSIGNED',
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    reporter_role: 'public_user',
    reporter_name: 'D. Khongwir (Aapda Mitra)',
    reporter_phone: '+91 98622 77109',
    road_blocked: false,
    casualties_reported: 0,
    houses_damaged: 0,
    people_affected: 45,
    assigned_team: 'Border Roads Organisation (Project Vartak)',
    media: [
      {
        id: 'med_03',
        media_type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
        caption: 'Road shoulder subsidence',
        uploaded_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
      }
    ],
    internal_notes: [
      'Single lane traffic permitted with weight restriction (<10T).',
      'Geogrid and gabion wall reinforcement proposed by BRO.'
    ]
  },
  {
    id: 'INC-2026-0036',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    district_name: 'East Khasi Hills',
    block_id: 'blk_sohra',
    block_name: 'Sohra Block',
    village_id: 'vil_tyrna',
    village_name: 'Tyrna Foothill Base',
    lat: 25.2420,
    lon: 91.6810,
    title: 'Tension crack formation on slope above Tyrna Primary School',
    description: 'A 15cm wide ground fissure opening observed along the upper contour of the community school slope following saturation.',
    incident_type: 'SLOPE_CRACK',
    severity: 'HIGH',
    status: 'VERIFIED',
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    reporter_role: 'scientist',
    reporter_name: 'Dr. M. Lyndem',
    reporter_phone: '+91 94361 55902',
    road_blocked: false,
    casualties_reported: 0,
    houses_damaged: 0,
    people_affected: 210,
    assigned_team: 'State Disaster Management Authority (SDMA)',
    media: [
      {
        id: 'med_04',
        media_type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
        caption: 'Slope tension crack',
        uploaded_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
      }
    ],
    internal_notes: [
      'Inclinometer sensor showing 0.32°/day creep rate.',
      'SDRF standby unit alerted.'
    ]
  }
];

// 7. Default Road Network
export const defaultRoads: RoadSegment[] = [
  {
    id: 'road_shillong_sohra',
    name: 'Shillong - Sohra Highway (SH-5)',
    highway_number: 'SH-5',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    coordinates: [
      [25.5788, 91.8933],
      [25.5350, 91.8480],
      [25.4600, 91.8100],
      [25.3800, 91.7600],
      [25.2986, 91.7323]
    ],
    status: 'CLEAR',
    last_cleared_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  },
  {
    id: 'road_sohra_laitkynsew',
    name: 'Sohra - Laitkynsew Ridge Link Road',
    highway_number: 'MDR-22',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    coordinates: [
      [25.2986, 91.7323],
      [25.2890, 91.7250],
      [25.2520, 91.6950],
      [25.2155, 91.6650]
    ],
    status: 'BLOCKED',
    blockage_reason: 'Major rockfall scarp displacement. Single-lane breached. Road clearing underway.',
    alternate_route_id: 'road_shillong_sohra'
  },
  {
    id: 'road_mawsynram_balat',
    name: 'Mawsynram - Balat Major District Road',
    highway_number: 'MDR-19',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    coordinates: [
      [25.2970, 91.5830],
      [25.2300, 91.5400],
      [25.1700, 91.5100],
      [25.1300, 91.4800]
    ],
    status: 'CAUTION',
    blockage_reason: 'Shoulder subsidence at Km 34. Caution advised.'
  },
  {
    id: 'road_shillong_guwahati',
    name: 'Guwahati - Shillong 4-Lane Expressway (NH-6)',
    highway_number: 'NH-6',
    state_id: 'state_meghalaya',
    district_id: 'dist_ribhoi',
    coordinates: [
      [26.1445, 91.7362],
      [25.9800, 91.8200],
      [25.9000, 91.8800],
      [25.7500, 91.8900],
      [25.5788, 91.8933]
    ],
    status: 'CLEAR'
  },
  {
    id: 'road_shillong_dawki',
    name: 'Shillong - Pynursla - Dawki Highway (NH-206)',
    highway_number: 'NH-206',
    state_id: 'state_meghalaya',
    district_id: 'dist_ekh',
    coordinates: [
      [25.5788, 91.8933],
      [25.4400, 91.9100],
      [25.3110, 91.9020],
      [25.2015, 91.9160],
      [25.1850, 92.0230]
    ],
    status: 'CLEAR'
  }
];

// 8. Default Geotechnical Sensors
export const defaultSensors: Sensor[] = [
  {
    id: 'sens_sohra_tilt',
    name: 'Sohra Ridge MEMS Tiltmeter 01',
    type: 'INCLINOMETER',
    village_id: 'vil_sohra_town',
    village_name: 'Sohra Ridge',
    district_id: 'dist_ekh',
    lat: 25.2990,
    lon: 91.7320,
    battery_pct: 94,
    signal_dbm: -68,
    is_online: true,
    last_reading: {
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      value: 0.38,
      unit: 'deg/day',
      status: 'ALERT'
    }
  },
  {
    id: 'sens_laitkynsew_piezo',
    name: 'Laitkynsew Deep Pore Piezometer Array',
    type: 'PIEZOMETER',
    village_id: 'vil_laitkynsew',
    village_name: 'Laitkynsew Ridge',
    district_id: 'dist_ekh',
    lat: 25.2158,
    lon: 91.6645,
    battery_pct: 88,
    signal_dbm: -74,
    is_online: true,
    last_reading: {
      timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      value: 42.5,
      unit: 'kPa',
      status: 'ALERT'
    }
  },
  {
    id: 'sens_mawsynram_rain',
    name: 'Mawsynram AWS Tipping Bucket Rain Gauge',
    type: 'RAIN_GAUGE',
    village_id: 'vil_mawsynram_central',
    village_name: 'Mawsynram Valley',
    district_id: 'dist_ekh',
    lat: 25.2975,
    lon: 91.5825,
    battery_pct: 99,
    signal_dbm: -62,
    is_online: true,
    last_reading: {
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      value: 215.0,
      unit: 'mm/24h',
      status: 'ALERT'
    }
  },
  {
    id: 'sens_tyrna_extenso',
    name: 'Tyrna Slope Wire Extensometer',
    type: 'GNSS_DISPLACEMENT',
    village_id: 'vil_tyrna',
    village_name: 'Tyrna Foothill Base',
    district_id: 'dist_ekh',
    lat: 25.2425,
    lon: 91.6815,
    battery_pct: 91,
    signal_dbm: -71,
    is_online: true,
    last_reading: {
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      value: 0.32,
      unit: 'deg/day',
      status: 'ALERT'
    }
  },
  {
    id: 'sens_nongstoin_soil',
    name: 'Nongstoin Moisture & Pore Probe',
    type: 'SOIL_MOISTURE',
    village_id: 'vil_nongstoin_valley',
    village_name: 'Nongstoin Hill',
    district_id: 'dist_wkh',
    lat: 25.5185,
    lon: 91.2675,
    battery_pct: 96,
    signal_dbm: -65,
    is_online: true,
    last_reading: {
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      value: 68.0,
      unit: '% saturation',
      status: 'NORMAL'
    }
  },
  {
    id: 'sens_shillong_insar',
    name: 'Upper Shillong InSAR Corner Reflector',
    type: 'GNSS_DISPLACEMENT',
    village_id: 'vil_upper_shillong',
    village_name: 'Upper Shillong',
    district_id: 'dist_ekh',
    lat: 25.5355,
    lon: 91.8485,
    battery_pct: 100,
    signal_dbm: -55,
    is_online: true,
    last_reading: {
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      value: 0.01,
      unit: 'deg/day',
      status: 'NORMAL'
    }
  }
];

// 9. Default Infrastructure Points
export const defaultInfrastructure: InfrastructurePoint[] = [
  {
    id: 'infra_sohra_shelter',
    name: 'Sohra Multi-Purpose Disaster Shelter',
    type: 'SHELTER',
    district_id: 'dist_ekh',
    lat: 25.2995,
    lon: 91.7335,
    capacity: 1200,
    occupancy_current: 180,
    status: 'OPEN',
    contact: '+91-94361-00281'
  },
  {
    id: 'infra_sohra_chc',
    name: 'Sohra Community Health Centre (CHC)',
    type: 'HOSPITAL',
    district_id: 'dist_ekh',
    lat: 25.2960,
    lon: 91.7300,
    capacity: 60,
    occupancy_current: 28,
    status: 'OPEN',
    contact: '+91-94361-00999'
  },
  {
    id: 'infra_mawsynram_shelter',
    name: 'Mawsynram Central Relief Hall',
    type: 'SHELTER',
    district_id: 'dist_ekh',
    lat: 25.2980,
    lon: 91.5840,
    capacity: 800,
    occupancy_current: 65,
    status: 'OPEN',
    contact: '+91-94361-99812'
  },
  {
    id: 'infra_shillong_helipad',
    name: 'Upper Shillong Emergency Airforce Helipad',
    type: 'HELIPAD',
    district_id: 'dist_ekh',
    lat: 25.5360,
    lon: 91.8490,
    capacity: 10,
    occupancy_current: 2,
    status: 'OPEN',
    contact: '+91-94361-11223'
  }
];

// 10. Default Analytics Summary
export const defaultAnalyticsSummary: AnalyticsSummary = {
  total_villages_monitored: 10,
  high_critical_villages_count: 3,
  new_alerts_24h: 3,
  open_incidents_count: 3,
  acknowledged_alerts_24h: 1,
  avg_acknowledgment_time_mins: 14.5,
  evacuation_shelters_active: 3,
  total_shelter_capacity: 2000,
  current_shelter_occupancy: 273,
  sensors_online_pct: 100.0,
  sensors_total_count: 6,
  sensors_warning_count: 4,
  roads_at_risk_count: 2,
  roads_blocked_count: 1,
  estimated_exposed_population: 25566,
  rainfall_max_24h_mm: 215.0,
  rainfall_max_location: 'Mawsynram Valley Slopes, East Khasi Hills',
  data_source_mode: 'DEMO',
  risk_distribution: {
    LOW: 2,
    MODERATE: 5,
    HIGH: 2,
    CRITICAL: 1
  },
  incidents_by_status: {
    NEW: 0,
    VERIFIED: 1,
    IN_PROGRESS: 1,
    CLOSED: 0,
    REJECTED: 0
  },
  alerts_trend: [
    { date: '2026-08-27', critical: 0, high: 1, moderate: 2, low: 7, rainfall_avg: 45.2 },
    { date: '2026-08-28', critical: 0, high: 1, moderate: 3, low: 6, rainfall_avg: 62.0 },
    { date: '2026-08-29', critical: 1, high: 2, moderate: 4, low: 3, rainfall_avg: 110.5 },
    { date: '2026-08-30', critical: 1, high: 3, moderate: 4, low: 2, rainfall_avg: 145.0 },
    { date: '2026-08-31', critical: 2, high: 3, moderate: 3, low: 2, rainfall_avg: 185.2 },
    { date: '2026-09-01', critical: 2, high: 4, moderate: 3, low: 1, rainfall_avg: 210.0 },
    { date: '2026-09-02', critical: 2, high: 4, moderate: 3, low: 1, rainfall_avg: 215.0 }
  ]
};

// 11. Default User Profile
export const defaultUser: User = {
  id: 'USR-001',
  name: 'Central DRR Duty Officer',
  email: 'superadmin@mdoner.gov.in',
  phone: '+91 94361 88291',
  role: 'super_admin',
  department: 'MDoNER & NDMA Disaster Risk Reduction Cell',
  designation: 'Joint Secretary (DRR Division)',
  allowed_regions: ['dist_ekh', 'dist_wkh', 'dist_ribhoi', 'dist_ejh', 'dist_dima_hasao']
};
