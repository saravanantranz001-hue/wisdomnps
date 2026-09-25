import React, { useState, useId } from 'react';
import {
  Printer,
  Sliders,
  CheckSquare,
  Square,
  Search,
  Download,
  Filter,
  Layers,
  Sparkles,
  QrCode,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Eye,
  CreditCard,
  User,
  ArrowRight
} from 'lucide-react';
import { Student, ClassName } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { SCHOOL_INFO, CLASS_SUMMARY } from '../data/initialData';

interface StudentIdCardGeneratorProps {
  students: Student[];
  initialSelectedStudentId?: string | null;
  onBackToDirectory?: () => void;
}

export type CardOrientation = 'vertical' | 'horizontal';
export type CardSide = 'front' | 'back' | 'both';
export type ThemeColor = 'navy' | 'emerald' | 'crimson' | 'royal';

export const StudentIdCardGenerator: React.FC<StudentIdCardGeneratorProps> = ({
  students,
  initialSelectedStudentId,
  onBackToDirectory,
}) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(() => {
    if (initialSelectedStudentId) return [initialSelectedStudentId];
    return students.slice(0, 4).map((s) => s.id);
  });

  const [activePreviewStudentId, setActivePreviewStudentId] = useState<string>(
    initialSelectedStudentId || students[0]?.id || ''
  );

  const [filterClass, setFilterClass] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Customization Options
  const [orientation, setOrientation] = useState<CardOrientation>('vertical');
  const [cardSide, setCardSide] = useState<CardSide>('both');
  const [theme, setTheme] = useState<ThemeColor>('navy');
  const [showBarcode, setShowBarcode] = useState(true);
  const [showQrCode, setShowQrCode] = useState(true);
  const [showPrincipalSignature, setShowPrincipalSignature] = useState(true);
  const [showBloodGroup, setShowBloodGroup] = useState(true);
  const [showEmergencyContact, setShowEmergencyContact] = useState(true);
  const [academicYear, setAcademicYear] = useState('2026 - 2027');

  // Print Mode State
  const [isPrintLayoutOpen, setIsPrintLayoutOpen] = useState(false);

  // Filter students for sidebar picker
  const filteredStudents = students.filter((s) => {
    const matchClass = filterClass === 'All' || s.className === filterClass;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  const toggleSelectStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((item) => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredStudents.map((s) => s.id);
    const combined = Array.from(new Set([...selectedStudentIds, ...filteredIds]));
    setSelectedStudentIds(combined);
  };

  const deselectAll = () => {
    setSelectedStudentIds([]);
  };

  const currentPreviewStudent =
    students.find((s) => s.id === activePreviewStudentId) || students[0];

  const themeColors = {
    navy: {
      header: 'bg-[#0f2d59]',
      accent: 'border-blue-900',
      tag: 'bg-blue-900 text-white',
      badge: 'border-amber-400 text-amber-900',
      gradient: 'from-blue-900 to-indigo-950',
    },
    emerald: {
      header: 'bg-[#064e3b]',
      accent: 'border-emerald-800',
      tag: 'bg-emerald-800 text-white',
      badge: 'border-amber-400 text-amber-900',
      gradient: 'from-emerald-800 to-teal-950',
    },
    crimson: {
      header: 'bg-[#881337]',
      accent: 'border-rose-900',
      tag: 'bg-rose-900 text-white',
      badge: 'border-amber-400 text-amber-900',
      gradient: 'from-rose-900 to-red-950',
    },
    royal: {
      header: 'bg-[#312e81]',
      accent: 'border-indigo-900',
      tag: 'bg-indigo-900 text-white',
      badge: 'border-amber-400 text-amber-900',
      gradient: 'from-indigo-900 to-slate-900',
    },
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  // Render Front of Single ID Card
  const renderCardFront = (student: Student) => {
    const classInfo = CLASS_SUMMARY.find((c) => c.className === student.className);
    const gradeColor = classInfo?.color || '#2563eb';

    if (orientation === 'vertical') {
      return (
        <div className="w-[280px] h-[430px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 flex flex-col relative select-none print:shadow-none print:border-slate-400 print:m-1">
          {/* Top Lanyard Slot Guide */}
          <div className="h-5 bg-slate-100 flex items-center justify-center border-b border-slate-200">
            <div className="w-10 h-1.5 rounded-full bg-slate-300" />
          </div>

          {/* School Header Banner */}
          <div className={`px-2.5 py-2.5 bg-gradient-to-r ${themeColors[theme].gradient} text-white text-center flex flex-col items-center justify-center relative shadow-xs`}>
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <SchoolLogo size={34} />
              <div className="text-left">
                <h4 className="font-serif font-black text-[13px] tracking-wide text-white leading-tight">
                  WISDOM
                </h4>
                <p className="text-[7.5px] uppercase font-bold tracking-wider text-blue-200 leading-tight">
                  Nursery & Primary School
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[8px] text-amber-300 font-extrabold tracking-wider">
              <span>ESSUR - 603310</span>
              <span>•</span>
              <span>PH: 9176593129</span>
            </div>
          </div>

          {/* Grade Badge Banner Strip */}
          <div
            className="py-0.5 text-center text-[9px] font-black uppercase tracking-wider text-white shadow-xs"
            style={{ backgroundColor: gradeColor }}
          >
            STUDENT IDENTITY CARD • {academicYear}
          </div>

          {/* Student Photo & Identity Details */}
          <div className="flex-1 px-3 pt-2.5 pb-2 flex flex-col items-center text-center justify-between">
            {/* Student Photo Box */}
            <div className="relative">
              <div
                className="w-22 h-24 rounded-xl border-2 border-white ring-2 shadow-md flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-slate-100"
                style={{ outlineColor: gradeColor }}
              >
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl text-white shadow-xs"
                      style={{ backgroundColor: gradeColor }}
                    >
                      {student.name.charAt(0)}
                    </div>
                    <span className="text-[8px] font-semibold text-slate-400 mt-1 uppercase">Photo</span>
                  </div>
                )}
              </div>
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full text-[8.5px] font-black text-white shadow-xs"
                style={{ backgroundColor: gradeColor }}
              >
                {student.className}
              </span>
            </div>

            {/* Student Name */}
            <div className="mt-1">
              <h3 className="font-black text-slate-900 text-sm tracking-tight leading-tight">
                {student.name}
              </h3>
              <p className="text-[10px] font-extrabold text-blue-900 uppercase">
                Section: {student.section} • Roll No: #{student.rollNo}
              </p>
            </div>

            {/* Info Table */}
            <div className="w-full bg-slate-50/90 rounded-xl p-2 border border-slate-200/80 text-[9.5px] text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Adm No:</span>
                <span className="font-mono font-bold text-slate-800">{student.admissionNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Parent / Guardian:</span>
                <span className="font-bold text-slate-800 truncate max-w-[125px]">{student.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Contact:</span>
                <span className="font-bold text-slate-800">{student.parentPhone}</span>
              </div>
              {showBloodGroup && (
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Blood Group:</span>
                  <span className="font-extrabold text-rose-600 bg-rose-50 px-1 rounded">{student.bloodGroup}</span>
                </div>
              )}
            </div>

            {/* Footer Barcode & Signature */}
            <div className="w-full flex items-end justify-between pt-1 border-t border-slate-100 mt-1">
              {showBarcode ? (
                <div className="flex flex-col items-start">
                  <div className="font-mono text-[7px] text-slate-400">||| | |||| | ||| |||| |</div>
                  <div className="text-[7.5px] font-mono font-bold text-slate-600">{student.admissionNo}</div>
                </div>
              ) : (
                <div className="text-[7.5px] text-slate-400 font-medium">Essur, TN</div>
              )}

              {showPrincipalSignature && (
                <div className="text-right">
                  <div className="font-serif italic text-[9px] font-bold text-blue-950 leading-none">
                    Jayanthi S
                  </div>
                  <div className="text-[7px] text-slate-400 font-bold uppercase mt-0.5">
                    Principal Seal
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Horizontal Layout (CR80 Standard Wallet Style)
    return (
      <div className="w-[400px] h-[250px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 flex flex-col relative select-none print:shadow-none print:border-slate-400 print:m-1">
        {/* Header */}
        <div className={`px-4 py-2 bg-gradient-to-r ${themeColors[theme].gradient} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <SchoolLogo size={36} />
            <div>
              <h4 className="font-serif font-black text-sm text-white tracking-wide leading-tight">
                {SCHOOL_INFO.name}
              </h4>
              <p className="text-[8px] font-bold text-blue-200 uppercase tracking-widest">
                ESSUR - 603310 • PHONE / GPAY: 9176593129
              </p>
            </div>
          </div>
          <span
            className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-xs"
            style={{ backgroundColor: gradeColor }}
          >
            {student.className}
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-3 flex items-center gap-4">
          {/* Photo */}
          <div className="flex flex-col items-center">
            <div
              className="w-20 h-24 rounded-xl border-2 border-white ring-2 shadow-sm flex items-center justify-center bg-slate-100 overflow-hidden"
              style={{ outlineColor: gradeColor }}
            >
              {student.avatarUrl ? (
                <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl text-white"
                  style={{ backgroundColor: gradeColor }}
                >
                  {student.name.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Roll #{student.rollNo}</span>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-1 text-[10px]">
            <div>
              <h3 className="font-black text-slate-900 text-sm leading-tight">{student.name}</h3>
              <p className="text-[9px] font-extrabold text-blue-800">
                Class: {student.className} - {student.section} • Adm: {student.admissionNo}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[8.5px]">Parent:</span>
                <span className="font-bold text-slate-800 truncate block">{student.parentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8.5px]">Phone:</span>
                <span className="font-bold text-slate-800">{student.parentPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8.5px]">Blood Group:</span>
                <span className="font-black text-rose-600">{student.bloodGroup}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8.5px]">Academic Year:</span>
                <span className="font-bold text-slate-800">{academicYear}</span>
              </div>
            </div>
          </div>

          {/* QR & Sign */}
          <div className="w-20 flex flex-col items-center justify-between h-full py-1 text-center border-l border-slate-100 pl-2">
            {showQrCode ? (
              <div className="w-14 h-14 bg-white p-1 rounded-md border border-slate-200 flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-800" />
              </div>
            ) : (
              <div />
            )}
            <div className="text-center mt-2">
              <div className="font-serif italic text-[8.5px] font-bold text-blue-900">Jayanthi S</div>
              <div className="text-[7px] font-bold text-slate-400 uppercase">Headmistress</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Back of Single ID Card
  const renderCardBack = (student: Student) => {
    if (orientation === 'vertical') {
      return (
        <div className="w-[280px] h-[430px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 flex flex-col relative select-none print:shadow-none print:border-slate-400 print:m-1 p-3.5 justify-between">
          <div>
            <div className="flex items-center justify-center gap-1.5 pb-2 border-b border-slate-200 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
              <span className="text-[10px] font-black text-blue-950 uppercase tracking-wider">
                Emergency & School Terms
              </span>
            </div>

            <div className="mt-2 space-y-2 text-[9px] text-slate-600">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-400 font-bold uppercase text-[7.5px]">Residential Address:</div>
                <div className="font-semibold text-slate-800 mt-0.5">{student.address}</div>
              </div>

              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-emerald-800 font-bold uppercase text-[7.5px]">Official Fee Payment UPI:</div>
                <div className="font-extrabold text-emerald-950 mt-0.5">Google Pay (GPay): 9176593129</div>
                <div className="text-[7.5px] text-emerald-700">UPI ID: {SCHOOL_INFO.upiId}</div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="font-bold text-slate-800 text-[8.5px]">Instructions to Card Holder:</div>
                <ul className="list-disc pl-3 text-[8px] space-y-0.5 text-slate-500">
                  <li>This card is mandatory for campus entry and school vans.</li>
                  <li>In case of emergency or loss, immediately call <strong>9176593129</strong>.</li>
                  <li>Found cards must be returned to Wisdom School Office, Essur.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* QR verification block */}
          <div className="pt-2 border-t border-slate-200 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 shadow-2xs flex items-center justify-center mb-1">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <div className="text-[7.5px] font-mono text-slate-400 font-bold">
              DIGITAL VERIFIED ID • ESSUR 603310
            </div>
            <div className="text-[7px] text-slate-500 mt-0.5">
              {SCHOOL_INFO.fullName}
            </div>
          </div>
        </div>
      );
    }

    // Horizontal Card Back
    return (
      <div className="w-[400px] h-[250px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 flex flex-col relative select-none print:shadow-none print:border-slate-400 print:m-1 p-3.5 justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs font-black text-blue-950 uppercase">
            {SCHOOL_INFO.fullName}
          </span>
          <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
            EMERGENCY CARD
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[9px] my-auto">
          <div className="space-y-2">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[8px]">Student Address:</span>
              <span className="font-bold text-slate-800">{student.address}</span>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 block text-[8px]">GPay Fee Helpline:</span>
              <span className="font-black text-emerald-950">9176593129</span>
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col justify-center">
            <div className="text-[8.5px] font-bold text-slate-700">Rules & Regulations:</div>
            <p className="text-[8px] text-slate-500 leading-snug">
              • Student must wear this ID card during school hours & bus travel.<br/>
              • If lost, duplicate card fee is ₹100.<br/>
              • Essur Campus Helpline: 9176593129.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-400">
          <span>Campus Address: Essur - 603310, Cheyyar Taluk</span>
          <span className="font-bold text-blue-900">www.wisdomessur.edu.in</span>
        </div>
      </div>
    );
  };

  const selectedStudentsList = students.filter((s) =>
    selectedStudentIds.includes(s.id)
  );

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Student ID Card Generator & Printing Tool
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              {selectedStudentIds.length} Selected for Print
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate high-resolution printable ID cards for Wisdom Nursery and Primary School students with barcode, QR, and GPay metadata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBackToDirectory && (
            <button
              onClick={onBackToDirectory}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              ← Back to Students
            </button>
          )}

          <button
            onClick={handleTriggerPrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print {selectedStudentIds.length} ID Cards</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 print:hidden">
        {/* Left Column (4 cols): Student Selection List & Filters */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Select Students ({selectedStudentIds.length}/{students.length})</span>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAllFiltered}
                  className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={deselectAll}
                  className="text-[11px] font-bold text-slate-500 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Search and Class Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student or roll no..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="All">All Grades (248 Students)</option>
                <option value="Nursery">Nursery (28)</option>
                <option value="LKG">LKG (34)</option>
                <option value="UKG">UKG (32)</option>
                <option value="Class 1">Class 1 (36)</option>
                <option value="Class 2">Class 2 (32)</option>
                <option value="Class 3">Class 3 (31)</option>
                <option value="Class 4">Class 4 (27)</option>
                <option value="Class 5">Class 5 (28)</option>
              </select>
            </div>

            {/* Scrollable Student Checklist */}
            <div className="max-h-[380px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
              {filteredStudents.map((std) => {
                const isSelected = selectedStudentIds.includes(std.id);
                const isPreview = activePreviewStudentId === std.id;

                return (
                  <div
                    key={std.id}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isPreview
                        ? 'bg-blue-50/80 border border-blue-200'
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setActivePreviewStudentId(std.id)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectStudent(std.id);
                        }}
                        className="text-slate-400 hover:text-blue-600 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 truncate">{std.name}</div>
                        <div className="text-[10px] text-slate-400">
                          #{std.rollNo} • {std.className}-{std.section}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePreviewStudentId(std.id)}
                      className="px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-white rounded border border-slate-200 shadow-2xs hover:bg-blue-50 shrink-0"
                    >
                      Preview
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center & Right Column (8 cols): Interactive Preview & Customization Controls */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card Formatting Options Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Orientation */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Layout:</span>
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setOrientation('vertical')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    orientation === 'vertical' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Portrait (Lanyard)
                </button>
                <button
                  onClick={() => setOrientation('horizontal')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    orientation === 'horizontal' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Landscape (Wallet)
                </button>
              </div>
            </div>

            {/* Sides */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">View Side:</span>
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setCardSide('front')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    cardSide === 'front' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => setCardSide('back')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    cardSide === 'back' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={() => setCardSide('both')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    cardSide === 'both' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Both Sides
                </button>
              </div>
            </div>

            {/* Color Theme */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Theme:</span>
              <div className="flex gap-1.5">
                {(['navy', 'emerald', 'crimson', 'royal'] as ThemeColor[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                      theme === t ? 'scale-120 ring-2 ring-blue-500' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor:
                        t === 'navy'
                          ? '#0f2d59'
                          : t === 'emerald'
                          ? '#064e3b'
                          : t === 'crimson'
                          ? '#881337'
                          : '#312e81',
                    }}
                    title={t.toUpperCase()}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Toggle Badges Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-slate-500">Elements:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={showBarcode}
                onChange={(e) => setShowBarcode(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Barcode</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={showQrCode}
                onChange={(e) => setShowQrCode(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>UPI / QR</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={showPrincipalSignature}
                onChange={(e) => setShowPrincipalSignature(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Principal Seal</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={showBloodGroup}
                onChange={(e) => setShowBloodGroup(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Blood Group</span>
            </label>
          </div>

          {/* Real-Time Live Card Preview Area */}
          <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/50 p-6 rounded-3xl border border-slate-200/80 shadow-inner flex flex-col items-center justify-center min-h-[460px]">
            <div className="mb-4 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Live High-Definition Preview
              </span>
              <h3 className="text-base font-black text-slate-800">
                {currentPreviewStudent?.name} ({currentPreviewStudent?.className} - {currentPreviewStudent?.section})
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {(cardSide === 'front' || cardSide === 'both') && currentPreviewStudent && (
                <div className="transition-transform duration-300 hover:scale-102">
                  <div className="text-[10px] font-bold text-slate-400 text-center mb-1">FRONT SIDE</div>
                  {renderCardFront(currentPreviewStudent)}
                </div>
              )}

              {(cardSide === 'back' || cardSide === 'both') && currentPreviewStudent && (
                <div className="transition-transform duration-300 hover:scale-102">
                  <div className="text-[10px] font-bold text-slate-400 text-center mb-1">BACK SIDE</div>
                  {renderCardBack(currentPreviewStudent)}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={handleTriggerPrint}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print All {selectedStudentIds.length} Selected Cards</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT-ONLY CONTAINER (Standard A4 Sheet Layout) */}
      <div className="hidden print:block print:w-full print:m-0 print:p-0">
        <style>{`
          @media print {
            body {
              background: white !important;
              color: black !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            header, nav, aside, footer, .print\\:hidden {
              display: none !important;
            }
            .id-card-print-grid {
              display: flex !important;
              flex-wrap: wrap !important;
              gap: 16px !important;
              justify-content: flex-start !important;
              page-break-inside: auto !important;
            }
            .id-card-item {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
        `}</style>

        <div className="p-4 text-center border-b border-slate-300 mb-4">
          <h2 className="text-xl font-black font-serif text-blue-950 uppercase">{SCHOOL_INFO.fullName}</h2>
          <p className="text-xs font-bold text-slate-600">
            OFFICIAL STUDENT IDENTITY CARD PRINT SHEET • BATCH: {academicYear} • TOTAL CARDS: {selectedStudentsList.length}
          </p>
        </div>

        <div className="id-card-print-grid">
          {selectedStudentsList.map((std) => (
            <React.Fragment key={std.id}>
              {(cardSide === 'front' || cardSide === 'both') && (
                <div className="id-card-item">
                  {renderCardFront(std)}
                </div>
              )}
              {(cardSide === 'back' || cardSide === 'both') && (
                <div className="id-card-item">
                  {renderCardBack(std)}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
