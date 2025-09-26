# QUICKSTART — Vercel + Supabase (bosqichma-bosqich)

Siz Vercel ichidan Supabase'ni ulab, URL va ANON KEY oldingiz. Endi quyidagi tartib bilan davom eting.

## 1) Vercel ENV tekshirish
**Project → Settings → Environment Variables** ichida quyilar borligini tasdiqlang (Development/Preview/Production uchalasi uchun):
- `NEXT_PUBLIC_SUPABASE_URL` = (Supabase Project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Anon public key)
*(Hech qachon `SERVICE_ROLE`ni frontga qo‘ymang).*

Agar front deployed bo‘lsa, **Redeploy** qiling.

### Tez diagnostika
Agar konsolda `Error: supabaseUrl is required` chiqsa:
- Yuqoridagi ikkita env yo‘q yoki noto‘g‘ri → sozlab, redeploy qiling.

## 2) Supabase'da baza sxemasini o‘rnatish
Cursor'da `CURSOR_PROMPTS/02_backend_db_prompt.md` promptini ishga tushiring (SQL migratsiyalar, RLS, indekslar).  
Natijada: `org`, `branch`, `user_profile`, `plan`, `task`, `client_card`, `status_history`, `attachment`, `audit_log` jadvallari.

## 3) Auth & RBAC
`CURSOR_PROMPTS/04_auth_rbac_prompt.md` bilan:
- Rollar: super_admin, admin, pm, ssenarist, dizayner, smm, operator, viewer
- `user_profile`ga filial va rol biriktirish
- RLS siyosatlari faolligi

## 4) Storage (media fayllar)
Supabase **Storage**da `attachments` nomli **private** bucket yarating (quyida to‘liq qo‘llanma).  
UI: “Rasm o‘zgartirish” tugmasi signed URL orqali upload/preview qiladi.

## 5) Edge Functions
`CURSOR_PROMPTS/03_edge_functions_prompt.md`: `status:update`, `media:upload`, `plan:export`, `health`.

## 6) Seed ma’lumotlar
`CURSOR_PROMPTS/08_seeding_prompt.md`: demo filiallar (navoiy, samarqand, toshkent), foydalanuvchilar, 2 ta demo reja, vazifalar.

## 7) CI/CD
`CURSOR_PROMPTS/05_ci_cd_prompt.md`: GitHub Actions → test/build/migratsiya; Vercelga deploy.

## 8) Sinov va monitoring
`OPERATIONS/TESTING.md` bo‘yicha E2E; Sentry/PostHog ishlashini tekshiring.

--- 
**Checklist**: ENV ✅  Schema ✅  RLS ✅  Storage ✅  Edge ✅  Seed ✅  CI/CD ✅  Test ✅
