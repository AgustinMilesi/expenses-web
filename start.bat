@echo off
TITLE VOUT Web - Cloud Sync Hub
echo ===================================================
echo   ⚡ VOUT Web & Cloud Sync Hub
echo   Next.js 16 • React 19 • Neon Postgres (Prisma)
echo ===================================================

REM 1. Pre-flight Check: Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta en PATH. Por favor instala Node.js 20+
    pause
    exit /b 1
)

REM 2. Pre-flight Check: Dependencies
if not exist "node_modules\" (
    echo [INFO] Instalando dependencias de npm...
    call npm install
)

REM 3. Pre-flight Check: .env
if not exist ".env" (
    echo [INFO] Creando archivo .env desde .env.example...
    copy .env.example .env
)

REM 4. Generate Prisma Client
echo [INFO] Verificando cliente de base de datos Prisma...
call npx prisma generate

REM 5. Start Next.js Development Server
echo [INFO] Iniciando servidor VOUT Web en http://localhost:3000 ...
echo ===================================================
call npm run dev
