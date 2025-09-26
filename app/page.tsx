"use client";

import { Building2, MapPin, Users } from "lucide-react";
import { useState } from "react";

import { SamarqandImageLogo } from "@/components/SamarqandImageLogo";
import { NavoiyImageLogo } from "@/components/NavoiyImageLogo";
import { ToshkentImageLogo } from "@/components/ToshkentImageLogo";
import { AdminLogin } from "@/components/AdminLogin";
import { useAppStore } from "@/lib/store";
import { FILIALS, ACTIVE_USERS_COUNT, COLOR_CLASSES, type Filial } from "@/lib/constants";

export default function HomePage() {
  const [selectedFilial, setSelectedFilial] = useState<Filial | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { organizations, setCurrentOrganization } = useAppStore();

  // Barcha filiallar uchun parollar
  const filialPasswords = {
    navoiy: process.env.NEXT_PUBLIC_NAVOIY_PASSWORD,
    samarqand: process.env.NEXT_PUBLIC_SAMARQAND_PASSWORD,
    toshkent: process.env.NEXT_PUBLIC_TOSHKENT_PASSWORD
  };

  // Barcha filiallar
  const filiallar = FILIALS;

  const handleFilialSelect = (filial: Filial) => {
    setSelectedFilial(filial);

    // If we have real organization data, set it
    if (organizations.length > 0) {
      const organization = organizations.find((org) => org.id === filial.id);
      if (organization) {
        setCurrentOrganization(organization);
      }
    }

    console.log("Tanlangan filial:", filial);
  };

  const handleTizimgaKirish = () => {
    if (selectedFilial) {
      const correctPassword = filialPasswords[selectedFilial.city as keyof typeof filialPasswords];
      
      if (password === correctPassword) {
        setError("");
        setShowAdminLogin(true);
      } else {
        setError("Noto'g'ri parol! Qaytadan urinib ko'ring.");
      }
    }
  };

  const handleBackToHome = () => {
    setShowAdminLogin(false);
    setSelectedFilial(null);
    setPassword("");
    setError("");
  };


  // Agar admin login sahifasi ko'rsatilayotgan bo'lsa
  if (showAdminLogin && selectedFilial) {
    return (
      <AdminLogin
        filial={selectedFilial}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700">
      {/* Header */}
      <header className="bg-blue-900 shadow-lg rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-white" />
              <h1 className="ml-2 text-2xl font-bold text-white">
                Boshqaruv
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Mobile Hero */}
        <div className="block sm:hidden text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Assalomu alaykum,
          </h2>
          <h3 className="text-xl font-bold text-white mb-3">
            {selectedFilial ? `${selectedFilial.name} Xush Kelibsiz!` : "Xush Kelibsiz!"}
          </h3>
          <p className="text-sm text-blue-100 px-4">
            {selectedFilial 
              ? `${selectedFilial.name} filialiga kirish uchun admin parolini kiriting.`
              : "Bugun uchun ish rejangizni boshlash uchun hududni tanlang."
            }
          </p>
        </div>

        {/* Desktop Hero */}
        <div className="hidden sm:block text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Assalomu alaykum,
          </h2>
          <h3 className="text-3xl font-bold text-white mb-4">
            {selectedFilial ? `${selectedFilial.name} Xush Kelibsiz!` : "Xush Kelibsiz!"}
          </h3>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {selectedFilial 
              ? `${selectedFilial.name} filialiga kirish uchun admin parolini kiriting.`
              : "Bugun uchun ish rejangizni boshlash uchun hududni tanlang."
            }
          </p>
        </div>

        {/* Barcha filiallar */}
        {!selectedFilial && (
          <>
            {/* Mobile Filial Cards */}
            <div className="block sm:hidden space-y-4 px-4">
              {filiallar.map((filial) => (
                <div
                  key={filial.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 cursor-pointer transition-all duration-300 active:scale-95 border-2 border-transparent hover:shadow-xl"
                  onClick={() => handleFilialSelect(filial)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {filial.city === "samarqand" ? (
                        <SamarqandImageLogo size={48} />
                      ) : filial.city === "navoiy" ? (
                        <NavoiyImageLogo size={48} />
                      ) : filial.city === "toshkent" ? (
                        <ToshkentImageLogo size={48} />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${COLOR_CLASSES[filial.color as keyof typeof COLOR_CLASSES]}`}
                        >
                          <MapPin className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {filial.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{filial.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>Faol foydalanuvchilar: {ACTIVE_USERS_COUNT}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Filial Cards */}
            <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {filiallar.map((filial) => (
                <div
                  key={filial.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-transparent active:scale-95"
                  onClick={() => handleFilialSelect(filial)}
                >
                  <div className="flex items-center justify-center mb-4">
                    {filial.city === "samarqand" ? (
                      <SamarqandImageLogo size={32} />
                    ) : filial.city === "navoiy" ? (
                      <NavoiyImageLogo size={32} />
                    ) : filial.city === "toshkent" ? (
                      <ToshkentImageLogo size={32} />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${COLOR_CLASSES[filial.color as keyof typeof COLOR_CLASSES]}`}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                    {filial.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-center text-sm">{filial.description}</p>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Faol foydalanuvchilar: {ACTIVE_USERS_COUNT}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Selected Filial Info - faqat filial tanlanganda ko'rsatish */}
        {selectedFilial && (
          <div className="mt-4 sm:mt-8 max-w-2xl mx-auto px-4 sm:px-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 sm:p-8">
              {/* Mobile Filial Info */}
              <div className="block sm:hidden text-center mb-6">
                <div className="flex justify-center mb-3">
                  {selectedFilial.city === "samarqand" ? (
                    <SamarqandImageLogo size={56} />
                  ) : selectedFilial.city === "navoiy" ? (
                    <NavoiyImageLogo size={56} />
                  ) : selectedFilial.city === "toshkent" ? (
                    <ToshkentImageLogo size={56} />
                  ) : (
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center bg-${selectedFilial.color}-primary text-white`}
                    >
                      <MapPin className="h-7 w-7" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedFilial.name}
                </h3>
                <p className="text-base text-blue-600 font-medium mb-2">
                  Xush Kelibsiz!
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedFilial.description}
                </p>
              </div>

              {/* Desktop Filial Info */}
              <div className="hidden sm:block text-center mb-6">
                <div className="flex justify-center mb-4">
                  {selectedFilial.city === "samarqand" ? (
                    <SamarqandImageLogo size={64} />
                  ) : selectedFilial.city === "navoiy" ? (
                    <NavoiyImageLogo size={64} />
                  ) : selectedFilial.city === "toshkent" ? (
                    <ToshkentImageLogo size={64} />
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center bg-${selectedFilial.color}-primary text-white`}
                    >
                      <MapPin className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedFilial.name}
                </h3>
                <p className="text-lg text-blue-600 font-medium mb-2">
                  Xush Kelibsiz!
                </p>
                <p className="text-gray-600 mb-6">
                  {selectedFilial.description}
                </p>
              </div>
              
              {/* Parol kiritish joyi */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Paroli
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTizimgaKirish()}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                  placeholder="Parolni kiriting..."
                />
                {error && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600">{error}</p>
                )}
                
                {/* Kirish tugmasi */}
                <button
                  onClick={handleTizimgaKirish}
                  className="w-full mt-3 sm:mt-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2 sm:py-3 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                >
                  Kirish
                </button>
              </div>
              
              <div className="flex space-x-2 sm:space-x-4">
                <button
                  onClick={() => {
                    setSelectedFilial(null);
                    setPassword("");
                    setError("");
                  }}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                >
                  Orqaga
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-t rounded-t-2xl mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-semibold">Boshqaruv</h3>
              </div>
              <p className="text-blue-100 mb-2">&copy; 2025 Boshqaruv. Barcha huquqlar himoyalangan.</p>
              <div className="flex justify-center space-x-4 text-sm text-blue-200">
                <span>• Samarqandda Bugun</span>
                <span>• Navoiyda Bugun</span>
                <span>• Toshkentda Bugun</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
