export type ClassName = 'Nursery' | 'LKG' | 'UKG' | 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5';

export interface Student {
  id: string;
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
  admissionDate: string;
  bloodGroup: string;
  feeStatus: 'Paid' | 'Partial' | 'Pending';
  totalFee: number;
  paidFee: number;
  pendingFee: number;
  attendanceRate: number;
  avatarUrl?: string;

  // Van / Transport Fee Fields
  usesVan?: boolean;
  vanRoute?: string;
  vanStop?: string;
  vanFeeMonthly?: number;
  vanFeeTotal?: number;
  vanFeePaid?: number;
  vanFeePending?: number;

  // Separate Tuition Fee breakdown
  tuitionFeeTotal?: number;
  tuitionFeePaid?: number;
  tuitionFeePending?: number;
}

export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  qualification: string;
  subjects: string[];
  classTeacherOf?: string;
  phone: string;
  email: string;
  joinDate: string;
  experience: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  joinDate: string;
}

export type FeeCategory = 'School Tuition' | 'Van Transport' | 'Combined (School + Van)' | 'Books & Exam';

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  amount: number;
  date: string;
  paymentMethod: 'GPay' | 'Cash' | 'Bank Transfer' | 'Cheque';
  transactionId?: string;
  feeCategory?: FeeCategory;
  feeType:
    | 'Term 1 Tuition'
    | 'Term 2 Tuition'
    | 'Term 3 Tuition'
    | 'Van / Transport Fee'
    | 'Books & Uniform'
    | 'Annual Development'
    | 'Exam Fee'
    | 'Combined School & Van Fee';
  vanRoute?: string;
  vanMonth?: string;
  status: 'Completed' | 'Pending' | 'Failed';
  collectedBy: string;
  remarks?: string;
}

export interface VanRoute {
  id: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  vanNumber: string;
  monthlyFee: number;
  annualFee: number;
  stops: string[];
  studentCount: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: ClassName;
  section: string;
  date: string;
  status: 'Present' | 'Absent' | 'Leave';
  remarks?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  targetAudience: 'All' | 'Parents' | 'Teachers' | 'Students' | 'Nursery/KG' | 'Primary';
  category: 'Event' | 'Holiday' | 'Academic' | 'Exam' | 'Urgent';
  postedBy: string;
  sentViaWhatsApp?: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  location: string;
  description: string;
}

export interface Activity {
  id: string;
  title: string;
  time: string;
  type: 'admission' | 'fee' | 'exam' | 'notice' | 'homework' | 'attendance';
  iconType: string;
  meta?: string;
}

export interface ExamMark {
  id: string;
  studentId: string;
  studentName: string;
  className: ClassName;
  examName: string;
  term: 'Term 1' | 'Term 2' | 'Term 3' | 'Unit Test 1' | 'Unit Test 2';
  subjects: {
    name: string;
    marksObtained: number;
    maxMarks: number;
    grade: string;
  }[];
  totalMarks: number;
  maxTotal: number;
  percentage: number;
  overallGrade: string;
}

export interface Homework {
  id: string;
  className: ClassName;
  subject: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  teacherName: string;
}
