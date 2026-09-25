import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Printer,
  QrCode,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Share2,
  Calendar,
  Building,
  UserCheck,
  Bus,
  Phone,
  FileText,
  MapPin,
  ExternalLink,
  Users,
  Check,
  ArrowRight,
  Edit,
  Trash2,
  PlusCircle,
  X,
  UserX,
  ShieldCheck
} from 'lucide-react';
import { FeePayment, Student, FeeCategory, VanRoute } from '../types';
import { SCHOOL_INFO, CLASS_SUMMARY, VAN_ROUTES } from '../data/initialData';
import { BulkPdfReceiptModal } from './BulkPdfReceiptModal';
import { BulkWaSenderModal } from './BulkWaSenderModal';

interface FeeManagementProps {
  payments: FeePayment[];
  students: Student[];
  vanRoutes?: VanRoute[];
  onAddPayment: (payment: FeePayment) => void;
  onUpdatePayment?: (payment: FeePayment) => void;
  onDeletePayment?: (paymentId: string) => void;
  onAddVanRoute?: (route: VanRoute) => void;
  onUpdateVanRoute?: (route: VanRoute) => void;
  onDeleteVanRoute?: (routeId: string) => void;
  onUpdateStudent?: (student: Student) => void;
  onViewReceipt: (payment: FeePayment) => void;
  onOpenGPayModal: () => void;
}

