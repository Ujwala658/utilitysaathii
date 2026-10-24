/**
 * Utility Saathi - Usage Analytics & Pan-India State Maps View
 * Visualizes 6-Month Electricity & Water Trends with Recharts.
 * Features an Interactive Pan-India State Utility Map, Tariff Comparisons,
 * and Sustainable Indian Wonders with a rich, vibrant multi-color Indian palette.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts';
import {
  Zap,
  Droplets,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Info,
  Sun,
  Flame,
  Compass,
  Landmark,
  Layers,
  ArrowUpRight,
  Award,
  MapPin,
  BarChart3
} from 'lucide-react';
import { IndiaStateUtilityMap } from './IndiaStateUtilityMap';

// 6-Month Historical Data with Peak Anomaly Context
interface MonthlyUsageRecord {
  month: string;
  shortMonth: string;
  season: 'Summer' | 'Monsoon' | 'Festive Autumn';
  indianSeason: string;
  electricityKwh: number;
  electricityCost: number;
  waterKl: number;
  waterCost: number;
  totalCost: number;
  elecIsPeak: boolean;
  waterIsPeak: boolean;
  peakReason?: string;
  landmarkComparison: string;
}

const SIX_MONTH_DATA: MonthlyUsageRecord[] = [
  {
    month: 'May 2024',
    shortMonth: 'May',
    season: 'Summer',
    indianSeason: 'Greeshma (Summer Heat)',
    electricityKwh: 215,
    electricityCost: 1720,
    waterKl: 24.5,
    waterCost: 318,
    totalCost: 2038,
    elecIsPeak: true,
    waterIsPeak: true,
    peakReason: 'Extreme summer temperatures; Dual AC units running ~7.5 hrs/night plus evaporative water replenishment.',
    landmarkComparison: 'Matches peak summer cooling at Kempegowda T2 eco-canopy'
  },
  {
    month: 'Jun 2024',
    shortMonth: 'Jun',
    season: 'Summer',
    indianSeason: 'Greeshma / Early Varsha',
    electricityKwh: 198,
    electricityCost: 1584,
    waterKl: 20.2,
    waterCost: 262,
    totalCost: 1846,
    elecIsPeak: false,
    waterIsPeak: false,
    peakReason: 'Warm afternoons with sporadic pre-monsoon showers moderating late evening temperatures.',
    landmarkComparison: 'Similar to a heritage haveli courtyard temperature drop'
  },
  {
    month: 'Jul 2024',
    shortMonth: 'Jul',
    season: 'Monsoon',
    indianSeason: 'Varsha (Bengaluru Monsoon)',
    electricityKwh: 154,
    electricityCost: 1232,
    waterKl: 15.4,
    waterCost: 200,
    totalCost: 1432,
    elecIsPeak: false,
    waterIsPeak: false,
    peakReason: 'Pleasant natural breeze; AC remained switched off 24 days. Rainwater harvesting offset garden tap needs.',
    landmarkComparison: 'Clean rainwater harvesting like Rani ki Vav stepwell'
  },
  {
    month: 'Aug 2024',
    shortMonth: 'Aug',
    season: 'Monsoon',
    indianSeason: 'Varsha (Optimal Baseline)',
    electricityKwh: 148,
    electricityCost: 1184,
    waterKl: 14.8,
    waterCost: 192,
    totalCost: 1376,
    elecIsPeak: false,
    waterIsPeak: false,
    peakReason: 'Lowest baseline month across the 6-month period. Highly efficient appliances and cool overcast skies.',
    landmarkComparison: 'Super energy-efficient like Cochin 100% Solar Airport'
  },
  {
    month: 'Sep 2024',
    shortMonth: 'Sep',
    season: 'Festive Autumn',
    indianSeason: 'Sharad (Post-Monsoon Warmth)',
    electricityKwh: 172,
    electricityCost: 1376,
    waterKl: 17.6,
    waterCost: 228,
    totalCost: 1604,
    elecIsPeak: false,
    waterIsPeak: false,
    peakReason: 'Moderate humidity following monsoon retreat; increased ceiling fan and refrigerator compressor duty cycle.',
    landmarkComparison: 'Balanced energy profile like Udaipur Solar Island'
  },
  {
    month: 'Oct 2024',
    shortMonth: 'Oct',
    season: 'Festive Autumn',
    indianSeason: 'Sharad (Diwali / Dussehra Prep)',
    electricityKwh: 242,
    electricityCost: 1936,
    waterKl: 22.8,
    waterCost: 296,
    totalCost: 2232,
    elecIsPeak: true,
    waterIsPeak: true,
    peakReason: 'Festive family hosting, deep house cleaning, festive lighting strands, plus utility billing cycle catch-up.',
    landmarkComparison: 'Illumination spikes comparable to Mysuru Palace festive lighting'
  }
];

// Tariff breakdown buckets for Pie Chart
const TARIFF_SLAB_BREAKDOWN = [
  { name: 'Lifeline Tier (0-50 kWh)', units: 50, amount: 237.5, color: '#10b981' }, // Krishna Emerald
  { name: 'Tier 2 (51-100 kWh)', units: 50, amount: 350.0, color: '#0ea5e9' }, // Peacock Cyan
  { name: 'Slab 3 (>100 kWh Peak)', units: 142, amount: 1136.0, color: '#f59e0b' }, // Marigold Amber
  { name: 'Fixed Capacity Charge', units: 0, amount: 110.0, color: '#8b5cf6' }, // Gulal Violet
  { name: 'FAC Fuel Adjustment + Tax', units: 0, amount: 102.5, color: '#f43f5e' } // Lotus Ruby
];

// Sustainable Indian Attractions & Civic Wonders
interface IndianAttraction {
  id: string;
  name: string;
  state: string;
  tagline: string;
  themeColor: string;
  textColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  statLabel: string;
  statValue: string;
  description: string;
  ecoTip: string;
}

const INDIAN_ATTRACTIONS: IndianAttraction[] = [
  {
    id: 'cochin-airport',
    name: 'Cochin International Airport (CIAL)',
    state: 'Kochi, Kerala',
    tagline: "World's First 100% Solar Powered Airport",
    themeColor: 'from-emerald-700 via-teal-800 to-cyan-900',
    textColor: 'text-emerald-300',
    borderColor: 'border-emerald-300/40',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    badgeText: 'UN Champion of the Earth',
    statLabel: 'Daily Solar Production',
    statValue: '50,000+ kWh/day',
    description:
      'With over 46,000 ground-mounted solar panels, CIAL produces zero net grid emissions. Your home’s 6-month energy savings (340 kWh) mirrors the clean aviation standard pioneered in South India.',
    ecoTip: 'Running solar net-metering on your roof can turn your electricity bill to zero just like CIAL.'
  },
  {
    id: 'modhera-village',
    name: 'Modhera Sun Temple & Solar Village',
    state: 'Mehsana, Gujarat',
    tagline: "India's 1st Round-the-Clock Solar Village",
    themeColor: 'from-amber-600 via-orange-700 to-rose-900',
    textColor: 'text-amber-300',
    borderColor: 'border-amber-300/40',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    badgeText: '24x7 Solar Powered',
    statLabel: 'Community Solar Adoption',
    statValue: '100% Rooftops',
    description:
      'Ancient 11th-century Sun Temple architecture married with a modern 6 MW solar battery storage system. Residents now earn surplus income from their DISCOM instead of paying power bills.',
    ecoTip: 'Shifting washing machines to 12 PM - 3 PM captures peak rooftop solar generation.'
  },
  {
    id: 'kempegowda-t2',
    name: 'Kempegowda T2: Terminal in a Garden',
    state: 'Bengaluru, Karnataka',
    tagline: 'IGBC Platinum 100% Renewable Terminal',
    themeColor: 'from-teal-800 via-emerald-800 to-slate-900',
    textColor: 'text-teal-300',
    borderColor: 'border-teal-300/40',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    badgeText: 'Zero-Waste & Green Rainwater',
    statLabel: 'Water Recycling Rate',
    statValue: '100% Harvested',
    description:
      'Built with engineered bamboo and indigenous flora, Bengaluru’s airport terminal harvests millions of litres of monsoon rain to sustain indoor rainforest gardens with zero municipal groundwater extraction.',
    ecoTip: 'Setting low-flow aerators on taps in Indiranagar cuts 400 litres of water weekly.'
  },
  {
    id: 'bhadla-solar',
    name: 'Bhadla Solar Park',
    state: 'Phalodi, Rajasthan',
    tagline: "World's Largest Operational Solar Farm (2,245 MW)",
    themeColor: 'from-orange-700 via-amber-700 to-red-900',
    textColor: 'text-amber-300',
    borderColor: 'border-orange-400/40',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    badgeText: '14,000 Acres Desert Wonder',
    statLabel: 'Total Capacity',
    statValue: '2,245 MW',
    description:
      'Nestled in the scorching Thar Desert where summer temperatures touch 50°C, Bhadla harnesses fierce desert sunlight to power over 4.5 million Indian homes cleanly.',
    ecoTip: 'Rooftop solar in high-irradiation northern states generates over 5 units/kW daily.'
  }
];

export const UsageAnalyticsView: React.FC = () => {
  const { setActiveTab } = useApp();

  const [viewSection, setViewSection] = useState<'all' | 'maps' | 'trends'>('all');
  const [utilityFocus, setUtilityFocus] = useState<'both' | 'electricity' | 'water'>('both');
  const [highlightPeaks, setHighlightPeaks] = useState<boolean>(true);
  const [selectedAttractionId, setSelectedAttractionId] = useState<string>('cochin-airport');

  // Compute 6-month averages
  const avgElec = Math.round(
    SIX_MONTH_DATA.reduce((acc, d) => acc + d.electricityKwh, 0) / SIX_MONTH_DATA.length
  );
  const avgWater = Number(
    (SIX_MONTH_DATA.reduce((acc, d) => acc + d.waterKl, 0) / SIX_MONTH_DATA.length).toFixed(1)
  );

  const ELEC_PEAK_THRESHOLD = 190; // kWh

  const activeAttraction =
    INDIAN_ATTRACTIONS.find(a => a.id === selectedAttractionId) || INDIAN_ATTRACTIONS[0];

  // Custom Tooltip for Recharts
  const CustomRechartsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = SIX_MONTH_DATA.find(d => d.shortMonth === label || d.month === label);
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl border border-slate-700 shadow-xl text-xs space-y-2 backdrop-blur-md max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span className="font-bold text-slate-100">{dataPoint?.month || label}</span>
            <span className="text-[10px] text-amber-300 font-mono font-bold">{dataPoint?.indianSeason}</span>
          </div>

          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              const isElec = entry.dataKey === 'electricityKwh';
              const isWater = entry.dataKey === 'waterKl';
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 font-bold" style={{ color: entry.color }}>
                    {isElec && <Zap className="w-3.5 h-3.5" />}
                    {isWater && <Droplets className="w-3.5 h-3.5" />}
                    <span>{entry.name}:</span>
                  </span>
                  <span className="font-mono font-black text-white">
                    {entry.value} {isElec ? 'kWh' : isWater ? 'kL' : '₹'}
                  </span>
                </div>
              );
            })}
          </div>

          {dataPoint?.elecIsPeak && (
            <div className="pt-1.5 border-t border-slate-800 text-[10px] text-rose-300 flex items-start gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
              <span>{dataPoint.peakReason}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header with Multi-Color Badges & 3-Way Section Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Usage Analytics & State Maps
            </h1>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
              Pan-India Civic Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Compare electricity and water consumption trends across 6 billing cycles, and explore state-by-state utility tariffs,
            solar powerparks, and green civic attractions across Indian states.
          </p>
        </div>

        {/* 3-WAY SECTION SWITCHER: Multi-Colored Vibrant Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold shadow-2xs self-start lg:self-auto">
          <button
            onClick={() => setViewSection('all')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewSection === 'all'
                ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>All Features</span>
          </button>
          <button
            onClick={() => setViewSection('maps')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewSection === 'maps'
                ? 'bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>State Utility Maps (7 States)</span>
          </button>
          <button
            onClick={() => setViewSection('trends')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewSection === 'trends'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>6-Month Recharts</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: PAN-INDIA STATE UTILITY MAPS */}
      {(viewSection === 'all' || viewSection === 'maps') && (
        <div className="space-y-4">
          <IndiaStateUtilityMap />
        </div>
      )}

      {/* SECTION 2: 6-MONTH CONSUMPTION TRENDS & RECHARTS */}
      {(viewSection === 'all' || viewSection === 'trends') && (
        <div className="space-y-6">
          {/* Section Divider / Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-purple-100 text-purple-800">
                  <TrendingUp className="w-4 h-4 text-purple-700" />
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  Home 6-Month Consumption Trends (Recharts)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Electricity (kWh) and water (kL) trajectory with peak season threshold lines.
              </p>
            </div>

            {/* Utility Filter & Peak Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setUtilityFocus('both')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    utilityFocus === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Combined</span>
                </button>
                <button
                  onClick={() => setUtilityFocus('electricity')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    utilityFocus === 'electricity' ? 'bg-white text-amber-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Electricity</span>
                </button>
                <button
                  onClick={() => setUtilityFocus('water')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    utilityFocus === 'water' ? 'bg-white text-cyan-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Water</span>
                </button>
              </div>

              <button
                onClick={() => setHighlightPeaks(!highlightPeaks)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  highlightPeaks
                    ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className={`w-3.5 h-3.5 ${highlightPeaks ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>{highlightPeaks ? 'Peak Highlight ON' : 'Highlight Peaks'}</span>
              </button>
            </div>
          </div>

          {/* 4 Multi-Color Scorecards with Vibrant Saffron, Azure, Rose, and Amethyst */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Electricity - Vibrant Saffron & Gold */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/15 p-4.5 rounded-2xl border border-amber-300 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
                <span>Avg Monthly Electricity</span>
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-950 font-mono">{avgElec}</span>
                <span className="text-xs text-amber-800 font-bold">kWh / month</span>
              </div>
              <p className="text-[11px] text-amber-900 font-medium">
                Baseline: 148 kWh (Aug) · Peak: 242 kWh (Oct)
              </p>
            </div>

            {/* Card 2: Water - Royal Azure & Cyan */}
            <div className="bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-blue-500/15 p-4.5 rounded-2xl border border-sky-300 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-sky-900 font-bold">
                <span>Avg Monthly Water</span>
                <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                  <Droplets className="w-4 h-4 fill-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-sky-950 font-mono">{avgWater}</span>
                <span className="text-xs text-sky-800 font-bold">kL (~19,000 L)</span>
              </div>
              <p className="text-[11px] text-sky-900 font-medium">
                Baseline: 14.8 kL (Aug) · Peak: 24.5 kL (May)
              </p>
            </div>

            {/* Card 3: High-Usage Periods - Ruby Rose */}
            <div className="bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-red-500/15 p-4.5 rounded-2xl border border-rose-300 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-rose-900 font-bold">
                <span>High Usage Periods</span>
                <span className="px-2 py-0.5 bg-rose-500 text-white font-extrabold rounded-full text-[10px]">
                  2 Detected
                </span>
              </div>
              <div className="text-xl font-black text-rose-950 font-mono">
                May & Oct 2024
              </div>
              <p className="text-[11px] text-rose-900 font-medium leading-tight">
                Summer heat AC surge (+29%) & Diwali prep (+31%).
              </p>
            </div>

            {/* Card 4: Potential Avoidable Cost - Royal Amethyst */}
            <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-violet-500/15 p-4.5 rounded-2xl border border-purple-300 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-purple-900 font-bold">
                <span>Avoidable Surge Cost</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-purple-950 font-mono">
                ₹1,180
              </div>
              <p className="text-[11px] text-purple-900 font-medium leading-tight">
                Achievable with 24°C AC setpoint and tap aerators.
              </p>
            </div>
          </div>

          {/* DUAL UTILITY AREA CHART */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  6-Month Trajectory & Peak Anomaly Line
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hover to inspect monthly kWh, kL, and seasonal climatic drivers.
                </p>
              </div>

              {/* Multi-Color Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-amber-700">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 inline-block" />
                  <span>Electricity (kWh)</span>
                </div>
                <div className="flex items-center gap-1.5 text-sky-700">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 inline-block" />
                  <span>Water (kL)</span>
                </div>
                {highlightPeaks && (
                  <div className="flex items-center gap-1.5 text-rose-600">
                    <span className="w-3 h-0.5 bg-rose-500 inline-block border-t border-dashed border-rose-500" />
                    <span>Surge Threshold (&gt;190 kWh)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SIX_MONTH_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="elecColorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0.02} />
                    </linearGradient>

                    <linearGradient id="waterColorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="shortMonth"
                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    label={{ value: 'Electricity (kWh)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                  />
                  {utilityFocus === 'both' && (
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 40]}
                      tick={{ fill: '#0284c7', fontSize: 11 }}
                      axisLine={{ stroke: '#bae6fd' }}
                      tickLine={false}
                      label={{ value: 'Water (kL)', angle: 90, position: 'insideRight', fill: '#0284c7', fontSize: 10 }}
                    />
                  )}

                  <Tooltip content={<CustomRechartsTooltip />} />

                  {highlightPeaks && (
                    <ReferenceLine
                      yAxisId="left"
                      y={ELEC_PEAK_THRESHOLD}
                      stroke="#f43f5e"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      label={{
                        value: 'High Consumption Surge Threshold (190 kWh)',
                        fill: '#e11d48',
                        fontSize: 10,
                        fontWeight: 700,
                        position: 'top'
                      }}
                    />
                  )}

                  {(utilityFocus === 'both' || utilityFocus === 'electricity') && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="electricityKwh"
                      name="Electricity"
                      stroke="#ea580c"
                      strokeWidth={3.5}
                      fillOpacity={1}
                      fill="url(#elecColorGradient)"
                      activeDot={{ r: 6, fill: '#ea580c', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  )}

                  {(utilityFocus === 'both' || utilityFocus === 'water') && (
                    <Area
                      yAxisId={utilityFocus === 'both' ? 'right' : 'left'}
                      type="monotone"
                      dataKey="waterKl"
                      name="Water"
                      stroke="#0284c7"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#waterColorGradient)"
                      activeDot={{ r: 6, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TWO-COLUMN CHARTS: Bar Chart & Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 2: Month-over-Month Bar Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Monthly Electricity Units (kWh)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Color-coded: Emerald (Optimal), Amber (Moderate), Ruby (Peak Surge).
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  6 Cycles
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SIX_MONTH_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="shortMonth" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Bar dataKey="electricityKwh" name="Electricity" radius={[8, 8, 0, 0]}>
                      {SIX_MONTH_DATA.map((entry, index) => {
                        let barColor = '#10b981'; // Green for normal
                        if (entry.electricityKwh > ELEC_PEAK_THRESHOLD) {
                          barColor = '#f43f5e'; // Red for peak surge
                        } else if (entry.electricityKwh > 170) {
                          barColor = '#f59e0b'; // Amber for moderate-high
                        }
                        return <Cell key={`cell-${index}`} fill={barColor} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] font-bold pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Optimal (&lt;170 kWh)
                </span>
                <span className="flex items-center gap-1.5 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Moderate (170-190 kWh)
                </span>
                <span className="flex items-center gap-1.5 text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Peak Surge (&gt;190 kWh)
                </span>
              </div>
            </div>

            {/* Chart 3: Tariff Cost Composition Donut */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    October Peak Bill Breakdown (₹1,936)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Lifeline slabs, peak slab penalties, and statutory taxes.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                  LT-2(a)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={TARIFF_SLAB_BREAKDOWN}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="amount"
                      >
                        {TARIFF_SLAB_BREAKDOWN.map((entry, index) => (
                          <Cell key={`slice-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Cost']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs">
                  {TARIFF_SLAB_BREAKDOWN.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-700 truncate font-semibold">{item.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        ₹{item.amount.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: INCREDIBLE INDIA SUSTAINABLE WONDERS */}
      {(viewSection === 'all' || viewSection === 'maps') && (
        <div className="space-y-5 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900">
                  <Landmark className="w-5 h-5 text-amber-700" />
                </span>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  Incredible India: Green Civic Wonders & Eco Landmarks
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Connect your household conservation to iconic Indian renewable landmarks and historic water architecture.
              </p>
            </div>
          </div>

          {/* 4 Attraction Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDIAN_ATTRACTIONS.map(attraction => {
              const isSelected = selectedAttractionId === attraction.id;
              return (
                <div
                  key={attraction.id}
                  onClick={() => setSelectedAttractionId(attraction.id)}
                  className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isSelected
                      ? 'ring-2 ring-amber-500 shadow-md border-amber-400 bg-gradient-to-b from-white to-amber-50/40'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${attraction.badgeBg}`}>
                        {attraction.badgeText}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{attraction.state}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-amber-900 transition-colors">
                        {attraction.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium leading-snug">
                        {attraction.tagline}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">{attraction.statLabel}</span>
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {attraction.statValue}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-amber-800">
                      {isSelected ? 'Viewing Benchmark ✓' : 'Explore Landmark →'}
                    </span>
                    <Compass className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Landmark Showcase Banner */}
          <div
            className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${activeAttraction.themeColor} text-white shadow-xl border ${activeAttraction.borderColor} space-y-4 relative overflow-hidden`}
          >
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                  {activeAttraction.badgeText}
                </span>
                <span className="text-xs text-slate-200">{activeAttraction.state}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{activeAttraction.name}</h3>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">{activeAttraction.description}</p>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center gap-3">
                  <Sun className="w-5 h-5 text-amber-300 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">Home Conservation Tip:</span>
                    <span className="text-slate-200">{activeAttraction.ecoTip}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('savings')}
                  className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <span>Simulate Solar Savings</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
