# TESTING — Supabase'ni mock qilish strategiyasi (kodsiz tavsif)

## Maqsad
Frontend va Edge testlarini real Supabase’siz ham yuritish.

## Yondashuv
1. **Portlar**: `DATA/CONTRACTS.md` dagi funksiyalarni `DataPort` sifatida qabul qiling.
2. **FakeAdapter**: xotira (in-memory) obyektlar bilan `SupabaseAdapter` bilan bir xil interfeysni taqdim etadi.
3. **Seed**: `CURSOR_PROMPTS/08_seeding_prompt.md` dagi demo ma'lumotlarni FakeAdapter ichiga yuklash.
4. **Storage**: faylni haqiqatan yuklamaymiz, faqat `path` va `signedUrl` ni qaytaramiz.
5. **Realtime**: oddiy pub/sub (EventEmitter) orqali eventlarni sinab ko‘ramiz.

## Test ssenariylari
- Plan yaratish → listPlans’da ko‘rinishi
- Task yaratish → gridda ko‘rinishi
- Status update → history’ga yozilishi
- Attachment sign + link → listAttachments’da ko‘rinishi
- RBAC: viewer’da create tugmalari yo‘qligi

## Eslatma
Mock kodi keyin Cursor bilan generatsiya qilinadi: `CURSOR_PROMPTS/12_mocks_prompt.md` yaratib qo‘yilgan.
