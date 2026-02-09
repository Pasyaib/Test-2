import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import EventCard from './components/EventCard';
import CreateEvent from './components/CreateEvent';
import ReportsView from './components/ReportsView';
import { SearchIcon, PlusIcon, ChevronDownIcon, GlobeIcon, MapPinIcon, CalendarIcon } from './components/Icons';
import { STATS } from './constants';
import { EventStatus, EventData, LocationType } from './types';

type View = 'dashboard' | 'create-event' | 'reports';
type Timeframe = 'All' | 'Upcoming' | 'Past';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeTab, setActiveTab] = useState<'All' | EventStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [events, setEvents] = useState<EventData[]>([]); 
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filterLocation, setFilterLocation] = useState<LocationType | 'All'>('All');
  const [filterTimeframe, setFilterTimeframe] = useState<Timeframe>('All');

  const handleToggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleCloseMenu = () => {
    setOpenMenuId(null);
  };

  const handleAddEvent = (newEvent: EventData) => {
    setEvents([newEvent, ...events]);
    setCurrentView('dashboard');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    handleCloseMenu();
  };

  const handleUpdateEventStatus = (id: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    handleCloseMenu();
  };

  const activeFilterCount = (filterLocation !== 'All' ? 1 : 0) + (filterTimeframe !== 'All' ? 1 : 0);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Status Tab Filter
      const matchesTab = activeTab === 'All' || event.status === activeTab;
      
      // Search Query Filter (Title & Category)
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            event.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Location Type Filter
      const matchesLocation = filterLocation === 'All' || event.locationType === filterLocation;
      
      // Timeframe Filter (Mocked based on date strings, usually would use real timestamps)
      let matchesTimeframe = true;
      if (filterTimeframe === 'Upcoming') {
        matchesTimeframe = event.status !== EventStatus.Closed;
      } else if (filterTimeframe === 'Past') {
        matchesTimeframe = event.status === EventStatus.Closed;
      }

      return matchesTab && matchesSearch && matchesLocation && matchesTimeframe;
    });
  }, [activeTab, searchQuery, events, filterLocation, filterTimeframe]);

  const resetFilters = () => {
    setFilterLocation('All');
    setFilterTimeframe('All');
    setSearchQuery('');
    setActiveTab('All');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create-event':
        return <CreateEvent onBack={() => setCurrentView('dashboard')} onEventCreated={handleAddEvent} />;
      case 'reports':
        return <ReportsView />;
      case 'dashboard':
      default:
        return (
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {STATS.map((stat, idx) => (
                <StatCard key={idx} metric={{
                  ...stat,
                  value: idx === 0 ? events.length : (idx === 1 ? events.filter(e => e.status === EventStatus.Published).length : (idx === 2 ? events.reduce((acc, curr) => acc + curr.registered, 0) : stat.value))
                }} />
              ))}
            </div>

            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 px-4 text-center border border-gray-100 rounded-[40px] bg-white shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 text-gray-200">
                  <PlusIcon className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Ready to host?</h2>
                <p className="text-gray-400 max-w-sm mb-12 text-base font-medium leading-relaxed">
                  You haven't created any events yet. Start building your community and selling tickets today.
                </p>
                <button 
                  onClick={() => setCurrentView('create-event')}
                  className="bg-[#FF4A00] hover:bg-[#E64200] text-white font-black h-16 px-12 rounded-[20px] shadow-2xl shadow-orange-100 flex items-center gap-4 transition-all active:scale-95"
                >
                  <PlusIcon className="w-6 h-6" /> Create Your First Event
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-6 mb-10">
                  {/* Main Toolbar */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="relative w-full md:w-[400px] group">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#FF4A00] transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Search title or category..." 
                          className="w-full pl-12 pr-6 py-3 bg-white border border-gray-100 focus:border-[#FF4A00]/20 hover:bg-gray-50/50 transition-all rounded-2xl text-sm font-medium outline-none placeholder-gray-400 shadow-sm"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all font-bold text-sm shadow-sm whitespace-nowrap
                          ${showFilters || activeFilterCount > 0 
                            ? 'bg-orange-50 border-orange-100 text-[#FF4A00]' 
                            : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="w-5 h-5 flex items-center justify-center bg-[#FF4A00] text-white text-[10px] rounded-full">
                            {activeFilterCount}
                          </span>
                        )}
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <div className="flex p-1.5 bg-gray-100/60 rounded-2xl border border-gray-50 shadow-sm">
                      {(['All', 'Draft', 'Published', 'Closed'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab as any)}
                          className={`px-6 py-2 text-[13px] font-black rounded-xl transition-all ${
                            activeTab === tab 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expandable Advanced Filters */}
                  {showFilters && (
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/20 flex flex-col md:flex-row gap-10 animate-in slide-in-from-top-4 duration-300">
                      <div className="space-y-4 flex-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location Type</label>
                        <div className="flex flex-wrap gap-2">
                          {(['All', LocationType.Offline, LocationType.Online, LocationType.Hybrid] as const).map((loc) => (
                            <button
                              key={loc}
                              onClick={() => setFilterLocation(loc)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all
                                ${filterLocation === loc 
                                  ? 'bg-black border-black text-white shadow-lg' 
                                  : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                                }
                              `}
                            >
                              {loc === 'All' ? 'All Formats' : loc}
                              {loc === LocationType.Online && <GlobeIcon className="w-3.5 h-3.5" />}
                              {loc === LocationType.Offline && <MapPinIcon className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 flex-1 border-l border-gray-50 pl-10 hidden md:block">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeframe</label>
                        <div className="flex flex-wrap gap-2">
                          {(['All', 'Upcoming', 'Past'] as const).map((time) => (
                            <button
                              key={time}
                              onClick={() => setFilterTimeframe(time as Timeframe)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all
                                ${filterTimeframe === time 
                                  ? 'bg-black border-black text-white shadow-lg' 
                                  : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                                }
                              `}
                            >
                              {time}
                              {time !== 'All' && <CalendarIcon className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-end border-l border-gray-50 pl-10">
                        <button 
                          onClick={resetFilters}
                          className="text-xs font-black text-[#FF4A00] hover:bg-orange-50 px-5 py-3 rounded-xl transition-all uppercase tracking-widest"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-16">
                  {filteredEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      openMenuId={openMenuId}
                      onToggleMenu={handleToggleMenu}
                      onCloseMenu={handleCloseMenu}
                      onDelete={handleDeleteEvent}
                      onStatusUpdate={handleUpdateEventStatus}
                    />
                  ))}
                  {filteredEvents.length === 0 && (
                    <div className="col-span-full py-32 text-center flex flex-col items-center bg-white rounded-[40px] border border-gray-50 shadow-sm">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <SearchIcon className="w-10 h-10 text-gray-200" />
                      </div>
                      <p className="text-gray-400 font-bold text-lg">No matching events found</p>
                      <p className="text-gray-300 text-sm mt-1 mb-8">Try adjusting your filters or search query.</p>
                      <button 
                        onClick={resetFilters}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
    }
  };

  const headerProps = {
    dashboard: { title: "My Events", subtitle: "Manage and monitor all your events", showCreateButton: events.length > 0 },
    'create-event': { title: "Create New Event", subtitle: "Set up your event details and tickets" },
    reports: { title: "Reports Dashboard", subtitle: "Analyze your event performance and data" },
  }[currentView];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activeView={currentView as any} onNavigate={setCurrentView as any} />
      
      <div className="flex-1 ml-64 flex flex-col">
        <Header 
          {...headerProps} 
          onCreateEvent={() => setCurrentView('create-event')} 
        />
        
        <main className="flex-1 px-14 py-10 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;