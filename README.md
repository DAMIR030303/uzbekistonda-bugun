# BoshqaruvMobile

Uzbekistonda Bugun loyihasi uchun boshqaruv tizimi. Next.js 14 va React Native bilan qurilgan full-stack ilovalar.

## Loyiha tarkibi

- **Web App** (Next.js 14) - Boshqaruv paneli
- **Mobile App** (React Native) - Mobil ilova

## Texnik stack

### Web App (Next.js)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **HTTP**: TanStack Query + Axios
- **Validation**: Zod
- **i18n**: next-intl (uz/en/ru)
- **Realtime**: Supabase Realtime
- **Auth**: Supabase Auth

### Mobile App (React Native)
- **Framework**: React Native + Expo
- **Navigation**: React Navigation
- **State**: Zustand
- **HTTP**: Supabase JS
- **Storage**: AsyncStorage + SecureStore
- **Auth**: Supabase Auth

## O'rnatish

### Web App
```bash
# Dependencies o'rnatish
npm install

# Development server ishga tushirish
npm run dev
```

### Mobile App
```bash
# Mobile app papkasiga o'tish
cd uzbekistonda-bugun-app/apps/mobile

# Dependencies o'rnatish
npm install

# Expo server ishga tushirish
npm start
```

## Scriptlar

### Web App
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint tekshiruv
- `npm run typecheck` - TypeScript tekshiruv
- `npm run format` - Prettier formatlash

### Mobile App
- `npm start` - Expo development server
- `npm run android` - Android simulator
- `npm run ios` - iOS simulator
- `npm run web` - Web browser
- `npm run lint` - ESLint tekshiruv
- `npm run typecheck` - TypeScript tekshiruv

## Struktura

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── dashboard/
│   ├── plans/
│   ├── tasks/
│   └── settings/
├── api/
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── ui/
│   ├── button.tsx
│   └── card.tsx

lib/
└── utils.ts
```

## Filiallar

- **Navoiy** - Ko'k ranglar (#1E40AF, #3B82F6)
- **Samarqand** - Yashil ranglar (#059669, #10B981)
- **Toshkent** - Qizil ranglar (#DC2626, #EF4444)

## Environment variables

`.env.local` faylini yarating:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Tekshiruv

1. `npm run dev` - Server ishga tushadi
2. http://localhost:3000 - Landing sahifasi ochiladi
3. Filial tanlash ko'rinishi kerak
4. Responsive dizayn tekshiriladi

## Keyingi qadamlar

- [ ] Auth sahifalar
- [ ] Dashboard sahifalar
- [ ] Supabase integration
- [ ] Realtime funksiyalar
- [ ] i18n sozlash
