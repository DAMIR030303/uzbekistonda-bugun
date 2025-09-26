Xato ■6
- **Tavsif:** Qattiq kodlangan (Hardcoded) va xavfsiz bo'lmagan Content-Security-Policy (CSP).
- **Sabab:** `Content-Security-Policy` to'g'ridan-to'g'ri `app/layout.tsx` faylida `meta` teg orqali `'unsafe-inline'` va `'unsafe-eval'` kabi xavfli direktivalar bilan o'rnatilgan. Bu XSS (Cross-Site Scripting) hujumlariga yo'l ochishi mumkin.
- **Yechim:** CSP siyosatini `next.config.js` fayli orqali markazlashtirilgan holda sozlash va xavfsizroq qoidalarni ishlatish kerak. Bu siyosatni boshqarishni osonlashtiradi va xavfsizlikni oshiradi.

Namuna (`next.config.js`):
'''javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    // script-src uchun 'unsafe-eval' va 'unsafe-inline' olib tashlandi.
    // Zaruratga qarab boshqa manbalarni (masalan, img-src) qo'shish mumkin.
    value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:;"
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
'''
So'ngra, `app/layout.tsx` faylidagi `metadata` ob'ektidan `other` maydonini olib tashlash kerak.

---

Xato ■7
- **Tavsif:** `<html>` tegining `lang` atributi statik tarzda `"uz"` qilib belgilangan.
- **Sabab:** `lang="uz"` to'g'ridan-to'g'ri `app/layout.tsx` komponentida yozilgan.
- **Yechim:** Hozircha bu katta muammo emas. Ammo kelajakda dasturni ko'p tilli qilish (xalqarolashtirish, i18n) rejalashtirilsa, tilni dinamik ravishda (masalan, URL yoki cookie'dan) o'rnatish uchun `next-intl` kabi kutubxonalardan foydalanish kerak bo'ladi. Bu bandni kelajak uchun eslatma sifatida saqlash tavsiya etiladi.

---

Xato ■8
- **Tavsif:** Komponent nomining noto'g'riligi va mas'uliyatining kengayib ketishi.
- **Sabab:** `AdminLogin` nomli komponent o'z ichiga rejalarni ko'rish, yaratish, o'chirish kabi butun bir "Dashboard" (boshqaruv paneli) logikasini olgan. Bu "Single Responsibility Principle" (Yagona Mas'uliyat Tamoyili) buzilishiga olib keladi va kodni tushunishni qiyinlashtiradi.
- **Yechim:** Komponent nomini vazifasiga moslab `AdminDashboard` yoki `FilialDashboard` deb o'zgartirish va uni kichikroq komponentlarga (masalan, `PlanList`, `NewPlanForm`, `DashboardHeader`) ajratish kerak. Bu kodning o'qilishi va qo'llab-quvvatlanishini osonlashtiradi.

---

Xato ■9
- **Tavsif:** Ma'lumotlarning doimiy saqlanmasligi. Rejalar (`plans`) haqidagi ma'lumotlar sahifa yangilanganda yo'qoladi.
- **Sabab:** Ma'lumotlar `useState` yordamida `AdminLogin.tsx` komponentining lokal holatida saqlanmoqda. Ma'lumotlarni saqlash uchun doimiy manba (baza, `localStorage`) ishlatilmagan.
- **Yechim:** Ma'lumotlarni doimiy saqlash uchun quyidagi usullardan birini qo'llash kerak:
    1.  **Vaqtinchalik yechim:** Brauzerning `localStorage`idan foydalanish. Bu sahifa yangilanganda ma'lumotlarni saqlab qoladi.
    2.  **To'liq yechim:** Ma'lumotlarni serverda (masalan, Supabase ma'lumotlar bazasida) saqlash va dasturda API orqali olish/yangilash. Bu barcha qurilmalarda ma'lumotlar sinxronizatsiyasini ta'minlaydi.

Namuna (`localStorage` uchun custom hook):
'''typescript
import { useState, useEffect } from 'react';

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

// Komponentda ishlatilishi:
// const [plans, setPlans] = useLocalStorageState('plans', [/*...default plans...*/]);
'''

---

Xato ■10
- **Tavsif:** Yangi yaratilgan obyektlar uchun ID raqami ishonchsiz usulda generatsiya qilinmoqda.
- **Sabab:** Yangi rejaning `id`si `Math.max(...plans.map(p => p.id)) + 1` yordamida aniqlanmoqda. Agar rejalar tartibsiz o'chirilsa yoki bir vaqtda bir nechta reja qo'shilsa, bir xil IDlar paydo bo'lishi (ID collision) mumkin.
- **Yechim:** Unikal ID yaratish uchun `uuid` kabi kutubxonadan foydalanish kerak. Bu har bir yozuvning takrorlanmas IDga ega bo'lishini ta'minlaydi.

O'rnatish:
'''bash
npm install uuid
npm install @types/uuid --save-dev
'''

Namuna:
'''typescript
import { v4 as uuidv4 } from 'uuid';

// ...
const handleCreatePlan = () => {
  // ...
  const plan: Plan = {
    id: uuidv4(), // Endi ID takrorlanmas string bo'ladi
    title: newPlan.title,
    // ...
  };
  // ...
};
// Eslatma: `Plan` interfeysidagi `id` tipini `number`dan `string`ga o'zgartirish kerak bo'ladi.
'''
