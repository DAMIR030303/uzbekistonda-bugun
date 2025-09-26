# SUPABASE STORAGE — `attachments` bucket

## 1) Bucket yaratish
- Supabase → Storage → **New bucket**: `attachments`
- Visibility: **Private**

## 2) Ruxsat siyosati (policies)
Storage obyektlari `storage.objects` jadvali orqali boshqariladi. Maqsad — **faqat imzolangan URL** orqali ko‘rinishi.

### Ko‘rish (read) — signed URL orqali
- Umumiy qoida: public read yo‘q.
- UI `getSignedUrl` funksiyasi bilan vaqtinchalik URL oladi.

### Yozish (insert/update/delete)
- Foydalanuvchi faqat o‘z filialidagi vazifa (`task.branch_id`) bilan bog‘liq faylni yuklay oladi.
- Fayl yo‘li shabloni: `branch/{branch_id}/tasks/{task_id}/{random}.{ext}`

> Eslatma: Aniq SQL siyosatlarini `CURSOR_PROMPTS/02_backend_db_prompt.md` ichida generatsiya qildiramiz. Shunchaki quyidagi mantiqni talab qiling:
> - `auth.uid()` → `user_profile`ga join → `branch_id` tekshirilsin.
> - `bucket_id = 'attachments'` bo‘lsin.
> - `record.name like 'branch/{branch_id}/tasks/%'`.

## 3) CORS
`https://*.vercel.app` va kerakli domenlaringizga ruxsat bering (default odatda yetarli).

## 4) Fayl o‘lchami va turlari
- Maks o‘lcham: 10–20 MB (UI’da cheklov qo‘ying)
- Ruxsat etilgan turlar: `.png, .jpg, .webp, .pdf` (kerakka qarab kengaytiring)

## 5) Xavfsizlik
- Hech qachon **service role** kalitini brauzerga qo‘ymang.
- Har upload Edge Function orqali yoki client → signed URL orqali yursin.
