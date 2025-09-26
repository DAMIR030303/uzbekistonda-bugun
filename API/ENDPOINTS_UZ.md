# API Endpoints — Reja va Ko‘rsatmalar

Hozircha ilova frontend ichida mock parol tekshiruvidan foydalanadi. Kelgusida quyidagi endpointlar joriy etilishi rejalashtiriladi (edge/server routes):

## 1. Auth
- POST `/api/auth/login`
  - Kirish: `{ filialId: string, password: string }`
  - Chiqish: `{ token: string, role: 'admin'|'operator', exp: number }`
  - 401 xatolik: noto‘g‘ri parol.

- POST `/api/auth/logout`
  - Kirish: `Authorization: Bearer <token>`
  - Chiqish: `{ ok: true }`

## 2. Filiallar
- GET `/api/filials`
  - Chiqish: `Filial[]` — mavjud filiallar ro‘yxati.

- GET `/api/filials/:id`
  - Chiqish: `Filial` — tanlangan filial ma’lumoti.

## 3. Hisobot/Vazifa (kelgusida)
- GET `/api/tasks`
- POST `/api/tasks`
- GET `/api/reports`

Xavfsizlik:
- `Authorization: Bearer` header talab qilinadi.
- RLS va roli asosida ruxsat: admin/operator farqlanadi.

Bog‘liq:
- `API/EDGE_HTTP_CONTRACTS.md`

