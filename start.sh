#!/usr/bin/env bash
set -e

echo "==================================================="
echo "  ⚡ VOUT Web & Cloud Sync Hub"
echo "  Next.js 16 • React 19 • Neon Postgres (Prisma)"
echo "==================================================="

trap 'kill 0' SIGINT SIGTERM EXIT

# 1. Pre-flight Check: Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js no está instalado o no se encuentra en PATH."
    exit 1
fi

# 2. Pre-flight Check: Dependencies
if [ ! -d "node_modules" ]; then
    echo "[INFO] Instalando dependencias de npm..."
    npm install
fi

# 3. Pre-flight Check: .env
if [ ! -f ".env" ]; then
    echo "[INFO] Creando archivo .env desde .env.example..."
    cp .env.example .env
fi

# 4. Generate Prisma Client
echo "[INFO] Verificando cliente de base de datos Prisma..."
npx prisma generate

# 5. Start Development Server
echo "[INFO] Iniciando servidor VOUT Web en http://localhost:3000 ..."
echo "==================================================="
npm run dev
