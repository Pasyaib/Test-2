import React, { useRef, useEffect, useState } from 'react';
import { EventData, EventStatus, LocationType } from '../types';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  ChartBarIcon, 
  DotsHorizontalIcon,
  DuplicateIcon,
  PencilIcon,
  TrashIcon,
  GlobeIcon,
  ChevronRightIcon
} from './Icons';

interface EventCardProps {
  event: EventData;
  openMenuId: string | null;
  onToggleMenu: (id: string) => void;
  onCloseMenu: () => void;
  onDelete?: (id: string) => void;
  onStatusUpdate?: (id: string, status: EventStatus) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  openMenuId, 
  onToggleMenu, 
  onCloseMenu,
  onDelete,
  onStatusUpdate
}) => {
  const isMenuOpen = openMenuId === event.id;
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [confirmAction, setConfirmAction] = useState<null | 'delete' | 'close'>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onCloseMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, onCloseMenu]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmAction(null);
    };
    if (confirmAction) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [confirmAction]);

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.Published:
        return <span className="px-3.5 py-1 bg-[#E7F7F2] text-[#2DB583] text-[10px] font-black rounded-full uppercase tracking-wide">Published</span>;
      case EventStatus.Draft:
        return <span className="px-3.5 py-1 bg-[#FFF8EB] text-[#FFA114] text-[10px] font-black rounded-full uppercase tracking-wide">Draft</span>;
      case EventStatus.Closed:
        return <span className="px-3.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-full uppercase tracking-wide">Closed</span>;
    }
  };

  const getLocationIcon = (type: LocationType) => {
    if (type === LocationType.Online) return <GlobeIcon className="w-3.5 h-3.5" />;
    return <MapPinIcon className="w-3.5 h-3.5" />;
  };

  const progressPercentage = Math.min((event.registered / event.capacity) * 100, 100);

  const handleDelete = () => {
    if (onDelete) onDelete(event.id);
    setConfirmAction(null);
  };

  const handleCloseEvent = () => {
    if (onStatusUpdate) onStatusUpdate(event.id, EventStatus.Closed);
    setConfirmAction(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group">
        {/* Image Header */}
        <div className="h-52 relative bg-gray-100 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute top-4 right-4">
            {getStatusBadge(event.status)}
          </div>
        </div>

        {/* Body */}
        <div className="p-7 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-extrabold text-gray-900 text-lg line-clamp-1 flex-1 pr-2 tracking-tight">
              {event.title}
            </h3>
            <span className="bg-[#F0F2F5] text-gray-500 text-[10px] px-2.5 py-1 rounded font-black uppercase tracking-wider whitespace-nowrap">
              {event.category}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-400 text-[13px] font-semibold mb-8">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-gray-300" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {getLocationIcon(event.locationType)}
              <span>{event.locationType}</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black uppercase mb-3 tracking-widest">
                <UsersIcon className="w-4 h-4 text-gray-300" />
                Registered
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="font-black text-gray-900 text-2xl leading-none">{event.registered}</span>
                <span className="text-gray-300 text-xs font-bold">/{event.capacity}</span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF4A00] rounded-full transition-all duration-1000 ease-in-out shadow-sm shadow-orange-100" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black uppercase mb-3 tracking-widest">
                <span className="font-sans font-black text-xs text-gray-300">$</span>
                Revenue
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-gray-900 text-2xl leading-none">
                  ${event.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto flex gap-3 relative">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-gray-100 text-gray-700 font-extrabold text-xs py-3 rounded-xl transition-all border border-gray-100">
              <ChartBarIcon className="w-4 h-4 text-gray-400" />
              View Report
            </button>
            
            <button 
              ref={buttonRef}
              onClick={() => onToggleMenu(event.id)}
              className={`w-12 flex items-center justify-center bg-[#F8FAFC] hover:bg-gray-100 rounded-xl border border-gray-100 transition-all ${isMenuOpen ? 'text-[#FF4A00] border-[#FF4A00]/20' : 'text-gray-400'}`}
            >
              <DotsHorizontalIcon className="w-6 h-6" />
            </button>

            {/* Context Menu */}
            {isMenuOpen && (
              <div 
                ref={menuRef}
                className="absolute right-0 bottom-14 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 origin-bottom-right"
              >
                <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                  <DuplicateIcon className="w-4 h-4 text-gray-400" />
                  Duplicate
                </button>
                <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                  <PencilIcon className="w-4 h-4 text-gray-400" />
                  Edit Event
                </button>
                
                {event.status === EventStatus.Published && (
                  <button 
                    onClick={() => { setConfirmAction('close'); onCloseMenu(); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <GlobeIcon className="w-4 h-4 text-gray-400" />
                    Close Event
                  </button>
                )}

                <div className="h-px bg-gray-50 my-1.5 mx-3"></div>
                <button 
                  onClick={() => { setConfirmAction('delete'); onCloseMenu(); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-black text-[#FF4A00] hover:bg-orange-50 flex items-center gap-3 transition-colors"
                >
                  <TrashIcon className="w-4 h-4 text-[#FF4A00]" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {confirmAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setConfirmAction(null)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className={`h-2 w-full ${confirmAction === 'delete' ? 'bg-[#FF4A00]' : 'bg-black'}`}></div>
            
            <div className="p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 leading-tight mb-3 tracking-tight">
                  {confirmAction === 'delete' ? 'Delete this event?' : 'Close this event?'}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {confirmAction === 'delete' 
                    ? "Are you sure? This event and all its registration data will be permanently removed. This action cannot be undone."
                    : "Once closed, users will no longer be able to register for this event. Existing registrations will still be accessible."
                  }
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmAction === 'delete' ? handleDelete : handleCloseEvent}
                  className={`w-full py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                    confirmAction === 'delete' 
                      ? 'bg-[#FF4A00] hover:bg-[#E64200] shadow-orange-100' 
                      : 'bg-black hover:bg-gray-800 shadow-gray-200'
                  }`}
                >
                  {confirmAction === 'delete' ? 'Yes, Delete Event' : 'Yes, Close Event'}
                </button>
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="w-full py-4 rounded-2xl text-gray-400 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;