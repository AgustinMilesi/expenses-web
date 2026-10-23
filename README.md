<div align="center">

# 🌐 VOUT Web & Cloud Sync Hub
### Companion Web de Alta Gama para el Ecosistema VOUT

[![VOUT Ecosystem](https://img.shields.io/badge/VOUT-Ecosystem-C6F827?style=for-the-badge&logoColor=black&labelColor=0A0E14)](https://github.com/AgustinMilesi)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js&logoColor=white&labelColor=0A0E14)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=0A0E14)](https://react.dev)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white&labelColor=0A0E14)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=white&labelColor=0A0E14)](https://neon.tech)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white&labelColor=0A0E14)](https://tailwindcss.com)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAgustinMilesi%2Fexpenses-web&env=DATABASE_URL,AUTH_SECRET&project-name=vout-web&repository-name=expenses-web)

<p align="center">
  <strong>Versión Web oficial de VOUT con arquitectura full-stack, diseño Cyber-Lime obsidiana y sincronización bidireccional en la nube por cuenta de usuario.</strong>
</p>

</div>

---

## ⚡ Capacidades & Módulos Web

- 📊 **Panel de Presupuesto en Vivo:** Visualización del saldo libre disponible (*Safe to Spend*), cálculo dual de ingresos (sueldo fijo vs. liquidez inicial) y barra apilada de distribución de gastos.
- 🏠 **Gestor de Gastos Fijos:** Registro de alquiler, servicios públicos, expensas y conectividad con fecha de vencimiento y toggle rápido de pago.
- 🔁 **Control de Suscripciones:** Monitoreo de streaming, membresías y cobros automáticos periódicos.
- 🎁 **Dinero Extra & Bonos:** Registro ágil de ingresos extraordinarios que aumentan la liquidez libre en tiempo real.
- ☕ **Micro-gastos & Salidas:** Registro de consumos cotidianos, café y esparcimiento.
- 🔄 **Conciliación de Fin de Mes:** Consulta de sobrante real y traspaso guiado al nuevo ciclo.
- ☁️ **Sincronización Bidireccional por Cuenta:** Cuentas con Email y Contraseña (hash `scrypt` con sal criptográfica), sesiones seguras con cookies HTTP-only y tokens Bearer para la app móvil.

---

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 16.4 (App Router), React 19, TypeScript strict mode, Tailwind CSS v4.
- **Backend / API:** Next.js Route Handlers REST (`/api/sync`, `/api/auth/*`).
- **Base de Datos:** PostgreSQL en Neon Serverless (schema aislado `vout`).
- **ORM:** Prisma 6.19.
- **Seguridad:** Criptografía nativa de Node.js (`crypto.scrypt`), cookies seguras, validación estricta con Zod y cabeceras de seguridad CSP.

---

## 🚀 Puesta en Marcha Local

```bash
# Instalar dependencias
npm install

# Sincronizar schema de Prisma con PostgreSQL
npx prisma db push

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará accesible en `http://localhost:3000`.

---

<div align="center">
  <p>© 2026 VOUT · Flagship Financial Design System.</p>
</div>
