import React, { useState, useEffect } from 'react';
import {
  Village,
  District,
  Block,
  RoadSegment,
  InfrastructurePoint,
  Sensor,
  Alert,
  IncidentReport,
  AnalyticsSummary,
  User,
  Role
} from './types.ts';
import { apiService } from './services/api.ts';
import { Language } from './i18n/translations.ts';
import { Header } from './components/common/Header.tsx';
import { Sidebar, NavTab } from './components/common/Sidebar.tsx';
import { DashboardView } from './components/dashboard/DashboardView.tsx';
import { RiskMap } from './components/map/RiskMap.tsx';
import { AlertsView } from './components/alerts/AlertsView.tsx';
import { IncidentsView } from './components/incidents/IncidentsView.tsx';
import { ReportIncidentView } from './components/incidents/ReportIncidentView.tsx';
import { SafeRouteFinderView } from './components/routes/SafeRouteFinderView.tsx';
import { AnalyticsView } from './components/analytics/AnalyticsView.tsx';
import { LandingView } from './components/landing/LandingView.tsx';
import { ProfileView } from './components/profile/ProfileView.tsx';
import { ApiDocsModal } from './components/docs/ApiDocsModal.tsx';
import { Loader2, CloudRain, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [portalMode, setPortalMode] = useState<'government' | 'public'>('government');
  const [activeLanguage, setActiveLanguage] = useState<Language>('en');
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  // Dynamic User Persona (No hardcoded names!)
  const [user, setUser] = useState<User>({
    id: 'USR-001',
    name: 'Disaster Duty Officer',
    email: 'operations@mdoner.gov.in',
    role: 'super_admin',
    department: 'MDoNER & NDMA Disaster Risk Reduction Cell',
    designation: 'Joint Secretary (DRR Division)',
    phone: '+91 94361 88291',
    avatar_initials: 'DO'
  });

  // Data Store
  const [villages, setVillages] = useState<Village[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [roads, setRoads] = useState<RoadSegment[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructurePoint[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Map & Drilldown Selection
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  // Initial Load
  const loadData = async () => {
    try {
      const [vList, dList, bList, rList, iList, sList, aList, incList, sum] = await Promise.all([
        apiService.getVillages(),
        apiService.getDistricts(),
        apiService.getBlocks(),
        apiService.getRoads(),
        apiService.getInfrastructure(),
        apiService.getSensors(),
        apiService.getAlerts(),
        apiService.getIncidents(),
        apiService.getAnalyticsSummary()
      ]);

      setVillages(vList);
      setDistricts(dList);
      setBlocks(bList);
      setRoads(rList);
      setInfrastructure(iList);
      setSensors(sList);
      setAlerts(aList);
      setIncidents(incList);
      setSummary(sum);

      // Auto-focus the highest risk village for seamless GIS telemetry on load
      if (vList && vList.length > 0) {
        const highestRisk = [...vList].sort((a, b) => (b.susceptibility_base_score || 0) - (a.susceptibility_base_score || 0))[0];
        setSelectedVillage(highestRisk || vList[0]);
      }
    } catch (err) {
      console.error('Failed to load initial BEACON disaster data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Portal Mode Toggling
  const handleTogglePortalMode = (mode: 'government' | 'public') => {
    setPortalMode(mode);
    if (mode === 'public') {
      setCurrentTab('landing');
    } else {
      setCurrentTab('dashboard');
    }
  };

  // Role switching dynamically
  const handleRoleChange = (role: Role) => {
    const roleProfiles: Record<Role, Partial<User>> = {
      super_admin: {
        id: 'USR-001',
        name: 'Central DRR Duty Officer',
        email: 'superadmin@mdoner.gov.in',
        role: 'super_admin',
        department: 'MDoNER & NDMA Disaster Risk Reduction Cell',
        designation: 'Joint Secretary (DRR Division)',
        phone: '+91 94361 88291',
        avatar_initials: 'SO'
      },
      mdoner_admin: {
        id: 'USR-002',
        name: 'MDoNER Regional Director',
        email: 'regional.director@mdoner.gov.in',
        role: 'mdoner_admin',
        department: 'Ministry of Development of North Eastern Region',
        designation: 'Regional Operations Director',
        phone: '+91 94361 88292',
        avatar_initials: 'MD'
      },
      sdma_officer: {
        id: 'USR-003',
        name: 'State Disaster Director',
        email: 'sdma.director@meghalaya.gov.in',
        role: 'sdma_officer',
        department: 'State Disaster Management Authority (SDMA)',
        designation: 'Executive Director (Disaster Management)',
        phone: '+91 94361 11200',
        avatar_initials: 'SD'
      },
      ddma_officer: {
        id: 'USR-004',
        name: 'District Disaster Magistrate',
        email: 'ddma.eastkhasi@nic.in',
        role: 'ddma_officer',
        department: 'District Disaster Management Authority (DDMA)',
        designation: 'District Magistrate & Chairman DDMA',
        phone: '+91 94361 22450',
        avatar_initials: 'DM'
      },
      field_officer: {
        id: 'USR-005',
        name: 'Block Disaster Inspector',
        email: 'field.sohra@meghalaya.gov.in',
        role: 'field_officer',
        department: 'Sub-Divisional Revenue & DRR Office',
        designation: 'Nodal Landslide Inspector',
        phone: '+91 94361 77201',
        avatar_initials: 'FO'
      },
      scientist: {
        id: 'USR-006',
        name: 'Lead Geohazards Scientist',
        email: 'geohazards@nesac.gov.in',
        role: 'scientist',
        department: 'North Eastern Space Applications Centre (NESAC / ISRO)',
        designation: 'Senior Earth Observation Scientist',
        phone: '+91 94361 33400',
        avatar_initials: 'SC'
      },
      ndrf_sdrf_officer: {
        id: 'USR-007',
        name: 'Quick Reaction Commander',
        email: 'commander.sdrf@nic.in',
        role: 'ndrf_sdrf_officer',
        department: '1st Battalion NDRF / SDRF Meghalaya',
        designation: 'Disaster Response Commandant',
        phone: '+91 94361 44550',
        avatar_initials: 'RC'
      },
      bro_nhai_officer: {
        id: 'USR-008',
        name: 'Highway Taskforce Engineer',
        email: 'taskforce.bro@gov.in',
        role: 'bro_nhai_officer',
        department: 'Border Roads Organisation (BRO Project Swastik)',
        designation: 'Superintending Highway Engineer',
        phone: '+91 94361 66700',
        avatar_initials: 'HE'
      },
      public_user: {
        id: 'USR-009',
        name: 'Community Safety Volunteer',
        email: 'volunteer.community@gmail.com',
        role: 'public_user',
        department: 'Village Defense Taskforce & Citizen Network',
        designation: 'Local Citizen Responder',
        phone: '+91 94361 55192',
        avatar_initials: 'CV'
      },
      state_admin: {
        id: 'USR-010',
        name: 'State Disaster Director',
        email: 'sdma.director@meghalaya.gov.in',
        role: 'state_admin',
        department: 'State Disaster Management Authority (SDMA)',
        designation: 'Executive Director (Disaster Management)',
        phone: '+91 94361 11200',
        avatar_initials: 'SD'
      },
      district_admin: {
        id: 'USR-011',
        name: 'District Disaster Magistrate',
        email: 'ddma.eastkhasi@nic.in',
        role: 'district_admin',
        department: 'District Disaster Management Authority (DDMA)',
        designation: 'District Magistrate & Chairman DDMA',
        phone: '+91 94361 22450',
        avatar_initials: 'DM'
      }
    };

    const newProfile = roleProfiles[role] || roleProfiles.super_admin;
    setUser(prev => ({
      ...prev,
      ...newProfile
    }));

    if (role === 'public_user') {
      setPortalMode('public');
      setCurrentTab('landing');
    }
  };

  // Simulate Extreme Heavy Rain (SIH Demo)
  const handleSimulateHeavyRain = async () => {
    setIsSimulating(true);
    setSimulationToast('⚠️ Injecting 24h Extreme Monsoon Precipitation (+140mm across Khasi & Jaintia Hills)...');
    try {
      const res = await apiService.simulateHeavyRain();
      setVillages(res.villages);
      setAlerts(res.alerts);
      setSimulationToast('🚨 BEACON Critical Red Alerts Dispatched! Inclinometers triggered & Evacuation routes calculated.');
      setTimeout(() => setSimulationToast(null), 6000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  // Reset Simulation
  const handleResetSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await apiService.resetSimulation();
      setVillages(res.villages);
      setAlerts(res.alerts);
      setSimulationToast('Baseline environmental conditions restored.');
      setTimeout(() => setSimulationToast(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  // Acknowledge alert
  const handleAcknowledgeAlert = async (alertId: string, note?: string) => {
    try {
      const res = await apiService.acknowledgeAlert(alertId, note);
      const updatedAlert = res?.alert || (res as any);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED', acknowledged_by: user.name, acknowledged_at: new Date().toISOString(), ...updatedAlert } : a));
    } catch (e) {
      console.error(e);
    }
  };

  // Update Incident Status
  const handleUpdateIncidentStatus = async (id: string, status: IncidentReport['status'], note?: string) => {
    try {
      const updated = await apiService.updateIncident(id, { status, note });
      setIncidents(prev => prev.map(inc => inc.id === id ? (updated?.id ? updated : { ...inc, status, updated_at: new Date().toISOString() }) : inc));
    } catch (e) {
      console.error(e);
    }
  };

  // Submit new incident
  const handleIncidentSubmitted = (newInc: IncidentReport) => {
    setIncidents(prev => [newInc, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-600 via-amber-600 to-rose-700 p-0.5 flex items-center justify-center shadow-2xl animate-pulse">
          <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
          </div>
        </div>
        <div className="text-center space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">BEACON Observation Network</h2>
          <p className="text-xs text-slate-400 max-w-sm">
            Landslide Early Warning, Assessment, Communication and Observation Network
          </p>
          <div className="flex items-center justify-center gap-2 text-rose-400 text-xs pt-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading Geospatial Layers, IoT Inclinometers & IMD Radar...</span>
          </div>
        </div>
      </div>
    );
  }

  const unreadAlertsCount = alerts.filter(a => a.status === 'NEW').length;
  const openIncidentsCount = incidents.filter(i => i.status !== 'CLOSED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Global Toast Banner */}
      {simulationToast && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-lg sticky top-0 z-50 animate-in slide-in-from-top">
          <CloudRain className="w-4 h-4" />
          <span>{simulationToast}</span>
        </div>
      )}

      {/* Main Top App Header */}
      <Header
        user={user}
        activeLanguage={activeLanguage}
        onLanguageChange={setActiveLanguage}
        onRoleChange={handleRoleChange}
        portalMode={portalMode}
        onTogglePortalMode={handleTogglePortalMode}
        alerts={alerts}
        onOpenDocs={() => setIsDocsModalOpen(false || true)}
        onSimulateRain={handleSimulateHeavyRain}
        onResetSimulation={handleResetSimulation}
        isSimulating={isSimulating}
        onSelectAlert={(alt) => {
          const v = villages.find(vil => vil.id === alt.village_id);
          if (v) {
            setSelectedVillage(v);
            setCurrentTab('map');
          } else {
            setCurrentTab('alerts');
          }
        }}
        onNavigateToTab={(tab, payload) => {
          if (tab === 'map' && payload?.villageId) {
            const v = villages.find(vil => vil.id === payload.villageId);
            if (v) setSelectedVillage(v);
          }
          setCurrentTab(tab);
        }}
      />

      {/* App Body Layout: Left Sidebar + Center Dynamic View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onTabSelect={setCurrentTab}
          activeLanguage={activeLanguage}
          unreadAlertsCount={unreadAlertsCount}
          openIncidentsCount={openIncidentsCount}
          portalMode={portalMode}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950/60">
          {currentTab === 'dashboard' && (
            <DashboardView
              summary={summary}
              alerts={alerts}
              incidents={incidents}
              villages={villages}
              sensors={sensors}
              roads={roads}
              user={user}
              activeLanguage={activeLanguage}
              onNavigateToMap={() => setCurrentTab('map')}
              onNavigateToAlerts={() => setCurrentTab('alerts')}
              onNavigateToIncidents={() => setCurrentTab('incidents')}
              onNavigateToReport={() => setCurrentTab('report')}
              onNavigateToSafeRoutes={() => setCurrentTab('safe-routes')}
              onSelectVillage={(v) => {
                setSelectedVillage(v);
                setCurrentTab('map');
              }}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onSimulateRain={handleSimulateHeavyRain}
              isSimulating={isSimulating}
            />
          )}

          {currentTab === 'map' && (
            <RiskMap
              villages={villages}
              roads={roads}
              infrastructure={infrastructure}
              sensors={sensors}
              incidents={incidents}
              alerts={alerts}
              districts={districts}
              blocks={blocks}
              activeLanguage={activeLanguage}
              selectedVillage={selectedVillage}
              onSelectVillage={setSelectedVillage}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onOpenReportModal={(v) => {
                setSelectedVillage(v);
                setCurrentTab('report');
              }}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              districts={districts}
              user={user}
              activeLanguage={activeLanguage}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onNavigateToMap={(vId) => {
                const v = villages.find(vil => vil.id === vId);
                if (v) setSelectedVillage(v);
                setCurrentTab('map');
              }}
              onSimulateRain={handleSimulateHeavyRain}
              isSimulating={isSimulating}
            />
          )}

          {currentTab === 'incidents' && (
            <IncidentsView
              incidents={incidents}
              districts={districts}
              user={user}
              activeLanguage={activeLanguage}
              onUpdateIncidentStatus={handleUpdateIncidentStatus}
              onNavigateToReport={() => setCurrentTab('report')}
              onNavigateToMap={(vId) => {
                const v = villages.find(vil => vil.id === vId);
                if (v) setSelectedVillage(v);
                setCurrentTab('map');
              }}
            />
          )}

          {currentTab === 'safe-routes' && (
            <SafeRouteFinderView
              activeLanguage={activeLanguage}
              onNavigateToMap={() => setCurrentTab('map')}
            />
          )}

          {currentTab === 'report' && (
            <ReportIncidentView
              villages={villages}
              districts={districts}
              blocks={blocks}
              user={user}
              activeLanguage={activeLanguage}
              initialVillage={selectedVillage}
              onSubmitSuccess={handleIncidentSubmitted}
              onNavigateToIncidents={() => setCurrentTab('incidents')}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              summary={summary}
              villages={villages}
              incidents={incidents}
              alerts={alerts}
              activeLanguage={activeLanguage}
            />
          )}

          {currentTab === 'landing' && (
            <LandingView
              villages={villages}
              alerts={alerts}
              infrastructure={infrastructure}
              activeLanguage={activeLanguage}
              onNavigateToMap={(vId) => {
                if (vId) {
                  const v = villages.find(vil => vil.id === vId);
                  if (v) setSelectedVillage(v);
                }
                setCurrentTab('map');
              }}
              onNavigateToReport={() => setCurrentTab('report')}
              onNavigateToSafeRoutes={() => setCurrentTab('safe-routes')}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              user={user}
              onUpdateUser={setUser}
              activeLanguage={activeLanguage}
              onRoleChange={handleRoleChange}
            />
          )}
        </main>
      </div>

      {/* BEACON Architecture & Model Modal */}
      {isDocsModalOpen && <ApiDocsModal onClose={() => setIsDocsModalOpen(false)} />}
    </div>
  );
}
