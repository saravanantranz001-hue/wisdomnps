/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_STAFF,
  INITIAL_PAYMENTS,
  UPCOMING_EVENTS,
  RECENT_ACTIVITIES,
  INITIAL_NOTICES,
  VAN_ROUTES,
} from './data/initialData';
import { Student, Teacher, Staff, FeePayment, Notice, SchoolEvent, Activity, VanRoute } from './types';
import { HeaderBanner } from './components/HeaderBanner';
import { TopNavbar } from './components/TopNavbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentManagement } from './components/StudentManagement';
import { FeeManagement } from './components/FeeManagement';
import { AttendanceModule } from './components/AttendanceModule';
import { ParentCommunication } from './components/ParentCommunication';
import { TeachersStaff } from './components/TeachersStaff';
import { ClassesSections } from './components/ClassesSections';
import { SubjectsModule } from './components/SubjectsModule';
import { ExamsMarks } from './components/ExamsMarks';
import { TimetableModule } from './components/TimetableModule';
import { HomeworkModule } from './components/HomeworkModule';
import { TransportModule } from './components/TransportModule';
import { LibraryInventoryModule } from './components/LibraryInventoryModule';
import { ExpensesIncomeModule } from './components/ExpensesIncomeModule';
import { SettingsModule } from './components/SettingsModule';
import { GPayModal } from './components/GPayModal';
import { PrintReceiptModal } from './components/PrintReceiptModal';
import { BarChart3 } from 'lucide-react';
import { readStored, writeStored } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data States
  const [students, setStudents] = useState<Student[]>(() => {
    return readStored('wisdom_students', INITIAL_STUDENTS);
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    return readStored('wisdom_teachers', INITIAL_TEACHERS);
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    return readStored('wisdom_staff', INITIAL_STAFF);
  });

  const [payments, setPayments] = useState<FeePayment[]>(() => {
    return readStored('wisdom_payments', INITIAL_PAYMENTS);
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    return readStored('wisdom_notices', INITIAL_NOTICES);
  });

  const [vanRoutes, setVanRoutes] = useState<VanRoute[]>(() => {
    return readStored('wisdom_van_routes', VAN_ROUTES);
  });

  const [events] = useState<SchoolEvent[]>(UPCOMING_EVENTS);
  const [activities, setActivities] = useState<Activity[]>(() =>
    readStored('wisdom_activities', RECENT_ACTIVITIES)
  );

  // Sync to local storage
  useEffect(() => {
    writeStored('wisdom_students', students);
  }, [students]);

  useEffect(() => {
    writeStored('wisdom_teachers', teachers);
  }, [teachers]);

  useEffect(() => {
    writeStored('wisdom_staff', staff);
  }, [staff]);

  useEffect(() => {
    writeStored('wisdom_payments', payments);
  }, [payments]);

  useEffect(() => {
    writeStored('wisdom_notices', notices);
  }, [notices]);

  useEffect(() => {
    writeStored('wisdom_van_routes', vanRoutes);
  }, [vanRoutes]);

  useEffect(() => {
    writeStored('wisdom_activities', activities);
  }, [activities]);

  // Modals & Action Triggers
  const [gpayModalOpen, setGpayModalOpen] = useState(false);
  const [gpayStudent, setGpayStudent] = useState<{ name?: string; className?: string; amount?: number }>({});
  const [receiptToPrint, setReceiptToPrint] = useState<FeePayment | null>(null);

  // Quick Action Modals Flags
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [openAddTeacherModal, setOpenAddTeacherModal] = useState(false);
  const [openCollectFeeModal, setOpenCollectFeeModal] = useState(false);
  const [openSendNoticeModal, setOpenSendNoticeModal] = useState(false);

  // Handlers
  const handleAddStudent = (newStudent: Student) => {
    setStudents([newStudent, ...students]);
    setActivities([
      {
        id: `act-${Date.now()}`,
        title: `New student admission - ${newStudent.name}`,
        time: 'Just now',
        type: 'admission',
        iconType: 'UserPlus',
        meta: `${newStudent.className} - Roll No ${newStudent.rollNo}`,
      },
      ...activities,
    ]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers([newTeacher, ...teachers]);
  };

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(teachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t)));
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  const handleAddStaff = (newStaff: Staff) => {
    setStaff([...staff, newStaff]);
  };

  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaff(staff.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  const handleAddPayment = (newPayment: FeePayment) => {
    setPayments([newPayment, ...payments]);
    // update student fee pending
    setStudents(
      students.map((s) => {
        if (s.id === newPayment.studentId) {
          const newPaid = s.paidFee + newPayment.amount;
          const newPending = Math.max(0, s.totalFee - newPaid);
          const newStatus = newPaid >= s.totalFee ? 'Paid' : 'Partial';

          let vanPaid = s.vanFeePaid ?? 0;
          let vanPending = s.vanFeePending ?? 0;
          let tuitionPaid = s.tuitionFeePaid ?? 0;
          let tuitionPending = s.tuitionFeePending ?? 0;

          if (newPayment.feeCategory === 'Van Transport' || newPayment.feeType === 'Van / Transport Fee') {
            vanPaid = (s.vanFeePaid ?? 0) + newPayment.amount;
            vanPending = Math.max(0, (s.vanFeeTotal ?? 7000) - vanPaid);
          } else {
            tuitionPaid = (s.tuitionFeePaid ?? 0) + newPayment.amount;
            tuitionPending = Math.max(0, (s.tuitionFeeTotal ?? 14000) - tuitionPaid);
          }

          return {
            ...s,
            paidFee: newPaid,
            pendingFee: newPending,
            feeStatus: newStatus,
            vanFeePaid: vanPaid,
            vanFeePending: vanPending,
            tuitionFeePaid: tuitionPaid,
            tuitionFeePending: tuitionPending,
          };
        }
        return s;
      })
    );
    setActivities([
      {
        id: `act-${Date.now()}`,
        title: `Fee paid - ${newPayment.studentName} (₹ ${newPayment.amount.toLocaleString('en-IN')})`,
        time: 'Just now',
        type: 'fee',
        iconType: 'CreditCard',
        meta: `Received via ${newPayment.paymentMethod}`,
      },
      ...activities,
    ]);
  };

  const handleUpdatePayment = (updatedPayment: FeePayment) => {
    const oldPayment = payments.find((p) => p.id === updatedPayment.id);
    const diff = updatedPayment.amount - (oldPayment ? oldPayment.amount : 0);

    setPayments(payments.map((p) => (p.id === updatedPayment.id ? updatedPayment : p)));

    if (diff !== 0) {
      setStudents(
        students.map((s) => {
          if (s.id === updatedPayment.studentId) {
            const newPaid = s.paidFee + diff;
            const newPending = Math.max(0, s.totalFee - newPaid);
            const newStatus = newPaid >= s.totalFee ? 'Paid' : newPaid > 0 ? 'Partial' : 'Pending';

            let vanPaid = s.vanFeePaid ?? 0;
            let vanPending = s.vanFeePending ?? 0;
            let tuitionPaid = s.tuitionFeePaid ?? 0;
            let tuitionPending = s.tuitionFeePending ?? 0;

            if (updatedPayment.feeCategory === 'Van Transport' || updatedPayment.feeType === 'Van / Transport Fee') {
              vanPaid = Math.max(0, (s.vanFeePaid ?? 0) + diff);
              vanPending = Math.max(0, (s.vanFeeTotal ?? 7000) - vanPaid);
            } else {
              tuitionPaid = Math.max(0, (s.tuitionFeePaid ?? 0) + diff);
              tuitionPending = Math.max(0, (s.tuitionFeeTotal ?? 14000) - tuitionPaid);
            }

            return {
              ...s,
              paidFee: newPaid,
              pendingFee: newPending,
              feeStatus: newStatus,
              vanFeePaid: vanPaid,
              vanFeePending: vanPending,
              tuitionFeePaid: tuitionPaid,
              tuitionFeePending: tuitionPending,
            };
          }
          return s;
        })
      );
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    const paymentToDelete = payments.find((p) => p.id === paymentId);
    if (!paymentToDelete) return;

    if (!window.confirm(`Are you sure you want to delete receipt ${paymentToDelete.receiptNo} of ₹${paymentToDelete.amount}? This will update the student dues balance.`)) {
      return;
    }

    setPayments(payments.filter((p) => p.id !== paymentId));

    setStudents(
      students.map((s) => {
        if (s.id === paymentToDelete.studentId) {
          const newPaid = Math.max(0, s.paidFee - paymentToDelete.amount);
          const newPending = Math.max(0, s.totalFee - newPaid);
          const newStatus = newPaid >= s.totalFee ? 'Paid' : newPaid > 0 ? 'Partial' : 'Pending';

          let vanPaid = s.vanFeePaid ?? 0;
          let vanPending = s.vanFeePending ?? 0;
          let tuitionPaid = s.tuitionFeePaid ?? 0;
          let tuitionPending = s.tuitionFeePending ?? 0;

          if (paymentToDelete.feeCategory === 'Van Transport' || paymentToDelete.feeType === 'Van / Transport Fee') {
            vanPaid = Math.max(0, (s.vanFeePaid ?? 0) - paymentToDelete.amount);
            vanPending = Math.max(0, (s.vanFeeTotal ?? 7000) - vanPaid);
          } else {
            tuitionPaid = Math.max(0, (s.tuitionFeePaid ?? 0) - paymentToDelete.amount);
            tuitionPending = Math.max(0, (s.tuitionFeeTotal ?? 14000) - tuitionPaid);
          }

          return {
            ...s,
            paidFee: newPaid,
            pendingFee: newPending,
            feeStatus: newStatus,
            vanFeePaid: vanPaid,
            vanFeePending: vanPending,
            tuitionFeePaid: tuitionPaid,
            tuitionFeePending: tuitionPending,
          };
        }
        return s;
      })
    );
  };

  const handleAddVanRoute = (newRoute: VanRoute) => {
    setVanRoutes([...vanRoutes, newRoute]);
  };

  const handleUpdateVanRoute = (updatedRoute: VanRoute) => {
    setVanRoutes(vanRoutes.map((r) => (r.id === updatedRoute.id ? updatedRoute : r)));
  };

  const handleDeleteVanRoute = (routeId: string) => {
    const route = vanRoutes.find(r => r.id === routeId);
    if (!route) return;
    if (window.confirm(`Are you sure you want to delete van route "${route.routeName}"?`)) {
      setVanRoutes(vanRoutes.filter((r) => r.id !== routeId));
    }
  };

  const handleAddNotice = (newNotice: Notice) => {
    setNotices([newNotice, ...notices]);
    setActivities([
      {
        id: `act-${Date.now()}`,
        title: `Notice published - ${newNotice.title}`,
        time: 'Just now',
        type: 'notice',
        iconType: 'Bell',
        meta: `Audience: ${newNotice.targetAudience}`,
      },
      ...activities,
    ]);
  };

  const handleUpdateNotice = (updatedNotice: Notice) => {
    setNotices(notices.map((n) => (n.id === updatedNotice.id ? updatedNotice : n)));
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(notices.filter((n) => n.id !== id));
  };

  const triggerGPayForStudent = (student: Student) => {
    setGpayStudent({
      name: student.name,
      className: `${student.className} - ${student.section}`,
      amount: student.pendingFee > 0 ? student.pendingFee : 5000,
    });
    setGpayModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Header Banner matching the user's uploaded banner screenshot */}
      <HeaderBanner
        onOpenGPayModal={() => {
          setGpayStudent({});
          setGpayModalOpen(true);
        }}
      />

      {/* 2. Top Portal Navigation Bar */}
      <TopNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        onOpenGPay={() => {
          setGpayStudent({});
          setGpayModalOpen(true);
        }}
      />

      {/* 3. Main Body: Sidebar + Dynamic Content View */}
      <div className="flex-1 flex w-full relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          studentCount={students.length}
        />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              teachers={teachers}
              staff={staff}
              payments={payments}
              events={events}
              activities={activities}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAddStudent={() => {
                setActiveTab('students');
                setOpenAddStudentModal(true);
              }}
              onOpenAddTeacher={() => {
                setActiveTab('teachers');
                setOpenAddTeacherModal(true);
              }}
              onOpenCollectFee={() => {
                setActiveTab('fees');
                setOpenCollectFeeModal(true);
              }}
              onOpenGPay={() => {
                setGpayStudent({});
                setGpayModalOpen(true);
              }}
              onOpenSendNotice={() => {
                setActiveTab('notices');
                setOpenSendNoticeModal(true);
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagement
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onOpenGPayForStudent={triggerGPayForStudent}
            />
          )}

          {activeTab === 'teachers' && (
            <TeachersStaff
              teachers={teachers}
              staff={staff}
              onAddTeacher={handleAddTeacher}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onDeleteStaff={handleDeleteStaff}
              isOpenAddModal={openAddTeacherModal}
              onCloseAddModal={() => setOpenAddTeacherModal(false)}
            />
          )}

          {activeTab === 'parents' && (
            <ParentCommunication
              notices={notices}
              students={students}
              onAddNotice={handleAddNotice}
              onUpdateNotice={handleUpdateNotice}
              onDeleteNotice={handleDeleteNotice}
              onUpdateStudent={handleUpdateStudent}
              isOpenCompose={openSendNoticeModal}
              onCloseCompose={() => setOpenSendNoticeModal(false)}
            />
          )}

          {activeTab === 'classes' && <ClassesSections />}

          {activeTab === 'subjects' && <SubjectsModule />}

          {activeTab === 'timetable' && <TimetableModule />}

          {activeTab === 'attendance' && <AttendanceModule students={students} />}

          {activeTab === 'exams' && <ExamsMarks />}

          {activeTab === 'fees' && (
            <FeeManagement
              payments={payments}
              students={students}
              vanRoutes={vanRoutes}
              onAddPayment={handleAddPayment}
              onUpdatePayment={handleUpdatePayment}
              onDeletePayment={handleDeletePayment}
              onAddVanRoute={handleAddVanRoute}
              onUpdateVanRoute={handleUpdateVanRoute}
              onDeleteVanRoute={handleDeleteVanRoute}
              onUpdateStudent={handleUpdateStudent}
              onViewReceipt={(p) => setReceiptToPrint(p)}
              onOpenGPayModal={() => {
                setGpayStudent({});
                setGpayModalOpen(true);
              }}
            />
          )}

          {activeTab === 'homework' && <HomeworkModule />}

          {activeTab === 'notices' && (
            <ParentCommunication
              notices={notices}
              students={students}
              onAddNotice={handleAddNotice}
              onUpdateNotice={handleUpdateNotice}
              onDeleteNotice={handleDeleteNotice}
              onUpdateStudent={handleUpdateStudent}
              isOpenCompose={openSendNoticeModal}
              onCloseCompose={() => setOpenSendNoticeModal(false)}
            />
          )}

          {activeTab === 'library' && <LibraryInventoryModule />}

          {activeTab === 'transport' && (
            <TransportModule
              students={students}
              vanRoutes={vanRoutes}
              onAddVanRoute={handleAddVanRoute}
              onUpdateVanRoute={handleUpdateVanRoute}
              onDeleteVanRoute={handleDeleteVanRoute}
              onUpdateStudent={handleUpdateStudent}
              onOpenGPayForStudent={triggerGPayForStudent}
            />
          )}

          {activeTab === 'expenses' && <ExpensesIncomeModule />}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>School Analytics & Government MIS Reports</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    UDISE compliance, student attendance register & fee audit logs
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-bold">Total Strength</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">248 Students</div>
                  <div className="text-[11px] text-slate-500 mt-1">128 Boys • 120 Girls</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-bold">Student-Teacher Ratio</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">14 : 1</div>
                  <div className="text-[11px] text-emerald-600 mt-1">Individual attention focused</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-bold">Monthly Fee Realization</div>
                  <div className="text-2xl font-black text-blue-700 mt-1">78.2%</div>
                  <div className="text-[11px] text-slate-400 mt-1">GPay enabled quick settlement</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-bold">Average Attendance</div>
                  <div className="text-2xl font-black text-teal-700 mt-1">92.0%</div>
                  <div className="text-[11px] text-teal-600 mt-1">Above district benchmark</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && <SettingsModule />}
        </main>
      </div>

      {/* 4. Global Interactive Modals */}
      <GPayModal
        isOpen={gpayModalOpen}
        onClose={() => setGpayModalOpen(false)}
        presetAmount={gpayStudent.amount}
        studentName={gpayStudent.name}
        className={gpayStudent.className}
      />

      <PrintReceiptModal
        payment={receiptToPrint}
        isOpen={!!receiptToPrint}
        onClose={() => setReceiptToPrint(null)}
      />
    </div>
  );
}
