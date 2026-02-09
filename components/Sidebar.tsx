import React from 'react';
import { 
  LogoIcon, 
  GridIcon, 
  PlusSquareIcon, 
  FileTextIcon, 
  SettingsIcon, 
  HelpIcon,
  ChevronDownIcon 
} from './Icons';

interface SidebarProps {
  className?: string;
  activeView?: 'dashboard' | 'create-event' | 'reports';
  onNavigate?: (view: 'dashboard' | 'create-event' | 'reports') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, activeView = 'dashboard', onNavigate }) => {
  const handleNavigate = (view: 'dashboard' | 'create-event' | 'reports') => {
    if (onNavigate) onNavigate(view);
  };

  const getButtonClass = (isActive: boolean) => 
    isActive 
      ? "bg-[#FFF1EB] text-[#FF4A00] border-r-4 border-[#FF4A00]" 
      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-r-4 border-transparent";

  return (
    <aside className={`w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50 ${className}`}>
      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50/50">
        <div className="flex items-center gap-3 text-gray-900 font-bold text-xl">
          <div className="bg-[#FF4A00] rounded-lg p-1.5 text-white flex items-center justify-center">
            <LogoIcon className="w-4 h-4" />
          </div>
          Evention
        </div>
        <div className="ml-auto text-gray-300">
           <ChevronDownIcon className="w-4 h-4 rotate-90" />
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 py-8 flex flex-col gap-1">
        {/* My Events */}
        <button 
          onClick={() => handleNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-6 py-3.5 font-bold text-[14px] transition-all duration-200 ${getButtonClass(activeView === 'dashboard' || activeView === 'create-event')}`}
        >
          <GridIcon className="w-5 h-5" />
          My Events
        </button>

        {/* Reports */}
        <button 
          onClick={() => handleNavigate('reports')}
          className={`w-full flex items-center gap-3 px-6 py-3.5 font-bold text-[14px] transition-all duration-200 ${getButtonClass(activeView === 'reports')}`}
        >
          <FileTextIcon className="w-5 h-5" />
          Reports
        </button>

        <div className="h-px bg-gray-50 my-4 mx-6"></div>

        {/* Create Event */}
        <button 
          onClick={() => handleNavigate('create-event')}
          className={`w-full flex items-center gap-3 px-6 py-3.5 text-gray-400 hover:text-[#FF4A00] hover:bg-[#FFF1EB] font-bold text-[14px] transition-all border-r-4 border-transparent`}
        >
          <PlusSquareIcon className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="py-6 border-t border-gray-50 flex flex-col gap-1">
        <button className="w-full flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-gray-700 hover:bg-gray-50 font-bold text-sm transition-colors border-r-4 border-transparent">
          <SettingsIcon className="w-5 h-5" />
          Settings
        </button>

        <button className="w-full flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-gray-700 hover:bg-gray-50 font-bold text-sm transition-colors border-r-4 border-transparent">
          <HelpIcon className="w-5 h-5" />
          Help & Support
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;