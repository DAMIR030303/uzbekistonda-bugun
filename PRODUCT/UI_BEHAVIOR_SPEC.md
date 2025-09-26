# UI BEHAVIOR SPEC — UZBEKISTONDA BUGUN

## 1. Landing (hudud tanlash)
- Sarlavha: `Assalomu alaykum, {branch} Xush Kelibsiz!`
- Tanlov: kartalar (Navoiyda Bugun, Samarqandda Bugun, Toshkentda Bugun).
- Har karta: ikon + nom + `→` belgisi. Enter/Space bilan tanlanadi.
- Tanlanganda: `{slug}/plans` sahifasiga yo‘naltirish.

## 2. Filial Rejalari ro‘yxati (`/{slug}/plans`)
- Header: filial logotipi, user roli, soat, `Bosh Sahifa`, `Chiqish`.
- Banner: “Barcha qurilmalarda sinxronizatsiya” indikator (Realtime status).
- Tablar: `Rejalar Ro‘yxati`, `Reja` (aktiv bo‘lim holati saqlanadi).
- Reja kartasi: nomi, boshlanish sanasi, `# tadbirlar soni`, `Ochish` tugmasi, `🗑` (faqat admin).
- `Yangi Reja` tugmasi → dialog (nom, hafta boshlanish sanasi).

## 3. Reja ko‘rish (haftalik grid)
- Vaqt slot: 30 min; diapazon 09:00–18:00 (sozlanadi). Horizontal scroll mavjud.
- Kun ustuni: Dushanba–Yakshanba, balandlik avtomatik; sticky time header.
- Slotga bosilganda: **Mijoz Kartasi** modal ochiladi.
- Toolbar: `Saq­lash va Chiqish` (Ctrl+S), `Yangi Reja`, sana tanlash (datepicker), `Yangilash` (realtime refresh).
- Realtime: boshqa foydalanuvchi o‘zgartirsa, toast + soft-reload.

## 4. Mijoz Kartasi (modal)
**Form maydonlari**
- `Brend nomi` (required), `Ism Familiya`, `Telefon` (mask: +998 90 123 45 67), `Reklama turi` (multi-select), `Izohlar`, `Ssenariy` (autosize).
- `Status Tarixi` panel: quyidagilar timestamp va user bilan ko‘rinadi:
  - `Ishga olindi`
  - `Vazifa bajarildi`
  - `Post joylashtirildi`
  - `Oxirgi tahrir`
- `Rasm o‘zgartirish` (media upload): fayl tanlash → progress → preview.

**Tugmalar**
- `Vazifa bajarildi` → status=done, history yoziladi.
- `Post joylandi` → status=posted, history yoziladi.
- `Saqla` (primary) → validatsiya → DB save → toast.
- `Esc` yoki `×` → yopi­sh (unsaved changes bo‘lsa confirm).

**Davlatlar**
- `disabled` holat: ruxsat yo‘q bo‘lsa tugmalar bloklanadi.
- `loading` holat: saqlash jarayonida spinner.
- `error` holat: validatsiya yoki tarmoq xabari (uzbekcha).

## 5. RBAC ko‘rinishlari
- **viewer**: faqat ko‘rish, modal “read-only”.
- **operator/smm/dizayner/ssenarist**: create/update o‘z filialida.
- **pm/admin**: full branch control.
- **super_admin**: barcha filiallar.

## 6. Accessibility
- Klaviatura: Tab/Shift+Tab, Enter, Esc; modal fokus trap.
- A11y atributlar: `aria-label`, `aria-describedby`.
- Kontrast: WCAG AA (dark/light tema).

## 7. Telemetriya eventlari
- `plan_opened`, `task_created`, `task_updated`, `status_changed`, `media_uploaded`, `modal_opened`.
- Har eventga `branch_id`, `plan_id`, `task_id`, `role` qo‘shilsin.

## 8. Xatolik xabarlari (UZ)
- `Majburiy maydon to'ldirilmagan`
- `Telefon raqami noto‘g‘ri formatda`
- `Ruxsat yo‘q: administratorga murojaat qiling`
- `Tarmoq xatosi: keyinroq urinib ko‘ring`

## 9. Brending/Theme
- Navoiy: primary=#2563EB (ko‘k), gradient: ko‘k→indigo.
- Samarqand: primary=#7C3AED (binafsha).
- Toshkent: primary=#10B981 (yashil).
- Radius: `2xl`, shadow: soft, font: Inter.

## 10. Sinov ssenariylari (Playwright)
1) Reja yaratish → grid ochilishi.
2) Slotga bosish → modal ochilishi → saqlash.
3) Telefon mask validatsiyasi.
4) `Vazifa bajarildi` va `Post joylandi` oqimi → history yozilishi.
5) Rasm upload preview.
6) Realtime: 2 ta oynada bir vaqtda yangilanish.
7) RBAC: viewer uchun tugmalar yo‘qligi.

