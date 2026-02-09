import React from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon } from './Icons';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onCreateEvent?: () => void;
  showCreateButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "My Events", 
  subtitle = "Manage and monitor all your events",
  onCreateEvent,
  showCreateButton = false
}) => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 sticky top-0 z-50">
      {/* Left: Breadcrumbs/Title */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
        <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {showCreateButton && (
          <button 
            onClick={onCreateEvent}
            className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-sm mr-4"
          >
            Create Event
          </button>
        )}
        
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
            <SearchIcon className="w-5 h-5" />
          </button>
          
          <button className="relative text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF4A00] rounded-full border-2 border-white"></span>
          </button>
        </div>

        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Eric&backgroundColor=f1f5f9" 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-gray-50 group-hover:border-gray-300 transition-colors"
            />
          </div>
          <div className="hidden md:block text-right">
            <p className="font-bold text-gray-900 text-sm leading-none">Eric Josh P</p>
            <p className="text-gray-400 text-[10px] font-medium mt-1">jane@evention.io</p>
          </div>
          <ChevronDownIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Header;