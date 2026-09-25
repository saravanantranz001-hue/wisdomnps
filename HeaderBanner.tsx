import React from 'react';
import { Phone, MapPin, QrCode } from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import studentBannerImg from '../assets/images/school_students_banner_1790306064083.jpg';

interface HeaderBannerProps {
  onOpenGPayModal: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ onOpenGPayModal }) => {
  return (
    <header className="relative w-full bg-gradient-to-r from-slate-50 via-white to-blue-50 border-b border-slate-200 shadow-sm overflow-hidden">
      {/* Decorative top border with India tricolor / vibrant accent line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left & Center: Logo & School Branding */}
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 lg:gap-6 flex-1">
          {/* Logo with Emblem */}
          <div className="shrink-0 transition-transform hover:scale-105 duration-200">
            <SchoolLogo size={115} />
          </div>

          {/* School Name & Details */}
          <div className="flex flex-col items-center sm:items-start">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0f2d59] font-serif leading-none drop-shadow-sm select-none"
              style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}
            >
              WISDOM
            </h1>
            
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-[#1e3a8a] tracking-wider uppercase mt-1">
              Nursery and Primary School
            </h2>

            <div className="flex items-center gap-2 my-1">
              <span className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#991b1b]" />
              <span className="text-sm sm:text-base font-black tracking-widest text-[#991b1b] uppercase">
                ESSUR
              </span>
              <span className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#991b1b]" />
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-600 tracking-wide flex items-center gap-2">
              <span>Small Steps</span>
              <span className="text-blue-500 font-bold">•</span>
              <span>Big Dreams</span>
              <span className="text-blue-500 font-bold">•</span>
              <span className="text-amber-600 font-semibold">Bright Future</span>
            </p>
          </div>
        </div>

        {/* Right Section: Contact details pills + School Students Photo */}
        <div className="flex items-center justify-center lg:justify-end gap-3 sm:gap-6 w-full lg:w-auto">
          {/* Contact Cards matching screenshot */}
          <div className="flex flex-col gap-2 shrink-0">
            {/* Phone */}
            <a
              href="tel:9176593129"
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200 rounded-full transition-all duration-150 group"
              title="Call School Office"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-500 leading-tight">Phone</div>
                <div className="text-xs sm:text-sm font-black text-slate-800 tracking-wide group-hover:text-blue-700">
                  9176593129
                </div>
              </div>
            </a>

            {/* GPay */}
            <button
              onClick={onOpenGPayModal}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-300 rounded-full transition-all duration-150 group text-left cursor-pointer shadow-xs"
              title="Click to view GPay QR Code & Pay Fees"
            >
              <div className="w-7 h-7 rounded-full bg-white border border-emerald-200 flex items-center justify-center shadow-xs">
                {/* GPay stylized G badge */}
                <span className="font-extrabold text-xs">
                  <span className="text-blue-600">G</span>
                  <span className="text-green-600">P</span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 leading-tight">GPay</span>
                  <QrCode className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="text-xs sm:text-sm font-black text-emerald-950 tracking-wide group-hover:text-emerald-700">
                  9176593129
                </div>
              </div>
            </button>

            {/* Address */}
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50/80 border border-red-200 rounded-full">
              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-500 leading-tight">Location</div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Essur - 603310
                </div>
              </div>
            </div>
          </div>

          {/* Students Image Frame matching screenshot */}
          <div className="relative hidden md:block w-44 sm:w-56 lg:w-64 h-28 sm:h-32 shrink-0 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-1 ring-slate-200">
            <img
              src={studentBannerImg}
              alt="Wisdom Nursery and Primary School Students"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-1.5">
              <span className="text-[11px] font-bold text-white bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded">
                Excellence in Primary Education
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
