
"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface NewEventFormProps {
  day: string;
  time: string;
  onSave: (eventData: { title: string; description: string }) => void;
  onCancel: () => void;
}

export function NewEventForm({ day, time, onSave, onCancel }: NewEventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!title) {
      alert("Vazifa nomini kiriting.");
      return;
    }
    onSave({ title, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Yangi Vazifa Yaratish</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Yopish"
            aria-label="Yopish"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Vaqt:</span> {day}, {time}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vazifa Nomi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mijoz bilan uchrashuv..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tavsif (Ixtiyoriy)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Qisqacha ma'lumot..."
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Saqlash
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
}
