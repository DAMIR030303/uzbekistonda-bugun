Xato ■11
- **Tavsif:** Supabase URL va Anon Key kodda ochiq saqlanmoqda (Hardcoded).
- **Sabab:** `supabaseUrl` va `supabaseAnonKey` to'g'ridan-to'g'ri `lib/supabase.ts` faylida o'zgaruvchi sifatida e'lon qilingan. Garchi bu anonim kalit bo'lsa-da, eng yaxshi amaliyot (best practice) bu kabi konfiguratsiyalarni muhit o'zgaruvchilariga (`.env` fayli) joylashtirishdir.
- **Yechim:** Kalitlarni `.env.local` fayliga ko'chirish va Next.js qoidalariga ko'ra `NEXT_PUBLIC_` prefiksi bilan `process.env` orqali o'qish kerak. Bu kalitlarni markazlashtirilgan holda boshqarishni va xavfsizlikni oshiradi.

Namuna:
1. `.env.local` fayliga qo'shing:
'''
NEXT_PUBLIC_SUPABASE_URL=https://hrblmrpkwdqdjdlnkrnl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyYmxtcnBrd2RxZGpkbG5rcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTkzMzcsImV4cCI6MjA3MjU5NTMzN30.IS5sPma9P9K2dveD_fGoTv5V9siJwFhKlOccEoQ6SzM
'''

2. `lib/supabase.ts` faylini o'zgartiring:
'''typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// ... qolgan kod
'''

---

Xato ■12
- **Tavsif:** Katta va monolit (bitta butun) global holat menejeri (Zustand store).
- **Sabab:** `useAppStore` o'z ichiga autentifikatsiya, tashkilotlar, filiallar, rejalar va vazifalar kabi bir-biriga bog'liq bo'lmagan bir nechta sohalarning (domains) holati va amallarini jamlagan. Bu "Single Responsibility Principle"ga zid va state-manager'ni murakkablashtiradi.
- **Yechim:** Zustand "slices" (qismlar) patternidan foydalanib, har bir soha uchun alohida state-manager yaratish va ularni keyin birlashtirish. Bu kodni modulli va tushunarli qiladi.

Namuna:
'''typescript
// lib/slices/authSlice.ts
export const createAuthSlice = (set, get) => ({
  user: null,
  // ...boshqa auth state'lari va action'lari
  signIn: async (email, password) => { /* ... */ },
});

// lib/slices/dataSlice.ts
export const createDataSlice = (set, get) => ({
  plans: [],
  tasks: [],
  // ...boshqa data state'lari va action'lari
  loadPlans: async (orgId) => { /* ... */ },
});

// lib/store.ts (asosiy fayl)
import { create } from 'zustand';
import { createAuthSlice } from './slices/authSlice';
import { createDataSlice } from './slices/dataSlice';

export const useAppStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createDataSlice(...a),
}));
'''

---

Xato ■13
- **Tavsif:** CRUD (Create, Read, Update, Delete) amallaridan keyin ma'lumotlarni qayta yuklash samarasiz.
- **Sabab:** `createPlan`, `updatePlan`, `deletePlan` kabi amallardan so'ng, o'zgarishlarni aks ettirish uchun barcha rejalar ro'yxati (`loadPlans`) serverdan qaytadan to'liq yuklanmoqda. Bu tarmoq trafigini oshiradi va ilova ishlashini sekinlashtiradi.
- **Yechim:** Optimistik yangilanish (Optimistic UI) yoki lokal keshni to'g'ridan-to'g'ri manipulyatsiya qilish. Ya'ni, amal muvaffaqiyatli bajarilgandan so'ng, serverdan hamma ma'lumotni qayta so'rash o'rniga, faqat o'zgargan qismni lokal holatda (Zustand store ichida) yangilash kerak.

Namuna (`createPlan` uchun):
'''typescript
createPlan: async (plan: any) => {
  set({ isLoading: true, error: null });
  try {
    const newPlan = await SupabaseService.createPlan(plan);
    // Butun ro'yxatni qayta yuklash o'rniga, yangisini qo'shish:
    set((state) => ({ plans: [...state.plans, newPlan] }));
  } catch (error: any) {
    set({ error: error.message });
  } finally {
    set({ isLoading: false });
  }
},
'''

---

Xato ■14
- **Tavsif:** `PlanView` komponentida statik ma'lumotlar va takrorlanuvchi logika mavjud.
- **Sabab:** Komponent ichida kunlar (`days`), vaqt oraliqlari (`timeSlots`) kabi ma'lumotlar statik massiv sifatida qattiq kodlangan. Shuningdek, `getStatusColor`, `getStatusText`, `getStatusIcon` kabi funksiyalar bir xil `switch` mantig'ini takrorlaydi.
- **Yechim:** 
1.  `days` va `timeSlots` kabi ma'lumotlarni `lib/constants.ts` fayliga chiqarish yoki ularni dinamik generatsiya qiladigan funksiyalar yaratish.
2.  Status bilan bog'liq logikani bitta konfiguratsiya ob'ektiga jamlash.

Namuna (status uchun konfiguratsiya):
'''typescript
// lib/config.ts
export const STATUS_CONFIG = {
  working: {
    text: 'Ishda',
    icon: '🔄',
    colorClass: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400',
  },
  completed: {
    text: 'Bajarildi',
    icon: '✅',
    colorClass: 'bg-gradient-to-br from-green-50 to-green-100 border-green-400',
  },
  // ...boshqa statuslar
};

// Komponentda ishlatilishi:
// const statusInfo = STATUS_CONFIG[event.status];
'''

---

Xato ■15
- **Tavsif:** Test skripti mavjud, lekin loyihada birorta ham test yozilmagan.
- **Sabab:** `package.json` faylida `jest`, `@testing-library/react` kabi test kutubxonalari o'rnatilgan va `test` skripti mavjud, ammo `__tests__` papkasi yoki `*.test.ts(x)` fayllari yo'q.
- **Yechim:** Dastur barqarorligini ta'minlash uchun muhim logikani (masalan, `lib/store.ts`dagi amallar, murakkab komponentlar) unit-testlar bilan qoplashni boshlash kerak. Agar testlar yozilmasa, unda keraksiz bog'liqliklarni va skriptni olib tashlash mumkin. Ammo barqaror dastur uchun testlar yozish muhim hisoblanadi.
