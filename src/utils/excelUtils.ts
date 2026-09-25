import * as XLSX from 'xlsx';
import { Student, ClassName } from '../types';
import { FinanceEntry } from '../components/ExpensesIncomeModule';

export interface ParsedStudentRow {
  admissionNo: string;
  name: string;
  rollNo: string;
  className: ClassName;
  section: 'A' | 'B';
  gender: 'Boy' | 'Girl';
  parentName: string;
  parentPhone: string;
  parentGPay?: string;
  address: string;
  bloodGroup: string;
  totalFee: number;
  paidFee: number;
  pendingFee: number;
  feeStatus: 'Paid' | 'Partial' | 'Pending';
  attendanceRate: number;
  usesVan?: boolean;
  vanRoute?: string;
  vanStop?: string;
  vanFeeTotal?: number;
  vanFeePaid?: number;
  isValid: boolean;
  validationErrors: string[];
}

/**
 * Normalizes string keys and maps varied header names to canonical properties
 */
function cleanKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function parseRawRowToStudent(row: Record<string, any>, index: number): ParsedStudentRow {
  const normalized: Record<string, any> = {};
  for (const k of Object.keys(row)) {
    normalized[cleanKey(k)] = row[k];
  }

  const name =
    normalized['name'] ||
    normalized['studentname'] ||
    normalized['student'] ||
    normalized['pupilname'] ||
    '';

  let rawClass =
    normalized['class'] ||
    normalized['classname'] ||
    normalized['grade'] ||
    normalized['standard'] ||
    'Nursery';

  // Standardize ClassName
  const classStr = String(rawClass).trim().toLowerCase();
  let className: ClassName = 'Nursery';
  if (classStr.includes('nur') || classStr === 'pre-kg' || classStr === 'pkg') {
    className = 'Nursery';
  } else if (classStr.includes('lkg') || classStr.includes('lower')) {
    className = 'LKG';
  } else if (classStr.includes('ukg') || classStr.includes('upper')) {
    className = 'UKG';
  } else if (classStr.includes('1') || classStr.includes('i') && !classStr.includes('ii') && !classStr.includes('v')) {
    className = 'Class 1';
  } else if (classStr.includes('2') || classStr.includes('ii') && !classStr.includes('iii')) {
    className = 'Class 2';
  } else if (classStr.includes('3') || classStr.includes('iii')) {
    className = 'Class 3';
  } else if (classStr.includes('4') || classStr.includes('iv')) {
    className = 'Class 4';
  } else if (classStr.includes('5') || classStr.includes('v')) {
    className = 'Class 5';
  }

  const rawSection = String(normalized['section'] || normalized['sec'] || 'A').toUpperCase().trim();
  const section: 'A' | 'B' = rawSection.includes('B') ? 'B' : 'A';

  const rawGender = String(normalized['gender'] || normalized['sex'] || 'Boy').trim().toLowerCase();
  const gender: 'Boy' | 'Girl' = (rawGender.startsWith('g') || rawGender.startsWith('f')) ? 'Girl' : 'Boy';

  const admissionNo =
    normalized['admissionno'] ||
    normalized['admno'] ||
    normalized['admission'] ||
    normalized['regno'] ||
    `WES/2025/${Math.floor(100 + Math.random() * 900)}`;

  const rollNo =
    normalized['rollno'] ||
    normalized['roll'] ||
    normalized['rollnumber'] ||
    `${index + 1}`;

  const parentName =
    normalized['parentname'] ||
    normalized['parent'] ||
    normalized['fathername'] ||
    normalized['father'] ||
    normalized['mothername'] ||
    normalized['guardian'] ||
    'Parent';

  const parentPhone = String(
    normalized['parentphone'] ||
    normalized['phone'] ||
    normalized['mobile'] ||
    normalized['phoneno'] ||
    normalized['contact'] ||
    '9176593129'
  ).replace(/[^0-9]/g, '');

  const parentGPay =
    normalized['parentgpay'] ||
    normalized['gpay'] ||
    normalized['upi'] ||
    parentPhone;

  const address =
    normalized['address'] ||
    normalized['village'] ||
    normalized['location'] ||
    normalized['city'] ||
    'Essur - 603310';

  const bloodGroup = String(normalized['bloodgroup'] || normalized['blood'] || 'O+').toUpperCase();

  const totalFee = Number(normalized['totalfee'] || normalized['fee'] || normalized['fees'] || 15000);
  const paidFee = Number(normalized['paidfee'] || normalized['paid'] || 0);
  const pendingFee = Math.max(0, totalFee - paidFee);

  const feeStatus: 'Paid' | 'Partial' | 'Pending' =
    paidFee >= totalFee ? 'Paid' : paidFee > 0 ? 'Partial' : 'Pending';

  const attendanceRate = Number(normalized['attendancerate'] || normalized['attendance'] || 95);

  const rawVan = String(normalized['usesvan'] || normalized['van'] || normalized['transport'] || '').toLowerCase();
  const usesVan = rawVan === 'yes' || rawVan === 'true' || rawVan === '1' || normalized['vanroute'] ? true : false;
  const vanRoute = normalized['vanroute'] || normalized['route'] || (usesVan ? 'Route 1 - Essur Main Village' : undefined);
  const vanStop = normalized['vanstop'] || normalized['stop'] || (usesVan ? 'Essur Bus Stand' : undefined);
  const vanFeeTotal = usesVan ? Number(normalized['vanfeetotal'] || normalized['vanfee'] || 6000) : 0;
  const vanFeePaid = usesVan ? Number(normalized['vanfeepaid'] || 0) : 0;

  const validationErrors: string[] = [];
  if (!name || String(name).trim().length === 0) {
    validationErrors.push('Student name is required');
  }
  if (!parentPhone || parentPhone.length < 7) {
    validationErrors.push('Valid parent contact phone is required');
  }

  return {
    admissionNo: String(admissionNo).trim(),
    name: String(name).trim(),
    rollNo: String(rollNo).trim(),
    className,
    section,
    gender,
    parentName: String(parentName).trim(),
    parentPhone: parentPhone || '9176593129',
    parentGPay: String(parentGPay).trim(),
    address: String(address).trim(),
    bloodGroup,
    totalFee,
    paidFee,
    pendingFee,
    feeStatus,
    attendanceRate: Math.min(100, Math.max(0, attendanceRate)),
    usesVan,
    vanRoute,
    vanStop,
    vanFeeTotal,
    vanFeePaid,
    isValid: validationErrors.length === 0,
    validationErrors,
  };
}

