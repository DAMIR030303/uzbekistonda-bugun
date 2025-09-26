# System Design — Umumiy Ko‘rinish

Ushbu hujjat ilovaning arxitektura dizaynini soddalashtirilgan C4 kontekstida tushuntiradi va mavjud arxitektura yozuvlari bilan bog‘laydi.

## 1. Kontekst
- Foydalanuvchi: Admin/Operator/Kuzatuvchi.
- Ilova: Next.js 14 frontend (App Router).
- Xizmatlar: Supabase (Auth, DB, Storage, Realtime) — kelgusida to‘liq ulanish.
- Deploy: Vercel (tavsiya), statik va SSR/ISR.

## 2. Konteynerlar
- Web App (Next.js + React + TS)
  - UI, i18n, holat, data fetching.
  - Portlar: HTTP(s), static assets.
- Supabase (kelgusida)
  - Auth, Postgres, Storage, Realtime.
  - Portlar: REST/RPC/Event (Realtime) orqali muloqot.

## 3. Komponentlar
- UI Komponentlari (`components/`): Logo bloklari, formalar, modal/dialoglar.
- Holat (`lib/store`): `zustand` bilan global holat.
- Data (`@tanstack/react-query`): serverdan ma’lumot olish va keshlash.
- I18n (`next-intl`): Tilga mos matnlar.
- Validatsiya (`zod`): Forma va API javoblari validatsiyasi.

## 4. Ports & Adapters
- Ports: UI eventlari, HTTP chaqiriqlar (kelgusida edge routes), Supabase client.
- Adapters: TanStack Query fetcher’lari, Supabase SDK, mapper/serializer’lar.

Bog‘liq hujjatlar:
- `ARCHITECTURE/PORTS_AND_ADAPTERS.md`
- `ARCHITECTURE/DB_OPTIONS.md`
- `ARCHITECTURE/SUPABASE_STORAGE.md`
- `ARCHITECTURE/REALTIME.md`

## 5. Cross-Cutting
- Xavfsizlik: Muhit o‘zgaruvchilari, RLS, minimal huquq.
- Logging/Monitoring: brauzer devtools (boshlang‘ich), kelgusida server loglari.
- Performance: SSG/ISR, caching, lazy-loading.

## 6. Katalog Tashkili (asosiy)
- `app/` — sahifa va layoutlar (App Router).
- `components/` — UI bloklar.
- `lib/` — store, mijozlar, utils.
- `public/` — aktivlar (logo, rasm).
- `PRODUCT/`, `ARCHITECTURE/`, `OPERATIONS/`, `SECURITY/`, `TESTING/` — hujjatlar.

## 7. Evolyutsiya
- 1-bosqich: Frontend + mock parol.
- 2-bosqich: Supabase Auth, RLS, real DB.
- 3-bosqich: Realtime, hisobotlar, audit.

