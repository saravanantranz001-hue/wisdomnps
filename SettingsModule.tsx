import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Phone,
  QrCode,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  Building,
  CreditCard,
  Share2,
  ExternalLink,
  X,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Upload,
  Download,
  Database
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/initialData';
import { SchoolLogo } from './SchoolLogo';
import {
  createStorageBackup,
  readStored,
  restoreStorageBackup,
  writeStored,
} from '../utils/storage';

export interface GPayAccount {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  accountType: 'School Fee Primary' | 'Transport & Van' | 'Accounts Office' | 'Special Event';
  isDefault: boolean;
  notes?: string;
}

export interface SchoolContactNumber {
  id: string;
  department: string;
  contactPerson: string;
  phoneNumber: string;
  whatsappEnabled: boolean;
  availableHours: string;
  isEmergency: boolean;
}

const INITIAL_GPAY_ACCOUNTS: GPayAccount[] = [
  {
    id: 'gpay-1',
    name: 'Wisdom Nursery & Primary School',
    phone: '9176593129',
    upiId: '9176593129@okbizaxis',
    accountType: 'School Fee Primary',
    isDefault: true,
    notes: 'Official Google Pay for all school fees and term payments',
  },
  {
    id: 'gpay-2',
    name: 'Wisdom Transport & Van Services',
    phone: '9842109871',
    upiId: 'wisdomvan.essur@oksbi',
    accountType: 'Transport & Van',
    isDefault: false,
    notes: 'Designated account for van and bus transport fee collections',
  },
  {
    id: 'gpay-3',
    name: 'Wisdom Administration Office',
    phone: '9443218902',
    upiId: 'wisdomoffice@okhdfcbank',
    accountType: 'Accounts Office',
    isDefault: false,
    notes: 'Admission registration and stationery kit payments',
  },
];

const INITIAL_CONTACT_NUMBERS: SchoolContactNumber[] = [
  {
    id: 'phone-1',
    department: 'School Office & Fees Desk',
    contactPerson: 'Mrs. Anandhi K (Front Desk)',
    phoneNumber: '9176593129',
    whatsappEnabled: true,
    availableHours: '8:30 AM - 4:30 PM',
    isEmergency: false,
  },
  {
    id: 'phone-2',
    department: 'Principal Office',
    contactPerson: 'Mrs. Jayanthi S (Headmistress)',
    phoneNumber: '9443218902',
    whatsappEnabled: true,
    availableHours: '9:00 AM - 3:30 PM',
    isEmergency: false,
  },
  {
    id: 'phone-3',
    department: 'School Van & Transport Hotline',
    contactPerson: 'Mr. Murugan K (Transport In-charge)',
    phoneNumber: '9876543210',
    whatsappEnabled: true,
    availableHours: '6:30 AM - 6:00 PM (Active on Routes)',
    isEmergency: true,
  },
  {
    id: 'phone-4',
    department: 'New Admissions & Enquiries',
    contactPerson: 'Admission Counselor',
    phoneNumber: '9176593129',
    whatsappEnabled: true,
    availableHours: '9:00 AM - 5:00 PM',
    isEmergency: false,
  },
  {
    id: 'phone-5',
    department: 'Emergency & First Aid Desk',
    contactPerson: 'School Health In-charge',
    phoneNumber: '9842109871',
    whatsappEnabled: false,
    availableHours: '24/7 On Campus Hours',
    isEmergency: true,
  },
];

