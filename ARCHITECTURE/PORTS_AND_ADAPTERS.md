# ARCHITECTURE — Ports & Adapters (Supabase'ni almashtirish oson bo'lsin)

## Maqsad
Frontend/Edge kodini ma'lumot manbasidan ajratish uchun **Ports & Adapters** yondashuvi. `DATA/CONTRACTS.md` — portlar; `SupabaseAdapter` — implementatsiya.

## Adapterlar ro'yxati
- **SupabaseAdapter**: PostgREST + Realtime + Storage + Edge Functions
- **PocketBaseAdapter**: REST + Realtime (kelajak)
- **NeonAdapter** (+Auth.js, R2, Pusher): modul yig'ilma (kelajak)

## Konfiguratsiya nuqtalari
- **DB_URL**, **ANON_KEY** (Supabase)
- **S3_ENDPOINT**, **S3_BUCKET**, **S3_REGION**, **S3_KEY/SECRET** (agar R2/S3ga ko'chsa)
- **REALTIME_PROVIDER**: supabase | pusher | ably | liveblocks

## Abstraktsiya prinsiplari
- **StoragePath** formatini saqlang: `branch/{branch_id}/tasks/{task_id}/{uuid}.{ext}`
- **Event nomlari**ni o'zgartirmang (plan.updated va h.k.)
- **DTO** larni UI qatlamida birlashtirmang — adapter buni bajaradi (masalan, `getPlan` → `{plan, tasks}`)

## Versiyalash
- HTTP/Edge endpointlari `v1` prefiks bilan (qarang: `API/EDGE_HTTP_CONTRACTS.md`).
- Breaking o'zgarishlar uchun `v2` ochiladi; adapter backward-compat bilan ishlab tursin.
