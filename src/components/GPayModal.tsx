import React, { useState } from 'react';
import { X, Check, Copy, QrCode, Phone, ShieldCheck, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { SCHOOL_INFO } from '../data/initialData';

interface GPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetAmount?: number;
  studentName?: string;
  className?: string;
}

export const GPayModal: React.FC<GPayModalProps> = ({
  isOpen,
  onClose,
  presetAmount,
  studentName,
  className: studentClass,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [amount, setAmount] = useState<number>(presetAmount || 5000);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'phone' | 'upi') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const upiUrl = `upi://pay?pa=${SCHOOL_INFO.upiId}&pn=WISDOM+NURSERY+AND+PRIMARY+SCHOOL&am=${amount}&cu=INR`;
  const whatsappMsg = encodeURIComponent(
    `Hello Wisdom School, I have transferred fee of ₹${amount} for student ${studentName || ''} (${studentClass || ''}) via GPay to 9176593129. Please find screenshot attached.`
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header with GPay Styling */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md">
              <span className="text-xl font-black">
                <span className="text-blue-600">G</span>
                <span className="text-red-500">P</span>
                <span className="text-amber-500">a</span>
                <span className="text-green-600">y</span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-blue-200 uppercase tracking-wider font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Official School Fee Portal
              </div>
              <h3 className="text-base font-bold text-white leading-tight">
                {SCHOOL_INFO.fullName}
              </h3>
            </div>
          </div>
        </div>

        {/* QR Code and Payment Details */}
        <div className="p-6 text-center">
          {studentName && (
            <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-700 font-medium">
              Student: <span className="font-bold text-blue-900">{studentName}</span> ({studentClass})
            </div>
          )}

          {/* Amount selector pills */}
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-500 block mb-1.5 text-left">
              Select or Enter Fee Amount (₹)
            </label>
            <div className="flex gap-2 justify-center mb-2">
              {[3500, 4000, 5000, 8000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    amount === amt
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-1.5 text-sm font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden"
                placeholder="Enter custom amount"
              />
            </div>
          </div>

          {/* Styled SVG UPI QR Code */}
          <div className="relative mx-auto w-48 h-48 bg-white p-3 rounded-2xl shadow-lg border-2 border-emerald-500/80 flex flex-col items-center justify-center">
            {/* SVG Crisp QR Code visual representation */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Corner position markers */}
              <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="#0f172a" strokeWidth="4" />
              <rect x="11" y="11" width="16" height="16" rx="2" fill="#0f172a" />

              <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="#0f172a" strokeWidth="4" />
              <rect x="73" y="11" width="16" height="16" rx="2" fill="#0f172a" />

              <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="#0f172a" strokeWidth="4" />
              <rect x="11" y="73" width="16" height="16" rx="2" fill="#0f172a" />

              {/* Data pattern blocks */}
              <rect x="38" y="10" width="8" height="8" fill="#0f172a" />
              <rect x="50" y="10" width="8" height="8" fill="#0f172a" />
              <rect x="38" y="24" width="8" height="8" fill="#0f172a" />
              <rect x="50" y="24" width="8" height="8" fill="#0f172a" />

              <rect x="10" y="38" width="8" height="8" fill="#0f172a" />
              <rect x="24" y="38" width="8" height="8" fill="#0f172a" />
              <rect x="38" y="38" width="8" height="8" fill="#0f172a" />
              <rect x="54" y="38" width="8" height="8" fill="#0f172a" />
              <rect x="68" y="38" width="8" height="8" fill="#0f172a" />
              <rect x="82" y="38" width="8" height="8" fill="#0f172a" />

              <rect x="10" y="52" width="8" height="8" fill="#0f172a" />
              <rect x="24" y="52" width="8" height="8" fill="#0f172a" />
              <rect x="38" y="52" width="8" height="8" fill="#0f172a" />
              <rect x="54" y="52" width="8" height="8" fill="#0f172a" />
              <rect x="68" y="52" width="8" height="8" fill="#0f172a" />
              <rect x="82" y="52" width="8" height="8" fill="#0f172a" />

              <rect x="38" y="66" width="8" height="8" fill="#0f172a" />
              <rect x="50" y="66" width="8" height="8" fill="#0f172a" />
              <rect x="68" y="66" width="8" height="8" fill="#0f172a" />
              <rect x="82" y="66" width="8" height="8" fill="#0f172a" />

              <rect x="38" y="80" width="8" height="8" fill="#0f172a" />
              <rect x="50" y="80" width="8" height="8" fill="#0f172a" />
              <rect x="68" y="80" width="8" height="8" fill="#0f172a" />
              <rect x="82" y="80" width="8" height="8" fill="#0f172a" />

              {/* Center GPay Logo Badge */}
              <circle cx="50" cy="50" r="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <text x="50" y="54" fontSize="9" fontWeight="900" textAnchor="middle" fill="#059669">
                GPay
              </text>
            </svg>
            <div className="absolute -bottom-3 bg-emerald-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold shadow-md">
              Scan with Any UPI App
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Scan using <strong>Google Pay</strong>, <strong>PhonePe</strong>, or <strong>Paytm</strong>
          </p>

          {/* Quick Copy Number Block */}
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">GPay Mobile Number:</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm">{SCHOOL_INFO.gpay}</span>
                <button
                  onClick={() => copyToClipboard(SCHOOL_INFO.gpay, 'phone')}
                  className="p-1 rounded-md hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  title="Copy Phone Number"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
              <span className="font-semibold text-slate-600">UPI ID:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800 text-xs">{SCHOOL_INFO.upiId}</span>
                <button
                  onClick={() => copyToClipboard(SCHOOL_INFO.upiId, 'upi')}
                  className="p-1 rounded-md hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 space-y-2">
            <a
              href={`https://wa.me/91${SCHOOL_INFO.phone}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Send Payment Screenshot via WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