export const SettingsModule: React.FC = () => {
  const defaultGeneralSettings = {
    name: SCHOOL_INFO.name,
    fullName: SCHOOL_INFO.fullName,
    tagline: SCHOOL_INFO.tagline,
    motto: SCHOOL_INFO.motto,
    phone: SCHOOL_INFO.phone,
    gpay: SCHOOL_INFO.gpay,
    upiId: SCHOOL_INFO.upiId,
    address: SCHOOL_INFO.address,
    fullAddress: SCHOOL_INFO.fullAddress,
    email: SCHOOL_INFO.email,
    academicYear: SCHOOL_INFO.academicYear,
    logoDataUrl: '',
  };

  // General School Settings
  const [formData, setFormData] = useState(() => {
    const saved = readStored('wisdom_general_settings', defaultGeneralSettings);
    return {
      ...defaultGeneralSettings,
      ...saved,
      academicYear: saved.academicYear === '2025 - 2026'
        ? defaultGeneralSettings.academicYear
        : saved.academicYear,
    };
  });

  const [savedAlert, setSavedAlert] = useState<string | null>(null);
  const [backupInputKey, setBackupInputKey] = useState(0);

  // GPay Accounts State
  const [gpayAccounts, setGpayAccounts] = useState<GPayAccount[]>(() => {
    return readStored('wisdom_gpay_accounts', INITIAL_GPAY_ACCOUNTS);
  });

  // Phone Numbers State
  const [contactNumbers, setContactNumbers] = useState<SchoolContactNumber[]>(() => {
    return readStored('wisdom_contact_numbers', INITIAL_CONTACT_NUMBERS);
  });

  // Modal States for GPay
  const [showGPayModal, setShowGPayModal] = useState(false);
  const [editingGPay, setEditingGPay] = useState<GPayAccount | null>(null);
  const [gpayForm, setGpayForm] = useState<Omit<GPayAccount, 'id'>>({
    name: '',
    phone: '',
    upiId: '',
    accountType: 'School Fee Primary',
    isDefault: false,
    notes: '',
  });

  // Modal States for Contact Number
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [editingPhone, setEditingPhone] = useState<SchoolContactNumber | null>(null);
  const [phoneForm, setPhoneForm] = useState<Omit<SchoolContactNumber, 'id'>>({
    department: '',
    contactPerson: '',
    phoneNumber: '',
    whatsappEnabled: true,
    availableHours: '9:00 AM - 4:00 PM',
    isEmergency: false,
  });

  // Active view tab in settings
  const [activeTab, setActiveTab] = useState<'general' | 'gpay' | 'phones'>('general');

  // Sync to LocalStorage
  useEffect(() => {
    writeStored('wisdom_general_settings', formData);
  }, [formData]);

  useEffect(() => {
    writeStored('wisdom_gpay_accounts', gpayAccounts);
  }, [gpayAccounts]);

  useEffect(() => {
    writeStored('wisdom_contact_numbers', contactNumbers);
  }, [contactNumbers]);

  const triggerToast = (msg: string) => {
    setSavedAlert(msg);
    setTimeout(() => setSavedAlert(null), 3500);
  };

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event('wisdom-profile-updated'));
    triggerToast('School profile & general parameters updated successfully!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file for the school logo.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose a logo image smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const logoDataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!logoDataUrl) {
        alert('The selected logo could not be read. Please try another image.');
        return;
      }
      setFormData((current) => ({ ...current, logoDataUrl }));
      writeStored('wisdom_school_logo', logoDataUrl);
      window.dispatchEvent(new Event('wisdom-logo-updated'));
      triggerToast('School logo uploaded successfully.');
    };
    reader.onerror = () => alert('The selected logo could not be read. Please try another image.');
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData((current) => ({ ...current, logoDataUrl: '' }));
    writeStored('wisdom_school_logo', null);
    window.dispatchEvent(new Event('wisdom-logo-updated'));
    triggerToast('School logo removed. The default logo is active.');
  };

  const handleExportBackup = () => {
    const backup = {
      app: 'Wisdom School Management',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: createStorageBackup(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wisdom-school-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast('Complete school backup downloaded.');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setBackupInputKey((key) => key + 1);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const source = parsed?.data ?? parsed;
        const restored = restoreStorageBackup(source);
        if (!restored) throw new Error('No recognised school records found.');
        triggerToast(`${restored} data sections restored. Reloading the portal...`);
        window.setTimeout(() => window.location.reload(), 900);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown backup error.';
        alert(`Backup restore failed: ${message}`);
      }
    };
    reader.onerror = () => alert('The backup file could not be read.');
    reader.readAsText(file);
  };

  // GPay CRUD Handlers
  const openAddGPay = () => {
    setEditingGPay(null);
    setGpayForm({
      name: '',
      phone: '',
      upiId: '',
      accountType: 'School Fee Primary',
      isDefault: gpayAccounts.length === 0,
      notes: '',
    });
    setShowGPayModal(true);
  };

  const openEditGPay = (account: GPayAccount) => {
    setEditingGPay(account);
    setGpayForm({
      name: account.name,
      phone: account.phone,
      upiId: account.upiId,
      accountType: account.accountType,
      isDefault: account.isDefault,
      notes: account.notes || '',
    });
    setShowGPayModal(true);
  };

  const handleDeleteGPay = (id: string) => {
    const acc = gpayAccounts.find((a) => a.id === id);
    if (!acc) return;
    if (window.confirm(`Are you sure you want to delete GPay account for "${acc.name}" (${acc.phone})?`)) {
      setGpayAccounts(gpayAccounts.filter((a) => a.id !== id));
      triggerToast('GPay account removed.');
    }
  };

  const handleSetDefaultGPay = (id: string) => {
    setGpayAccounts(
      gpayAccounts.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    const chosen = gpayAccounts.find((a) => a.id === id);
    if (chosen) {
      setFormData({
        ...formData,
        gpay: chosen.phone,
        upiId: chosen.upiId,
      });
    }
    triggerToast('Default GPay payment recipient updated.');
  };

  const handleSaveGPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gpayForm.name || !gpayForm.phone || !gpayForm.upiId) {
      alert('Please fill in Name, Phone, and UPI ID.');
      return;
    }

    if (editingGPay) {
      let updatedList = gpayAccounts.map((a) =>
        a.id === editingGPay.id ? { ...editingGPay, ...gpayForm } : a
      );
      if (gpayForm.isDefault) {
        updatedList = updatedList.map((a) => ({
          ...a,
          isDefault: a.id === editingGPay.id,
        }));
        setFormData({ ...formData, gpay: gpayForm.phone, upiId: gpayForm.upiId });
      }
      setGpayAccounts(updatedList);
      triggerToast('GPay payment account updated.');
    } else {
      const newAcc: GPayAccount = {
        id: `gpay-${Date.now()}`,
        ...gpayForm,
      };
      let updatedList = [...gpayAccounts, newAcc];
      if (gpayForm.isDefault) {
        updatedList = updatedList.map((a) => ({
          ...a,
          isDefault: a.id === newAcc.id,
        }));
        setFormData({ ...formData, gpay: gpayForm.phone, upiId: gpayForm.upiId });
      }
      setGpayAccounts(updatedList);
      triggerToast('New GPay account added.');
    }

    setShowGPayModal(false);
  };

  // Phone Directory CRUD Handlers
  const openAddPhone = () => {
    setEditingPhone(null);
    setPhoneForm({
      department: '',
      contactPerson: '',
      phoneNumber: '',
      whatsappEnabled: true,
      availableHours: '9:00 AM - 4:00 PM',
      isEmergency: false,
    });
    setShowPhoneModal(true);
  };

  const openEditPhone = (contact: SchoolContactNumber) => {
    setEditingPhone(contact);
    setPhoneForm({
      department: contact.department,
      contactPerson: contact.contactPerson,
      phoneNumber: contact.phoneNumber,
      whatsappEnabled: contact.whatsappEnabled,
      availableHours: contact.availableHours,
      isEmergency: contact.isEmergency,
    });
    setShowPhoneModal(true);
  };

  const handleDeletePhone = (id: string) => {
    const contact = contactNumbers.find((c) => c.id === id);
    if (!contact) return;
    if (window.confirm(`Delete phone number "${contact.phoneNumber}" for ${contact.department}?`)) {
      setContactNumbers(contactNumbers.filter((c) => c.id !== id));
      triggerToast('Contact number removed.');
    }
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneForm.department || !phoneForm.phoneNumber) {
      alert('Please fill in Department and Phone Number.');
      return;
    }

    if (editingPhone) {
      setContactNumbers(
        contactNumbers.map((c) =>
          c.id === editingPhone.id ? { ...editingPhone, ...phoneForm } : c
        )
      );
      triggerToast('Contact number updated.');
    } else {
      const newContact: SchoolContactNumber = {
        id: `phone-${Date.now()}`,
        ...phoneForm,
      };
      setContactNumbers([...contactNumbers, newContact]);
      triggerToast('New phone contact added.');
    }

    setShowPhoneModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-900" />
            <span>School Settings & Communication Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • GPay UPI payment accounts & contact directory
          </p>
        </div>

        {savedAlert && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedAlert}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'general'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>School Profile & Info</span>
        </button>

        <button
          onClick={() => setActiveTab('gpay')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'gpay'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>GPay & Payment Accounts ({gpayAccounts.length})</span>
          <span className="text-[10px] bg-white/20 text-white font-mono px-1.5 py-0.5 rounded">
            Add / Edit / Delete
          </span>
        </button>

        <button
          onClick={() => setActiveTab('phones')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'phones'
              ? 'bg-purple-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Phone Numbers & WhatsApp Directory ({contactNumbers.length})</span>
          <span className="text-[10px] bg-white/20 text-white font-mono px-1.5 py-0.5 rounded">
            Add / Edit / Delete
          </span>
        </button>
      </div>

      {/* TAB 1: General Profile */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
            <div className="p-2 rounded-full bg-blue-50 border border-blue-200 mb-3">
              <SchoolLogo size={90} />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="px-3 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4" />
                Upload school logo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              {formData.logoDataUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-[11px] font-bold text-red-600 hover:text-red-700"
                >
                  Remove uploaded logo
                </button>
              )}
              <p className="text-[10px] text-slate-500">PNG, JPG, WEBP or SVG • Maximum 2 MB</p>
            </div>
            <h3 className="font-serif font-black text-base text-blue-950 uppercase">
              {formData.fullName}
            </h3>
            <p className="text-xs text-red-700 font-bold mt-1">PIN: 603310</p>
            <p className="text-xs text-slate-500 mt-2 italic max-w-xs">"{formData.tagline}"</p>

            <div className="w-full mt-6 space-y-2 text-xs text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <strong className="text-slate-800">{formData.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Default GPay:</span>
                <strong className="text-emerald-700">{formData.gpay}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UPI ID:</span>
                <strong className="font-mono text-slate-700">{formData.upiId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Academic Year:</span>
                <strong className="text-blue-800">{formData.academicYear}</strong>
              </div>
            </div>

            <div className="w-full mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-left">
              <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Tamil Nadu Govt Approved</span>
              </div>
              <p className="text-[10px] text-amber-800 mt-1">
                Wisdom Nursery and Primary School, Essur Village, Cheyyur Taluk, Chengalpattu District.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <form onSubmit={handleGeneralSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full School Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Short Name / Header</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Motto</label>
                  <input
                    type="text"
                    value={formData.motto}
                    onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">School Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Campus Village & Pin</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Postal Address (Printed on Receipts)</label>
                <textarea
                  rows={2}
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save General Settings</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-3 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-black flex items-center gap-2">
                  <Database className="w-5 h-5 text-sky-300" />
                  Local data safety
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Download a complete backup of students, fees, staff, notices, settings and other records.
                  Restore it on this device whenever you need to recover or move your school data.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-3.5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export backup
                </button>
                <label className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  Restore backup
                  <input
                    key={backupInputKey}
                    type="file"
                    accept="application/json,.json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GPay & Payment Accounts (Add, Edit, Delete) */}
      {activeTab === 'gpay' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Google Pay & UPI Payment Accounts</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage all GPay numbers, UPI IDs, and QR payment destinations for student tuition and van fees
              </p>
            </div>

            <button
              onClick={openAddGPay}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New GPay Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gpayAccounts.map((acc) => (
              <div
                key={acc.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between relative transition-all ${
                  acc.isDefault
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{acc.name}</h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {acc.accountType}
                        </span>
                      </div>
                    </div>

                    {acc.isDefault ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                        Default GPay
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefaultGPay(acc.id)}
                        className="text-[10px] text-slate-500 hover:text-emerald-700 font-bold border border-slate-200 hover:border-emerald-300 px-2 py-0.5 rounded-md cursor-pointer"
                      >
                        Set Default
                      </button>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">GPay Mobile:</span>
                      <a
                        href={`tel:${acc.phone}`}
                        className="font-mono font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{acc.phone}</span>
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">UPI ID:</span>
                      <strong className="font-mono text-emerald-800 text-[11px] truncate max-w-[170px]">
                        {acc.upiId}
                      </strong>
                    </div>
                    {acc.notes && (
                      <div className="pt-1.5 border-t border-slate-200/60 text-[11px] text-slate-600">
                        {acc.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {acc.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditGPay(acc)}
                      className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit GPay Account"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteGPay(acc.id)}
                      className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Delete GPay Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Phone Numbers & WhatsApp Directory (Add, Edit, Delete) */}
      {activeTab === 'phones' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-700" />
                <span>School Official Phone Numbers & Hotlines</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official phone contacts, WhatsApp desks, emergency transport lines, and admission helpdesks
              </p>
            </div>

            <button
              onClick={openAddPhone}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Contact Number</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactNumbers.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{c.department}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{c.contactPerson}</p>
                    </div>

                    {c.isEmergency && (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                        Hotline
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Phone:</span>
                      <a
                        href={`tel:${c.phoneNumber}`}
                        className="font-mono font-black text-sm text-blue-900 hover:underline flex items-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                        <span>{c.phoneNumber}</span>
                      </a>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">WhatsApp:</span>
                      {c.whatsappEnabled ? (
                        <a
                          href={`https://wa.me/91${c.phoneNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 hover:underline"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp Active</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">Call Only</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Available:</span>
                      <span className="text-slate-700 font-medium">{c.availableHours}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    <a
                      href={`tel:${c.phoneNumber}`}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                      title="Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    {c.whatsappEnabled && (
                      <a
                        href={`https://wa.me/91${c.phoneNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold"
                        title="Open WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditPhone(c)}
                      className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Contact"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeletePhone(c.id)}
                      className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Delete Contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit GPay Modal */}
      {showGPayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingGPay ? 'Edit GPay Payment Account' : 'Add New GPay Payment Account'}
                </h3>
                <p className="text-xs text-emerald-100">Wisdom Nursery & Primary School - Essur</p>
              </div>
              <button
                onClick={() => setShowGPayModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGPay} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Account Holder / Label *</label>
                <input
                  type="text"
                  required
                  value={gpayForm.name}
                  onChange={(e) => setGpayForm({ ...gpayForm, name: e.target.value })}
                  placeholder="e.g. Wisdom Nursery and Primary School"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">GPay Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={gpayForm.phone}
                    onChange={(e) => setGpayForm({ ...gpayForm, phone: e.target.value })}
                    placeholder="e.g. 9176593129"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Account Category</label>
                  <select
                    value={gpayForm.accountType}
                    onChange={(e) =>
                      setGpayForm({ ...gpayForm, accountType: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="School Fee Primary">School Fee Primary</option>
                    <option value="Transport & Van">Transport & Van</option>
                    <option value="Accounts Office">Accounts Office</option>
                    <option value="Special Event">Special Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">UPI ID (VPA) *</label>
                <input
                  type="text"
                  required
                  value={gpayForm.upiId}
                  onChange={(e) => setGpayForm({ ...gpayForm, upiId: e.target.value })}
                  placeholder="e.g. 9176593129@okbizaxis"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Purpose / Notes</label>
                <input
                  type="text"
                  value={gpayForm.notes}
                  onChange={(e) => setGpayForm({ ...gpayForm, notes: e.target.value })}
                  placeholder="e.g. Official Google Pay for all school fees"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gpayForm.isDefault}
                    onChange={(e) => setGpayForm({ ...gpayForm, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Set as Default School Fee GPay Account</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGPayModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {editingGPay ? 'Save Changes' : 'Create GPay Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Phone Contact Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-purple-800 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingPhone ? 'Edit School Contact' : 'Add New Contact Number'}
                </h3>
                <p className="text-xs text-purple-200">Wisdom Nursery & Primary School - Essur</p>
              </div>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhone} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Department / Service *</label>
                <input
                  type="text"
                  required
                  value={phoneForm.department}
                  onChange={(e) => setPhoneForm({ ...phoneForm, department: e.target.value })}
                  placeholder="e.g. Van & Transport Hotline"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Person / In-charge</label>
                <input
                  type="text"
                  value={phoneForm.contactPerson}
                  onChange={(e) => setPhoneForm({ ...phoneForm, contactPerson: e.target.value })}
                  placeholder="e.g. Mr. Murugan K"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phoneForm.phoneNumber}
                    onChange={(e) => setPhoneForm({ ...phoneForm, phoneNumber: e.target.value })}
                    placeholder="e.g. 9176593129"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Available Hours</label>
                  <input
                    type="text"
                    value={phoneForm.availableHours}
                    onChange={(e) => setPhoneForm({ ...phoneForm, availableHours: e.target.value })}
                    placeholder="8:30 AM - 4:30 PM"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={phoneForm.whatsappEnabled}
                    onChange={(e) => setPhoneForm({ ...phoneForm, whatsappEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>WhatsApp Enabled on this number</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={phoneForm.isEmergency}
                    onChange={(e) => setPhoneForm({ ...phoneForm, isEmergency: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Mark as Emergency / Immediate Hotline</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPhoneModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {editingPhone ? 'Save Changes' : 'Create Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
