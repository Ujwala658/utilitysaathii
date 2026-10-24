/**
 * Utility Saathi - Pan-India State Utility & Eco Map Explorer
 * Interactive state-by-state utility analysis, tariff comparisons, and green attractions.
 * Vibrant multi-color palette: Saffron, Royal Purple, Peacock Blue, Lotus Pink, Golden Amber, Ruby Red.
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  MapPin,
  Zap,
  Droplets,
  Sun,
  Wind,
  Landmark,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Compass,
  Award,
  Flame,
  CheckCircle2,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export interface IndianStateProfile {
  id: string;
  code: string;
  name: string;
  region: 'South' | 'North' | 'West';
  discom: string;
  waterBoard: string;
  avgTariffPerKwh: number;
  fixedCharge: number;
  solarCapacityMw: number;
  windCapacityMw: number;
  cleanEnergySharePct: number;
  waterStressLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  peakMonth: string;
  peakDriver: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradient: string;
  landmark: {
    name: string;
    type: string;
    fact: string;
    highlight: string;
  };
  monthlyComparison: { month: string; consumptionKwh: number; costInr: number }[];
}

export const INDIAN_STATES: IndianStateProfile[] = [
  {
    id: 'karnataka',
    code: 'KA',
    name: 'Karnataka',
    region: 'South',
    discom: 'BESCOM / HESCOM / MESCOM',
    waterBoard: 'BWSSB (Cauvery Stage V)',
    avgTariffPerKwh: 7.00,
    fixedCharge: 110,
    solarCapacityMw: 8400,
    windCapacityMw: 5300,
    cleanEnergySharePct: 54,
    waterStressLevel: 'Moderate',
    peakMonth: 'October & May',
    peakDriver: 'Festival lighting, post-monsoon humidity, and IT home office AC loads.',
    primaryColor: '#059669', // Emerald
    secondaryColor: '#f59e0b', // Marigold Amber
    accentColor: '#10b981',
    gradient: 'from-emerald-600 via-teal-700 to-amber-600',
    landmark: {
      name: 'Pavagada Solar Park & Kempegowda T2',
      type: 'World-Class Renewable Hubs',
      fact: 'Pavagada generates 2,050 MW across arid Tumakuru plains; Kempegowda T2 runs on 100% renewables.',
      highlight: 'Top 3 state in total solar & wind generation capacity in India'
    },
    monthlyComparison: [
      { month: 'May', consumptionKwh: 215, costInr: 1720 },
      { month: 'Jun', consumptionKwh: 198, costInr: 1584 },
      { month: 'Jul', consumptionKwh: 154, costInr: 1232 },
      { month: 'Aug', consumptionKwh: 148, costInr: 1184 },
      { month: 'Sep', consumptionKwh: 172, costInr: 1376 },
      { month: 'Oct', consumptionKwh: 242, costInr: 1936 }
    ]
  },
  {
    id: 'rajasthan',
    code: 'RJ',
    name: 'Rajasthan',
    region: 'North',
    discom: 'JVVNL / AVVNL / JdVVNL',
    waterBoard: 'PHED Rajasthan (Indira Gandhi Canal)',
    avgTariffPerKwh: 7.10,
    fixedCharge: 125,
    solarCapacityMw: 18700,
    windCapacityMw: 4400,
    cleanEnergySharePct: 48,
    waterStressLevel: 'Severe',
    peakMonth: 'May & June',
    peakDriver: 'Severe 48°C Thar desert summer heatwaves demanding continuous air cooling.',
    primaryColor: '#ea580c', // Fiery Saffron
    secondaryColor: '#f59e0b', // Desert Gold
    accentColor: '#f97316',
    gradient: 'from-orange-600 via-amber-600 to-red-600',
    landmark: {
      name: 'Bhadla Solar Park (Phalodi)',
      type: "World's Largest Solar Farm (2,245 MW)",
      fact: 'Spans 14,000 acres in the Thar desert with over 10 million solar panels operating in 50°C heat.',
      highlight: 'National #1 in total installed solar power capacity in India'
    },
    monthlyComparison: [
      { month: 'May', consumptionKwh: 310, costInr: 2480 },
      { month: 'Jun', consumptionKwh: 295, costInr: 2360 },
      { month: 'Jul', consumptionKwh: 210, costInr: 1680 },
      { month: 'Aug', consumptionKwh: 185, costInr: 1480 },
      { month: 'Sep', consumptionKwh: 190, costInr: 1520 },
      { month: 'Oct', consumptionKwh: 175, costInr: 1400 }
    ]
  },
  {
    id: 'maharashtra',
    code: 'MH',
    name: 'Maharashtra',
    region: 'West',
    discom: 'MSEDCL / Adani / Tata Power / BEST',
    waterBoard: 'BMC Water Works & MJP',
    avgTariffPerKwh: 8.40,
    fixedCharge: 140,
    solarCapacityMw: 5200,
    windCapacityMw: 5050,
    cleanEnergySharePct: 36,
    waterStressLevel: 'Moderate',
    peakMonth: 'April & October',
    peakDriver: 'Mumbai coastal humidity spikes and industrial commercial power demands.',
    primaryColor: '#7c3aed', // Royal Purple
    secondaryColor: '#ec4899', // Pink
    accentColor: '#8b5cf6',
    gradient: 'from-purple-700 via-indigo-700 to-pink-600',
    landmark: {
      name: 'Koyna Hydro Dam & Tata Solar Lonand',
      type: 'Pioneering Clean Powerhouses',
      fact: 'Koyna is one of India’s largest pumped hydro complexes (1,960 MW) providing rapid grid stabilization.',
      highlight: 'Highest industrial & metropolitan power reliability standards'
    },
    monthlyComparison: [
      { month: 'May', consumptionKwh: 260, costInr: 2340 },
      { month: 'Jun', consumptionKwh: 230, costInr: 2070 },
      { month: 'Jul', consumptionKwh: 175, costInr: 1575 },
      { month: 'Aug', consumptionKwh: 168, costInr: 1512 },
      { month: 'Sep', consumptionKwh: 182, costInr: 1638 },
      { month: 'Oct', consumptionKwh: 250, costInr: 2250 }
    ]
  },
  {
    id: 'delhi',
    code: 'DL',
    name: 'Delhi NCR',
    region: 'North',
    discom: 'BSES Rajdhani / BSES Yamuna / TPDDL',
    waterBoard: 'Delhi Jal Board (DJB)',
    avgTariffPerKwh: 4.50, // Effective with subsidy
    fixedCharge: 90,
    solarCapacityMw: 320,
    windCapacityMw: 120,
    cleanEnergySharePct: 22,
    waterStressLevel: 'High',
    peakMonth: 'June & July',
    peakDriver: 'Peak northern heatwaves touching 47°C; grid demand tops 8,600 MW all-time high.',
    primaryColor: '#e11d48', // Ruby Rose
    secondaryColor: '#f97316', // Saffron
    accentColor: '#f43f5e',
    gradient: 'from-rose-600 via-orange-600 to-amber-600',
    landmark: {
      name: 'Akshardham Solar Canopy & Net-Zero Metro',
      type: 'Urban Rooftop Clean Transit',
      fact: 'Delhi Metro is the first metro network in the world powered 100% by solar during daytime runs.',
      highlight: 'Famous 200-Unit Lifeline Zero-Bill Scheme for residential consumers'
    },
    monthlyComparison: [
      { month: 'May', consumptionKwh: 340, costInr: 2210 },
      { month: 'Jun', consumptionKwh: 380, costInr: 2470 },
      { month: 'Jul', consumptionKwh: 320, costInr: 2080 },
      { month: 'Aug', consumptionKwh: 240, costInr: 1560 },
      { month: 'Sep', consumptionKwh: 195, costInr: 1267 },
      { month: 'Oct', consumptionKwh: 160, costInr: 800 } // Subsidy benefits
    ]
  },
  {
    id: 'gujarat',
    code: 'GJ',
    name: 'Gujarat',
    region: 'West',
    discom: 'GUVNL / DGVCL / MGVCL / Torrent',
    waterBoard: 'GWSSB (Narmada Canal Grid)',
    avgTariffPerKwh: 5.85,
    fixedCharge: 95,
    solarCapacityMw: 11400,
    windCapacityMw: 11000,
    cleanEnergySharePct: 45,
    waterStressLevel: 'Moderate',
    peakMonth: 'April & May',
    peakDriver: 'Pre-monsoon industrial cooling and rooftop agricultural feeder requirements.',
    primaryColor: '#0891b2', // Electric Cyan
    secondaryColor: '#f59e0b', // Gold
    accentColor: '#06b6d4',
    gradient: 'from-cyan-600 via-teal-600 to-amber-500',
    landmark: {
      name: 'Modhera 24x7 Solar Village & Dholera',
      type: 'Pioneering Clean Settlements',
      fact: 'Modhera Sun Temple village is 100% solar powered day and night with 6 MW battery storage.',
      highlight: 'National #1 in total combined Wind & Rooftop Solar adoption'
    },
    monthlyComparison: [
      { month: 'May', consumptionKwh: 240, costInr: 1560 },
      { month: 'Jun', consumptionKwh: 210, costInr: 1365 },
      { month: 'Jul', consumptionKwh: 165, costInr: 1072 },
      { month: 'Aug', consumptionKwh: 155, costInr: 1007 },
      { month: 'Sep', consumptionKwh: 170, costInr: 1105 },
      { month: 'Oct', consumptionKwh: 225, costInr: 1462 }
    ]
  },
  {
    id: 'kerala',
    code: 'KL',
    name: 'Kerala',
    region: 'South',
    discom: 'KSEB (Kerala State Electricity Board)',
    waterBoard: 'Kerala Water Authority (KWA)',
    avgTariffPerKwh: 6.20,
    fixedCharge: 80,
    solarCapacityMw: 1050,
    windCapacityMw: 70,
    cleanEnergySharePct: 68,
    waterStressLevel: 'Low',
    peakMonth: 'April & May',
    peakDriver: 'Summer humidity prior to early Southwest monsoon onset.',
    primaryColor: '#0284c7', // Royal Azure
    secondaryColor: '#10b981', // Krishna Green
    accentColor: '#38bdf8',
    gradient: 'from-sky-700 via-teal-700 to-emerald-700',
    landmark: {
      name: 'Cochin International Airport (CIAL)',
      type: 'World’s 1st 100% Solar-Powered Airport',
      fact: 'Has saved over 300,000 metric tons of CO2 with 46,000 solar panels under tropical palm groves.',
      highlight: 'Over 68% electricity generated from clean Western Ghats hydroelectric dams'
    },
    monthlyComparison: [
      { month: 'May', consumptionKwh: 205, costInr: 1332 },
      { month: 'Jun', consumptionKwh: 150, costInr: 975 },
      { month: 'Jul', consumptionKwh: 140, costInr: 910 },
      { month: 'Aug', consumptionKwh: 135, costInr: 877 },
      { month: 'Sep', consumptionKwh: 145, costInr: 942 },
      { month: 'Oct', consumptionKwh: 170, costInr: 1105 }
    ]
  },
  {
    id: 'tamilnadu',
    code: 'TN',
    name: 'Tamil Nadu',
    region: 'South',
    discom: 'TANGEDCO',
    waterBoard: 'CMWSSB (MetroWater & Desalination)',
    avgTariffPerKwh: 6.50,
    fixedCharge: 100,
    solarCapacityMw: 7200,
    windCapacityMw: 10200,
    cleanEnergySharePct: 51,
    waterStressLevel: 'High',
    peakMonth: 'May & June',
    peakDriver: 'Agni Nakshatram summer peak heat and Chennai coastal air-conditioning.',
    primaryColor: '#db2777', // Lotus Pink
    secondaryColor: '#3b82f6', // Indigo
    accentColor: '#ec4899',
    gradient: 'from-pink-600 via-purple-700 to-blue-600',
    landmark: {
      name: 'Muppandal Wind Farm & Kamuthi Solar',
      type: 'Mega Clean Energy Powerhouses',
      fact: 'Muppandal is one of the world’s largest operational onshore wind farms (1,500 MW).',
      highlight: 'First 100 units free bi-monthly scheme for residential consumers'
    },
    monthlyComparison: [
      { month: 'May', consumptionKwh: 275, costInr: 1787 },
      { month: 'Jun', consumptionKwh: 250, costInr: 1625 },
      { month: 'Jul', consumptionKwh: 180, costInr: 1170 },
      { month: 'Aug', consumptionKwh: 170, costInr: 1105 },
      { month: 'Sep', consumptionKwh: 190, costInr: 1235 },
      { month: 'Oct', consumptionKwh: 210, costInr: 1365 }
    ]
  }
];

export const IndiaStateUtilityMap: React.FC = () => {
  const [selectedStateId, setSelectedStateId] = useState<string>('karnataka');
  const [activeMetric, setActiveMetric] = useState<'tariff' | 'solar' | 'cleanShare'>('tariff');

  const selectedState =
    INDIAN_STATES.find(s => s.id === selectedStateId) || INDIAN_STATES[0];

  // Data for comparative bar chart across all 7 states
  const comparativeData = INDIAN_STATES.map(s => ({
    name: s.code,
    fullName: s.name,
    tariff: s.avgTariffPerKwh,
    solar: s.solarCapacityMw,
    cleanShare: s.cleanEnergySharePct,
    color: s.primaryColor
  }));

  return (
    <div className="space-y-6">
      {/* Section Header with Multi-Color Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-purple-600 to-cyan-600 p-6 rounded-3xl text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute right-3 -bottom-4 opacity-15 pointer-events-none">
          <Compass className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/25 backdrop-blur-md font-bold text-amber-100 border border-white/30">
              Interactive State Maps & Tariffs
            </span>
            <span className="text-white/90">
              Pan-India DISCOM & Renewable Benchmarks
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore Utilities & Green Attractions Across Indian States
          </h2>

          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed max-w-2xl">
            Click on any state on the map or tab below to inspect local electricity DISCOM tariffs, solar parks,
            water boards, and high-demand summer vs festive seasons across India.
          </p>
        </div>
      </div>

      {/* STATE SELECTION BAR: Vivid Multi-Color Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {INDIAN_STATES.map(st => {
          const isSelected = selectedStateId === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setSelectedStateId(st.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md border-slate-700 ring-2 ring-amber-400 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: st.primaryColor }}
              />
              <span>{st.name}</span>
              <span className="text-[10px] font-mono opacity-60">({st.code})</span>
            </button>
          );
        })}
      </div>

      {/* TWO-COLUMN GRID: Stylized Interactive SVG India State Map & State Detail Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (5 cols): Stylized SVG India Regional Map */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Pan-India Regional Grid Map</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Click any highlighted state node to explore its utility structure
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              7 Hubs
            </span>
          </div>

          {/* Stylized SVG Map Representation of India */}
          <div className="relative w-full aspect-[4/4.4] bg-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Background Map Grid & Stars */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            <svg
              viewBox="0 0 400 440"
              className="w-full h-full drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Generalized Stylized Map Silhouette of India */}
              <path
                d="M175,25 L215,25 L225,50 L255,80 L290,120 L275,145 L255,160 L280,180 L250,225 L230,280 L210,340 L195,380 L180,410 L165,370 L140,320 L135,270 L110,230 L85,210 L75,170 L105,130 L140,90 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="1.5"
                opacity="0.85"
              />

              {/* State Interactive Geo-Polygons */}

              {/* 1. RAJASTHAN (North-West) - Fiery Saffron */}
              <g
                onClick={() => setSelectedStateId('rajasthan')}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <polygon
                  points="105,120 155,100 170,140 135,175 90,160"
                  fill={selectedStateId === 'rajasthan' ? '#ea580c' : '#7c2d12'}
                  stroke="#fb923c"
                  strokeWidth={selectedStateId === 'rajasthan' ? '2.5' : '1'}
                  className="transition-all hover:fill-orange-500"
                />
                <circle cx="130" cy="135" r="5" fill="#fef08a" />
                <text x="130" y="152" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  RJ
                </text>
              </g>

              {/* 2. DELHI NCR (North) - Ruby Rose */}
              <g
                onClick={() => setSelectedStateId('delhi')}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <polygon
                  points="172,112 188,105 192,122 178,128"
                  fill={selectedStateId === 'delhi' ? '#e11d48' : '#881337'}
                  stroke="#fda4af"
                  strokeWidth={selectedStateId === 'delhi' ? '2.5' : '1'}
                  className="transition-all hover:fill-rose-500"
                />
                <circle cx="182" cy="116" r="4" fill="#ffffff" />
                <text x="182" y="100" textAnchor="middle" fill="#f43f5e" fontSize="9" fontWeight="extrabold">
                  DL
                </text>
              </g>

              {/* 3. GUJARAT (West) - Electric Cyan */}
              <g
                onClick={() => setSelectedStateId('gujarat')}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <polygon
                  points="75,170 120,175 125,215 95,230 65,200"
                  fill={selectedStateId === 'gujarat' ? '#0891b2' : '#164e63'}
                  stroke="#67e8f9"
                  strokeWidth={selectedStateId === 'gujarat' ? '2.5' : '1'}
                  className="transition-all hover:fill-cyan-500"
                />
                <circle cx="95" cy="195" r="5" fill="#67e8f9" />
                <text x="95" y="212" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  GJ
                </text>
              </g>

              {/* 4. MAHARASHTRA (West-Central) - Royal Purple */}
              <g
                onClick={() => setSelectedStateId('maharashtra')}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <polygon
                  points="125,215 190,210 215,245 160,275 125,250"
                  fill={selectedStateId === 'maharashtra' ? '#7c3aed' : '#3b0764'}
                  stroke="#c084fc"
                  strokeWidth={selectedStateId === 'maharashtra' ? '2.5' : '1'}
                  className="transition-all hover:fill-purple-500"
                />
                <circle cx="160" cy="242" r="5" fill="#e9d5ff" />
                <text x="160" y="259" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  MH
                </text>
              </g>

              {/* 5. KARNATAKA (South) - Emerald */}
              <g
                onClick={() => setSelectedStateId('karnataka')}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <polygon
                  points="135,270 175,270 185,335 150,345 135,305"
                  fill={selectedStateId === 'karnataka' ? '#059669' : '#064e3b'}
                  stroke="#6ee7b7"
                  strokeWidth={selectedStateId === 'karnataka' ? '2.5' : '1'}
                  className="transition-all hover:fill-emerald-500"
                />
                <circle cx="160" cy="305" r="5" fill="#a7f3d0" />
                <text x="160" y="322" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  KA
                </text>
              </g>

              {/* 6. KERALA (South-West Coast) - Royal Azure */}
              <g
                onClick={() => setSelectedStateId('kerala')}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <polygon
                  points="148,345 165,342 170,395 155,405"
                  fill={selectedStateId === 'kerala' ? '#0284c7' : '#082f49'}
                  stroke="#7dd3fc"
                  strokeWidth={selectedStateId === 'kerala' ? '2.5' : '1'}
                  className="transition-all hover:fill-sky-500"
                />
                <circle cx="158" cy="375" r="4" fill="#bae6fd" />
                <text x="144" y="380" textAnchor="end" fill="#38bdf8" fontSize="9" fontWeight="bold">
                  KL
                </text>
              </g>

              {/* 7. TAMIL NADU (South-East Coast) - Lotus Pink */}
              <g
                onClick={() => setSelectedStateId('tamilnadu')}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <polygon
                  points="175,330 205,335 190,395 170,390"
                  fill={selectedStateId === 'tamilnadu' ? '#db2777' : '#500724'}
                  stroke="#f472b6"
                  strokeWidth={selectedStateId === 'tamilnadu' ? '2.5' : '1'}
                  className="transition-all hover:fill-pink-500"
                />
                <circle cx="186" cy="360" r="4" fill="#fbcfe8" />
                <text x="198" y="365" textAnchor="start" fill="#f472b6" fontSize="9" fontWeight="bold">
                  TN
                </text>
              </g>
            </svg>

            {/* Quick Map Legend Tag */}
            <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] text-slate-300">
              Active: <strong className="text-amber-300">{selectedState.name} ({selectedState.code})</strong>
            </div>
          </div>

          {/* Quick State Grid Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block">DISCOM</span>
              <span className="font-bold text-slate-800 text-[11px] truncate block">
                {selectedState.discom.split('/')[0]}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Water Board</span>
              <span className="font-bold text-slate-800 text-[11px] truncate block">
                {selectedState.waterBoard.split('(')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT (7 cols): Vibrant Selected State Deep-Dive Showcase */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Hero Card for Selected State with Dynamic Gradient */}
          <div
            className={`rounded-3xl p-6 sm:p-7 bg-gradient-to-br ${selectedState.gradient} text-white shadow-xl space-y-5 relative overflow-hidden`}
          >
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-mono tracking-tight bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl border border-white/30">
                    {selectedState.code}
                  </span>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{selectedState.name}</h3>
                    <span className="text-xs text-white/80 font-medium">
                      {selectedState.region} Indian Utility Jurisdiction
                    </span>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30 text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-200 block">
                    Average Tariff
                  </span>
                  <span className="text-lg font-black font-mono">
                    ₹{selectedState.avgTariffPerKwh.toFixed(2)}{' '}
                    <span className="text-xs font-normal">/ kWh</span>
                  </span>
                </div>
              </div>

              {/* 4 Multi-Color Stat Pills inside State Hero */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-black/25 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                  <div className="flex items-center gap-1 text-amber-300 text-[10px] font-bold">
                    <Sun className="w-3.5 h-3.5" />
                    <span>Solar Power</span>
                  </div>
                  <div className="text-base font-extrabold font-mono mt-0.5">
                    {selectedState.solarCapacityMw.toLocaleString('en-IN')} MW
                  </div>
                </div>

                <div className="bg-black/25 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                  <div className="flex items-center gap-1 text-cyan-300 text-[10px] font-bold">
                    <Wind className="w-3.5 h-3.5" />
                    <span>Wind Energy</span>
                  </div>
                  <div className="text-base font-extrabold font-mono mt-0.5">
                    {selectedState.windCapacityMw.toLocaleString('en-IN')} MW
                  </div>
                </div>

                <div className="bg-black/25 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                  <div className="flex items-center gap-1 text-emerald-300 text-[10px] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Clean Share</span>
                  </div>
                  <div className="text-base font-extrabold font-mono mt-0.5">
                    {selectedState.cleanEnergySharePct}%
                  </div>
                </div>

                <div className="bg-black/25 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                  <div className="flex items-center gap-1 text-rose-300 text-[10px] font-bold">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Water Stress</span>
                  </div>
                  <div className="text-base font-extrabold font-mono mt-0.5">
                    {selectedState.waterStressLevel}
                  </div>
                </div>
              </div>

              {/* Signature Landmark Callout */}
              <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                  <Landmark className="w-4 h-4" />
                  <span>State Landmark: {selectedState.landmark.name}</span>
                </div>
                <p className="text-xs text-slate-100 leading-relaxed">
                  {selectedState.landmark.fact}
                </p>
                <div className="text-[11px] font-semibold text-emerald-200 flex items-center gap-1 pt-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{selectedState.landmark.highlight}</span>
                </div>
              </div>

              {/* Seasonal Peak Driver */}
              <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex items-start gap-2.5 text-xs">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-200">
                    High Demand Season ({selectedState.peakMonth}):
                  </span>{' '}
                  <span className="text-slate-200">{selectedState.peakDriver}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6-Month Simulated Recharts Curve for Selected State */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {selectedState.name} 2BHK 6-Month Consumption Curve (May - Oct 2024)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Typical residential consumption profile based on local climate & tariff slabs
                </p>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: selectedState.primaryColor }}
              >
                {selectedState.name}
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={selectedState.monthlyComparison}
                  margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                  <Tooltip
                    formatter={(val: any, name?: any) => [
                      name === 'consumptionKwh' ? `${val} kWh` : `₹${val}`,
                      name === 'consumptionKwh' ? 'Electricity Units' : 'Estimated Cost'
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="consumptionKwh"
                    name="consumptionKwh"
                    stroke={selectedState.primaryColor}
                    strokeWidth={3}
                    dot={{ r: 4, fill: selectedState.primaryColor }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARATIVE MULTI-COLOR BAR CHART: ALL 7 STATES */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span>Pan-India State Comparison (Vibrant Multi-Color View)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Compare tariffs, installed solar power, and renewable grid share across Indian states
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveMetric('tariff')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === 'tariff'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tariff (₹/kWh)
            </button>
            <button
              onClick={() => setActiveMetric('solar')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === 'solar'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solar MW
            </button>
            <button
              onClick={() => setActiveMetric('cleanShare')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === 'cleanShare'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clean Grid %
            </button>
          </div>
        </div>

        {/* Multi-Color Recharts Bar Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparativeData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="fullName" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
              <Tooltip
                formatter={(val: any) => [
                  activeMetric === 'tariff'
                    ? `₹${Number(val).toFixed(2)} / kWh`
                    : activeMetric === 'solar'
                    ? `${Number(val).toLocaleString('en-IN')} MW`
                    : `${val}%`,
                  activeMetric === 'tariff'
                    ? 'Average Tariff'
                    : activeMetric === 'solar'
                    ? 'Solar Capacity'
                    : 'Clean Energy Share'
                ]}
              />
              <Bar dataKey={activeMetric} radius={[6, 6, 0, 0]}>
                {comparativeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Multi-Color Key Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-slate-600 border-t border-slate-100">
          {INDIAN_STATES.map(s => (
            <div
              key={s.id}
              onClick={() => setSelectedStateId(s.id)}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.primaryColor }} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
