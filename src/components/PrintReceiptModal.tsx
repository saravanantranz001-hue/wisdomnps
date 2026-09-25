import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FeePayment } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { SCHOOL_INFO } from '../data/initialData';

interface PrintReceiptModalProps {
  payment: FeePayment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  payment,
  isOpen,
  onClose
}) => {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Action Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Official Fee Receipt</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-8 bg-white text-slate-900" id="receipt-printable">
          {/* Top School Header */}
          <div className="border-b-2 border-blue-900 pb-4 flex items-center justify-between gap-4">
            <div className="shrink-0">
              <SchoolLogo size={75} />
            </div>
            <div className="text-center flex-1">
              <h2 className="text-2xl font-black text-blue-950 font-serif tracking-tight">
                {SCHOOL_INFO.name}
              </h2>
              <div className="text-sm font-extrabold text-red-700 tracking-wider">
                — {SCHOOL_INFO.subName} —
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{SCHOOL_INFO.fullAddress}</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                Phone: <span className="font-bold text-blue-900">9176593129</span> | GPay: <span className="font-bold text-emerald-700">9176593129</span>
              </p>
            </div>
            <div className="w-16 hidden sm:block text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400">ORIGINAL<br/>RECEIPT</span>
            </div>
          </div>

          {/* Receipt Info Title */}
          <div className="my-4 flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-semibold">Receipt No: </span>
              <span className="text-xs font-mono font-bold text-blue-900">{payment.receiptNo}</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-black text-slate-800 uppercase px-3 py-1 bg-white rounded-md border border-slate-200">
                FEE PAYMENT RECEIPT
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold">Date: </span>
              <span className="text-xs font-bold text-slate-800">{payment.date} 2025</span>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-4 p-3.5 bg-slate-50/60 rounded-xl border border-slate-200">
            <div>
              <div className="text-slate-500">Student Name:</div>
              <div className="text-sm font-bold text-slate-900">{payment.studentName}</div>
            </div>
            <div>
              <div className="text-slate-500">Class & Section:</div>
              <div className="text-sm font-bold text-slate-900">Class {payment.className} - {payment.section}</div>
            </div>
            <div>
              <div className="text-slate-500">Payment Mode:</div>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span>{payment.paymentMethod}</span>
                {payment.paymentMethod === 'GPay' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                    9176593129 Verified
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Transaction / UTR Ref:</div>
              <div className="font-mono text-xs font-semibold text-slate-700">
                {payment.transactionId || 'CASH-COUNTER-REF'}
              </div>
            </div>
          </div>

          {/* Fee Itemization Table */}
          <table className="w-full text-xs text-left mb-6 border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-900 text-white font-bold uppercase text-[10px]">
              <tr>
                <th className="p-2.5">S.No</th>
                <th className="p-2.5">Fee Particulars</th>
                <th className="p-2.5">Academic Term</th>
                <th className="p-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 font-bold">01</td>
                <td className="p-2.5 font-semibold text-slate-800">
                  <div>{payment.feeType}</div>
                  {payment.vanRoute && (
                    <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                      School Van Transport: {payment.vanRoute} {payment.vanMonth ? `(${payment.vanMonth})` : ''}
                    </div>
                  )}
                </td>
                <td className="p-2.5 text-slate-600">Academic Year 2026-2027</td>
                <td className="p-2.5 text-right font-bold text-slate-900">
                  ₹ {payment.amount.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr className="bg-slate-50/80 font-black">
                <td colSpan={3} className="p-2.5 text-right text-slate-700">
                  Total Amount Received:
                </td>
                <td className="p-2.5 text-right text-sm text-emerald-700">
                  ₹ {payment.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Amount in words & Remarks */}
          <div className="text-xs text-slate-600 space-y-1 mb-8">
            <div>
              <span className="font-semibold text-slate-700">Status: </span>
              <span className="text-emerald-700 font-bold">PAID IN FULL</span>
            </div>
            {payment.remarks && (
              <div>
                <span className="font-semibold text-slate-700">Remarks: </span>
                <span>{payment.remarks}</span>
              </div>
            )}
            <div className="text-[11px] text-slate-400 italic">
              * This is a computer generated digital fee receipt issued by Wisdom Nursery and Primary School - Essur.
            </div>
          </div>

          {/* Signature & Seal Row */}
          <div className="flex items-end justify-between pt-6 border-t border-slate-200 text-xs">
            <div className="text-center">
              <div className="w-24 h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400 mb-1">
                Official School Seal
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Wisdom School, Essur</span>
            </div>

            <div className="text-center">
              <div className="h-10"></div>
              <div className="border-t border-slate-400 px-6 pt-1 font-bold text-slate-800">
                Cashier / Accounts Incharge
              </div>
              <div className="text-[10px] text-slate-500">Collected by {payment.collectedBy}</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Queries? Call: <strong className="text-slate-800">9176593129</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
