# OPERATIONS — Realtime ishonchliligi

## Monitoring
- PostHog: `realtime_delay_ms`, `socket_reconnects`, `presence_users`
- Sentry: WebSocket xatoliklari (breadcrumb)

## Alertlar (PRD)
- p95 `realtime_delay_ms > 1500ms` (15 min oynada) → sariq
- `socket_reconnects > 5/min` → qizil

## Favqulodda rejim (degradatsiya)
- WebSocket ketma-ket muvaffaqiyatsiz bo‘lsa → **polling fallback** (15s interval)
- Presence vaqtincha o‘chiriladi, faqat persisted eventlar qoladi

## Konfiguratsiya
- Backoff: 1s → 2s → 4s → 8s → 16s → 30s (jitter)
- Max subscription: faqat **faol plan** uchun obuna

## Post-incident
- `OPERATIONS/INCIDENTS.md`ga yozing
- Root-cause: tarmoq, brauzer, SDK, server yoki RLS siyosati?
