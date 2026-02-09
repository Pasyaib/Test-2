import React from 'react';
import { StatMetric } from '../types';
import { CalendarIcon, EyeIcon, UsersIcon, MoneyIcon } from './Icons';

interface StatCardProps {
  metric: StatMetric;
}

const StatCard: React.FC<StatCardProps> = ({ metric }) => {
  const getIcon = () => {
    const iconClass = "w-6 h-6";
    switch (metric.iconType) {
      case 'calendar': return <CalendarIcon className={`${iconClass} text-indigo-600`} />;
      case 'eye': return <EyeIcon className={`${iconClass} text-emerald-500`} />;
      case 'users': return <UsersIcon className={`${iconClass} text-blue-600`} />;
      case 'money': return <MoneyIcon className={`${iconClass} text-emerald-600`} />;
      default: return null;
    }
  };

  const getIconBg = () => {
    switch (metric.iconType) {
      case 'calendar': return 'bg-indigo-50/70';
      case 'eye': return 'bg-emerald-50/70';
      case 'users': return 'bg-blue-50/70';
      case 'money': return 'bg-emerald-50/70';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-7 rounded-2xl border border-gray-50 shadow-sm flex items-center justify-between hover:border-orange-100 transition-all duration-300 group">
      <div>
        <h3 className="text-2xl font-black text-gray-900">{metric.value}</h3>
        <p className="text-gray-400 text-xs font-semibold mt-1 uppercase tracking-tight">{metric.label}</p>
      </div>
      <div className={`p-3 rounded-xl ${getIconBg()} group-hover:scale-110 transition-transform duration-300`}>
        {getIcon()}
      </div>
    </div>
  );
};

export default StatCard;