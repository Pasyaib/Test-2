import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  UploadIcon, 
  CalendarIcon, 
  ClockIcon, 
  ChevronDownIcon, 
  ArrowLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  StarIcon,
  DirectionIcon,
  BookmarkIcon,
  MapPinFilledIcon,
  PlusIcon,
  TrashIcon
} from './Icons';
import { EventData, EventStatus, LocationType } from '../types';

interface CreateEventProps {
  onBack: () => void;
  onEventCreated: (event: EventData) => void;
}

type Step = 1 | 2;

interface FreeTicket {
  id: string;
  name: string;
  quantity: string;
}

interface PaidTicket {
  id: string;
  name: string;
  price: string;
  quantity: string;
}

// Helper utilities
const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const h = hour.toString().padStart(2, '0');
      const m = min.toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const CreateEvent: React.FC<CreateEventProps> = ({ onBack, onEventCreated }) => {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Field States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [format, setFormat] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requireApproval, setRequireApproval] = useState(false);

  // Ticket States
  const [freeTickets, setFreeTickets] = useState<FreeTicket[]>([]);
  const [paidTickets, setPaidTickets] = useState<PaidTicket[]>([]);

  // Date Picker States
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  
  // Time Picker States
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);
  const dateTriggerRef = useRef<HTMLButtonElement>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);

  const isOffline = format === 'Offline' || format === 'Hybrid';
  const isOnline = format === 'Online' || format === 'Hybrid';

  const handleNext = () => {
    if (!title || !selectedDate || !selectedStartTime || !category || !format) return;
    setStep(2);
  };
  
  const handleBackToStep1 = () => setStep(1);

  // Ticket Functions
  const addFreeTicket = () => {
    const newTicket: FreeTicket = { id: Date.now().toString(), name: '', quantity: '' };
    setFreeTickets([...freeTickets, newTicket]);
  };

  const deleteFreeTicket = (id: string) => {
    setFreeTickets(freeTickets.filter(t => t.id !== id));
  };

  const addPaidTicket = () => {
    const newTicket: PaidTicket = { id: Date.now().toString(), name: '', price: '', quantity: '' };
    setPaidTickets([...paidTickets, newTicket]);
  };

  const deletePaidTicket = (id: string) => {
    setPaidTickets(paidTickets.filter(t => t.id !== id));
  };

  const updateFreeTicket = (id: string, field: keyof FreeTicket, value: string) => {
    setFreeTickets(freeTickets.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const updatePaidTicket = (id: string, field: keyof PaidTicket, value: string) => {
    setPaidTickets(paidTickets.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  // Submission Logic
  const handleCreateEvent = () => {
    if (freeTickets.length === 0 && paidTickets.length === 0) return;
    setIsSubmitting(true);
    
    const totalCapacity = [...freeTickets, ...paidTickets].reduce((acc, curr) => {
      const val = parseInt(curr.quantity);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    const newEvent: EventData = {
      id: Date.now().toString(),
      title: title,
      category: category,
      date: selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD',
      locationType: format as LocationType,
      status: EventStatus.Published,
      registered: 0,
      capacity: totalCapacity || 100,
      revenue: 0,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/400`,
    };

    setTimeout(() => {
      onEventCreated(newEvent);
      setIsSubmitting(false);
    }, 800);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (calendarRef.current && !calendarRef.current.contains(target) && 
          dateTriggerRef.current && !dateTriggerRef.current.contains(target)) {
        setIsCalendarOpen(false);
      }
      if (startTimeRef.current && !startTimeRef.current.contains(target)) setIsStartTimeOpen(false);
      if (endTimeRef.current && !endTimeRef.current.contains(target)) setIsEndTimeOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar logic
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
    dateTriggerRef.current?.focus();
  };

  const handleDateKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isCalendarOpen) return;
    const currentFocus = focusedDate || viewDate;
    let nextDate = new Date(currentFocus);
    switch (e.key) {
      case 'ArrowLeft': nextDate.setDate(currentFocus.getDate() - 1); setFocusedDate(nextDate); setViewDate(nextDate); break;
      case 'ArrowRight': nextDate.setDate(currentFocus.getDate() + 1); setFocusedDate(nextDate); setViewDate(nextDate); break;
      case 'ArrowUp': nextDate.setDate(currentFocus.getDate() - 7); setFocusedDate(nextDate); setViewDate(nextDate); break;
      case 'ArrowDown': nextDate.setDate(currentFocus.getDate() + 7); setFocusedDate(nextDate); setViewDate(nextDate); break;
      case 'Enter': case ' ': e.preventDefault(); handleDateSelect(currentFocus); break;
      case 'Escape': setIsCalendarOpen(false); dateTriggerRef.current?.focus(); break;
    }
  }, [isCalendarOpen, focusedDate, viewDate]);

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();
      const isFocused = focusedDate?.toDateString() === date.toDateString();
      days.push(
        <button key={d} role="gridcell" aria-selected={isSelected} aria-label={`${d} ${monthNames[month]} ${year}`} onClick={() => handleDateSelect(date)}
          className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all
            ${isSelected ? 'bg-[#FF4A00] text-white shadow-lg shadow-orange-200 scale-110' : 'text-gray-700 hover:bg-gray-100'}
            ${isToday && !isSelected ? 'text-[#FF4A00] border border-orange-100' : ''}
            ${isFocused ? 'ring-2 ring-orange-400 ring-offset-2 outline-none' : 'outline-none'}
          `}
        >
          {d}
        </button>
      );
    }
    return (
      <div ref={calendarRef} onKeyDown={handleDateKeyDown} className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-[100] w-80 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-gray-900">{monthNames[month]} {year}</h4>
          <div className="flex gap-1">
            <button onClick={() => setViewDate(new Date(year, month - 1))} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" aria-label="Previous month"><ArrowLeftIcon className="w-4 h-4" /></button>
            <button onClick={() => setViewDate(new Date(year, month + 1))} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" aria-label="Next month"><ChevronRightIcon className="w-4 h-4" /></button>
          </div>
        </div>
        <div role="grid" className="grid grid-cols-7 gap-1 text-center">
          {dayNames.map(day => (<div key={day} role="columnheader" className="h-10 flex items-center justify-center text-[10px] font-black text-gray-300 uppercase tracking-widest">{day[0]}</div>))}
          {days}
        </div>
      </div>
    );
  };

  const renderTimePicker = (
    type: 'start' | 'end', 
    isOpen: boolean, 
    setIsOpen: (val: boolean) => void, 
    selected: string | null, 
    setSelected: (val: string) => void,
    containerRef: React.RefObject<HTMLDivElement>
  ) => {
    return (
      <div ref={containerRef} className="relative">
        <label className="block text-sm font-bold text-gray-900 mb-2">{type === 'start' ? 'Start Time' : 'End Time'} {type === 'start' && <span className="text-red-500">*</span>}</label>
        <div className="relative group">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full text-left border rounded-xl pl-5 pr-12 py-3.5 text-sm transition-all outline-none font-medium
              ${selected ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
              ${isOpen ? 'bg-white border-[#FF4A00]/20 ring-4 ring-[#FF4A00]/5' : 'hover:bg-gray-100/30'}
            `}
          >
            {selected || (type === 'start' ? 'Start Time' : 'End Time')}
          </button>
          <ClockIcon className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${isOpen ? 'text-[#FF4A00]' : 'text-gray-300'}`} />
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-[100] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 scrollbar-hide">
            <div role="listbox">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelected(time);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2.5 text-sm font-bold transition-colors
                    ${selected === time ? 'bg-orange-50 text-[#FF4A00]' : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const isStep1Complete = title && selectedDate && selectedStartTime && category && format;

  return (
    <div className="max-w-5xl mx-auto pb-16 animate-in fade-in duration-500">
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-10">
            <div className={`flex items-center gap-2.5 font-bold text-sm transition-colors ${step >= 1 ? 'text-[#FF4A00]' : 'text-gray-300'}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${step >= 1 ? 'border-[#FF4A00]' : 'border-gray-200'}`}>
                    <div className={`w-2.5 h-2.5 bg-[#FF4A00] rounded-full transition-transform ${step >= 1 ? 'scale-100' : 'scale-0'}`}></div>
                </div>
                <span>Informasi Event</span>
            </div>
            <div className="text-gray-200"><ChevronRightIcon className="w-5 h-5" /></div>
             <div className={`flex items-center gap-2.5 font-bold text-sm transition-colors ${step === 2 ? 'text-[#FF4A00]' : 'text-gray-300'}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${step === 2 ? 'border-[#FF4A00]' : 'border-gray-200'}`}>
                    <div className={`w-2.5 h-2.5 bg-[#FF4A00] rounded-full transition-transform ${step === 2 ? 'scale-100' : 'scale-0'}`}></div>
                </div>
                <span>Ticket Pricing</span>
            </div>
             <div className="text-gray-200"><ChevronRightIcon className="w-5 h-5" /></div>
        </div>

        {step === 1 ? (
            /* Step 1: Basic Information */
            <>
                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden mb-10">
                    <div className="bg-[#FF4A00] px-8 py-4">
                        <h2 className="text-white font-bold text-lg">Basic Information</h2>
                    </div>
                    
                    <div className="p-10 space-y-10">
                        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
                            <div className="lg:w-[35%] flex flex-col">
                                <label className="block text-sm font-bold text-transparent mb-2 select-none">Spacer</label>
                                <div className="flex-1 border border-gray-100 rounded-3xl flex flex-col items-center justify-center p-8 text-center hover:bg-gray-50/50 hover:border-[#FF4A00]/30 transition-all cursor-pointer group bg-gray-50/20">
                                     <div className="w-14 h-14 bg-white border border-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:shadow-md transition-all shadow-sm"><UploadIcon className="w-7 h-7 text-gray-300 group-hover:text-[#FF4A00]" /></div>
                                     <p className="text-gray-900 font-bold mb-1">Upload cover image</p>
                                     <p className="text-[13px] text-gray-400 font-medium leading-relaxed px-4">Hero section for your event page. Drag & drop or <span className="text-[#FF4A00] font-semibold underline decoration-[#FF4A00]/30 underline-offset-4">browse</span></p>
                                </div>
                            </div>

                            <div className="lg:w-[65%] space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Event Title <span className="text-red-500">*</span></label>
                                    <input 
                                      type="text" 
                                      value={title}
                                      onChange={(e) => setTitle(e.target.value)}
                                      placeholder="e.g., Startup Pitch Competition 2026" 
                                      className={`w-full border rounded-xl px-5 py-3.5 text-sm transition-all outline-none font-medium
                                        ${title ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400 placeholder-gray-400/70'}
                                        focus:bg-white focus:border-[#FF4A00]/20 focus:ring-4 focus:ring-[#FF4A00]/5
                                      `} 
                                    />
                                </div>
                                
                                {/* Date Picker */}
                                <div className="relative">
                                    <label id="date-picker-label" className="block text-sm font-bold text-gray-900 mb-2">Date <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <button ref={dateTriggerRef} type="button" onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                            className={`w-full text-left border rounded-xl pl-5 pr-12 py-3.5 text-sm transition-all outline-none font-medium
                                              ${selectedDate ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
                                              ${isCalendarOpen ? 'bg-white border-[#FF4A00]/20 ring-4 ring-[#FF4A00]/5' : 'hover:bg-gray-100/30'}
                                            `}
                                        >
                                            {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date'}
                                        </button>
                                        <CalendarIcon className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${isCalendarOpen ? 'text-[#FF4A00]' : 'text-gray-300'}`} />
                                    </div>
                                    {isCalendarOpen && renderCalendar()}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {renderTimePicker('start', isStartTimeOpen, setIsStartTimeOpen, selectedStartTime, setSelectedStartTime, startTimeRef)}
                                    {renderTimePicker('end', isEndTimeOpen, setIsEndTimeOpen, selectedEndTime, setSelectedEndTime, endTimeRef)}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Category <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <select 
                                              value={category} 
                                              onChange={(e) => setCategory(e.target.value)} 
                                              className={`w-full appearance-none border rounded-xl px-5 py-3.5 text-sm transition-all outline-none font-medium cursor-pointer
                                                ${category ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
                                                focus:bg-white focus:border-[#FF4A00]/20
                                              `}
                                            >
                                                <option value="" disabled>Select category</option>
                                                <option value="Sport">Sport</option>
                                                <option value="Hackathon">Hackathon</option>
                                                <option value="Conference">Conference</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-[#FF4A00] transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Event Format <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <select 
                                              value={format} 
                                              onChange={(e) => setFormat(e.target.value)} 
                                              className={`w-full appearance-none border rounded-xl px-5 py-3.5 text-sm transition-all outline-none font-medium cursor-pointer
                                                ${format ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
                                                focus:bg-white focus:border-[#FF4A00]/20
                                              `}
                                            >
                                                <option value="" disabled>Select format</option>
                                                <option value="Offline">Offline</option>
                                                <option value="Online">Online</option>
                                                <option value="Hybrid">Hybrid</option>
                                            </select>
                                            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-[#FF4A00] transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(isOffline || isOnline) && (
                            <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                                {isOffline && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">Location <span className="text-red-500">*</span></label>
                                            <div className="relative group">
                                                <select 
                                                  value={location} 
                                                  onChange={(e) => setLocation(e.target.value)} 
                                                  className={`w-full appearance-none border rounded-xl px-5 py-3.5 text-sm transition-all outline-none font-medium cursor-pointer
                                                    ${location ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
                                                    focus:bg-white focus:border-[#FF4A00]/20
                                                  `}
                                                >
                                                    <option value="" disabled>Search or select location</option>
                                                    <option value="Gelora bung karno">Gelora bung karno</option>
                                                    <option value="Istora Senayan">Istora Senayan</option>
                                                </select>
                                                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-[#FF4A00] transition-colors" />
                                            </div>
                                        </div>
                                        {location && (
                                          <div className="space-y-3 animate-in fade-in duration-500">
                                              <div className="flex items-center justify-between">
                                                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Map Preview</label>
                                                  <button className="flex items-center gap-1.5 text-blue-600 text-xs font-bold hover:underline"><GlobeIcon className="w-3.5 h-3.5" />Open in Google Maps</button>
                                              </div>
                                              <div className="relative h-64 w-full bg-[#E5E7EB] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                                  <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${location === 'Istora Senayan' ? '-6.2165,106.8015' : '-6.2185,106.8025'}&zoom=16&size=1200x400&scale=2&maptype=roadmap`} alt="Map" className="w-full h-full object-cover grayscale-[0.2]" />
                                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-4 flex flex-col min-w-[280px] border border-gray-100">
                                                      <div className="flex justify-between items-start mb-2">
                                                          <div>
                                                              <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{location}</h4>
                                                              <div className="flex items-center gap-1">
                                                                  <span className="text-[11px] font-bold text-gray-900">4,8</span>
                                                                  <div className="flex text-yellow-400"><StarIcon className="w-2.5 h-2.5" /><StarIcon className="w-2.5 h-2.5" /><StarIcon className="w-2.5 h-2.5" /><StarIcon className="w-2.5 h-2.5" /><StarIcon className="w-2.5 h-2.5" /></div>
                                                                  <span className="text-[10px] text-gray-400 font-medium">(59.286)</span>
                                                              </div>
                                                          </div>
                                                          <div className="flex gap-2">
                                                              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><DirectionIcon className="w-4 h-4" /></div>
                                                              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><BookmarkIcon className="w-4 h-4" /></div>
                                                          </div>
                                                      </div>
                                                      <p className="text-[11px] text-gray-500 font-medium">Stadion • <span className="text-blue-500">Jl. Pintu Satu Senayan</span></p>
                                                  </div>
                                                  <div className="absolute top-[calc(50%+40px)] left-1/2 -translate-x-1/2 text-red-600 drop-shadow-lg"><MapPinFilledIcon className="w-8 h-8" /></div>
                                              </div>
                                          </div>
                                        )}
                                    </div>
                                )}
                                {isOnline && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Event Link <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <input type="text" placeholder="https://zoom.us/j/..." className="w-full bg-[#F8FAFC] border-transparent rounded-xl pl-12 pr-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#FF4A00]/10 focus:bg-white focus:border-[#FF4A00]/20 transition-all outline-none font-medium" />
                                            <GlobeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF4A00] pointer-events-none transition-colors" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="w-full">
                            <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                            <div className="relative group">
                                <textarea 
                                  rows={6} 
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                  placeholder="Provide more details about your event, schedule, speakers, etc." 
                                  className={`w-full border rounded-2xl px-6 py-5 text-sm transition-all outline-none resize-none font-medium
                                    ${description ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
                                    focus:bg-white focus:border-[#FF4A00]/20 focus:ring-4 focus:ring-[#FF4A00]/5
                                  `}
                                ></textarea>
                                <p className="absolute bottom-4 right-6 text-[11px] font-bold text-gray-300 uppercase tracking-widest">{description.length}/2000 characters</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 px-8 py-3.5 bg-white border border-gray-100 text-gray-400 font-bold text-sm rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">
                        <ArrowLeftIcon className="w-4 h-4" /> Cancel
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="px-8 py-3.5 bg-white border border-gray-100 text-gray-400 font-bold text-sm rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">Save Draft</button>
                        <button 
                          onClick={handleNext} 
                          disabled={!isStep1Complete}
                          className={`px-10 py-3.5 font-bold text-sm rounded-xl transition-all shadow-xl active:scale-95 flex items-center gap-2
                            ${isStep1Complete ? 'bg-black text-white hover:bg-gray-900 shadow-gray-200/80' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}
                          `}
                        >
                          Next Step
                        </button>
                    </div>
                </div>
            </>
        ) : (
            /* Step 2: Ticket Pricing */
            <>
                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden mb-10">
                    <div className="bg-[#FF4A00] px-8 py-4">
                        <h2 className="text-white font-bold text-lg">Ticket Details</h2>
                    </div>

                    <div className="p-10 space-y-10">
                        {/* Free Tickets Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-bold text-gray-900">Free Tickets</h3>
                                  <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-black text-gray-400">{freeTickets.length}</span>
                                </div>
                                <button 
                                  onClick={addFreeTicket}
                                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#FF4A00] hover:bg-orange-50 hover:border-orange-100 transition-all"
                                >
                                    <PlusIcon className="w-3.5 h-3.5" /> Add Tier
                                </button>
                            </div>
                            
                            {freeTickets.length === 0 ? (
                                <div className="border border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/10">
                                    <div className="w-10 h-10 bg-white border border-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-200"><PlusIcon className="w-5 h-5" /></div>
                                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">No free tickets added</p>
                                </div>
                            ) : (
                              <div className="space-y-4">
                                {freeTickets.map((ticket) => (
                                  <div key={ticket.id} className="bg-white border border-gray-100 rounded-2xl p-6 relative group animate-in zoom-in-95 duration-200">
                                      <button 
                                        onClick={() => deleteFreeTicket(ticket.id)}
                                        className="absolute top-4 right-4 text-gray-200 hover:text-red-500 transition-colors"
                                      >
                                          <TrashIcon className="w-4 h-4" />
                                      </button>
                                      <div className="grid grid-cols-2 gap-6">
                                          <div>
                                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ticket Name</label>
                                              <input 
                                                type="text" 
                                                value={ticket.name} 
                                                onChange={(e) => updateFreeTicket(ticket.id, 'name', e.target.value)}
                                                placeholder="e.g. Regular Registration"
                                                className={`w-full border rounded-xl px-5 py-3 text-sm font-medium transition-all outline-none
                                                  ${ticket.name ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
                                                  focus:bg-white focus:border-[#FF4A00]/20
                                                `} 
                                              />
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Available Quantity</label>
                                              <input 
                                                type="number" 
                                                value={ticket.quantity} 
                                                onChange={(e) => updateFreeTicket(ticket.id, 'quantity', e.target.value)}
                                                placeholder="0"
                                                className={`w-full border rounded-xl px-5 py-3 text-sm font-medium transition-all outline-none
                                                  ${ticket.quantity ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
                                                  focus:bg-white focus:border-[#FF4A00]/20
                                                `} 
                                              />
                                          </div>
                                      </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>

                        {/* Paid Tickets Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-bold text-gray-900">Paid Tickets</h3>
                                  <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-black text-gray-400">{paidTickets.length}</span>
                                </div>
                                <button 
                                  onClick={addPaidTicket}
                                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#FF4A00] hover:bg-orange-50 hover:border-orange-100 transition-all"
                                >
                                    <PlusIcon className="w-3.5 h-3.5" /> Add Tier
                                </button>
                            </div>

                            {paidTickets.length === 0 ? (
                                <div className="border border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/10">
                                    <div className="w-10 h-10 bg-white border border-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-200"><PlusIcon className="w-5 h-5" /></div>
                                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">No paid tickets added</p>
                                </div>
                            ) : (
                              <div className="space-y-4">
                                {paidTickets.map((ticket) => (
                                  <div key={ticket.id} className="bg-white border border-gray-100 rounded-2xl p-6 relative group animate-in zoom-in-95 duration-200">
                                      <button 
                                        onClick={() => deletePaidTicket(ticket.id)}
                                        className="absolute top-4 right-4 text-gray-200 hover:text-red-500 transition-colors"
                                      >
                                          <TrashIcon className="w-4 h-4" />
                                      </button>
                                      <div className="grid grid-cols-12 gap-6">
                                          <div className="col-span-5">
                                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ticket Name</label>
                                              <input 
                                                type="text" 
                                                value={ticket.name} 
                                                onChange={(e) => updatePaidTicket(ticket.id, 'name', e.target.value)}
                                                placeholder="e.g. VIP Pass"
                                                className={`w-full border rounded-xl px-5 py-3 text-sm font-medium transition-all outline-none
                                                  ${ticket.name ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
                                                  focus:bg-white focus:border-[#FF4A00]/20
                                                `} 
                                              />
                                          </div>
                                          <div className="col-span-4">
                                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price ($)</label>
                                              <input 
                                                type="number" 
                                                value={ticket.price} 
                                                onChange={(e) => updatePaidTicket(ticket.id, 'price', e.target.value)}
                                                placeholder="0.00"
                                                className={`w-full border rounded-xl px-5 py-3 text-sm font-medium transition-all outline-none
                                                  ${ticket.price ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
                                                  focus:bg-white focus:border-[#FF4A00]/20
                                                `} 
                                              />
                                          </div>
                                          <div className="col-span-3">
                                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quantity</label>
                                              <input 
                                                type="number" 
                                                value={ticket.quantity} 
                                                onChange={(e) => updatePaidTicket(ticket.id, 'quantity', e.target.value)}
                                                placeholder="0"
                                                className={`w-full border rounded-xl px-5 py-3 text-sm font-medium transition-all outline-none
                                                  ${ticket.quantity ? 'bg-[#F8FAFC] border-transparent text-gray-900' : 'bg-gray-50/20 border-gray-100 text-gray-400'}
                                                  focus:bg-white focus:border-[#FF4A00]/20
                                                `} 
                                              />
                                          </div>
                                      </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>

                        {/* Approval Section */}
                        <div className="flex items-center justify-between py-6 border-t border-gray-100">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm tracking-tight">Require Approval</h4>
                                <p className="text-[11px] text-gray-400 font-bold mt-0.5 uppercase tracking-wide">Manual review for each registrant</p>
                            </div>
                            <button 
                                onClick={() => setRequireApproval(!requireApproval)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${requireApproval ? 'bg-[#FF4A00]' : 'bg-gray-200 shadow-inner'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${requireApproval ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button onClick={handleBackToStep1} className="flex items-center gap-2 px-8 py-3.5 bg-white border border-gray-100 text-gray-400 font-bold text-sm rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">
                        <ArrowLeftIcon className="w-4 h-4" /> Back
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="px-8 py-3.5 bg-white border border-gray-100 text-gray-400 font-bold text-sm rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">Save Draft</button>
                        <button 
                          onClick={handleCreateEvent} 
                          disabled={isSubmitting || (freeTickets.length === 0 && paidTickets.length === 0)}
                          className={`px-10 py-3.5 font-bold text-sm rounded-xl transition-all shadow-xl active:scale-95 disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none flex items-center gap-3
                            ${(freeTickets.length > 0 || paidTickets.length > 0) ? 'bg-[#FF4A00] text-white hover:bg-[#E64200] shadow-orange-100' : ''}
                          `}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                              Launching...
                            </>
                          ) : 'Launch Event'}
                        </button>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default CreateEvent;