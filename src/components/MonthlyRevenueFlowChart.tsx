import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  AreaChart, 
  BarChart, 
  LineChart, 
  Area, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Target, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt, 
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import { PaymentRecord, Student } from '../types';
import { formatMonthNameMalay } from '../utils/whatsapp';

interface MonthlyRevenueFlowChartProps {
  payments: PaymentRecord[];
  students: Student[];
  onNavigateToFees?: () => void;
}

type ChartMode = 'flow' | 'comparison' | 'rate';
type TimeframeOption = 'all' | '6m' | '3m';

export const MonthlyRevenueFlowChart: React.FC<MonthlyRevenueFlowChartProps> = ({
  payments,
  students,
  onNavigateToFees
}) => {
  const [chartMode, setChartMode] = useState<ChartMode>('flow');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('6m');

  // Compute monthly data aggregated from real payments
  const allMonthlyData = useMemo(() => {
    // Unique months sorted chronologically
    const months = Array.from(new Set(payments.map(p => p.month))).sort();

    return months.map((m, idx) => {
      const mPayments = payments.filter(p => p.month === m);
      const target = mPayments.reduce((sum, p) => sum + p.amountDue, 0);
      const collected = mPayments.reduce((sum, p) => sum + p.amountPaid, 0);
      const outstanding = Math.max(0, target - collected);
      const rate = target > 0 ? Math.round((collected / target) * 100) : 0;
      const paidStudentsCount = mPayments.filter(p => p.status === 'paid').length;
      const totalInvoices = mPayments.length;

      // Extract Malay short label, e.g. "Okt 2026"
      const fullName = formatMonthNameMalay(m);
      const parts = fullName.split(' ');
      const shortName = parts.length >= 2 
        ? `${parts[0].substring(0, 3)} '${parts[1].slice(-2)}` 
        : fullName;

      return {
        monthKey: m,
        fullName,
        shortName,
        Kutipan: collected,
        Sasaran: target,
        Tertunggak: outstanding,
        KadarKutipan: rate,
        paidStudentsCount,
        totalInvoices,
        index: idx
      };
    });
  }, [payments]);

  // Apply timeframe filter
  const chartData = useMemo(() => {
    if (timeframe === '3m') {
      return allMonthlyData.slice(-3);
    }
    if (timeframe === '6m') {
      return allMonthlyData.slice(-6);
    }
    return allMonthlyData;
  }, [allMonthlyData, timeframe]);

  // Derived financial KPI metrics
  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, d) => sum + d.Kutipan, 0);
  }, [chartData]);

  const totalTarget = useMemo(() => {
    return chartData.reduce((sum, d) => sum + d.Sasaran, 0);
  }, [chartData]);

  const avgMonthlyRevenue = useMemo(() => {
    return chartData.length > 0 ? Math.round(totalRevenue / chartData.length) : 0;
  }, [totalRevenue, chartData]);

  const bestMonth = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((prev, curr) => (curr.Kutipan > prev.Kutipan ? curr : prev), chartData[0]);
  }, [chartData]);

  // Month-over-month (MoM) growth between the last two months
  const momGrowth = useMemo(() => {
    if (chartData.length < 2) return null;
    const last = chartData[chartData.length - 1].Kutipan;
    const prev = chartData[chartData.length - 2].Kutipan;
    if (prev === 0) return last > 0 ? 100 : 0;
    return Math.round(((last - prev) / prev) * 100);
  }, [chartData]);

  const latestMonth = chartData.length > 0 ? chartData[chartData.length - 1] : null;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-slate-700/60 text-xs min-w-[210px] space-y-2">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span className="font-bold text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {data.fullName}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {data.KadarKutipan}% Lunas
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between items-center text-emerald-400">
              <span className="text-slate-400 font-sans">Kutipan Diterima:</span>
              <span className="font-bold">RM {data.Kutipan.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-rose-400">
              <span className="text-slate-400 font-sans">Tertunggak:</span>
              <span className="font-bold">RM {data.Tertunggak.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300 border-t border-slate-800 pt-1">
              <span className="text-slate-400 font-sans">Sasaran Yuran:</span>
              <span className="font-bold">RM {data.Sasaran.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between font-sans">
            <span>Status Pelajar:</span>
            <span className="text-slate-200 font-medium">
              {data.paidStudentsCount} / {data.totalInvoices} bayar penuh
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
      {/* Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title & Tag */}
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100/80 text-blue-700 rounded-lg shadow-xs">
                <TrendingUp className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                    Aliran Kutipan & Trend Pendapatan Yuran
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Masa Nyata
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualisasi aliran tunai kutipan sebenar, sasaran invois, dan kecekapan kutipan bulanan.
                </p>
              </div>
            </div>
          </div>

          {/* Control Buttons (Chart Mode & Timeframe) */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Timeframe Filter */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setTimeframe('3m')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  timeframe === '3m'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                3 Bulan
              </button>
              <button
                onClick={() => setTimeframe('6m')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  timeframe === '6m'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                6 Bulan
              </button>
              <button
                onClick={() => setTimeframe('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  timeframe === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Semua
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setChartMode('flow')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  chartMode === 'flow'
                    ? 'bg-blue-700 text-white font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
                title="Papar Aliran Tunai Gelombang (Area Chart)"
              >
                <span>Aliran Cerun</span>
              </button>

              <button
                onClick={() => setChartMode('comparison')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  chartMode === 'comparison'
                    ? 'bg-blue-700 text-white font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
                title="Papar Perbandingan Bar Kutipan vs Tertunggak"
              >
                <span>Kutipan vs Sasaran</span>
              </button>

              <button
                onClick={() => setChartMode('rate')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  chartMode === 'rate'
                    ? 'bg-blue-700 text-white font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
                title="Papar Peratus Kadar Kutipan (%)"
              >
                <span>Kadar %</span>
              </button>
            </div>

          </div>

        </div>

        {/* 4 Financial KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          
          {/* Card 1: Jumlah Kutipan */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Jumlah Terkumpul</span>
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 mt-1">
              RM {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
              Daripada sasaran RM {totalTarget.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
          </div>

          {/* Card 2: Purata Kutipan Sebulan */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Purata Sebulan</span>
              <Target className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 mt-1">
              RM {avgMonthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              <span className="text-xs text-slate-400 font-normal"> /bln</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Purata aliran tunai bulanan
            </div>
          </div>

          {/* Card 3: Bulan Puncak (Best Month) */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Bulan Tertinggi</span>
              <Award className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate">
              {bestMonth ? bestMonth.fullName : '-'}
            </div>
            <div className="text-[10px] font-mono font-semibold text-emerald-700 mt-0.5">
              {bestMonth ? `RM ${bestMonth.Kutipan.toLocaleString('en-US', { minimumFractionDigits: 0 })} dikutip` : '-'}
            </div>
          </div>

          {/* Card 4: MoM Growth / Prestasi Bulan Terkini */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Pertumbuhan MoM</span>
              {momGrowth !== null && momGrowth >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-rose-600" />
              )}
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-lg sm:text-xl font-bold font-mono ${
                momGrowth === null ? 'text-slate-900' :
                momGrowth >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                {momGrowth !== null ? `${momGrowth > 0 ? '+' : ''}${momGrowth}%` : '-'}
              </span>
              <span className="text-[10px] text-slate-400">vs bln lalu</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
              Bulan kini: {latestMonth ? `${latestMonth.KadarKutipan}% selesai` : '-'}
            </div>
          </div>

        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="p-5 sm:p-6">
        {chartData.length > 0 ? (
          <div>
            
            {/* Chart Legend & Context Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-4">
              <div className="flex items-center gap-4 text-[11px]">
                {chartMode === 'flow' && (
                  <>
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block shadow-xs" />
                      Aliran Kutipan Sebenar (RM)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-3 h-0.5 bg-amber-500 inline-block" />
                      Purata Kutipan (RM {avgMonthlyRevenue})
                    </span>
                  </>
                )}

                {chartMode === 'comparison' && (
                  <>
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block shadow-xs" />
                      Kutipan Diterima (RM)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block shadow-xs" />
                      Tertunggak (RM)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-3 h-0.5 bg-slate-400 inline-block border-t border-dashed" />
                      Sasaran Invois
                    </span>
                  </>
                )}

                {chartMode === 'rate' && (
                  <>
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block shadow-xs" />
                      Kadar Kutipan (%)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-3 h-0.5 bg-rose-400 inline-block border-t border-dashed" />
                      Ambang Sasaran KPI (90%)
                    </span>
                  </>
                )}
              </div>

              {onNavigateToFees && (
                <button
                  onClick={onNavigateToFees}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                >
                  <span>Buka Pengurusan Yuran Penuh</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Recharts Canvas */}
            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                
                {chartMode === 'flow' ? (
                  <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueFlowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="shortName" 
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
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Average reference line */}
                    {avgMonthlyRevenue > 0 && (
                      <ReferenceLine 
                        y={avgMonthlyRevenue} 
                        stroke="#F59E0B" 
                        strokeDasharray="4 4" 
                        strokeWidth={1.5}
                        label={{ 
                          value: `Purata RM${avgMonthlyRevenue}`, 
                          position: 'top', 
                          fill: '#B45309', 
                          fontSize: 10,
                          fontWeight: 600
                        }} 
                      />
                    )}

                    <Area 
                      type="monotone" 
                      dataKey="Kutipan" 
                      stroke="#2563EB" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#revenueFlowGradient)"
                      activeDot={{ r: 6, stroke: '#1E40AF', strokeWidth: 2, fill: '#FFFFFF' }}
                      name="Kutipan Diterima"
                    />
                  </AreaChart>
                ) : chartMode === 'comparison' ? (
                  <ComposedChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="shortName" 
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
                    <Tooltip content={<CustomTooltip />} />
                    
                    <Bar 
                      dataKey="Kutipan" 
                      fill="#2563EB" 
                      radius={[4, 4, 0, 0]} 
                      name="Kutipan (RM)" 
                      maxBarSize={28} 
                    />
                    <Bar 
                      dataKey="Tertunggak" 
                      fill="#F43F5E" 
                      radius={[4, 4, 0, 0]} 
                      name="Tertunggak (RM)" 
                      maxBarSize={28} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Sasaran" 
                      stroke="#0F172A" 
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      dot={{ r: 3, fill: '#0F172A' }}
                      name="Sasaran Yuran" 
                    />
                  </ComposedChart>
                ) : (
                  <LineChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="shortName" 
                      tick={{ fontSize: 11, fill: '#64748B' }} 
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
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* 90% KPI target line */}
                    <ReferenceLine 
                      y={90} 
                      stroke="#EF4444" 
                      strokeDasharray="4 4" 
                      strokeWidth={1.5}
                      label={{ 
                        value: 'Sasaran KPI 90%', 
                        position: 'insideTopRight', 
                        fill: '#DC2626', 
                        fontSize: 10,
                        fontWeight: 600
                      }} 
                    />

                    <Line 
                      type="monotone" 
                      dataKey="KadarKutipan" 
                      stroke="#059669" 
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#10B981', stroke: '#065F46', strokeWidth: 2 }}
                      activeDot={{ r: 7 }}
                      name="Kadar Kutipan (%)" 
                    />
                  </LineChart>
                )}

              </ResponsiveContainer>
            </div>

            {/* Month-by-Month Flow Breakdown Strip */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 tracking-tight flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-blue-600" />
                  Pecahan Aliran Kutipan Setiap Bulan
                </span>
                <span className="text-[11px] text-slate-400">
                  {chartData.length} bulan dipaparkan
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {chartData.map((item) => {
                  const isFullyCollected = item.KadarKutipan >= 100;
                  const isHighCollection = item.KadarKutipan >= 85;

                  return (
                    <div 
                      key={item.monthKey} 
                      className="p-3 bg-slate-50/70 hover:bg-slate-100/80 transition-colors rounded-xl border border-slate-200/60"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-800">{item.fullName.split(' ')[0]}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isFullyCollected ? 'bg-emerald-100 text-emerald-800' :
                          isHighCollection ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.KadarKutipan}%
                        </span>
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm mt-1">
                        RM {item.Kutipan.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate flex justify-between">
                        <span>Sasaran:</span>
                        <span className="font-mono">RM {item.Sasaran.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <DollarSign className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Tiada Data Rekod Yuran Ditemui</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Carta aliran kutipan bulanan akan terhasil secara automatik sebaik sahaja invois yuran dijana atau direkodkan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
