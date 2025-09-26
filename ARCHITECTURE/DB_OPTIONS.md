# Ma'lumotlar bazasi va backend variantlari (bepulga yaqin)

## Tavsiya (MVP uchun)
**Supabase (PostgreSQL)** — Auth + Storage + Realtime + RLS hammasi bilan tayyor. Bizning UI/flow va RBAC/RLS talablarimizga eng mos.
- Afzallik: tez start, Postgres, RLS, Edge Functions, Storage, Realtime bitta joyda.
- Kamchilik: vendor xususiy integratsiyalari; lekin ORM va S3-API bilan vendor-lockni kamaytirish mumkin.
- Tavsiya: **Drizzle ORM** yoki **Prisma** bilan migratsiyalarni o‘z repoingizda saqlang; fayllar uchun S3-compatible saqlashga mos interfeys yozing (kelajakda R2/S3’ga ko‘chirish oson bo‘ladi).

## Muqobillar (bepul / arzon)
### 1) Neon (Serverless Postgres) + modul yondashuv
- **DB**: Neon Postgres (serverless, bepul bosqich bor)
- **Auth**: Auth.js (NextAuth) yoki Lucia
- **Realtime**: Pusher/Ably/Liveblocks (kichik bepul bosqichlar bor) yoki Hasura (GraphQL + realtime)
- **Storage**: Cloudflare R2 (arzon), yoki Uploadcare/Uploadthing
- **RLS**: Postgres darajasida mavjud, ammo JWT orqali backend/Hasura bilan bog‘lash kerak
- **Qiyinchilik**: qismlarni siz birlashtirasiz → sozlash va xavfsizlikni o‘zingiz boshqarasiz

### 2) Nhost (Postgres + Hasura + Auth + Storage)
- Supabase’ga o‘xshash “hammasi bitta” model, GraphQL-first (Hasura)
- RLS o‘rniga Hasura permissionlari; realtime GraphQL subscriptions
- Bepul developer bosqichi mavjud

### 3) PocketBase (Go + SQLite + Realtime + Auth + File)
- Juda yengil va tez; Fly.io/Render’da bepul bosqichda ishga tushirish mumkin
- O‘rnatilgan auth, realtime va fayl saqlash, admin panel mavjud
- SQL Postgres emas; keyin Postgres’ga ko‘chirish qo‘shimcha ish talab qiladi

### 4) Firebase (Firestore + Auth + Storage)
- Realtime kuchli, SDK’lar qulay; Next.js bilan yaxshi mos
- SQL/RLS yo‘q; security rules orqali multi-tenant; migratsiya va so‘rovlar modeli farqli

### 5) Vercel Postgres (Neon asosida)
- Next.js bilan juda mos; serverless Postgres
- Auth/Storage/Realtime’ni alohida tanlaysiz (Auth.js, R2, Pusher va h.k.)

### 6) Directus (Headless CMS) + Postgres
- Kontent boshqarish kuchli; RBAC bor; media bilan qulay
- Rejalashtirish/tadbir logikasini siz yozasiz yoki webhooklar bilan bog‘laysiz

## Qaysi holatda qaysi biri?
- **SQL + RLS + Realtime + Storage + Auth bitta joyda** → **Supabase** (bizning holat)
- **GraphQL-first + granular ruxsatlar + subscriptions** → **Nhost/Hasura**
- **Eng yengil va tez MVP** → **PocketBase**
- **Serverless Postgres kerak, lekin modul tanlashni o‘zingiz xohlaysiz** → **Neon + Auth.js + R2 + (Pusher/Liveblocks)**
- **Google ekotizimi bilan mahkam integratsiya** → **Firebase**

## Vendor-lock’ni kamaytirish uchun amaliy qoidalar
- **ORM**: Drizzle/Prisma bilan **SQL migratsiyalarini** repoda saqlang (DB’dan eksport emas).
- **Storage**: S3-compatible interfeysdan foydalaning (Supabase Storage, R2, S3 o‘rtasida ko‘chirish osonlashadi).
- **Auth**: Email-magic yoki OAuth’ni **Auth.js/Lucia** singari ochiq yechimlar bilan ham qo‘llab ko‘ring (keyin ko‘chirish oson).
- **Realtime**: Ably/Pusher/Liveblocks kabi protokolga bog‘lanmagan SDKlardan foydalaning, event nomlari va formatini hujjatlashtiring.
- **RLS**: Qoidalarni SQL’da alohida fayl sifatida saqlang, testlar yozing.
- **Backup**: Har kuni SQL dump; fayllar uchun bucket-to-bucket sync skriptlari.

## Minimal rekomendatsiya (MVP)
1. **Supabase**: DB + Auth + Storage + Realtime + Edge Functions
2. **Vercel**: Frontend
3. **Sentry + PostHog**: kuzatuv
4. **Drizzle ORM**: migratsiyalar
5. **S3-API abstraksiya**: kelajakda R2/S3’ga oson ko‘chirish uchun

## Qachon ko‘chamiz?
- Bepul bosqich limitlariga yaqinlashganda
- Ko‘p fayl saqlash narxi oshsa → Storage’ni **R2**ga olib chiqish
- Maxsus GraphQL/real-time talablar paydo bo‘lsa → **Hasura/Nhost**

