# API — Edge HTTP Contracts (v1)

**Auth**: `Authorization: Bearer <JWT>` (Supabase Auth yoki muqobil)

## POST /v1/status.update
- **Body**: `{ "task_id": "uuid", "status": "taken|done|posted|edited" }`
- **200**: `{ "ok": true, "history": StatusHistory }`
- **4xx/5xx**: `{ "ok": false, "code": "E_AUTH|E_RLS|E_VALIDATION|E_NOT_FOUND|E_RATE_LIMIT|E_INTERNAL", "message": "..." }`

## POST /v1/media.upload
- **Body**: `{ "task_id": "uuid", "filename": "file.png", "contentType": "image/png" }`
- **200**: `{ "ok": true, "signedUrl": "https://...", "path": "branch/<id>/tasks/<id>/file.png" }`

## POST /v1/plan.export
- **Body**: `{ "plan_id": "uuid", "format": "png|pdf" }`
- **200**: `{ "ok": true, "url": "https://..." }`

## GET /v1/health
- **200**: `{ "ok": true, "db":"up", "time":"ISO8601" }`

### Event nomlari (Realtime)
- `plan.updated`, `task.created`, `task.updated`, `status.changed`, `attachment.added`

### Xatoliklar katalogi (kodlar)
- `E_AUTH` — JWT/rol xatosi
- `E_RLS` — RLS yoki ruxsat
- `E_VALIDATION` — talab noto‘g‘ri
- `E_NOT_FOUND` — resurs topilmadi
- `E_RATE_LIMIT` — tezlik cheklovi
- `E_INTERNAL` — kutilmagan xato
