Xato ■1
- **Tavsif:** Parollar to'g'ridan-to'g'ri kodning o'zida (hardcode) saqlanmoqda. Bu xavfsizlik nuqtai nazaridan jiddiy kamchilik. Agar kod kimningdir qo'liga tushsa, barcha parollar oshkor bo'ladi.
- **Sabab:** Parollar `filialPasswords` ob'ektida `app/page.tsx` faylida ochiq matn sifatida saqlangan.
- **Yechim:** Parollarni koddan olib tashlash va ularni muhit o'zgaruvchilari (`.env` fayli) orqali yuklash kerak. Bu har bir muhit (development, production) uchun alohida parollar ishlatish imkonini beradi va xavfsizlikni oshiradi.

Namuna:
1. Loyiha ildizida `.env.local` faylini yarating va parollarni qo'shing:
'''
NEXT_PUBLIC_NAVOIY_PASSWORD="Navoiy2025!"
NEXT_PUBLIC_SAMARQAND_PASSWORD="Samarqand2025!"
NEXT_PUBLIC_TOSHKENT_PASSWORD="Toshkent2025!"
'''

2. `app/page.tsx` faylida parollarni `process.env` orqali oling:
'''typescript
const filialPasswords = {
  navoiy: process.env.NEXT_PUBLIC_NAVOIY_PASSWORD,
  samarqand: process.env.NEXT_PUBLIC_SAMARQAND_PASSWORD,
  toshkent: process.env.NEXT_PUBLIC_TOSHKENT_PASSWORD
};
'''

---

Xato ■2
- **Tavsif:** Parol to'g'ri bo'lmasa ham, u foydalanuvchiga ko'rsatilmoqda. Bu test uchun vaqtinchalik yechim bo'lishi mumkin, lekin production uchun mutlaqo yaroqsiz. Bu jiddiy xavfsizlik zaifligini keltirib chiqaradi.
- **Sabab:** `app/page.tsx` faylida `selectedFilial` mavjud bo'lganda, parol `<p>` tegi ichida to'g'ridan-to'g'ri ko'rsatilmoqda.
- **Yechim:** Bu qatorni butunlay olib tashlash kerak. Parol hech qachon foydalanuvchi interfeysida ko'rsatilmasligi lozim.

Olib tashlanishi kerak bo'lgan kod qismi (`app/page.tsx`):
'''html
<p className="mt-2 text-xs sm:text-sm text-gray-500">
  Filial paroli: {filialPasswords[selectedFilial.city as keyof typeof filialPasswords]}
</p>
'''

---

Xato ■3
- **Tavsif:** Komponent mantig'i va ko'rinishi (logic and view) bitta faylda aralashib ketgan. `HomePage` komponenti juda katta va bir nechta vazifalarni bajaradi (filial tanlash, parol tekshirish, admin panelini ko'rsatish). Bu kodni o'qish, tushunish va kelajakda o'zgartirishni qiyinlashtiradi.
- **Sabab:** "Single Responsibility Principle" (Yagona mas'uliyat tamoyili) buzilgan. Barcha logika va UI bitta komponent ichiga joylashtirilgan.
- **Yechim:** Komponentni kichikroq, qayta ishlatiladigan qismlarga bo'lish kerak. Masalan:
    1.  `FilialList` - filiallar ro'yxatini ko'rsatadigan komponent.
    2.  `FilialLoginForm` - tanlangan filial uchun parol kiritish formasini ko'rsatadigan komponent.
    3.  Ma'lumotlar (filiallar ro'yxati) va holatni (tanlangan filial) boshqarish uchun alohida custom hook (`useFilialManagement`) yaratish mumkin.

Namuna (`components/FilialList.tsx`):
'''typescript
import { Filial } from '@/types'; // (Filial tipini alohida faylga chiqarish kerak)

interface FilialListProps {
  filiallar: Filial[];
  onSelect: (filial: Filial) => void;
}

export const FilialList = ({ filiallar, onSelect }: FilialListProps) => {
  return (
    <div className="grid ...">
      {filiallar.map(filial => (
        <div key={filial.id} onClick={() => onSelect(filial)}>
          {/* Filial kartasining kodi */}
        </div>
      ))}
    </div>
  );
};
'''

---

Xato ■4
- **Tavsif:** Statik ma'lumotlar (filiallar ro'yxati, foydalanuvchilar soni) komponentning o'zida joylashgan. Agar filiallar soni o'zgarsa yoki yangisi qo'shilsa, kodni o'zgartirishga to'g'ri keladi.
- **Sabab:** `filiallar` massivi va "Faol foydalanuvchilar: 24" kabi matnlar to'g'ridan-to'g'ri JSX ichida yozilgan.
- **Yechim:** Bunday ma'lumotlarni alohida `lib/constants.ts` kabi faylga chiqarish yoki kelajakda API orqali olish kerak. Bu ma'lumotlarni markazlashtirilgan holda boshqarishni osonlashtiradi.

Namuna (`lib/constants.ts`):
'''typescript
export const FILIALS = [
  {
    id: "navoiy",
    name: "Navoiyda Bugun",
    city: "navoiy",
    color: "navoiy",
    description: "Navoiy viloyati boshqaruv markazi",
  },
  {
    id: "samarqand",
    name: "Samarqandda Bugun",
    city: "samarqand",
    color: "samarqand",
    description: "Samarqand viloyati boshqaruv markazi",
  },
  // ... boshqa filiallar
];
'''

---

Xato ■5
- **Tavsif:** CSS klass nomlari TailwindCSS yordamida dinamik tarzda `bg-${filial.color}-primary` kabi yaratilmoqda. TailwindCSS o'zining optimallashtirish jarayonida (purging) ishlatilmagan klasslarni olib tashlaydi. Dinamik klass nomlari statik tahlil qilinmaydi, natijada bu stillar production build'da ishlamay qolishi mumkin.
- **Sabab:** TailwindCSS build vaqtida qaysi klasslar ishlatilishini aniqlash uchun kodni skanerlaydi. String biriktirish (`bg-${filial.color}-primary`) orqali yaratilgan klass nomlarini topa olmaydi.
- **Yechim:** To'liq klass nomlarini ishlatish kerak. Buning uchun mapping ob'ektidan foydalanish mumkin. Bu Tailwindga qaysi klasslarni saqlab qolish kerakligini bildiradi.

Namuna:
'''typescript
// Mapping ob'ekti
const colorClasses = {
  navoiy: 'bg-blue-500 text-white', // Misol uchun ranglar
  samarqand: 'bg-green-500 text-white',
  toshkent: 'bg-red-500 text-white',
};

// JSX ichida ishlatilishi
<div className={`... ${colorClasses[filial.color]}`}>
  ...
</div>

// Muhim: `tailwind.config.js` faylida ushbu klasslar to'g'ridan-to'g'ri ishlatilmasa ham, ular o'chib ketmasligi uchun `safelist` konfiguratsiyasiga qo'shish mumkin.
// Ammo eng yaxshi yechim - to'liq klass nomlarini mapping orqali berishdir.
'''
