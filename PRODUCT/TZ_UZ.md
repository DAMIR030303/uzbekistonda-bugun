# Texnik Topshiriq (TZ) — "UZBEKISTONDA BUGUN" tizimi

Bu hujjat loyiha bo‘yicha to‘liq texnik topshiriqni (TZ) belgilaydi: maqsad, funksional va nofunksional talablar, arxitektura, ishlatiladigan texnologiyalar, fayl strukturasi, xavfsizlik va testlash mezonlari, deploy strategiyasi hamda qabul qilish mezonlari.

## 1. Maqsad va Qamrov
- Maqsad: Viloyatlar bo‘yicha (Navoiy, Samarqand, Toshkent) boshqaruv paneli va foydalanuvchi interfeysini taqdim etish, filial tanlash, autentifikatsiya (admin paroli), holatni ko‘rish va keyingi modullar (hisobotlar, vazifalar) uchun tayanch yaratish.
- Qamrov: Frontend Next.js 14 (App Router) ilovasi, Supabase integratsiyasi (kelgusida), holat boshqaruvi, i18n, UI komponentlari, xavfsizlik va deploy yo‘riqnomalari.

## 2. Foydalanuvchi Rollari
- Admin: Tanlangan filial uchun tizimga kirish, boshqaruv funksiyalaridan foydalanish.
- Operator (kelgusida): Vazifalar/hisobotlar bilan ishlash.
- Kuzatuvchi (kelgusida): Faqat ko‘rish huquqi.

## 3. Funksional Talablar
- Filial tanlash: Foydalanuvchi viloyat filialini tanlay oladi.
- Admin kirishi: Har bir filialga mos parol orqali kirish.
- UI: Logotiplar (Samarqand, Navoiy, Toshkent) bilan brending.
- Holat boshqaruvi: `zustand` yordamida joriy filial/organizatsiyani saqlash.
- Xalqaro til (i18n): `next-intl` bilan ko‘p tillilikka tayyor arxitektura.
- Ma’lumot qatlami: `@tanstack/react-query` bilan ma’lumot olish (kelgusida Supabase/API bilan ulanadi).

## 4. Nofunksional Talablar
- Ishlash samaradorligi: Next.js SSG/ISR/SSR imkoniyatlaridan foydalanish.
- Xavfsizlik: Muhit o‘zgaruvchilari, roli asosidagi kirish, minimal huquqlar tamoyili.
- Moslashuvchan UI: Tailwind CSS bilan responsiv dizayn.
- Sinov: Jest + Testing Library bilan komponentlar sathi testlari.
- Kuzatuv: Konsol va brauzer devtools; (kelgusida) monitoring/logging.

## 5. Ishlatiladigan Texnologiyalar
- Next.js 14, React 18, TypeScript 5
- Tailwind CSS, Radix UI
- Zustand (holat), TanStack Query (data), Zod (validatsiya)
- next-intl (i18n)
- Supabase JS SDK (kelgusida backend xizmatlari uchun)

## 6. Arxitektura Ko‘rinishi
- App Router: `app/` katalogi orqali sahifalar va layoutlar.
- UI komponentlari: `components/` ichida qayta ishlatiladigan bloklar.
- Holat va kutubxonalar: `lib/` ichida store, mijozlar, util-funksiyalar.
- Statik aktivlar: `public/` ichida rasm va logo fayllari.
- Arxitektura hujjatlari: `ARCHITECTURE/` (ports & adapters, storage, realtime).

Bog‘liq hujjatlar:
- `ARCHITECTURE/PORTS_AND_ADAPTERS.md`
- `ARCHITECTURE/DB_OPTIONS.md`
- `ARCHITECTURE/REALTIME.md`
- `ARCHITECTURE/SUPABASE_STORAGE.md`
- `ARCHITECTURE/SYSTEM_DESIGN_UZ.md` (ushbu TZ bilan birga qo‘shildi)

## 7. Ma’lumotlar Modeli (boshlang‘ich)
- Filial: `{ id: string; name: string; city: 'navoiy'|'samarqand'|'toshkent'; description: string }`
- Admin parol konfiguratsiyasi: mintaqaga bog‘liq parollar (hozircha frontdagi mock; kelgusida server/storage).

## 8. API Shartnomalari
- Joriy bosqich: Frontend ichida mock/parol tekshirish.
- Kelgusi bosqich: Supabase yoki edge-route orqali autentifikatsiya va roli asosida ruxsat.
- Hujjat: `API/EDGE_HTTP_CONTRACTS.md`, `API/ENDPOINTS_UZ.md`.

## 9. UI Dizayn Tamoyillari
- Brending: Har bir filial uchun alohida logo va rang sxemasi.
- Accessibility: Kontrast, klaviatura bilan boshqarish, ARIA teglar (kelgusida to‘liq qamrov).
- Komponentlar: Radix UI + Tailwind; `class-variance-authority` va `tailwind-merge` bilan stil boshqaruvi.

## 10. Fayl Struktura (asosiy)
- `app/`: Ilova sahifalari. Masalan: `app/page.tsx` — filial tanlash va admin kirishi UI.
- `components/`: UI komponentlar (masalan, `components/SamarqandImageLogo.tsx`).
- `lib/`: Holat (`lib/store`), util va mijozlar.
- `public/images/logos/`: Logotiplar.
- `PRODUCT/`, `ARCHITECTURE/`, `OPERATIONS/`, `SECURITY/`, `TESTING/`: hujjatlar.

## 11. Muhit O‘zgaruvchilari
- `.env.example` fayli kiritildi; unda Next.js va Supabase uchun kerakli o‘zgaruvchilar keltirilgan.
- Vercel dagi sozlamalar: `OPERATIONS/VERCEL_ENV.md` va `OPERATIONS/ENV_TEMPLATES.md` bilan muvofiqlikda.

## 12. Xavfsizlik
- Parollarni klientda saqlamaslik (hozirgi mock vaqtincha). Kelgusida server tarafda tekshirish.
- Supabase kalitlarini to‘g‘ri bo‘lishi: faqat `NEXT_PUBLIC_*` mijozda foydalaniladi.
- RLS va ro‘yxatlar: `SECURITY/RLS_TESTS.md` ga qarang (kelgusida to‘ldiriladi).

## 13. Testlash Strategiyasi
- Birlik testlari: Jest + Testing Library bilan komponentlar va util-funksiyalar.
- E2E (kelgusida): Realtime va kirish ssenariylari uchun end-to-end.
- Hujjat: `TESTING/REALTIME_E2E.md`, `TESTING/MOCKING_STRATEGY.md`.

## 14. CI/CD va Deploy
- Mahalliy: `npm run dev` bilan ishga tushirish.
- Build: `npm run build` -> `.next/` artefaktlar.
- Deploy: Vercel tavsiya etiladi; muhit o‘zgaruvchilari tayyor bo‘lishi shart.

## 15. Qabul Qilish Mezonlari
- Filial tanlash sahifasi ishlaydi, logolar to‘g‘ri ko‘rinadi.
- Admin paroli UI orqali tekshiriladi (mock), xatolik holatlari ko‘rsatiladi.
- Fayl struktura va hujjatlar to‘liq: ushbu TZ, `.env.example`, API va dizayn yozuvlari mavjud.
- Lint va typecheck xatosiz: `npm run lint`, `npm run typecheck`.

## 16. Roadmap (kelgusida)
- Server taraf autentifikatsiya va roli asosida ruxsat.
- Supabase jadval va RLS siyosatlari.
- Hisobotlar, vazifalar modullari, monitoring/logging, audit.

