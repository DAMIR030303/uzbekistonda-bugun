# Boshqaruv Mobile - Postgres va Supabase bilan

Bu loyiha Postgres va Supabase bilan ishlash imkoniyatini beradi. Siz istagan database-ni tanlashingiz mumkin.

## 🚀 Tez Boshlash

### 1. Loyihani klonlash
```bash
git clone <repository-url>
cd uzbekistonda-bugun
pnpm install
```

### 2. Database sozlash

#### Variant A: Postgres (To'g'ridan-to'g'ri ulanish)
```bash
# .env.local fayl yarating
cp env.template .env.local

# .env.local faylini tahrirlang
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=boshqaruv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
```

#### Variant B: Supabase (Boshqariladigan Postgres)
```bash
# .env.local fayl yarating
cp env.template .env.local

# .env.local faylini tahrirlang
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Database-ni ishga tushirish

#### Postgres uchun:
```bash
# Postgres server-ni ishga tushiring
# Keyin database-ni yarating
pnpm run init-db
```

#### Supabase uchun:
```bash
# Supabase dashboard-da tables yarating yoki
# Supabase CLI ishlatib migration-larni ishga tushiring
```

### 4. Loyihani ishga tushirish
```bash
pnpm run dev
```

## 📊 Database Xususiyatlari

### Postgres Xususiyatlari:
- ✅ To'g'ridan-to'g'ri PostgreSQL ulanishi
- ✅ Connection pooling
- ✅ Automatic table creation
- ✅ Sample data
- ✅ Full SQL control
- ✅ Cost-effective

### Supabase Xususiyatlari:
- ✅ Managed PostgreSQL
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ File storage
- ✅ Edge functions
- ✅ Easy setup

## 🔧 Environment Variables

```env
# Postgres (Variant A)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=boshqaruv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here

# Supabase (Variant B)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Filial Parollari
NEXT_PUBLIC_NAVOIY_PASSWORD=navoiy123
NEXT_PUBLIC_SAMARQAND_PASSWORD=samarqand123
NEXT_PUBLIC_TOSHKENT_PASSWORD=toshkent123
```

## 🏗️ Database Schema

```sql
-- Organizations (Tashkilotlar)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url TEXT,
  theme_colors JSONB,
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Branches (Filiallar)
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  manager_id UUID,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

-- User Profiles (Foydalanuvchi Profillari)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(50),
  role VARCHAR(100) NOT NULL,
  permissions JSONB,
  status VARCHAR(50) DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Plans (Rejalar)
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  priority VARCHAR(50) DEFAULT 'medium',
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks (Vazifalar)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scenario TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(50) DEFAULT 'medium',
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Railway Deployment
Railway-da environment variables-ni sozlang:

```env
# Postgres uchun
POSTGRES_HOST=your-railway-postgres-host
POSTGRES_PORT=5432
POSTGRES_DB=railway
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-railway-password

# Yoki Supabase uchun
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Vercel Deployment
Vercel-da environment variables-ni sozlang va Supabase ishlatish tavsiya etiladi.

## 🔄 Database O'zgartirish

Agar Supabase-dan Postgres-ga o'tmoqchi bo'lsangiz:

1. Postgres server-ni sozlang
2. Environment variables-ni o'zgartiring
3. `pnpm run init-db` ni ishga tushiring
4. Ma'lumotlarni migrate qiling

## 📝 Qo'shimcha Ma'lumot

- **Postgres**: To'liq nazorat, arzon, lekin sozlash kerak
- **Supabase**: Oson sozlash, lekin vendor lock-in
- **Hybrid**: Ikkalasini ham qo'llab-quvvatlaydi

Loyiha avtomatik ravishda qaysi database mavjudligini aniqlaydi va shunga mos ravishda ishlaydi.