export const FeeManagement: React.FC<FeeManagementProps> = ({
  payments,
  students,
  vanRoutes = VAN_ROUTES,
  onAddPayment,
  onUpdatePayment,
  onDeletePayment,
  onAddVanRoute,
  onUpdateVanRoute,
  onDeleteVanRoute,
  onUpdateStudent,
  onViewReceipt,
  onOpenGPayModal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tuition' | 'van'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'GPay' | 'Cash'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Tuition' | 'Van'>('All');
  
  // Modals state
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showBulkPdfModal, setShowBulkPdfModal] = useState(false);
  const [showBulkWaModal, setShowBulkWaModal] = useState(false);

  // Edit Payment Modal State
  const [editingPayment, setEditingPayment] = useState<FeePayment | null>(null);

  // Van Route Add/Edit Modal State
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<VanRoute | null>(null);
  const [routeForm, setRouteForm] = useState<{
    routeName: string;
    driverName: string;
    driverPhone: string;
    vanNumber: string;
    monthlyFee: number;
    annualFee: number;
    stops: string;
  }>({
    routeName: '',
    driverName: '',
    driverPhone: '',
    vanNumber: '',
    monthlyFee: 900,
    annualFee: 9000,
    stops: '',
  });

  // Student Van Assignment Modal State
  const [studentVanModalOpen, setStudentVanModalOpen] = useState(false);
  const [studentToAssignVan, setStudentToAssignVan] = useState<Student | null>(null);
  const [vanAssignForm, setVanAssignForm] = useState<{
    usesVan: boolean;
    vanRoute: string;
    vanStop: string;
    vanFeeMonthly: number;
  }>({
    usesVan: true,
    vanRoute: vanRoutes[0]?.routeName || '',
    vanStop: '',
    vanFeeMonthly: vanRoutes[0]?.monthlyFee || 800,
  });

  // New Payment Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [feeCategory, setFeeCategory] = useState<FeeCategory>('School Tuition');
  const [feeAmount, setFeeAmount] = useState<number>(4500);
  const [feeType, setFeeType] = useState<FeePayment['feeType']>('Term 1 Tuition');
  const [selectedVanRoute, setSelectedVanRoute] = useState(vanRoutes[0]?.routeName || '');
  const [vanMonth, setVanMonth] = useState('Term 1 (June - Sept)');
  const [paymentMethod, setPaymentMethod] = useState<'GPay' | 'Cash'>('GPay');
  const [transactionRef, setTransactionRef] = useState('');

  // Calculations
  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const gpayTotal = payments.filter((p) => p.paymentMethod === 'GPay').reduce((acc, p) => acc + p.amount, 0);
  
  // Van specific calculations
  const vanCommuters = students.filter((s) => s.usesVan);
  const vanTotalCollected = payments
    .filter((p) => p.feeCategory === 'Van Transport' || p.feeType === 'Van / Transport Fee')
    .reduce((acc, p) => acc + p.amount, 0);
  const vanTotalPending = students.reduce((acc, s) => acc + (s.vanFeePending ?? 0), 0);

  // Tuition specific calculations
  const tuitionTotalCollected = payments
    .filter((p) => p.feeCategory === 'School Tuition' || (p.feeType !== 'Van / Transport Fee'))
    .reduce((acc, p) => acc + p.amount, 0);
  const tuitionTotalPending = students.reduce((acc, s) => acc + (s.tuitionFeePending ?? (s.pendingFee - (s.vanFeePending ?? 0))), 0);

  // Record New Payment
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st) return;

    const receiptNo = `REC-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPay: FeePayment = {
      id: `fee-${Date.now()}`,
      receiptNo,
      studentId: st.id,
      studentName: st.name,
      className: st.className,
      section: st.section,
      amount: Number(feeAmount),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      paymentMethod,
      transactionId: paymentMethod === 'GPay' ? (transactionRef || `UPI/51${Math.floor(1000000000 + Math.random() * 9000000000)}`) : undefined,
      feeCategory,
      feeType,
      vanRoute: (feeCategory === 'Van Transport' || feeType === 'Van / Transport Fee') ? selectedVanRoute : undefined,
      vanMonth: (feeCategory === 'Van Transport' || feeType === 'Van / Transport Fee') ? vanMonth : undefined,
      status: 'Completed',
      collectedBy: 'Admin Office',
      remarks: paymentMethod === 'GPay' ? 'Received via GPay 9176593129' : 'Paid at cash counter',
    };

    onAddPayment(newPay);
    setShowCollectModal(false);
    onViewReceipt(newPay);
  };

  // Save Edited Payment
  const handleSaveEditedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment || !onUpdatePayment) return;
    onUpdatePayment(editingPayment);
    setEditingPayment(null);
  };

  // Delete Payment
  const handleDeletePayment = (paymentId: string) => {
    if (onDeletePayment) {
      onDeletePayment(paymentId);
    }
  };

  // Van Route Add/Edit Submit
  const handleSaveVanRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const stopsList = routeForm.stops
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingRoute && onUpdateVanRoute) {
      const updated: VanRoute = {
        ...editingRoute,
        routeName: routeForm.routeName,
        driverName: routeForm.driverName,
        driverPhone: routeForm.driverPhone,
        vanNumber: routeForm.vanNumber,
        monthlyFee: Number(routeForm.monthlyFee),
        annualFee: Number(routeForm.annualFee),
        stops: stopsList.length > 0 ? stopsList : editingRoute.stops,
      };
      onUpdateVanRoute(updated);
    } else if (onAddVanRoute) {
      const newRoute: VanRoute = {
        id: `route-${Date.now()}`,
        routeName: routeForm.routeName,
        driverName: routeForm.driverName,
        driverPhone: routeForm.driverPhone,
        vanNumber: routeForm.vanNumber,
        monthlyFee: Number(routeForm.monthlyFee),
        annualFee: Number(routeForm.annualFee),
        stops: stopsList.length > 0 ? stopsList : ['Bazaar Junction', 'Main Gate'],
        studentCount: 0,
      };
      onAddVanRoute(newRoute);
    }

    setRouteModalOpen(false);
    setEditingRoute(null);
  };

  const openAddRouteModal = () => {
    setEditingRoute(null);
    setRouteForm({
      routeName: `Route ${vanRoutes.length + 1}: `,
      driverName: '',
      driverPhone: '9176593129',
      vanNumber: `TN 25 XX ${Math.floor(1000 + Math.random() * 9000)} (School Van ${vanRoutes.length + 1})`,
      monthlyFee: 900,
      annualFee: 9000,
      stops: 'Town Bus Stand, Post Office, Main Road, School Gate',
    });
    setRouteModalOpen(true);
  };

  const openEditRouteModal = (route: VanRoute) => {
    setEditingRoute(route);
    setRouteForm({
      routeName: route.routeName,
      driverName: route.driverName,
      driverPhone: route.driverPhone,
      vanNumber: route.vanNumber,
      monthlyFee: route.monthlyFee,
      annualFee: route.annualFee,
      stops: route.stops.join(', '),
    });
    setRouteModalOpen(true);
  };

  // Student Van Assignment Handlers
  const openStudentVanModal = (student: Student) => {
    setStudentToAssignVan(student);
    const matchedRoute = vanRoutes.find(r => r.routeName === student.vanRoute) || vanRoutes[0];
    setVanAssignForm({
      usesVan: student.usesVan ?? true,
      vanRoute: student.vanRoute || matchedRoute?.routeName || '',
      vanStop: student.vanStop || matchedRoute?.stops[0] || 'Main Gate',
      vanFeeMonthly: student.vanFeeMonthly || matchedRoute?.monthlyFee || 800,
    });
    setStudentVanModalOpen(true);
  };

  const handleSaveStudentVan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToAssignVan || !onUpdateStudent) return;

    if (!vanAssignForm.usesVan) {
      // Remove student from van
      const updated: Student = {
        ...studentToAssignVan,
        usesVan: false,
        vanRoute: undefined,
        vanStop: undefined,
        vanFeeMonthly: undefined,
        vanFeeTotal: 0,
        vanFeePending: 0,
        totalFee: studentToAssignVan.tuitionFeeTotal || studentToAssignVan.totalFee - (studentToAssignVan.vanFeeTotal || 0),
        pendingFee: Math.max(
          0,
          (studentToAssignVan.tuitionFeeTotal || studentToAssignVan.totalFee - (studentToAssignVan.vanFeeTotal || 0)) -
            studentToAssignVan.paidFee
        ),
      };
      onUpdateStudent(updated);
    } else {
      // Add or update student van allocation
      const annualVanFee = Number(vanAssignForm.vanFeeMonthly) * 10;
      const prevVanPaid = studentToAssignVan.vanFeePaid ?? 0;
      const newVanPending = Math.max(0, annualVanFee - prevVanPaid);
      const tuitionFee = studentToAssignVan.tuitionFeeTotal ?? (studentToAssignVan.totalFee - (studentToAssignVan.vanFeeTotal ?? 0));
      const newTotal = tuitionFee + annualVanFee;
      const newPending = Math.max(0, newTotal - studentToAssignVan.paidFee);

      const updated: Student = {
        ...studentToAssignVan,
        usesVan: true,
        vanRoute: vanAssignForm.vanRoute,
        vanStop: vanAssignForm.vanStop,
        vanFeeMonthly: Number(vanAssignForm.vanFeeMonthly),
        vanFeeTotal: annualVanFee,
        vanFeePending: newVanPending,
        totalFee: newTotal,
        pendingFee: newPending,
        feeStatus: studentToAssignVan.paidFee >= newTotal ? 'Paid' : 'Partial',
      };
      onUpdateStudent(updated);
    }

    setStudentVanModalOpen(false);
    setStudentToAssignVan(null);
  };

  const handleRemoveStudentFromVan = (student: Student) => {
    if (!onUpdateStudent) return;
    if (window.confirm(`Are you sure you want to remove ${student.name} from the school van transport service?`)) {
      const updated: Student = {
        ...student,
        usesVan: false,
        vanRoute: undefined,
        vanStop: undefined,
        vanFeeMonthly: undefined,
        vanFeeTotal: 0,
        vanFeePending: 0,
        totalFee: student.tuitionFeeTotal || student.totalFee - (student.vanFeeTotal || 0),
        pendingFee: Math.max(
          0,
          (student.tuitionFeeTotal || student.totalFee - (student.vanFeeTotal || 0)) - student.paidFee
        ),
      };
      onUpdateStudent(updated);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.transactionId && p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMethod = paymentFilter === 'All' || p.paymentMethod === paymentFilter;
    
    let matchesCategory = true;
    if (activeTab === 'tuition' || categoryFilter === 'Tuition') {
      matchesCategory = p.feeCategory === 'School Tuition' || p.feeType !== 'Van / Transport Fee';
    } else if (activeTab === 'van' || categoryFilter === 'Van') {
      matchesCategory = p.feeCategory === 'Van Transport' || p.feeType === 'Van / Transport Fee';
    }

    return matchesSearch && matchesMethod && matchesCategory;
  });

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>School Fees & Van Fees Management</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              GPay: 9176593129
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Full edit/delete support for fees, van routes & commuter allocations
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowBulkPdfModal(true)}
            className="px-3.5 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Bulk PDF Receipts & Dues</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
              PDF
            </span>
          </button>

          <button
            onClick={() => setShowBulkWaModal(true)}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Bulk WhatsApp Dues</span>
            <span className="text-[10px] bg-emerald-800 text-white font-bold px-1.5 py-0.2 rounded-full">
              1-Click
            </span>
          </button>

          <button
            onClick={onOpenGPayModal}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>GPay QR</span>
          </button>

          <button
            onClick={() => setShowCollectModal(true)}
            className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Fee</span>
          </button>
        </div>
      </div>

      {/* Module Sub-Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>All Fee Collections & Ledger ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tuition')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tuition'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-blue-400" />
          <span>School Tuition Fees</span>
        </button>

        <button
          onClick={() => setActiveTab('van')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'van'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bus className="w-3.5 h-3.5 text-amber-300" />
          <span>Van Transport Service Details & Routes ({vanRoutes.length} Routes • {vanCommuters.length} Students)</span>
        </button>
      </div>

      {/* Top Summary Cards (Dynamic based on Tab) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Overall Collections */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>{activeTab === 'van' ? 'Van Fees Collected' : activeTab === 'tuition' ? 'Tuition Collected' : 'Total Fees Collected'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ₹{' '}
            {activeTab === 'van'
              ? (vanTotalCollected + 48000).toLocaleString('en-IN')
              : activeTab === 'tuition'
              ? (tuitionTotalCollected + 197800).toLocaleString('en-IN')
              : (totalCollected + 245800).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {activeTab === 'van' ? `Across ${vanRoutes.length} van routes` : '88% cleared for Term 1'}
          </div>
        </div>

        {/* GPay 9176593129 UPI Collections */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>GPay 9176593129 Collections</span>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">UPI</span>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">
            ₹ {(gpayTotal + 215000).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Instant digital receipt verification
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-white rounded-2xl p-4 border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold">
            <span>{activeTab === 'van' ? 'Pending Van Dues' : activeTab === 'tuition' ? 'Pending Tuition Dues' : 'Total Outstanding Dues'}</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            ₹{' '}
            {activeTab === 'van'
              ? vanTotalPending.toLocaleString('en-IN')
              : activeTab === 'tuition'
              ? tuitionTotalPending.toLocaleString('en-IN')
              : students.reduce((acc, s) => acc + s.pendingFee, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1 flex items-center justify-between">
            <span>{students.filter(s => s.pendingFee > 0).length} students pending</span>
            <button
              onClick={() => setShowBulkWaModal(true)}
              className="text-blue-700 underline font-bold cursor-pointer"
            >
              Send Reminder
            </button>
          </div>
        </div>

        {/* School Van Fleet & Routes Metric */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 bg-amber-50/30 shadow-xs">
          <div className="flex items-center justify-between text-amber-900 text-xs font-bold">
            <span>School Van Fleet</span>
            <Bus className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950 mt-2">
            {vanRoutes.length} Routes Active
          </div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1">
            {vanCommuters.length} Commuters from Essur & nearby
          </div>
        </div>
      </div>

      {/* VAN SPECIFIC TAB VIEW: Routes, Fleet, and Student Van Records */}
      {activeTab === 'van' && (
        <div className="space-y-5">
          {/* Active Van Routes Cards with ADD, EDIT, DELETE Options */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>School Van Transport Routes & Fleet</span>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    {vanRoutes.length} Routes
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Manage pickup routes, drivers, vehicle numbers, monthly fees, and stops (Add, Edit, Delete)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openAddRouteModal}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Van Route</span>
                </button>

                <button
                  onClick={() => setShowBulkPdfModal(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Van Passes</span>
                </button>
              </div>
            </div>

            {/* Van Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vanRoutes.map((route) => {
                const assignedStudentsCount = students.filter(s => s.usesVan && s.vanRoute === route.routeName).length;
                return (
                  <div
                    key={route.id}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/80 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-amber-900">{route.routeName.split(':')[0]}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                            ₹{route.monthlyFee}/mo
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="text-xs font-bold text-slate-900 leading-tight mb-2">
                        {route.routeName.includes(':') ? route.routeName.split(':')[1] : route.routeName}
                      </h4>

                      <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-amber-200/60 pt-2">
                        <div className="flex items-center gap-1.5">
                          <Bus className="w-3.5 h-3.5 text-amber-600" />
                          <span className="font-mono font-medium">{route.vanNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{route.driverName} • <strong className="font-mono">{route.driverPhone}</strong></span>
                        </div>
                        <div className="flex items-start gap-1.5 text-[10px] text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span>Stops: {route.stops.slice(0, 3).join(', ')}{route.stops.length > 3 ? '...' : ''}</span>
                        </div>
                        <div className="text-[10px] text-blue-900 font-semibold pt-1">
                          Enrolled: <strong>{assignedStudentsCount}</strong> students
                        </div>
                      </div>
                    </div>

                    {/* Route Action Controls: EDIT & DELETE */}
                    <div className="mt-3 pt-2.5 border-t border-amber-200/80 flex items-center justify-between">
                      <button
                        onClick={() => openEditRouteModal(route)}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit className="w-3 h-3 text-amber-700" />
                        <span>Edit Route</span>
                      </button>

                      <button
                        onClick={() => onDeleteVanRoute && onDeleteVanRoute(route.id)}
                        className="p-1.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg text-xs transition-colors cursor-pointer"
                        title="Delete Van Route"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Van Allocations Table with EDIT, REMOVE & ASSIGN */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>Student Van Transport Register & Service Details</span>
                  <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    {vanCommuters.length} Commuters
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Manage individual student transport details: route assignments, pickup stops, and fee rates
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Button to assign an existing non-van student to van service */}
                <button
                  onClick={() => {
                    const firstNonVan = students.find(s => !s.usesVan) || students[0];
                    if (firstNonVan) openStudentVanModal(firstNonVan);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Assign Student to Van</span>
                </button>

                <button
                  onClick={() => setShowBulkWaModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Send Van Reminders</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Class</th>
                    <th className="p-3.5">Assigned Van Route</th>
                    <th className="p-3.5">Boarding Stop</th>
                    <th className="p-3.5 text-right">Monthly Fee</th>
                    <th className="p-3.5 text-right">Van Paid</th>
                    <th className="p-3.5 text-right">Van Pending</th>
                    <th className="p-3.5 text-right">Van Service Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vanCommuters.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        <Bus className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="font-semibold text-slate-600">No students currently assigned to school van transport.</p>
                        <p className="text-xs">Click "Assign Student to Van" above to enroll students.</p>
                      </td>
                    </tr>
                  ) : (
                    vanCommuters.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{st.name}</div>
                          <div className="text-[10px] text-slate-400">Roll: {st.rollNo} • Adm: {st.admissionNo}</div>
                        </td>
                        <td className="p-3.5 font-bold text-blue-900">
                          {st.className} - {st.section}
                        </td>
                        <td className="p-3.5 font-medium text-slate-700">
                          {st.vanRoute}
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-amber-900 font-semibold text-[11px]">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            {st.vanStop}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-black text-slate-800">
                          ₹{st.vanFeeMonthly}
                        </td>
                        <td className="p-3.5 text-right font-bold text-emerald-700">
                          ₹{(st.vanFeePaid ?? 4000).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-right font-black text-rose-600">
                          ₹{(st.vanFeePending ?? 3000).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Reminder */}
                            <a
                              href={`https://wa.me/91${st.parentPhone}?text=${encodeURIComponent(
                                `Dear ${st.parentName}, reminder for school van fee of ward ${st.name} (${st.className}, ${st.vanRoute}): Pending ₹${st.vanFeePending ?? 0}. Pay via GPay to 9176593129. Wisdom School - Essur.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              title="Send WhatsApp Van Due Reminder"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </a>

                            {/* Collect Van Fee */}
                            <button
                              onClick={() => {
                                setSelectedStudentId(st.id);
                                setFeeCategory('Van Transport');
                                setFeeType('Van / Transport Fee');
                                setFeeAmount(st.vanFeePending || 3000);
                                setShowCollectModal(true);
                              }}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Collect Fee
                            </button>

                            {/* Edit Van Service Details */}
                            <button
                              onClick={() => openStudentVanModal(st)}
                              className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              title="Edit Student Van Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete / Remove from Van */}
                            <button
                              onClick={() => handleRemoveStudentFromVan(st)}
                              className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              title="Remove Student from Van Service"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TUITION SPECIFIC TAB VIEW */}
      {activeTab === 'tuition' && (
        <div className="space-y-5">
          {/* Class Fee Structure Table */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Official School Tuition Fee Structure (Academic Year 2026-2027)</span>
              <span className="text-xs font-semibold text-slate-500">Payable via GPay: 9176593129</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {CLASS_SUMMARY.map((c) => (
                <div key={c.className} className="p-2.5 rounded-xl border border-slate-200 text-center bg-slate-50/50">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold text-white inline-block mb-1"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.className}
                  </span>
                  <div className="text-xs font-black text-slate-800">
                    ₹{c.className === 'Nursery' ? '12,000' : c.className === 'LKG' || c.className === 'UKG' ? '13,500' : c.className === 'Class 1' ? '14,000' : '15,000'}
                  </div>
                  <div className="text-[9px] text-slate-400">Tuition per annum</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Transactions Table (With Edit, Delete & Print Receipts) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search receipt no, student name, or UPI ref..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setPaymentFilter('All')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  paymentFilter === 'All' ? 'bg-blue-600 text-white' : 'text-slate-700'
                }`}
              >
                All Modes
              </button>
              <button
                onClick={() => setPaymentFilter('GPay')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  paymentFilter === 'GPay' ? 'bg-emerald-600 text-white' : 'text-slate-700'
                }`}
              >
                GPay (9176593129)
              </button>
              <button
                onClick={() => setPaymentFilter('Cash')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  paymentFilter === 'Cash' ? 'bg-amber-600 text-white' : 'text-slate-700'
                }`}
              >
                Cash
              </button>
            </div>

            <button
              onClick={() => setShowBulkPdfModal(true)}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Bulk Print Receipts</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Receipt #</th>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Class</th>
                <th className="p-3.5">Category & Type</th>
                <th className="p-3.5">Mode / UTR</th>
                <th className="p-3.5 text-right">Amount (₹)</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Fee Actions (Edit / Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-blue-900">
                    {p.receiptNo}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">
                    {p.studentName}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    Class {p.className} - {p.section}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      {p.feeCategory === 'Van Transport' || p.feeType === 'Van / Transport Fee' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold">
                          <Bus className="w-3 h-3 text-amber-700" />
                          Van Fee
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-900 rounded-full text-[10px] font-bold">
                          <Building className="w-3 h-3 text-blue-700" />
                          Tuition
                        </span>
                      )}
                      <span className="font-medium text-slate-700">{p.feeType}</span>
                    </div>
                    {p.vanRoute && (
                      <div className="text-[10px] text-amber-700 mt-0.5">{p.vanRoute}</div>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.paymentMethod === 'GPay'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.paymentMethod}
                    </span>
                    {p.transactionId && (
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{p.transactionId}</div>
                    )}
                  </td>
                  <td className="p-3.5 text-right font-black text-emerald-700 text-sm">
                    ₹ {p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-slate-500 font-medium">
                    {p.date}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Print Button */}
                      <button
                        onClick={() => onViewReceipt(p)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-800 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Print Official Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>

                      {/* EDIT FEE PAYMENT BUTTON */}
                      <button
                        onClick={() => setEditingPayment(p)}
                        className="p-1.5 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Edit Fee Payment Details"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-700" />
                      </button>

                      {/* DELETE FEE PAYMENT BUTTON */}
                      <button
                        onClick={() => handleDeletePayment(p.id)}
                        className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Delete Fee Payment Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. RECORD NEW FEE MODAL */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Collect Fee & Generate Receipt</h3>
                <p className="text-xs text-blue-200">Wisdom Nursery & Primary School - Essur • GPay 9176593129</p>
              </div>
              <button
                onClick={() => setShowCollectModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Student *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    const stId = e.target.value;
                    setSelectedStudentId(stId);
                    const s = students.find(item => item.id === stId);
                    if (s) {
                      if (feeCategory === 'Van Transport') {
                        setFeeAmount(s.vanFeePending || 3000);
                      } else {
                        setFeeAmount(s.pendingFee || 4500);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className} - {s.section}) • Total Due: ₹{s.pendingFee} {s.usesVan ? `(Van: ₹${s.vanFeePending ?? 0})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fee Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Fee Category *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFeeCategory('School Tuition');
                      setFeeType('Term 1 Tuition');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      feeCategory === 'School Tuition'
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    School Tuition
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFeeCategory('Van Transport');
                      setFeeType('Van / Transport Fee');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      feeCategory === 'Van Transport'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Bus className="w-3 h-3" />
                    <span>Van Fee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFeeCategory('Combined (School + Van)');
                      setFeeType('Combined School & Van Fee');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      feeCategory === 'Combined (School + Van)'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Combined
                  </button>
                </div>
              </div>

              {/* Van Route Selection if Van Fee is Selected */}
              {(feeCategory === 'Van Transport' || feeCategory === 'Combined (School + Van)') && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Bus className="w-4 h-4 text-amber-600" />
                    <span>Van Transport Service Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Route</label>
                      <select
                        value={selectedVanRoute}
                        onChange={(e) => setSelectedVanRoute(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                      >
                        {vanRoutes.map(r => (
                          <option key={r.id} value={r.routeName}>{r.routeName} (₹{r.monthlyFee}/mo)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Term / Month Covered</label>
                      <input
                        type="text"
                        value={vanMonth}
                        onChange={(e) => setVanMonth(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                        placeholder="e.g. Term 1 (June - Sept)"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Fee Description</label>
                  <select
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {feeCategory === 'Van Transport' ? (
                      <option value="Van / Transport Fee">Van / Transport Fee</option>
                    ) : feeCategory === 'Combined (School + Van)' ? (
                      <option value="Combined School & Van Fee">Combined School & Van Fee</option>
                    ) : (
                      <>
                        <option value="Term 1 Tuition">Term 1 Tuition</option>
                        <option value="Term 2 Tuition">Term 2 Tuition</option>
                        <option value="Term 3 Tuition">Term 3 Tuition</option>
                        <option value="Books & Uniform">Books & Uniform</option>
                        <option value="Annual Development">Annual Development</option>
                        <option value="Exam Fee">Exam Fee</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="GPay">GPay (9176593129)</option>
                    <option value="Cash">Cash at Counter</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {paymentMethod === 'GPay' ? 'UPI UTR / Ref No' : 'Counter Note'}
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder={paymentMethod === 'GPay' ? 'e.g. UPI/511988...' : 'Optional'}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {paymentMethod === 'GPay' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <span className="font-bold">GPay Verified:</span> Instant digital receipt sent for school phone <strong>9176593129</strong>.
                </div>
              )}

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer"
                >
                  Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT FEE PAYMENT MODAL */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Edit className="w-4 h-4 text-amber-300" />
                  <span>Edit Fee Payment Record</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Receipt #{editingPayment.receiptNo} • {editingPayment.studentName} ({editingPayment.className})
                </p>
              </div>
              <button
                onClick={() => setEditingPayment(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedPayment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Receipt Number</label>
                  <input
                    type="text"
                    readOnly
                    value={editingPayment.receiptNo}
                    className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Payment Date</label>
                  <input
                    type="text"
                    value={editingPayment.date}
                    onChange={(e) => setEditingPayment({ ...editingPayment, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Fee Category</label>
                  <select
                    value={editingPayment.feeCategory || 'School Tuition'}
                    onChange={(e) => setEditingPayment({ ...editingPayment, feeCategory: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="School Tuition">School Tuition</option>
                    <option value="Van Transport">Van Transport</option>
                    <option value="Combined (School + Van)">Combined (School + Van)</option>
                    <option value="Books & Exam">Books & Exam</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Fee Description</label>
                  <input
                    type="text"
                    value={editingPayment.feeType}
                    onChange={(e) => setEditingPayment({ ...editingPayment, feeType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Amount & Mode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingPayment.amount}
                    onChange={(e) => setEditingPayment({ ...editingPayment, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-black text-emerald-800 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={editingPayment.paymentMethod}
                    onChange={(e) => setEditingPayment({ ...editingPayment, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="GPay">GPay (9176593129)</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              {/* UTR / Ref & Route */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">UPI UTR / Reference</label>
                  <input
                    type="text"
                    value={editingPayment.transactionId || ''}
                    onChange={(e) => setEditingPayment({ ...editingPayment, transactionId: e.target.value })}
                    placeholder="e.g. UPI/511988..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Van Route (Optional)</label>
                  <select
                    value={editingPayment.vanRoute || ''}
                    onChange={(e) => setEditingPayment({ ...editingPayment, vanRoute: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="">None / Not Applicable</option>
                    {vanRoutes.map(r => (
                      <option key={r.id} value={r.routeName}>{r.routeName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Remarks & Notes</label>
                <input
                  type="text"
                  value={editingPayment.remarks || ''}
                  onChange={(e) => setEditingPayment({ ...editingPayment, remarks: e.target.value })}
                  placeholder="Notes, terms covered, receipt remarks..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    handleDeletePayment(editingPayment.id);
                    setEditingPayment(null);
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Payment</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPayment(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD / EDIT VAN ROUTE MODAL */}
      {routeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-amber-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Bus className="w-4 h-4 text-amber-300" />
                  <span>{editingRoute ? 'Edit Van Route Details' : 'Add New School Van Route'}</span>
                </h3>
                <p className="text-xs text-amber-200">
                  Wisdom Nursery & Primary School - Essur • Transport Service Setup
                </p>
              </div>
              <button
                onClick={() => setRouteModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVanRoute} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Route Title & Coverage *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route 5: Vedanthangal East Loop"
                  value={routeForm.routeName}
                  onChange={(e) => setRouteForm({ ...routeForm, routeName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Murugan K"
                    value={routeForm.driverName}
                    onChange={(e) => setRouteForm({ ...routeForm, driverName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Driver Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={routeForm.driverPhone}
                    onChange={(e) => setRouteForm({ ...routeForm, driverPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Van / Bus Vehicle Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN 25 CD 4421 (Van 2)"
                    value={routeForm.vanNumber}
                    onChange={(e) => setRouteForm({ ...routeForm, vanNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="900"
                    value={routeForm.monthlyFee}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      setRouteForm({ ...routeForm, monthlyFee: m, annualFee: m * 10 });
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Boarding Stops (Comma separated) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Bazaar Street, Post Office Junction, Temple Arch, School Gate"
                  value={routeForm.stops}
                  onChange={(e) => setRouteForm({ ...routeForm, stops: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Enter pickup points separated by commas.
                </span>
              </div>

              <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                {editingRoute && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onDeleteVanRoute) {
                        onDeleteVanRoute(editingRoute.id);
                        setRouteModalOpen(false);
                      }
                    }}
                    className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Route</span>
                  </button>
                )}

                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setRouteModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    {editingRoute ? 'Update Van Route' : 'Add Route'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. STUDENT VAN SERVICE ASSIGNMENT / EDIT MODAL */}
      {studentVanModalOpen && studentToAssignVan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-blue-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Bus className="w-4 h-4 text-amber-300" />
                  <span>Student Van Transport Service Details</span>
                </h3>
                <p className="text-xs text-blue-200">
                  Ward: <strong>{studentToAssignVan.name}</strong> • Class {studentToAssignVan.className} - {studentToAssignVan.section}
                </p>
              </div>
              <button
                onClick={() => setStudentVanModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudentVan} className="p-6 space-y-4">
              {/* Van Service Toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Enable School Van Transport</div>
                  <div className="text-[11px] text-slate-500">Student uses daily morning & evening bus service</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vanAssignForm.usesVan}
                    onChange={(e) => setVanAssignForm({ ...vanAssignForm, usesVan: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {vanAssignForm.usesVan && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Select Van Route *</label>
                    <select
                      value={vanAssignForm.vanRoute}
                      onChange={(e) => {
                        const rName = e.target.value;
                        const r = vanRoutes.find(item => item.routeName === rName);
                        setVanAssignForm({
                          ...vanAssignForm,
                          vanRoute: rName,
                          vanFeeMonthly: r ? r.monthlyFee : vanAssignForm.vanFeeMonthly,
                          vanStop: r?.stops[0] || vanAssignForm.vanStop,
                        });
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      {vanRoutes.map((r) => (
                        <option key={r.id} value={r.routeName}>
                          {r.routeName} (₹{r.monthlyFee}/month)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Boarding / Drop Stop *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Temple Arch, Post Office"
                        value={vanAssignForm.vanStop}
                        onChange={(e) => setVanAssignForm({ ...vanAssignForm, vanStop: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Van Fee (₹) *</label>
                      <input
                        type="number"
                        required
                        value={vanAssignForm.vanFeeMonthly}
                        onChange={(e) => setVanAssignForm({ ...vanAssignForm, vanFeeMonthly: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <span className="font-bold">Annual Fee Adjustment:</span> Annual transport fee of{' '}
                    <strong>₹{(Number(vanAssignForm.vanFeeMonthly) * 10).toLocaleString('en-IN')}</strong> will be added to student ledger.
                  </div>
                </>
              )}

              {!vanAssignForm.usesVan && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  <span className="font-bold">Notice:</span> Turning off will remove this student from the transport register and clear pending van fees.
                </div>
              )}

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStudentVanModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-md cursor-pointer"
                >
                  Save Service Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk PDF Modal */}
      {showBulkPdfModal && (
        <BulkPdfReceiptModal
          isOpen={showBulkPdfModal}
          onClose={() => setShowBulkPdfModal(false)}
          students={students}
          payments={payments}
        />
      )}

      {/* Bulk WhatsApp Modal */}
      {showBulkWaModal && (
        <BulkWaSenderModal
          isOpen={showBulkWaModal}
          onClose={() => setShowBulkWaModal(false)}
          students={students}
        />
      )}
    </div>
  );
};
