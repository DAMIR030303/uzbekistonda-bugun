"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Building2, ArrowRight, Home, X, Calendar, Hash, Plus } from "lucide-react";
import { SamarqandImageLogo } from "@/components/SamarqandImageLogo";
import { NavoiyImageLogo } from "@/components/NavoiyImageLogo";
import { ToshkentImageLogo } from "@/components/ToshkentImageLogo";
import { PlanView } from "@/components/PlanView";

interface AdminLoginProps {
  filial: {
    id: string;
    name: string;
    city: string;
    color: string;
    description: string;
  };
  onBack: () => void;
}

interface Plan {
  id: string;
  title: string;
  startDate: string;
  eventsCount: number;
  events?: ScheduleEvent[];
}

interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'working' | 'completed';
  time: string;
  day: string;
}

export function AdminLogin({ filial, onBack }: AdminLoginProps) {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "plan-1",
      title: `${filial.name} Rejasi #1`,
      startDate: "2025-09-04",
      eventsCount: 8,
      events: [
        { id: '1', title: 'sadasd', description: 'dasdas', status: 'working', time: '09:00', day: 'Du 01.09' },
        { id: '2', title: 'ewrwerfsdf', description: 'fsdfsd', status: 'working', time: '09:30', day: 'Du 01.09' },
        { id: '3', title: 'sdfsdfsdf', description: 'sdfsdf', status: 'completed', time: '10:00', day: 'Du 01.09' },
        { id: '4', title: 'asdsad', description: 'asdas', status: 'working', time: '09:00', day: 'Se 02.09' },
        { id: '5', title: 'dasdasd', description: 'dasdas', status: 'completed', time: '09:00', day: 'Cho 03.09' },
        { id: '6', title: 'dasdsada', description: '', status: 'pending', time: '09:00', day: 'Pa 04.09' },
        { id: '7', title: 'fsdfsdf', description: 'fsdfsdf', status: 'working', time: '09:00', day: 'Ju 05.09' },
        { id: '8', title: 'fsefsef', description: 'esfse', status: 'working', time: '09:30', day: 'Sha 06.09' },
      ]
    },
    {
      id: "plan-2",
      title: `${filial.name} Rejasi #2`,
      startDate: "2025-09-04",
      eventsCount: 7,
      events: [
        { id: '1', title: 'sadasd', description: 'dasdas', status: 'working', time: '09:00', day: 'Du 01.09' },
        { id: '2', title: 'ewrwerfsdf', description: 'fsdfsd', status: 'working', time: '09:30', day: 'Du 01.09' },
        { id: '3', title: 'sdfsdfsdf', description: 'sdfsdf', status: 'completed', time: '10:00', day: 'Du 01.09' },
        { id: '4', title: 'asdsad', description: 'asdas', status: 'working', time: '09:00', day: 'Se 02.09' },
        { id: '5', title: 'dasdasd', description: 'dasdas', status: 'completed', time: '09:00', day: 'Cho 03.09' },
        { id: '6', title: 'dasdsada', description: '', status: 'pending', time: '09:00', day: 'Pa 04.09' },
        { id: '7', title: 'fsdfsdf', description: 'fsdfsdf', status: 'working', time: '09:00', day: 'Ju 05.09' },
      ]
    }
  ]);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [showPlanView, setShowPlanView] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState({
    title: "",
    startDate: "",
    eventsCount: 0
  });

  // Load plans from localStorage on mount
  useEffect(() => {
    const savedPlans = localStorage.getItem(`plans-${filial.id}`);
    if (savedPlans) {
      try {
        setPlans(JSON.parse(savedPlans));
      } catch (error) {
        console.error('Error loading plans from localStorage:', error);
      }
    }
  }, [filial.id]);

  // Save plans to localStorage whenever plans change
  useEffect(() => {
    localStorage.setItem(`plans-${filial.id}`, JSON.stringify(plans));
  }, [plans, filial.id]);

  const handlePlanOpen = (planId: string) => {
    setSelectedPlanId(planId);
    setShowPlanView(true);
    console.log(`${filial.name} Rejasi #${planId} ochildi`);
  };

  const handleNewPlan = () => {
    setShowNewPlanForm(true);
  };

  const handleCreatePlan = () => {
    if (newPlan.title && newPlan.startDate) {
      const planId = uuidv4();
      const plan: Plan = {
        id: planId,
        title: newPlan.title,
        startDate: newPlan.startDate,
        eventsCount: newPlan.eventsCount || 0,
        events: [] // Yangi reja bo'sh jadval bilan yaratiladi (empty schedule)
      };

      setPlans([...plans, plan]);
      setNewPlan({ title: "", startDate: "", eventsCount: 0 });
      setShowNewPlanForm(false);
      console.log("Yangi reja yaratildi:", plan);
    }
  };

  const handleBackFromPlan = () => {
    setShowPlanView(false);
    setSelectedPlanId(null);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId));
    console.log(`${filial.name} Rejasi #${planId} o'chirildi`);
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

  // Agar PlanView ko'rsatilayotgan bo'lsa
  if (showPlanView && selectedPlanId) {
    const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
    return (
      <PlanView
        filial={filial}
        planId={selectedPlanId}
        events={selectedPlan?.events}
        onBack={handleBackFromPlan}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Header */}
      <header className="bg-blue-900 shadow-lg">
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
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                <span>Chiqish</span>
              </button>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Content */}
        <div className="space-y-6">
          {/* Sync Bar */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700 font-medium">
                  Barcha qurilmalarda sinxronizatsiya
                </span>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Yangilash</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium">
                  Rejalar Ro&apos;yxati ({plans.length})
                </button>
                <button className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  Reja
                </button>
              </div>
              <button 
                onClick={handleNewPlan}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Yangi Reja</span>
              </button>
            </div>
          </div>

          {/* New Plan Form Modal */}
          {showNewPlanForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Yangi Reja Yaratish</h3>
                  <button
                    onClick={() => setShowNewPlanForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Yopish"
                    aria-label="Yopish"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reja nomi
                    </label>
                    <input
                      type="text"
                      value={newPlan.title}
                      onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Reja nomini kiriting..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boshlanish sanasi
                    </label>
                    <input
                      type="date"
                      value={newPlan.startDate}
                      onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Boshlanish sanasi"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tadbirlar soni
                    </label>
                    <input
                      type="number"
                      value={newPlan.eventsCount}
                      onChange={(e) => setNewPlan({...newPlan, eventsCount: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tadbirlar sonini kiriting..."
                      min="0"
                      aria-label="Tadbirlar soni"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleCreatePlan}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Yaratish
                  </button>
                  <button
                    onClick={() => setShowNewPlanForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {plan.title}
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Boshlanish sanasi: {plan.startDate}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Hash className="h-5 w-5 mr-2" />
                    <span>{plan.eventsCount} ta rejalashtirilgan tadbir</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleDeletePlan(plan.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    🗑️
                  </button>
                  <button 
                    onClick={() => handlePlanOpen(plan.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                  >
                    <span>Ochish</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}