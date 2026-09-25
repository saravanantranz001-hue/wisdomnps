import React, { useState } from 'react';
import {
  X,
  Share2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  Bus,
  CreditCard,
  Users,
  Search,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Send,
  Play,
  RotateCcw,
  Check
} from 'lucide-react';
import { Student } from '../types';
import { SCHOOL_INFO } from '../data/initialData';

interface BulkWaSenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export type WaTemplateType = 'combined-fee' | 'van-fee' | 'tuition-fee' | 'general-notice';

export const BulkWaSenderModal: React.FC<BulkWaSenderModalProps> = ({
  isOpen,
  onClose,
  students,
}) => {
  const [templateType, setTemplateType] = useState<WaTemplateType>('combined-fee');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [filterAudience, setFilterAudience] = useState<'All' | 'PendingFee' | 'PendingVan' | 'VanUsers'>('PendingFee');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom message body overrides
  const [customGreeting, setCustomGreeting] = useState('Warm greetings from WISDOM Nursery and Primary School - Essur.');
  const [customDeadline, setCustomDeadline] = useState('10th of this month');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sent status tracking
  const [sentStudentIds, setSentStudentIds] = useState<string[]>([]);

  // Queue mode for sequential dispatching
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [isQueueActive, setIsQueueActive] = useState<boolean>(false);

  // Selection list
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(() => {
    return students.filter(s => s.pendingFee > 0).map(s => s.id);
  });

  if (!isOpen) return null;

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchClass = selectedClass === 'All' || s.className === selectedClass;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentPhone.includes(searchTerm);
    
    let matchAudience = true;
    if (filterAudience === 'PendingFee') {
      matchAudience = s.pendingFee > 0;
    } else if (filterAudience === 'PendingVan') {
      matchAudience = !!(s.usesVan && (s.vanFeePending ?? 0) > 0);
    } else if (filterAudience === 'VanUsers') {
      matchAudience = !!s.usesVan;
    }

    return matchClass && matchSearch && matchAudience;
  });

  const toggleStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(item => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const selectAll = () => {
    setSelectedStudentIds(filteredStudents.map(s => s.id));
  };

  const deselectAll = () => {
    setSelectedStudentIds([]);
  };

  // Build the message text for a specific student
  const generateMessageText = (student: Student) => {
    const parent = student.parentName || 'Parent';
    const child = student.name;
    const cls = `${student.className} - Section ${student.section}`;
    const tuitionDue = student.tuitionFeePending ?? (student.pendingFee - (student.vanFeePending ?? 0));
    const vanDue = student.vanFeePending ?? 0;
    const totalDue = student.pendingFee;

    if (templateType === 'combined-fee') {
      return (
`*WISDOM NURSERY & PRIMARY SCHOOL - ESSUR*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Dear ${parent},

${customGreeting}

Fee Dues Notice for ward *${child}* (${cls}):
• *School Tuition Due:* ₹${tuitionDue.toLocaleString('en-IN')}
${student.usesVan ? `• *School Van Transport Due:* ₹${vanDue.toLocaleString('en-IN')} (${student.vanRoute || 'Van Service'})\n` : ''}• *Total Outstanding Balance:* ₹${totalDue.toLocaleString('en-IN')}
• *Due Date:* ${customDeadline}

*How to Pay via Google Pay (GPay):*
1. Open GPay and send to: *${SCHOOL_INFO.gpay}*
2. Note student name *${child}* & *${student.admissionNo}*
3. Instant digital receipt will be generated and issued.

For queries or cash counter payment, call: ${SCHOOL_INFO.phone}.
Thank you!
- Headmistress / Accounts Office
WISDOM School, Essur - 603310`
      );
    } else if (templateType === 'van-fee') {
      return (
`*WISDOM NURSERY & PRIMARY SCHOOL - ESSUR*
*School Van / Transport Fee Reminder*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Dear ${parent},

Greetings! This is a reminder regarding the school bus/van transport facility for your ward *${child}* (${cls}).

• *Van Route:* ${student.vanRoute || 'Essur School Transport'}
• *Boarding Stop:* ${student.vanStop || 'Designated Stop'}
• *Pending Van Fee:* *₹${vanDue.toLocaleString('en-IN')}*

Kindly pay via Google Pay (GPay) to *${SCHOOL_INFO.gpay}* to ensure uninterrupted transport pickup.
Phone: ${SCHOOL_INFO.phone}.

Thank you,
Transport Incharge, Wisdom School Essur - 603310`
      );
    } else if (templateType === 'tuition-fee') {
      return (
`*WISDOM NURSERY & PRIMARY SCHOOL - ESSUR*
*School Term Tuition Fee Notice*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Dear ${parent},

This is an official intimation regarding pending school tuition & exam fees for *${child}* (${cls}).

• *Tuition Dues:* *₹${tuitionDue.toLocaleString('en-IN')}*
• *Payable via GPay:* *${SCHOOL_INFO.gpay}*
• *Last Date:* ${customDeadline}

Official fee receipt will be provided upon payment.
Thank you for your cooperation.
- Wisdom School Administration, Essur`
      );
    } else {
      return (
`*WISDOM NURSERY & PRIMARY SCHOOL - ESSUR*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Dear ${parent} (Parent of ${child}, ${cls}),

${customGreeting}

For any academic, fees, or van transport information, please reach out to our school office at *${SCHOOL_INFO.phone}* or pay dues safely via GPay at *${SCHOOL_INFO.gpay}*.

Wisdom Nursery & Primary School, Essur - 603310`
      );
    }
  };

  const handleOpenWhatsApp = (student: Student) => {
    const text = generateMessageText(student);
    const cleanPhone = student.parentPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    if (!sentStudentIds.includes(student.id)) {
      setSentStudentIds(prev => [...prev, student.id]);
    }
  };

  const handleCopyMessage = (student: Student) => {
    const text = generateMessageText(student);
    navigator.clipboard.writeText(text);
    setCopiedId(student.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportBroadcastCsv = () => {
    const rows = [
      ['Student Name', 'Parent Name', 'Phone Number', 'Class', 'Pending Tuition', 'Pending Van Fee', 'Total Due', 'WhatsApp Text']
    ];

    selectedStudentsData.forEach(st => {
      rows.push([
        st.name,
        st.parentName,
        st.parentPhone,
        `${st.className} - ${st.section}`,
        String(st.tuitionFeePending ?? 0),
        String(st.vanFeePending ?? 0),
        String(st.pendingFee),
        `"${generateMessageText(st).replace(/"/g, '""')}"`
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Wisdom_Essur_WhatsApp_Broadcast_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedStudentsData = students.filter(s => selectedStudentIds.includes(s.id));
  const currentQueueStudent = selectedStudentsData[queueIndex];

  const handleNextInQueue = () => {
    if (currentQueueStudent) {
      handleOpenWhatsApp(currentQueueStudent);
    }
    if (queueIndex < selectedStudentsData.length - 1) {
      setQueueIndex(queueIndex + 1);
    } else {
      setIsQueueActive(false);
      setQueueIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
              <Share2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">
                  Bulk WhatsApp Due Reminders & Messenger
                </h3>
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  GPay: 9176593129
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                WISDOM Nursery & Primary School - Essur • 1-Click WhatsApp Parent Dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportBroadcastCsv}
              disabled={selectedStudentsData.length === 0}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Selector & Settings Bar */}
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700">Message Template:</span>
            <button
              onClick={() => setTemplateType('combined-fee')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                templateType === 'combined-fee'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Combined Dues (School + Van Fee)</span>
            </button>

            <button
              onClick={() => setTemplateType('van-fee')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                templateType === 'van-fee'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Van / Transport Fee Specific</span>
            </button>

            <button
              onClick={() => setTemplateType('tuition-fee')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                templateType === 'tuition-fee'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Tuition Fee Only</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Due Date Mentioned:</span>
            <input
              type="text"
              value={customDeadline}
              onChange={(e) => setCustomDeadline(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden w-36"
            />
          </div>
        </div>

        {/* Sequential Dispatch Queue Floating Bar */}
        {selectedStudentsData.length > 0 && (
          <div className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Play className="w-3.5 h-3.5 fill-emerald-400" />
                <span>Sequential Dispatcher:</span>
              </span>
              <span className="text-slate-300">
                {sentStudentIds.length} of {selectedStudentsData.length} sent
              </span>
              <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{
                    width: `${Math.round((sentStudentIds.length / (selectedStudentsData.length || 1)) * 100)}%`
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentQueueStudent && (
                <button
                  onClick={handleNextInQueue}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Send to Next: {currentQueueStudent.parentName} ({currentQueueStudent.name})</span>
                </button>
              )}
              {sentStudentIds.length > 0 && (
                <button
                  onClick={() => setSentStudentIds([])}
                  className="text-slate-400 hover:text-white text-[11px] underline cursor-pointer ml-2"
                >
                  Reset Sent Status
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Side: Filter & Student Checklist */}
          <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/70">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or parent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="font-bold text-slate-500 block mb-0.5">Audience</label>
                  <select
                    value={filterAudience}
                    onChange={(e) => setFilterAudience(e.target.value as any)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-medium"
                  >
                    <option value="All">All Parents</option>
                    <option value="PendingFee">Pending Dues Only</option>
                    <option value="PendingVan">Pending Van Fee</option>
                    <option value="VanUsers">Van Commuters</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-0.5">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-medium"
                  >
                    <option value="All">All Classes</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                <span className="text-slate-500">
                  <strong>{filteredStudents.length}</strong> matching parents
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={deselectAll}
                    className="text-slate-500 font-bold hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {filteredStudents.map((st) => {
                const isSelected = selectedStudentIds.includes(st.id);
                const isSent = sentStudentIds.includes(st.id);
                return (
                  <div
                    key={st.id}
                    onClick={() => toggleStudent(st.id)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected ? 'bg-emerald-50/70 border border-emerald-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="text-emerald-600">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 fill-emerald-600 text-white" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 leading-tight">
                            {st.parentName}
                          </span>
                          {isSent && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Sent
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Ward: <strong className="text-slate-700">{st.name}</strong> ({st.className})
                        </div>
                        <div className="text-[10px] font-mono text-emerald-800">
                          {st.parentPhone}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-rose-600">
                        ₹{st.pendingFee.toLocaleString('en-IN')}
                      </div>
                      {st.usesVan && (
                        <div className="text-[9px] text-amber-700 font-semibold">
                          Van: ₹{st.vanFeePending ?? 0}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
              <span>{selectedStudentIds.length} Recipients in Queue</span>
              <span className="text-[11px] text-emerald-700 font-extrabold">Ready to Dispatch</span>
            </div>
          </div>

          {/* Right Side: Message Previews & 1-Click Launchers */}
          <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto">
            {selectedStudentsData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <MessageSquare className="w-12 h-12 mb-2 text-slate-300" />
                <p className="text-sm font-semibold">No parent recipients selected.</p>
                <p className="text-xs">Select parents from the left list to generate WhatsApp messages.</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {selectedStudentsData.map((student, idx) => {
                  const message = generateMessageText(student);
                  const isSent = sentStudentIds.includes(student.id);
                  const isCopied = copiedId === student.id;

                  return (
                    <div
                      key={student.id}
                      className={`bg-white rounded-2xl border transition-all shadow-xs p-4 sm:p-5 ${
                        isSent ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Recipient bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-black">
                              {idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">
                              {student.parentName}
                            </h4>
                            <span className="text-xs text-slate-500">
                              (Ward: <strong className="text-blue-900">{student.name}</strong> • {student.className} - {student.section})
                            </span>
                          </div>
                          <div className="text-xs font-mono text-slate-600 mt-0.5 ml-8 flex items-center gap-3">
                            <span>Phone: <strong className="text-slate-800">{student.parentPhone}</strong></span>
                            <span>•</span>
                            <span className="text-rose-600 font-bold">Total Due: ₹{student.pendingFee.toLocaleString('en-IN')}</span>
                            {student.usesVan && (
                              <span className="text-amber-700 font-medium">(Van Due: ₹{student.vanFeePending ?? 0})</span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 ml-8 sm:ml-0">
                          <button
                            onClick={() => handleCopyMessage(student)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenWhatsApp(student)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                              isSent
                                ? 'bg-emerald-700 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>{isSent ? 'Sent (Send Again)' : 'Send WhatsApp'}</span>
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          </button>
                        </div>
                      </div>

                      {/* Chat Bubble Preview */}
                      <div className="bg-[#e7f7ed] border border-[#d1edd9] p-3.5 rounded-2xl rounded-tl-xs text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed shadow-2xs">
                        {message}
                      </div>

                      {/* Payment Quick Details */}
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
                        <span>Recipient Phone: +91 {student.parentPhone}</span>
                        <span className="text-emerald-800 font-semibold">GPay Payment Link Included (9176593129)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
