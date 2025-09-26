# REALTIME DIZAYN — barcha qurilmalarda bir vaqtda yangilanish

## Maqsad
- Reja/grid, Mijoz Kartasi va Statuslar **< 1 soniya** ichida barcha qurilmalarda sinxronlashsin.
- Realtime **RLS**ga bo‘ysunsin: foydalanuvchi faqat o‘z filialidagi (branch) o‘zgarishlarni oladi.

## Yondashuv
1) **Postgres Changes (persisted data):**
   - Jadval: `plan`, `task`, `client_card`, `status_history`, `attachment`
   - Filtrlash: `branch_id` yoki `plan_id` bo‘yicha
   - Supabase `postgres_changes` eventlari → WebSocket orqali klientga
   - **RLS-aware**: eventlar RLS bilan filtrlab yuboriladi

2) **Broadcast/Presence (efemer xabarlar):**
   - Kanal: `presence:plan:{plan_id}`
   - Maqsad: UI holatlari (masalan, “foydalanuvchi X shu slotni tahrirlayapti”)
   - Bu ma’lumot DB’da saqlanmaydi, faqat ko‘rsatish uchun

## Kanal strategiyasi
- `branch:{branch_id}` — umumiy filial oqimi (plans, tasks)
- `plan:{plan_id}` — ayni reja oqimi (tasks, status_history)
- `presence:plan:{plan_id}` — typing/selection presence

## Postgres Changes obuna namunasi (kontsept)
- `task` INSERT/UPDATE/DELETE: filter — `plan_id = eq.<plan_id>`
- `status_history` INSERT: filter — `task_id = eq.<task_id>`

## Event payload shartnomasi
```json
{
  "type": "postgres_changes",
  "table": "task",
  "event": "UPDATE",
  "record": {
    "id": "uuid",
    "plan_id": "uuid",
    "title": "string",
    "starts_at": "ISO",
    "ends_at": "ISO",
    "status": "taken|done|posted|edited",
    "updated_at": "ISO",
    "updated_by": "uuid",
    "branch_id": "uuid"
  },
  "old_record": { "status": "taken" }
}
```

## Klient sinxronlash (optimistik + reconcile)
- **Optimistik yozish**: UI darhol yangilanadi (temp-id), keyin serverdan tasdiq kelganda haqiqiy ID bilan reconcile.
- **Konflikt**: `updated_at` asosida **last-write-wins** + UI’da “yangilandi” belgilari.
- **Validation**: server (RLS/policy) rad etsa → UI optimistik o‘zgarishni rollback + toast.

## Offline/Queue
- IndexedDB (yoki zustand-persist) bilan **pending-ops queue**.
- Reconnect bo‘lganda ketma-ket yuborish (retry: exponential backoff).
- UI’dagi slotlar offline rejimda “pending” belgisi bilan ajratilsin.

## Reconnect & Backoff
- Exponential backoff (1s, 2s, 4s, 8s, max 30s), **jitter** bilan.
- Heartbeat/keepalive ping (SDK default).
- 1 daqiqadan uzun uzilishlarda UI’da sariq “realtime uzildi” banner.

## Performans
- Jadval obunalarini **plan kontekstida** filtrlash (keraksiz trafikni kamaytirish).
- Grid dom diffini throttling/debounce (requestAnimationFrame) bilan yangilash.
- “Virtualized list/grid” yondashuvi (kelajakda optimallashtirish).

## Xavfsizlik
- Realtime **RLS** bilan cheklanadi.
- Presence/broadcast xabarlarida **faqat zarur** metadata uzatilsin (PII emas).
- `service_role` kaliti hech qachon brauzerda ishlatilmaydi.

## Supabase sozlamalari (admin)
- Project → Realtime → **public** sxema uchun “Enable”
- Tablar PK ga ega (id uuid) bo‘lsin, aks holda changes yo‘lga chiqmaydi.
- RLS yoqilgan bo‘lsa: changes ham RLSga mos filtrlab yuboriladi.

## SLO
- p95 **realtime_delay_ms < 1000**
- Disconnect rate < 1% (10 daqiqa oynada)
