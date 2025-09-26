# REALTIME E2E — Ko‘p mijoz testi

## Setup
- Brauzer A (user: operator, branch: navoiy)
- Brauzer B (user: pm, branch: navoiy)
- Ikkalasi ham `/{slug}/plans/:id` sahifasida

## Test 1 — Task create
1. A: 10:00 slotga bosib task yaratadi → `title="Instagram Promo"`
2. B: **< 1s** ichida task paydo bo‘ladi
3. Telemetriya: `realtime_delay_ms` p95 < 1000

## Test 2 — Status update
1. B: taskni `Vazifa bajarildi` (done) qiladi
2. A: status paneli va history **< 1s** ichida yangilanadi

## Test 3 — Update conflict
1. A va B bir vaqtda `title`ni o‘zgartiradi
2. Last-write-wins; boshqa tomon uchun “yangilandi” belgisi ko‘rinadi

## Test 4 — Attachment
1. A: rasm yuklaydi
2. B: preview thumbnail **< 2s** ichida paydo bo‘ladi (signed URL)

## Test 5 — Presence
1. A: 11:00 slotni tanlaydi (typing)
2. B: o‘sha slot atrofida marker ko‘radi

## Test 6 — Offline queue
1. A: internetni o‘chiradi, 2 ta task qo‘shadi
2. Online bo‘lgach: tasklar ketma-ket yuboriladi, B’da paydo bo‘ladi

## Test 7 — Reconnect & banner
1. WebSocket uzilsin (devtools orqali)
2. UI “realtime uzildi” bannerini ko‘rsatadi, 30s ichida reconnect