/**
 * Parses an Excel or CSV file
 */
export async function parseExcelOrCsvFile(file: File): Promise<ParsedStudentRow[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  return rawRows.map((row, idx) => parseRawRowToStudent(row, idx));
}

/**
 * Parses tab-separated or comma-separated table text (e.g. copied directly from Excel / Sheets)
 */
export function parsePastedTableText(text: string): ParsedStudentRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(',') ? ',' : '\t';
  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''));

  const parsedRows: ParsedStudentRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length === 0 || (cols.length === 1 && cols[0] === '')) continue;

    const rowObj: Record<string, any> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = cols[idx] || '';
    });

    parsedRows.push(parseRawRowToStudent(rowObj, i - 1));
  }

  return parsedRows;
}

/**
 * Generates and downloads the official Excel Sample Template
 */
export function downloadStudentImportTemplate() {
  const sampleData = [
    {
      'Admission No': 'WES/2025/101',
      'Student Name': 'Aavya K',
      'Class': 'Nursery',
      'Section': 'A',
      'Roll No': '1',
      'Gender': 'Girl',
      'Parent Name': 'Karthik S',
      'Parent Phone': '9840123456',
      'GPay Number': '9840123456',
      'Address': 'Essur Post, Madurantakam Taluk - 603310',
      'Blood Group': 'O+',
      'Total Fee': 15000,
      'Paid Fee': 8000,
      'Uses Van': 'Yes',
      'Van Route': 'Route 1 - Essur Main Village',
      'Van Stop': 'Essur Bus Stand',
      'Van Fee': 6000,
      'Attendance %': 96,
    },
    {
      'Admission No': 'WES/2025/102',
      'Student Name': 'Bhuvan M',
      'Class': 'LKG',
      'Section': 'A',
      'Roll No': '2',
      'Gender': 'Boy',
      'Parent Name': 'Murugan K',
      'Parent Phone': '9840987654',
      'GPay Number': '9840987654',
      'Address': 'Colony Street, Essur - 603310',
      'Blood Group': 'B+',
      'Total Fee': 16000,
      'Paid Fee': 16000,
      'Uses Van': 'No',
      'Van Route': '',
      'Van Stop': '',
      'Van Fee': 0,
      'Attendance %': 98,
    },
    {
      'Admission No': 'WES/2025/103',
      'Student Name': 'Charulatha R',
      'Class': 'Class 1',
      'Section': 'B',
      'Roll No': '3',
      'Gender': 'Girl',
      'Parent Name': 'Rajendran P',
      'Parent Phone': '9444123890',
      'GPay Number': '9444123890',
      'Address': 'Near Vinayagar Temple, Essur - 603310',
      'Blood Group': 'A+',
      'Total Fee': 18000,
      'Paid Fee': 5000,
      'Uses Van': 'Yes',
      'Van Route': 'Route 2 - Karunguzhi Junction',
      'Van Stop': 'Karunguzhi Toll Gate',
      'Van Fee': 7000,
      'Attendance %': 94,
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  // Column widths
  ws['!cols'] = [
    { wch: 16 }, // Adm No
    { wch: 20 }, // Student Name
    { wch: 12 }, // Class
    { wch: 10 }, // Section
    { wch: 10 }, // Roll No
    { wch: 10 }, // Gender
    { wch: 20 }, // Parent Name
    { wch: 15 }, // Parent Phone
    { wch: 15 }, // GPay Number
    { wch: 38 }, // Address
    { wch: 12 }, // Blood Group
    { wch: 12 }, // Total Fee
    { wch: 12 }, // Paid Fee
    { wch: 10 }, // Uses Van
    { wch: 28 }, // Van Route
    { wch: 22 }, // Van Stop
    { wch: 12 }, // Van Fee
    { wch: 14 }, // Attendance %
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Student_Import_Template');

  XLSX.writeFile(wb, 'Wisdom_School_Student_Import_Template.xlsx');
}

/**
 * Exports students list to rich multi-sheet Excel spreadsheet
 */
export function exportStudentsToExcel(students: Student[], filteredLabel: string = 'All') {
  // Sheet 1: Student Directory
  const studentRows = students.map((std) => ({
    'Admission No': std.admissionNo,
    'Student Name': std.name,
    'Roll No': std.rollNo,
    'Class': std.className,
    'Section': std.section,
    'Gender': std.gender,
    'Parent / Guardian': std.parentName,
    'Contact Phone': std.parentPhone,
    'GPay Number': std.parentGPay || std.parentPhone,
    'Residential Address': std.address,
    'Blood Group': std.bloodGroup,
    'Admission Date': std.admissionDate,
    'Tuition Total (₹)': std.tuitionFeeTotal ?? std.totalFee,
    'Tuition Paid (₹)': std.tuitionFeePaid ?? std.paidFee,
    'Tuition Pending (₹)': std.tuitionFeePending ?? std.pendingFee,
    'Uses Van Transport': std.usesVan ? 'Yes' : 'No',
    'Van Route': std.vanRoute || 'N/A',
    'Van Stop': std.vanStop || 'N/A',
    'Van Fee Total (₹)': std.vanFeeTotal || 0,
    'Van Fee Paid (₹)': std.vanFeePaid || 0,
    'Van Fee Pending (₹)': std.vanFeePending || 0,
    'Grand Total Fee (₹)': std.totalFee,
    'Total Paid Fee (₹)': std.paidFee,
    'Balance Pending (₹)': std.pendingFee,
    'Fee Status': std.feeStatus,
    'Attendance (%)': `${std.attendanceRate}%`,
  }));

  const wsStudents = XLSX.utils.json_to_sheet(studentRows);
  wsStudents['!cols'] = [
    { wch: 16 }, // Adm
    { wch: 22 }, // Name
    { wch: 10 }, // Roll
    { wch: 12 }, // Class
    { wch: 10 }, // Sec
    { wch: 10 }, // Gender
    { wch: 22 }, // Parent
    { wch: 15 }, // Phone
    { wch: 15 }, // GPay
    { wch: 35 }, // Address
    { wch: 12 }, // Blood
    { wch: 14 }, // Adm Date
    { wch: 16 }, // Tuition Total
    { wch: 16 }, // Tuition Paid
    { wch: 16 }, // Tuition Pending
    { wch: 16 }, // Uses Van
    { wch: 28 }, // Van Route
    { wch: 22 }, // Van Stop
    { wch: 15 }, // Van Fee Total
    { wch: 15 }, // Van Fee Paid
    { wch: 16 }, // Van Fee Pending
    { wch: 16 }, // Grand Total
    { wch: 16 }, // Total Paid
    { wch: 16 }, // Total Pending
    { wch: 14 }, // Fee Status
    { wch: 14 }, // Attendance
  ];

  // Sheet 2: Class Wise Breakdown
  const classesList: ClassName[] = [
    'Nursery',
    'LKG',
    'UKG',
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
  ];

  const classSummary = classesList.map((cls) => {
    const list = students.filter((s) => s.className === cls);
    const boys = list.filter((s) => s.gender === 'Boy').length;
    const girls = list.filter((s) => s.gender === 'Girl').length;
    const vanUsers = list.filter((s) => s.usesVan).length;
    const feeCollected = list.reduce((sum, s) => sum + s.paidFee, 0);
    const feePending = list.reduce((sum, s) => sum + s.pendingFee, 0);

    return {
      'Class': cls,
      'Total Enrolled': list.length,
      'Boys': boys,
      'Girls': girls,
      'Van Users': vanUsers,
      'Total Paid Fees (₹)': feeCollected,
      'Total Dues Pending (₹)': feePending,
    };
  });

  const wsClassSummary = XLSX.utils.json_to_sheet(classSummary);
  wsClassSummary['!cols'] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 20 },
    { wch: 22 },
  ];

  // Sheet 3: Financial Fee Ledger Summary
  const totalFees = students.reduce((sum, s) => sum + s.totalFee, 0);
  const totalPaid = students.reduce((sum, s) => sum + s.paidFee, 0);
  const totalPending = students.reduce((sum, s) => sum + s.pendingFee, 0);
  const paidCount = students.filter((s) => s.feeStatus === 'Paid').length;
  const partialCount = students.filter((s) => s.feeStatus === 'Partial').length;
  const pendingCount = students.filter((s) => s.feeStatus === 'Pending').length;

  const ledgerData = [
    { 'Financial Metric': 'Total Students Registered', 'Value': students.length },
    { 'Financial Metric': 'Total Fee Demanded (₹)', 'Value': totalFees },
    { 'Financial Metric': 'Total Fee Collected (₹)', 'Value': totalPaid },
    { 'Financial Metric': 'Total Dues Outstanding (₹)', 'Value': totalPending },
    { 'Financial Metric': 'Fully Paid Students', 'Value': paidCount },
    { 'Financial Metric': 'Partial Payment Students', 'Value': partialCount },
    { 'Financial Metric': 'Defaulters / Nil Paid Students', 'Value': pendingCount },
    { 'Financial Metric': 'School Official GPay Contact', 'Value': '9176593129' },
    { 'Financial Metric': 'School Campus', 'Value': 'Wisdom Nursery & Primary School, Essur - 603310' },
  ];

  const wsLedger = XLSX.utils.json_to_sheet(ledgerData);
  wsLedger['!cols'] = [{ wch: 35 }, { wch: 35 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsStudents, 'Student Directory');
  XLSX.utils.book_append_sheet(wb, wsClassSummary, 'Class Breakdown');
  XLSX.utils.book_append_sheet(wb, wsLedger, 'Fee Audit Ledger');

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `Wisdom_School_Students_${filteredLabel.replace(/\s+/g, '_')}_${dateStr}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Export Expenses & Incomes to Excel
 */
export function exportFinancesToExcel(entries: FinanceEntry[]) {
  const data = entries.map((e) => ({
    'Date': e.date,
    'Type': e.type,
    'Category': e.category,
    'Title / Description': e.title,
    'Amount (₹)': e.amount,
    'Payment Mode': e.paymentMode,
    'Reference / Voucher No': e.referenceNo || 'N/A',
    'Recorded By': e.recordedBy,
    'Notes': e.notes || '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    { wch: 14 },
    { wch: 12 },
    { wch: 26 },
    { wch: 36 },
    { wch: 16 },
    { wch: 22 },
    { wch: 22 },
    { wch: 20 },
    { wch: 30 },
  ];

  const totalIncome = entries.filter((e) => e.type === 'Income').reduce((s, e) => s + e.amount, 0);
  const totalExpense = entries.filter((e) => e.type === 'Expense').reduce((s, e) => s + e.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const summary = [
    { 'Metric': 'Total Income (₹)', 'Value': totalIncome },
    { 'Metric': 'Total Expenses (₹)', 'Value': totalExpense },
    { 'Metric': 'Net Balance / Cash Surplus (₹)', 'Value': netBalance },
    { 'Metric': 'School', 'Value': 'Wisdom Nursery & Primary School - Essur' },
    { 'Metric': 'Official GPay / Phone', 'Value': '9176593129' },
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summary);
  wsSummary['!cols'] = [{ wch: 30 }, { wch: 35 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Financial Ledger');
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Financial Summary');

  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Wisdom_School_Expenses_Income_${dateStr}.xlsx`);
}
