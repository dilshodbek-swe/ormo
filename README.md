<div align="center">

# ◆ Ormo

**Kameralar, stabilizatorlar va dronlar uchun internet-do'kon**

Minimal, tez va Vercel uslubidagi zamonaviy e-commerce interfeysi

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-base--ui-000000?style=flat-square&logo=shadcnui&logoColor=white)

</div>

---

## 📖 Loyiha haqida

**Ormo** — foto va video texnikasi sotiladigan onlayn do'kon. Loyihaning asosiy g'oyasi — mahsulotning o'zi diqqat markazida bo'lishi: kam rang, ko'p bo'sh joy, aniq tipografiya va ingichka chegaralar.

> [!NOTE]
> Loyiha faol ishlab chiqilmoqda. API ulanmaguncha mahsulotlar va rasmlar vaqtinchalik (mock) ma'lumotlardan foydalanadi.

## ✨ Imkoniyatlar

- 🧭 **Navbar** — yopishqoq (sticky) header, kategoriyalar, qidiruv va savat tugmalari
- 🎬 **Hero** — mahsulot rasmi atrofida suzib turuvchi ma'lumot kartochkalari va silliq animatsiyalar
- 📱 **Responsive** — telefon, planshet va kompyuter uchun moslashgan
- 🌗 **Dark mode** — ranglar CSS o'zgaruvchilari orqali boshqariladi
- ♿ **Accessibility** — `prefers-reduced-motion` hurmat qilinadi, semantik HTML
- ⚡ **Cache Components** — statik qismlar oldindan render qilinadi

## 🛠 Texnologiyalar

| Soha | Texnologiya |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, Cache Components) |
| UI kutubxona | [React 19](https://react.dev) |
| Til | [TypeScript](https://www.typescriptlang.org) |
| Stillar | [Tailwind CSS 4](https://tailwindcss.com), [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) |
| Komponentlar | [shadcn/ui](https://ui.shadcn.com) ([Base UI](https://base-ui.com) asosida) |
| Ikonkalar | [Lucide](https://lucide.dev) |
| Shriftlar | Montserrat, Space Grotesk (`next/font`) |

## 🚀 Ishga tushirish

**Talablar:** Node.js 20 yoki undan yuqori

```bash
# Repozitoriyani klonlash
git clone https://github.com/dilshodbek-swe/ormo.git
cd ormo

# Bog'liqliklarni o'rnatish
npm install

# Dev serverni ishga tushirish
npm run dev
```

So'ng brauzerda [http://localhost:3000](http://localhost:3000) manzilini oching.

### Skriptlar

| Buyruq | Vazifasi |
| --- | --- |
| `npm run dev` | Dev serverni ishga tushiradi |
| `npm run build` | Production uchun build qiladi |
| `npm run start` | Build qilingan loyihani ishga tushiradi |
| `npm run lint` | ESLint orqali kodni tekshiradi |

## 📁 Loyiha tuzilishi

```
ormo/
├── app/
│   ├── (browse)/                  # Do'kon sahifalari guruhi
│   │   ├── (root)/                # Bosh sahifa
│   │   │   ├── _components/       # Faqat shu sahifaga tegishli bo'limlar
│   │   │   │   ├── hero.tsx
│   │   │   │   └── floating-card.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx             # Header + Footer
│   ├── globals.css                # Tailwind, ranglar va animatsiyalar
│   └── layout.tsx                 # Root layout va shriftlar
├── components/
│   ├── shared/                    # Umumiy komponentlar
│   │   ├── header.tsx
│   │   ├── nav.tsx
│   │   ├── nav-links.ts
│   │   ├── logo.tsx
│   │   └── footer.tsx
│   └── ui/                        # shadcn/ui komponentlari
├── lib/
│   └── utils.ts
└── public/
    └── images/                    # Vaqtinchalik mock rasmlar
        ├── hero.png
        └── products/
```

### Qoidalar

- **Umumiy komponentlar** (bir nechta sahifada ishlatiladigan) → `components/shared/`
- **Sahifaga xos bo'limlar** → shu route ichidagi `_components/` papkasi
- **shadcn/ui komponentlari** → `components/ui/`
- **Commitlar** → [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `chore:` ...), har bir tugallangan qadam alohida commit

## 🗺 Reja

- [x] Loyiha sozlamalari (shadcn/ui, shriftlar, root layout)
- [x] Navbar
- [x] Footer
- [x] Hero bo'limi
- [ ] Kategoriya sahifalari — kameralar, stabilizatorlar, dronlar
- [ ] Mahsulot kartochkasi va katalog filtrlari
- [ ] Mahsulot sahifasi va xususiyatlar jadvali
- [ ] Mahsulotlarni taqqoslash
- [ ] Savat (o'ngdan chiquvchi panel)
- [ ] `Ctrl K` qidiruv oynasi
- [ ] Dark mode almashtirgich
- [ ] API integratsiyasi

## 🖼 Rasmlar

Vaqtinchalik mahsulot rasmlari [Unsplash](https://unsplash.com/license) va [Pexels](https://www.pexels.com/license/) saytlaridan olingan. Ikkala litsenziya ham bepul va tijoriy foydalanishga ruxsat beradi. API ulangandan so'ng ular haqiqiy mahsulot rasmlari bilan almashtiriladi.

---

<div align="center">

Muallif: [Dilshodbek Gulomov](https://github.com/dilshodbek-swe)

</div>
