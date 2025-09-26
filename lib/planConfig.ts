export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export const DAYS = [
  { key: 'Du 01.09', label: 'Du 01.09', date: '2025-09-01' },
  { key: 'Se 02.09', label: 'Se 02.09', date: '2025-09-02' },
  { key: 'Cho 03.09', label: 'Cho 03.09', date: '2025-09-03' },
  { key: 'Pa 04.09', label: 'Pa 04.09', date: '2025-09-04' },
  { key: 'Ju 05.09', label: 'Ju 05.09', date: '2025-09-05' },
  { key: 'Sha 06.09', label: 'Sha 06.09', date: '2025-09-06' },
  { key: 'Ya 07.09', label: 'Ya 07.09', date: '2025-09-07' },
];

export const STATUS_CONFIG = {
  working: {
    text: 'Ishda',
    icon: '🔄',
    colorClass: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400 shadow-sm',
  },
  completed: {
    text: 'Bajarildi',
    icon: '✅',
    colorClass: 'bg-gradient-to-br from-green-50 to-green-100 border-green-400 shadow-sm',
  },
  pending: {
    text: 'Kutilmoqda',
    icon: '⏳',
    colorClass: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 shadow-sm',
  },
};