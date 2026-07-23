# Centryx — Plataforma Enterprise MDM & Monitoreo de Productividad

Plataforma de gestión de dispositivos corporativos Android (Device Owner / Android Enterprise DPC), monitoreo de productividad y control en tiempo real para 500+ dispositivos distribuidos en esquema Multi-Tenant.

## 🏗️ Arquitectura Monorepo

```text
CENTRYK/
├── apps/
│   ├── backend/             # API NestJS (TypeScript, TypeORM/Prisma, Redis, FCM)
│   ├── frontend/            # Dashboard Web Next.js 15 (App Router, Tailwind CSS)
│   └── mobile-android/      # App Android Kotlin (Device Owner / DPC)
├── docs/                    # Especificaciones y esquemas de arquitectura
└── docker-compose.yml       # Entorno local (TimescaleDB + Redis)
```

## 🎨 Tema Visual (Dashboard 2026)
- **Modo Oscuro Profundo**: Deep Navy (`#050A14`), Tarjetas (`#0D1B2E`)
- **Acentos Neon**: Neon Teal (`#2DD4BF`), Emerald Green (`#10B981`) con animación `pulse-dot` para estado en vivo de dispositivos.
- **Glassmorphism**: Bordes translúcidos (`rgba(255,255,255,0.08)`).

## 🚀 Entorno de Desarrollo Local

```bash
# Levantar base de datos y cache
docker-compose up -d
```
