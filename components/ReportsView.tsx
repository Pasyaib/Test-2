import React from 'react';
import { UsersIcon, MoneyIcon, EyeIcon, CalendarIcon, ChevronDownIcon, ArrowLeftIcon } from './Icons';

const ReportsView: React.FC = () => {
  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-700">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 shadow-sm">
              All Events
              <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
          {['7D', '30D', '90D', 'All Time'].map((range) => (
            <button
              key={range}
              className={`px-4 py-1.5 text-[11px] font-black rounded-lg transition-all ${
                range === 'All Time' ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Registrations" value="342" trend="+ 12%" icon={<UsersIcon className="w-5 h-5 text-indigo-600" />} color="bg-indigo-50" />
        <MetricCard label="Attendance Rate" value="85%" trend="+ 5%" icon={<EyeIcon className="w-5 h-5 text-emerald-600" />} color="bg-emerald-50" />
        <MetricCard label="Total Revenue" value="$15,680" trend="+ 3%" icon={<MoneyIcon className="w-5 h-5 text-cyan-600" />} color="bg-cyan-50" />
        <MetricCard label="Avg Revenue / Ticket" value="$31" trend="+ 3%" icon={<CalendarIcon className="w-5 h-5 text-pink-600" />} color="bg-pink-50" />
      </div>

      {/* Middle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Registration Trend</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Weekly registrations over time</p>
            </div>
          </div>
          <div className="h-64 relative w-full pt-10">
            {/* Simple SVG Line Chart */}
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4A00" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FF4A00" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 160 Q 50 140 100 110 T 200 80 T 300 100 T 400 60 T 500 40 T 600 80 T 700 30 T 800 120" fill="none" stroke="#FF4A00" strokeWidth="4" strokeLinecap="round" />
              <path d="M0 160 Q 50 140 100 110 T 200 80 T 300 100 T 400 60 T 500 40 T 600 80 T 700 30 T 800 120 V 200 H 0 Z" fill="url(#gradient)" />
              <g className="text-[10px] font-bold fill-gray-300">
                {[0, 100, 200, 300, 400, 500, 600, 700, 800].map((x, i) => (
                  <text key={x} x={x} y="200" textAnchor="middle">Jan {i + 1}</text>
                ))}
              </g>
            </svg>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Ticket Breakdown</h3>
          <p className="text-xs text-gray-400 font-medium mb-8">Weekly registrations over time</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 mb-8">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ffedd5" strokeWidth="12" strokeDasharray="160 251.2" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ff4a00" strokeWidth="12" strokeDasharray="60 251.2" strokeDashoffset="-160" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#b91c1c" strokeWidth="12" strokeDasharray="31.2 251.2" strokeDashoffset="-220" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black text-gray-900">342</span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              <LegendItem color="bg-orange-200" label="Early Bird" count="120" value="$2,400" />
              <LegendItem color="bg-[#FF4A00]" label="General" count="156" value="$4,680" />
              <LegendItem color="bg-red-700" label="VIP" count="42" value="$3,360" />
              <LegendItem color="bg-red-900" label="Student" count="24" value="$240" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Attendance vs Registration</h3>
          <p className="text-xs text-gray-400 font-medium mb-8">Weekly registrations over time</p>
          <div className="h-64 flex items-end justify-between gap-6 px-4">
            <BarGroup label="Mon" val1={90} val2={70} />
            <BarGroup label="Tue" val1={100} val2={85} />
            <BarGroup label="Wed" val1={95} val2={65} />
            <BarGroup label="Thu" val1={98} val2={78} />
            <BarGroup label="Fri" val1={110} val2={90} />
          </div>
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-200"></div><span className="text-[10px] font-bold text-gray-400">Registered</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FF4A00]"></div><span className="text-[10px] font-bold text-gray-400">Attended</span></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Revenue</h3>
          <p className="text-xs text-gray-400 font-medium mb-8">Weekly registrations over time</p>
          <div className="space-y-8">
            <HorizontalBar label="Early Bird" progress={45} value="$2,400" color="bg-orange-200" />
            <HorizontalBar label="General" progress={90} value="$4,680" color="bg-[#FF4A00]" />
            <HorizontalBar label="VIP" progress={65} value="$3,360" color="bg-[#FF4A00]" />
            <HorizontalBar label="Student" progress={15} value="$240" color="bg-red-900" />
          </div>
          <div className="mt-12 p-5 bg-orange-50/50 rounded-2xl flex items-center justify-between border border-orange-100/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF4A00]"><MoneyIcon className="w-4 h-4" /></div>
              <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Total Revenue</span>
            </div>
            <span className="text-xl font-black text-gray-900">$10,680</span>
          </div>
        </div>
      </div>

      {/* Registrant Table */}
      <div className="bg-white rounded-[32px] border border-gray-50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Registrant Details</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Weekly registrations over time</p>
          </div>
          <button className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700">
            All Tickets
            <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/30">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ticket</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <TableRow name="Alice Johnson" email="alice@example.com" ticket="VIP" date="Jan 15" amount="$80" status="Attended" />
              <TableRow name="Bob Smith" email="bob@example.com" ticket="General" date="Jan 16" amount="$30" status="Attended" />
              <TableRow name="Carol Davis" email="carol@example.com" ticket="Early Bird" date="Jan 10" amount="$20" status="No Show" />
              <TableRow name="David Wilson" email="david@example.com" ticket="Student" date="Jan 18" amount="$10" status="Attended" />
              <TableRow name="Emma Brown" email="emma@example.com" ticket="General" date="Jan 20" amount="$30" status="Attended" />
              <TableRow name="Frank Miller" email="frank@example.com" ticket="VIP" date="Jan 22" amount="$80" status="Registered" />
              <TableRow name="Grace Lee" email="grace@example.com" ticket="Early Bird" date="Jan 8" amount="$20" status="Attended" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ label, value, trend, icon, color }) => (
  <div className="bg-white p-7 rounded-[28px] border border-gray-50 shadow-sm hover:border-[#FF4A00]/20 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
      <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1">
        <ArrowLeftIcon className="w-2.5 h-2.5 rotate-[135deg]" />
        {trend}
      </span>
    </div>
    <h4 className="text-3xl font-black text-gray-900 mb-1">{value}</h4>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
  </div>
);

const LegendItem: React.FC<{ color: string; label: string; count: string; value: string }> = ({ color, label, count, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-xs font-bold text-gray-500">{label}</span>
    </div>
    <div className="flex gap-4">
      <span className="text-xs font-bold text-gray-400">{count}</span>
      <span className="text-xs font-black text-gray-900">{value}</span>
    </div>
  </div>
);

const BarGroup: React.FC<{ label: string; val1: number; val2: number }> = ({ label, val1, val2 }) => (
  <div className="flex-1 flex flex-col items-center h-full">
    <div className="flex-1 flex items-end gap-1.5 w-full justify-center">
      <div className="w-5 bg-orange-100 rounded-t-lg transition-all hover:bg-orange-200" style={{ height: `${val1}%` }}></div>
      <div className="w-5 bg-[#FF4A00] rounded-t-lg transition-all hover:bg-[#E64200]" style={{ height: `${val2}%` }}></div>
    </div>
    <span className="text-[10px] font-bold text-gray-400 mt-4">{label}</span>
  </div>
);

const HorizontalBar: React.FC<{ label: string; progress: number; value: string; color: string }> = ({ label, progress, value, color }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between text-[11px] font-bold">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
    <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const TableRow: React.FC<{ name: string; email: string; ticket: string; date: string; amount: string; status: string }> = ({ name, email, ticket, date, amount, status }) => (
  <tr className="hover:bg-gray-50/50 transition-colors">
    <td className="px-8 py-4 text-[13px] font-bold text-gray-900">{name}</td>
    <td className="px-8 py-4 text-[13px] font-medium text-gray-400">{email}</td>
    <td className="px-8 py-4">
      <span className="px-2.5 py-1 bg-gray-50 text-[10px] font-black text-gray-500 rounded-lg uppercase border border-gray-100">{ticket}</span>
    </td>
    <td className="px-8 py-4 text-[13px] font-medium text-gray-400">{date}</td>
    <td className="px-8 py-4 text-[13px] font-black text-gray-900">{amount}</td>
    <td className="px-8 py-4">
      <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wide
        ${status === 'Attended' ? 'bg-emerald-50 text-emerald-600' : 
          status === 'No Show' ? 'bg-red-50 text-red-500' : 
          'bg-blue-50 text-blue-500'}
      `}>
        {status}
      </span>
    </td>
  </tr>
);

export default ReportsView;