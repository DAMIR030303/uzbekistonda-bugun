export interface Filial {
  id: string;
  name: string;
  city: string;
  color: string;
  description: string;
}

export const FILIALS: Filial[] = [
  {
    id: "navoiy",
    name: "Navoiyda Bugun",
    city: "navoiy",
    color: "navoiy",
    description: "Navoiy viloyati boshqaruv markazi",
  },
  {
    id: "samarqand",
    name: "Samarqandda Bugun",
    city: "samarqand",
    color: "samarqand",
    description: "Samarqand viloyati boshqaruv markazi",
  },
  {
    id: "toshkent",
    name: "Toshkentda Bugun",
    city: "toshkent",
    color: "toshkent",
    description: "Toshkent viloyati boshqaruv markazi",
  }
];

export const ACTIVE_USERS_COUNT = 24;

export const COLOR_CLASSES = {
  navoiy: 'bg-blue-500 text-white',
  samarqand: 'bg-green-500 text-white',
  toshkent: 'bg-red-500 text-white',
};