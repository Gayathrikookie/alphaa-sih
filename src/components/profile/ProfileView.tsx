import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Bell,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Save,
  Radio,
  Sparkles,
  Award
} from 'lucide-react';
import { User, Role } from '../../types.ts';
import { Language, translations } from '../../i18n/translations.ts';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
  activeLanguage: Language;
  onRoleChange: (role: Role) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  activeLanguage,
  onRoleChange
}) => {
  const t = translations[activeLanguage] || translations.en;
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [department, setDepartment] = useState(user.department || 'Disaster Management Authority');
  const [designation, setDesignation] = useState(user.designation || 'Senior DRR Officer');
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const roleOptions: Array<{ id: Role; label: string; org: string; desc: string }> = [
    { id: 'super_admin', label: 'Super Admin', org: 'MDoNER & NDMA', desc: 'Central Policy & Full Access' },
    { id: 'mdoner_admin', label: 'MDoNER Regional Officer', org: 'MDoNER', desc: 'North Eastern Regional Operations' },
    { id: 'sdma_officer', label: 'State Disaster Director', org: 'SDMA Meghalaya', desc: 'State-wide Alert Dispatches' },
    { id: 'ddma_officer', label: 'District Disaster Officer', org: 'DDMA East Khasi Hills', desc: 'District Level Command' },
    { id: 'field_officer', label: 'Field Disaster Inspector', org: 'Sub-Division (Sohra)', desc: 'Ground Response & Verification' },
    { id: 'scientist', label: 'Earth Observation Scientist', org: 'NESAC / ISRO', desc: 'InSAR & Sensor Analytics' },
    { id: 'ndrf_sdrf_officer', label: 'Rescue Force Commander', org: 'NDRF / SDRF', desc: 'Search & Safe Evacuations' },
    { id: 'bro_nhai_officer', label: 'Highway Taskforce Officer', org: 'BRO / NHAI', desc: 'Road Blockages & Heavy Equipment' },
    { id: 'public_user', label: 'Citizen / Volunteer', org: 'Community Network', desc: 'Early Warnings & Crowdsourcing' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      phone,
      department,
      designation,
      avatar_initials: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-rose-500" />
          {t.profile}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          BEACON Command Credentials, Operational Role Matrix & Multi-Channel Subscriptions
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
        {/* User Persona Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 via-amber-600 to-rose-700 p-0.5 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-rose-400">
              {user.avatar_initials || name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{name}</h2>
            <p className="text-xs text-rose-400 font-semibold uppercase tracking-wider">{designation}</p>
            <p className="text-xs text-slate-400">{department} • {email}</p>
          </div>
        </div>

        {/* Role Selector Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-rose-400" />
            Switch Active BEACON Operational Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {roleOptions.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => onRoleChange(r.id)}
                className={`p-3 rounded-xl border text-xs text-left transition ${
                  user.role === r.id
                    ? 'border-rose-500 bg-rose-500/10 text-white font-bold shadow-lg shadow-rose-950/20'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-slate-200 font-bold flex items-center justify-between">
                  <span>{r.label}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 rounded text-slate-400 font-normal">{r.org}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Official Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Official Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Emergency Mobile / SMS Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Department / Organization</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-semibold text-slate-300 block mb-1">Designation / Title</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Alert Subscriptions */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-cyan-400" />
            Common Alerting Protocol (CAP) Auto-Delivery Channels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-0"
              />
              <span className="text-slate-300 font-medium">Critical SMS Cell Broadcast</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-0"
              />
              <span className="text-slate-300 font-medium">Email SITREP Digest</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-0"
              />
              <span className="text-slate-300 font-medium">WhatsApp Community Alert</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Profile changes saved successfully!
            </span>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-rose-950/40"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
