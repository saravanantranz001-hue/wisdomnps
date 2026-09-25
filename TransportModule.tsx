import React, { useState } from 'react';
import {
  Bus,
  Phone,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Share2,
  Printer,
  Calendar,
  Fuel,
  Wrench,
  UserX,
  X
} from 'lucide-react';
import { Student, VanRoute } from '../types';
import { VAN_ROUTES, SCHOOL_INFO } from '../data/initialData';

interface TransportModuleProps {
  students: Student[];
  vanRoutes: VanRoute[];
  onAddVanRoute: (route: VanRoute) => void;
  onUpdateVanRoute: (route: VanRoute) => void;
  onDeleteVanRoute: (routeId: string) => void;
  onUpdateStudent: (student: Student) => void;
  onOpenGPayForStudent?: (student: Student) => void;
}

interface MaintenanceLog {
  id: string;
  vanNumber: string;
  type: 'Fuel' | 'Service & Oil' | 'Tire & Brake' | 'Fitness Certificate (FC)';
  cost: number;
  date: string;
  notes: string;
}

export const TransportModule: React.FC<TransportModuleProps> = ({
  students,
  vanRoutes,
  onAddVanRoute,
  onUpdateVanRoute,
  onDeleteVanRoute,
  onUpdateStudent,
  onOpenGPayForStudent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'routes' | 'students' | 'maintenance'>('routes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('All');

  // Route Modal State
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<VanRoute | null>(null);
  const [routeForm, setRouteForm] = useState({
    routeName: '',
    driverName: '',
    driverPhone: '',
    vanNumber: '',
    monthlyFee: 900,
    annualFee: 9000,
    stops: '',
  });

  // Student Van Assignment Modal
  const [studentVanModalOpen, setStudentVanModalOpen] = useState(false);
  const [studentToAssign, setStudentToAssign] = useState<Student | null>(null);
  const [vanAssignForm, setVanAssignForm] = useState({
    usesVan: true,
    vanRoute: vanRoutes[0]?.routeName || '',
    vanStop: '',
    vanFeeMonthly: vanRoutes[0]?.monthlyFee || 800,
  });

  // Maintenance Logs State
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([
    {
      id: 'maint-1',
      vanNumber: 'TN 25 AB 1029 (Van 1)',
      type: 'Fuel',
      cost: 4500,
      date: '2025-04-20',
      notes: 'Full diesel tank fill for Essur local run',
    },
    {
      id: 'maint-2',
      vanNumber: 'TN 25 CD 4421 (Van 2)',
      type: 'Service & Oil',
      cost: 6200,
      date: '2025-04-15',
      notes: 'Quarterly engine oil replacement and brake inspection',
    },
    {
      id: 'maint-3',
      vanNumber: 'TN 25 EF 8812 (Van 3)',
      type: 'Fitness Certificate (FC)',
      cost: 3800,
      date: '2025-04-10',
      notes: 'RTO speed governor calibration and FC renewal',
    },
  ]);

  const [maintModalOpen, setMaintModalOpen] = useState(false);
  const [editingMaint, setEditingMaint] = useState<MaintenanceLog | null>(null);
  const [maintForm, setMaintForm] = useState<Omit<MaintenanceLog, 'id'>>({
    vanNumber: vanRoutes[0]?.vanNumber || 'TN 25 AB 1029',
    type: 'Fuel',
    cost: 3000,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const vanStudents = students.filter((s) => s.usesVan);
  const totalVanPending = vanStudents.reduce((acc, s) => acc + (s.vanFeePending ?? 0), 0);

  // Route Add / Edit Handlers
  const handleOpenAddRoute = () => {
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

  const handleOpenEditRoute = (route: VanRoute) => {
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

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const stopsList = routeForm.stops
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingRoute) {
      onUpdateVanRoute({
        ...editingRoute,
        routeName: routeForm.routeName,
        driverName: routeForm.driverName,
        driverPhone: routeForm.driverPhone,
        vanNumber: routeForm.vanNumber,
        monthlyFee: Number(routeForm.monthlyFee),
        annualFee: Number(routeForm.annualFee),
        stops: stopsList.length > 0 ? stopsList : editingRoute.stops,
      });
    } else {
      const newRoute: VanRoute = {
        id: `route-${Date.now()}`,
        routeName: routeForm.routeName,
        driverName: routeForm.driverName,
        driverPhone: routeForm.driverPhone,
        vanNumber: routeForm.vanNumber,
        monthlyFee: Number(routeForm.monthlyFee),
        annualFee: Number(routeForm.annualFee),
        stops: stopsList.length > 0 ? stopsList : ['Main Bazaar', 'School Gate'],
        studentCount: 0,
      };
      onAddVanRoute(newRoute);
    }

    setRouteModalOpen(false);
    setEditingRoute(null);
  };

  // Student Van Assign Handlers
  const handleOpenStudentVan = (student: Student) => {
    setStudentToAssign(student);
    const matched = vanRoutes.find((r) => r.routeName === student.vanRoute) || vanRoutes[0];
    setVanAssignForm({
      usesVan: student.usesVan ?? true,
      vanRoute: student.vanRoute || matched?.routeName || '',
      vanStop: student.vanStop || matched?.stops[0] || 'Main Gate',
      vanFeeMonthly: student.vanFeeMonthly || matched?.monthlyFee || 800,
    });
    setStudentVanModalOpen(true);
  };

  const handleSaveStudentVan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToAssign) return;

    if (!vanAssignForm.usesVan) {
      onUpdateStudent({
        ...studentToAssign,
        usesVan: false,
        vanRoute: undefined,
        vanStop: undefined,
        vanFeeMonthly: undefined,
        vanFeeTotal: 0,
        vanFeePending: 0,
      });
    } else {
      const annualFee = Number(vanAssignForm.vanFeeMonthly) * 10;
      const paid = studentToAssign.vanFeePaid ?? 0;
      onUpdateStudent({
        ...studentToAssign,
        usesVan: true,
        vanRoute: vanAssignForm.vanRoute,
        vanStop: vanAssignForm.vanStop,
        vanFeeMonthly: Number(vanAssignForm.vanFeeMonthly),
        vanFeeTotal: annualFee,
        vanFeePending: Math.max(0, annualFee - paid),
      });
    }

    setStudentVanModalOpen(false);
    setStudentToAssign(null);
  };

  // Maintenance Handlers
  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMaint) {
      setMaintenanceLogs(
        maintenanceLogs.map((m) => (m.id === editingMaint.id ? { ...editingMaint, ...maintForm } : m))
      );
    } else {
      const newM: MaintenanceLog = {
        id: `maint-${Date.now()}`,
        ...maintForm,
      };
      setMaintenanceLogs([newM, ...maintenanceLogs]);
    }
    setMaintModalOpen(false);
    setEditingMaint(null);
  };

  const handleDeleteMaint = (id: string) => {
    if (window.confirm('Delete this maintenance record?')) {
      setMaintenanceLogs(maintenanceLogs.filter((m) => m.id !== id));
    }
  };

  const filteredStudents = vanStudents.filter((s) => {
    const matchRoute = selectedRouteFilter === 'All' || s.vanRoute === selectedRouteFilter;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.vanStop && s.vanStop.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchRoute && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="w-6 h-6 text-amber-600" />
            <span>Transport & School Van Fleet Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Full Add, Edit, Delete for Routes, Drivers & Students
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddRoute}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Van Route</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>Active Van Fleet</span>
            <Bus className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{vanRoutes.length} Routes</div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1">Covers Essur & peripheral villages</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-blue-900">
            <span>Enrolled Commuters</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{vanStudents.length} Students</div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">Daily morning & evening transit</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-rose-900">
            <span>Pending Transport Dues</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">₹ {totalVanPending.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1">Payable via GPay: 9176593129</div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('routes')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'routes'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>Van Routes & Drivers ({vanRoutes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'students'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Commuters ({vanStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('maintenance')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'maintenance'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Fuel className="w-3.5 h-3.5" />
          <span>Fuel & Maintenance Logs ({maintenanceLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: ROUTES GRID */}
      {activeSubTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vanRoutes.map((route) => {
            const count = students.filter((s) => s.usesVan && s.vanRoute === route.routeName).length;
            return (
              <div
                key={route.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      {route.routeName.split(':')[0]}
                    </span>
                    <span className="text-xs font-black text-slate-900">₹{route.monthlyFee} / mo</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {route.routeName.includes(':') ? route.routeName.split(':')[1] : route.routeName}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-mono font-bold text-slate-800">{route.vanNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {route.driverName} • <strong className="font-mono">{route.driverPhone}</strong>
                      </span>
                    </div>

                    <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">
                        <strong>Stops:</strong> {route.stops.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-blue-900 font-bold flex items-center justify-between">
                    <span>Students Assigned:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{count} Students</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEditRoute(route)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit Route</span>
                  </button>

                  <button
                    onClick={() => onDeleteVanRoute(route.id)}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete Route"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: STUDENT COMMUTERS TABLE */}
      {activeSubTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student, parent, or stop..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedRouteFilter}
                onChange={(e) => setSelectedRouteFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium"
              >
                <option value="All">All Routes</option>
                {vanRoutes.map((r) => (
                  <option key={r.id} value={r.routeName}>{r.routeName.split(':')[0]}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  const firstNonVan = students.find((s) => !s.usesVan) || students[0];
                  if (firstNonVan) handleOpenStudentVan(firstNonVan);
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Student to Van</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Class</th>
                  <th className="p-3.5">Assigned Route</th>
                  <th className="p-3.5">Boarding Stop</th>
                  <th className="p-3.5 text-right">Monthly Fee</th>
                  <th className="p-3.5 text-right">Van Pending</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No van commuters matching this criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[10px] text-slate-400">Roll #{st.rollNo}</div>
                      </td>
                      <td className="p-3.5 font-bold text-blue-900">
                        {st.className} - {st.section}
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">{st.vanRoute}</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-amber-900 font-semibold text-[11px]">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          {st.vanStop}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-black text-slate-800">₹{st.vanFeeMonthly}</td>
                      <td className="p-3.5 text-right font-black text-rose-600">₹{st.vanFeePending ?? 0}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenStudentVan(st)}
                            className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Edit Student Van Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Remove ${st.name} from school van transport?`)) {
                                onUpdateStudent({ ...st, usesVan: false });
                              }
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Unenroll from Van"
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
      )}

      {/* TAB 3: MAINTENANCE LOGS */}
      {activeSubTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Van Fleet Fuel & Maintenance Expenses</h3>
              <p className="text-xs text-slate-500">Track diesel expenses, periodic services, and RTO fitness renewals</p>
            </div>

            <button
              onClick={() => {
                setEditingMaint(null);
                setMaintForm({
                  vanNumber: vanRoutes[0]?.vanNumber || 'TN 25 AB 1029',
                  type: 'Fuel',
                  cost: 3500,
                  date: new Date().toISOString().split('T')[0],
                  notes: '',
                });
                setMaintModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expense Log</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {maintenanceLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono">{log.vanNumber}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-bold text-[10px]">
                      {log.type}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-0.5">{log.notes}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-black text-rose-600">₹ {log.cost.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400">{log.date}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingMaint(log);
                        setMaintForm({
                          vanNumber: log.vanNumber,
                          type: log.type,
                          cost: log.cost,
                          date: log.date,
                          notes: log.notes,
                        });
                        setMaintModalOpen(true);
                      }}
                      className="p-1.5 hover:bg-amber-50 text-slate-400 hover:text-amber-700 rounded-lg cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaint(log.id)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD/EDIT VAN ROUTE */}
      {routeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-amber-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Bus className="w-4 h-4 text-amber-300" />
                <span>{editingRoute ? 'Edit Van Route Details' : 'Add New Van Route'}</span>
              </h3>
              <button onClick={() => setRouteModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRoute} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Route Name & Areas *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route 5: Madurantakam Highway"
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Driver Phone *</label>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Van / Bus Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN 25 CD 4421"
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Boarding Stops (Comma separated) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Bazaar Street, Post Office Junction, Main Road, School Gate"
                  value={routeForm.stops}
                  onChange={(e) => setRouteForm({ ...routeForm, stops: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
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
                  Save Route Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGN STUDENT TO VAN */}
      {studentVanModalOpen && studentToAssign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-blue-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Bus className="w-4 h-4 text-amber-300" />
                  <span>Student Van Transport Service Details</span>
                </h3>
                <p className="text-xs text-blue-200">
                  Ward: <strong>{studentToAssign.name}</strong> ({studentToAssign.className})
                </p>
              </div>
              <button onClick={() => setStudentVanModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudentVan} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Enable School Van Transport</div>
                  <div className="text-[11px] text-slate-500">Student uses daily morning & evening bus service</div>
                </div>
                <input
                  type="checkbox"
                  checked={vanAssignForm.usesVan}
                  onChange={(e) => setVanAssignForm({ ...vanAssignForm, usesVan: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-600 cursor-pointer"
                />
              </div>

              {vanAssignForm.usesVan && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Select Van Route *</label>
                    <select
                      value={vanAssignForm.vanRoute}
                      onChange={(e) => {
                        const rName = e.target.value;
                        const r = vanRoutes.find((item) => item.routeName === rName);
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
                </>
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

      {/* MODAL 3: MAINTENANCE EXPENSE */}
      {maintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Fuel className="w-4 h-4 text-amber-300" />
                <span>{editingMaint ? 'Edit Maintenance Log' : 'Add Van Fuel / Service Expense'}</span>
              </h3>
              <button onClick={() => setMaintModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaintenance} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Vehicle</label>
                <select
                  value={maintForm.vanNumber}
                  onChange={(e) => setMaintForm({ ...maintForm, vanNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                >
                  {vanRoutes.map((r) => (
                    <option key={r.id} value={r.vanNumber}>{r.vanNumber}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expense Type</label>
                  <select
                    value={maintForm.type}
                    onChange={(e) => setMaintForm({ ...maintForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Fuel">Fuel (Diesel)</option>
                    <option value="Service & Oil">Service & Oil</option>
                    <option value="Tire & Brake">Tire & Brake</option>
                    <option value="Fitness Certificate (FC)">FC Renewal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={maintForm.cost}
                    onChange={(e) => setMaintForm({ ...maintForm, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={maintForm.date}
                  onChange={(e) => setMaintForm({ ...maintForm, date: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Details / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Diesel fuel bill or service station note"
                  value={maintForm.notes}
                  onChange={(e) => setMaintForm({ ...maintForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMaintModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
