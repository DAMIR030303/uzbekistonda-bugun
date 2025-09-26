# VERCEL ENV — sozlash qo'llanmasi

**Project → Settings → Environment Variables**

| Nomi                         | Scope                        | Izoh |
|-----------------------------|------------------------------|------|
| NEXT_PUBLIC_SUPABASE_URL    | Development/Preview/Production | Supabase Project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Development/Preview/Production | Anon public key |
| POSTHOG_API_KEY (ixtiyoriy) | Development/Preview/Production | Telemetriya |
| SENTRY_DSN (ixtiyoriy)      | Development/Preview/Production | Xatolik kuzatuv |
| SUPABASE_SERVICE_ROLE       | **Only Build/Actions**        | Faqat server-yonida (CI) ishlatiladi; brauzerga chiqmasin |

**Redeploy** shart: yangi env qo‘shilganda yoki o‘zgartirilganda.
