"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Building2, Home, Calendar, Save } from "lucide-react";
import { SamarqandImageLogo } from "@/components/SamarqandImageLogo";
import { NavoiyImageLogo } from "@/components/NavoiyImageLogo";
import { ToshkentImageLogo } from "@/components/ToshkentImageLogo";
import { NewEventForm } from "@/components/NewEventForm";
import { TIME_SLOTS, DAYS, STATUS_CONFIG } from "@/lib/planConfig";

interface PlanViewProps {
  filial: {
    id: string;
    name: string;
    city: string;
    color: string;
    description: string;
  };
  planId: string;
  events?: ScheduleEvent[];
  onBack: () => void;
}

interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'working' | 'completed';
  time: string;
  day: string;
}

export function PlanView({ filial, planId, events: initialEvents, onBack }: PlanViewProps) {
  const currentDate = new Date('2025-09-04');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<ScheduleEvent[]>(initialEvents || []);

  // State for new event modal
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: string; time: string } | null>(null);

  const timeSlots = TIME_SLOTS;
  const days = DAYS;



  const getFilteredEvents = () => {
    let filteredEvents = events;
    
    if (statusFilter !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.status === statusFilter);
    }
    
    if (searchTerm) {
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredEvents;
  };

  const handleSaveAndExit = () => {
    // Here you would typically save the `events` state to your backend/global store
    console.log('Saqlangan vazifalar:', events);
    onBack();
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
  };

  const getLogoComponent = () => {
    switch (filial.city) {
      case "samarqand":
        return <SamarqandImageLogo size={48} />;
      case "navoiy":
        return <NavoiyImageLogo size={48} />;
      case "toshkent":
        return <ToshkentImageLogo size={48} />;
      default:
        return <Building2 className="h-12 w-12 text-white" />;
    }
  };

  const formatDate = (date: Date) => {
    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  // Handlers for new event modal
  const handleOpenNewEventModal = (day: string, time: string) => {
    setSelectedCell({ day, time });
    setIsNewEventModalOpen(true);
  };

  const handleCloseNewEventModal = () => {
    setSelectedCell(null);
    setIsNewEventModalOpen(false);
  };

  const handleCreateEvent = (eventData: { title: string; description: string }) => {
    if (!selectedCell) return;

    const newEvent: ScheduleEvent = {
      id: uuidv4(),
      title: eventData.title,
      description: eventData.description,
      status: 'pending', // Default status for new events
      day: selectedCell.day,
      time: selectedCell.time,
    };

    setEvents([...events, newEvent]);
    handleCloseNewEventModal();
  };

  const visibleEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {isNewEventModalOpen && selectedCell && (
        <NewEventForm
          day={selectedCell.day}
          time={selectedCell.time}
          onSave={handleCreateEvent}
          onCancel={handleCloseNewEventModal}
        />
      )}

      {/* Header */}
      <header className="bg-blue-900 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {getLogoComponent()}
              <h1 className="ml-3 text-2xl font-bold text-white">
                {filial.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <span className="font-medium">Admin</span>
              </div>
              <div className="text-white text-sm">
                {getCurrentDateTime()}
              </div>
              <button
                onClick={onBack}
                className="bg-white hover:bg-gray-100 text-blue-900 px-3 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Bosh Sahifa</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          
          {/* Plan Header */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Reja #{planId}
                </h2>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{formatDate(currentDate)}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Jami: {visibleEvents.length} ta tadbir
                </span>
                <button
                  onClick={handleSaveAndExit}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Saqlash va Chiqish</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tadbir nomi yoki tavsifini qidiring..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  title="Status bo'yicha filterlash"
                  aria-label="Status bo'yicha filterlash"
                >
                  <option value="all">Barcha statuslar</option>
                  <option value="working">Ishda</option>
                  <option value="completed">Bajarildi</option>
                  <option value="pending">Kutilmoqda</option>
                </select>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm"
                >
                  Tozalash
                </button>
              </div>
            </div>

            {/* Schedule Grid */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200 mt-4">
              <div className="min-w-max">
                {/* Time Header */}
                <div className="grid grid-cols-[100px_repeat(18,_minmax(150px,_1fr))] gap-0">
                  <div className="p-4 text-sm font-semibold text-gray-700 bg-gray-100 border-b border-r border-gray-200 flex items-center justify-center sticky left-0 z-10">
                    <Calendar className="h-4 w-4 mr-2" />
                    Kunlar
                  </div>
                  {timeSlots.map((time) => (
                    <div key={time} className="p-3 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-r border-gray-200 text-center">
                      {time}
                    </div>
                  ))}
                </div>

                {/* Days and Events */}
                {days.map((day) => (
                  <div key={day.key} className="grid grid-cols-[100px_repeat(18,_minmax(150px,_1fr))] gap-0">
                    <div className="p-4 text-sm font-semibold text-gray-800 border-r border-gray-200 flex items-center justify-center bg-gray-100 sticky left-0 z-10">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          {day.key.split(' ')[0]}
                        </div>
                        <div className="text-sm font-bold">
                          {day.key.split(' ')[1]}
                        </div>
                      </div>
                    </div>
                    {timeSlots.map((time) => {
                      const event = visibleEvents.find(e => e.day === day.key && e.time === time);
                      return (
                        <div 
                          key={`${day.key}-${time}`} 
                          className={`p-1.5 min-h-[100px] border-r border-b border-gray-200 transition-colors duration-200 ${!event ? 'hover:bg-blue-50' : ''}`}
                          onClick={() => !event && handleOpenNewEventModal(day.key, time)}
                        >
                          {event ? (
                            <div className={`p-2 rounded-lg border h-full cursor-pointer hover:shadow-md transition-all duration-200 ${STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG]?.colorClass || STATUS_CONFIG.pending.colorClass}`}>
                              <div className="flex items-start justify-between mb-1">
                                <div className="text-xs font-bold text-gray-800 leading-tight flex-1">
                                  {event.title}
                                </div>
                                <div className="text-base ml-2">
                                  {STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG]?.icon || STATUS_CONFIG.pending.icon}
                                </div>
                              </div>
                              {event.description && (
                                <div className="text-xs text-gray-600 mb-2 leading-tight">
                                  {event.description}
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-auto">
                                <div className="text-xs font-semibold text-gray-700">
                                  {STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG]?.text || STATUS_CONFIG.pending.text}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center cursor-pointer group">
                              <div className="w-5 h-5 text-gray-300 rounded-full group-hover:text-blue-500 transition-all flex items-center justify-center">
                                +
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Hint */}
            <div className="mt-4 text-center text-sm text-gray-500">
              - Vaqtlarni ko&apos;rish uchun jadvalni chapga-o&apos;ngga suring -
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}