import React from 'react';
import { 
  Users, 
  DollarSign, 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  UserPlus, 
  Receipt, 
  ArrowRight,
  TrendingUp,
  GraduationCap,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Student, ClassSession, PaymentRecord, AttendanceRecord, DayOfWeek, CenterSettings } from '../types';
import { formatMonthNameMalay, generateFeeReminderWhatsAppUrl } from '../utils/whatsapp';
import { NavTab } from './Navbar';

interface DashboardOverviewProps {
  students: Student[];
  classes: ClassSession[];
  payments: PaymentRecord[];
  attendance: AttendanceRecord[];
  settings: CenterSettings;
  setActiveTab: (tab: NavTab) => void;
  onTakeAttendance: (classId: string) => void;
  onViewReceipt: (payment: PaymentRecord, student: Student) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  students,
  classes,
  payments,
  attendance,
  settings,
  setActiveTab,
  onTakeAttendance,
  onViewReceipt
}) => {
  const currentMonth = '2026-10';
  const todayDateStr = new Date().toISOString().split('T')[0];

  // Map English getDay() to Malay DayOfWeek
  const dayNames: DayOfWeek[] = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  const todayDayName: DayOfWeek = dayNames[new Date().getDay()];

  // Active students
  const activeStudents = students.filter(s => s.status === 'active');

  // Month payment statistics
  const currentMonthPayments = payments.filter(p => p.month === currentMonth);
  const totalDue = currentMonthPayments.reduce((sum, p) => sum + p.amountDue, 0);
  const totalCollected = currentMonthPayments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalUnpaid = Math.max(0, totalDue - totalCollected);
  const collectionPercent = totalDue > 0 ? Math.round((totalCollected / totalDue) * 100) : 0;

  // Outstanding payment list for quick WhatsApp reminder
  const outstandingPayments = currentMonthPayments
    .filter(p => p.status === 'unpaid' || p.status === 'partial')
    .slice(0, 5);

  // Today's classes
  const todayClasses = classes.filter(c => c.dayOfWeek === todayDayName);

  // Today's attendance percentage
  const todayAttendanceRecords = attendance.filter(a => a.date === todayDateStr);
  const todayPresentCount = todayAttendanceRecords.filter(a => a.status === 'present').length;
  const todayAttendanceRate = todayAttendanceRecords.length > 0
    ? Math.round((todayPresentCount / todayAttendanceRecords.length) * 100)
    : 100;

  // 1. Data for Monthly Fee Collection Trend (Recharts) - 100% data sebenar
  // Dapatkan semua bulan yang benar-benar wujud dalam rekod pembayaran
  const uniqueMonths = Array.from(new Set(payments.map(p => p.month))).sort();

  const feeTrendData = uniqueMonths.map(m => {
    const mPayments = payments.filter(p => p.month === m);
    const due = mPayments.reduce((sum, p) => sum + p.amountDue, 0);
    const paid = mPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const unpaid = Math.max(0, due - paid);

    return {
      bulan: formatMonthNameMalay(m),
      Kutipan: paid,
      Tertunggak: unpaid,
      Sasaran: due
    };
  });

  // 2. Data for Student Attendance by Class/Subject (Recharts) - 100% data sebenar
  const attendanceData = classes.map(cls => {
    const classRecords = attendance.filter(a => a.classId === cls.id);
    const present = classRecords.filter(a => a.status === 'present').length;
    const absent = classRecords.filter(a => a.status === 'absent').length;
    const totalRecorded = classRecords.length;
    const rate = totalRecorded > 0 ? Math.round((present / totalRecorded) * 100) : 0;

    return {
      subjek: cls.subject.length > 12 ? `${cls.subject.substring(0, 10)}...` : cls.subject,
      namaPenuh: `${cls.subject} (${cls.level})`,
      Hadir: present,
      TidakHadir: absent,
      PeratusHadir: rate,
      totalRecorded
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Welcome & Center Identity Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full text-xs font-medium text-blue-200">
            <span>Sistem Operasi Pusat Tuisyen</span>
            <span>·</span>
            <span>{settings.registrationNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading">
            {settings.centerName}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            {settings.tagline} · Pengurusan pendaftaran, jadual kelas, kehadiran harian, dan rekod yuran bulanan dalam satu paparan.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('students')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white text-blue-900 hover:bg-blue-50 rounded-lg transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            Daftar Pelajar
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-700/80 hover:bg-blue-700 text-white rounded-lg transition-colors border border-blue-500/30"
          >
            <Receipt className="w-4 h-4" />
            Semak Yuran
          </button>
        </div>
      </div>

      {/* 4 Core KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Pelajar Aktif */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Pelajar Berdaftar
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
            {activeStudents.length} <span className="text-xs font-normal text-slate-400">orang aktif</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Jumlah keseluruhan: {students.length}</span>
            <button 
              onClick={() => setActiveTab('students')}
              className="text-blue-700 hover:underline font-medium"
            >
              Urus &rarr;
            </button>
          </div>
        </div>

        {/* Metric 2: Kutipan Bulan Ini */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
              Kutipan {formatMonthNameMalay(currentMonth)}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 mt-2">
            RM {totalCollected.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-2 flex items-center justify-between">
            <span>Kadar lunas: {collectionPercent}%</span>
            <span className="font-mono text-slate-400">Sasaran: RM {totalDue.toFixed(0)}</span>
          </div>
        </div>

        {/* Metric 3: Tunggakan Yuran */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
              Baki Yuran Tertunggak
            </span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-rose-700 mt-2">
            RM {totalUnpaid.toFixed(2)}
          </div>
          <div className="text-[11px] text-rose-600 mt-2 flex items-center justify-between">
            <span>{currentMonthPayments.filter(p => p.status === 'unpaid').length} invois belum bayar</span>
            <button 
              onClick={() => setActiveTab('fees')}
              className="text-rose-700 hover:underline font-medium"
            >
              Peringatan &rarr;
            </button>
          </div>
        </div>

        {/* Metric 4: Sesi Kelas & Kehadiran */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
              Kelas Hari Ini ({todayDayName})
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
            {todayClasses.length} <span className="text-xs font-normal text-slate-400">sesi kelas</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Kehadiran direkod: {todayAttendanceRecords.length}</span>
            <button 
              onClick={() => setActiveTab('attendance')}
              className="text-indigo-700 hover:underline font-medium"
            >
              Semak &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Visual Analytics & Charts Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Trend Kutipan Yuran Bulanan */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  Trend Kutipan Yuran Bulanan (RM)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Perbandingan jumlah yuran dikutip vs yuran tertunggak 5 bulan terkini
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                Dikutip
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                Tertunggak
              </span>
            </div>
          </div>

          {feeTrendData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="bulan" 
                    tick={{ fontSize: 11, fill: '#64748B' }} 
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748B' }} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(val) => `RM${val}`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [`RM ${Number(value).toFixed(2)}`, name]}
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      borderRadius: '8px', 
                      border: 'none', 
                      color: '#FFFFFF',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: '#FFFFFF' }}
                    labelStyle={{ fontWeight: 'bold', color: '#94A3B8', marginBottom: '4px' }}
                  />
                  <Bar dataKey="Kutipan" fill="#2563EB" radius={[4, 4, 0, 0]} name="Kutipan (RM)" maxBarSize={32} />
                  <Bar dataKey="Tertunggak" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Tertunggak (RM)" maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400">
              <DollarSign className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Tiada Data Rekod Yuran</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Carta trend kutipan akan dijana secara automatik mengikut data sebenar apabila rekod yuran wujud.
              </p>
            </div>
          )}
        </div>

        {/* Chart 2: Analisis Kehadiran Pelajar Mengikut Subjek Kelas */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  Statistik & Kadar Kehadiran Pelajar (%)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Peratusan kehadiran pelajar mengikut pecahan subjek & kelas berjadual
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                % Hadir
              </span>
            </div>
          </div>

          {attendanceData.some(d => d.totalRecorded > 0) ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="subjek" 
                    tick={{ fontSize: 10, fill: '#64748B' }} 
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 11, fill: '#64748B' }} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any, item: any) => {
                      if (name === 'PeratusHadir') {
                        return [`${value}% (Hadir: ${item.payload.Hadir}, Tidak: ${item.payload.TidakHadir})`, 'Kadar Kehadiran'];
                      }
                      return [value, name];
                    }}
                    labelFormatter={(_label, payload) => {
                      return payload && payload[0] ? payload[0].payload.namaPenuh : '';
                    }}
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      borderRadius: '8px', 
                      border: 'none', 
                      color: '#FFFFFF',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: '#FFFFFF' }}
                    labelStyle={{ fontWeight: 'bold', color: '#94A3B8', marginBottom: '4px' }}
                  />
                  <Bar 
                    dataKey="PeratusHadir" 
                    fill="#059669" 
                    radius={[4, 4, 0, 0]} 
                    name="PeratusHadir"
                    maxBarSize={32} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400">
              <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Belum Ada Rekod Kehadiran Direkodkan</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Peratusan kehadiran akan dipaparkan secara automatik mengikut data sebenar setelah anda mengambil kehadiran sesi.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Main Grid: Today's Classes & Pending Fee Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Sesi Kelas Hari Ini (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-700" />
              Jadual Kelas Hari Ini ({todayDayName})
            </h2>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs text-blue-700 hover:underline font-medium flex items-center gap-1"
            >
              Lihat Semua Jadual
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {todayClasses.length > 0 ? (
              todayClasses.map(cls => {
                const enrolled = students.filter(s => s.registeredClassIds.includes(cls.id));
                const attendanceToday = attendance.filter(a => a.classId === cls.id && a.date === todayDateStr);
                const isAttendanceTaken = attendanceToday.length > 0;

                return (
                  <div key={cls.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/60 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-700">{cls.subject}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-600 font-medium">{cls.level}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono text-slate-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {cls.startTime} - {cls.endTime}
                        </span>
                        <span>·</span>
                        <span>{cls.tutorName}</span>
                        <span>·</span>
                        <span>{cls.room}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {enrolled.length} pelajar berdaftar (Kapasiti: {cls.maxCapacity})
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {isAttendanceTaken ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Kehadiran Selesai ({attendanceToday.filter(a => a.status === 'present').length}/{enrolled.length})
                        </span>
                      ) : (
                        <button
                          onClick={() => onTakeAttendance(cls.id)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ambil Kehadiran
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400">
                <p className="text-sm font-medium">Tiada kelas dijadualkan pada hari {todayDayName}.</p>
                <p className="text-xs mt-1">Anda boleh melihat jadual hari lain atau menambah kelas baru.</p>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Buka Jadual Penuh
                </button>
              </div>
            )}
          </div>

          {/* Subjek & Tingkatan Distribution Strip */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Subjek Tuisyen Yang Ditawarkan ({classes.length} Kelas)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {classes.map(cls => (
                <div key={cls.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-800 block truncate">{cls.subject}</span>
                  <span className="text-[11px] text-slate-500 block">{cls.level}</span>
                  <span className="font-mono text-[11px] text-blue-700 font-medium block mt-1">
                    RM {cls.feePerMonth}/bln
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Peringatan Yuran WhatsApp Pantas (1 Col) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Tunggakan Yuran Segera
            </h2>
            <button
              onClick={() => setActiveTab('fees')}
              className="text-xs text-blue-700 hover:underline font-medium"
            >
              Semua Yuran
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {outstandingPayments.length > 0 ? (
              outstandingPayments.map(payment => {
                const student = students.find(s => s.id === payment.studentId);
                if (!student) return null;

                const balance = payment.amountDue - payment.amountPaid;
                const waUrl = generateFeeReminderWhatsAppUrl(student, payment, settings);

                return (
                  <div key={payment.id} className="p-4 hover:bg-slate-50/60 transition-colors space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-slate-900 text-xs">{student.name}</div>
                        <div className="text-[11px] text-slate-500">{student.level}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{student.parentPhone}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-rose-700 text-xs block">
                          RM {balance.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">Tertunggak</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onViewReceipt(payment, student)}
                        className="text-[11px] text-blue-700 hover:underline font-medium"
                      >
                        Lihat Invois
                      </button>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-700" />
                        Peringatan WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Tiada Tunggakan Yuran</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Semua pelajar telah menjelaskan yuran bagi bulan ini.</p>
              </div>
            )}
          </div>

          {/* Maklumat Akaun Bank Pusat Tuisyen */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs space-y-1.5">
            <span className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider block">
              Maklumat Akaun Rasmi (Untuk Ibu Bapa)
            </span>
            <p className="font-bold text-slate-900">{settings.bankName}</p>
            <p className="font-mono font-semibold text-slate-800 text-sm tracking-wider">{settings.accountNumber}</p>
            <p className="text-slate-500 text-[11px]">Nama: {settings.accountHolder}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
