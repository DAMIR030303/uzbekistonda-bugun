# BoshqaruvMobile MCP Servers o'rnatish skripti (PowerShell)

Write-Host "🚀 BoshqaruvMobile MCP Servers o'rnatish boshlandi..." -ForegroundColor Green

# Root papkaga o'tish
Set-Location $PSScriptRoot

# MCP servers papkasini yaratish
Write-Host "📁 MCP servers papkasini yaratish..." -ForegroundColor Yellow
if (!(Test-Path "mcp-servers")) {
    New-Item -ItemType Directory -Name "mcp-servers" | Out-Null
}

# Har bir MCP server uchun tsconfig.json yaratish
Write-Host "⚙️ TypeScript konfiguratsiyalarini yaratish..." -ForegroundColor Yellow

$servers = @("supabase-mcp", "react-native-mcp", "nextjs-mcp", "testing-mcp", "deployment-mcp")

foreach ($server in $servers) {
    Write-Host "  - $server uchun tsconfig.json..." -ForegroundColor Cyan
    $tsconfigContent = @"
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
"@
    
    if (!(Test-Path "mcp-servers/$server")) {
        New-Item -ItemType Directory -Path "mcp-servers/$server" | Out-Null
    }
    Set-Content -Path "mcp-servers/$server/tsconfig.json" -Value $tsconfigContent
}

# Har bir MCP server uchun .eslintrc.json yaratish
Write-Host "🔍 ESLint konfiguratsiyalarini yaratish..." -ForegroundColor Yellow

foreach ($server in $servers) {
    Write-Host "  - $server uchun .eslintrc.json..." -ForegroundColor Cyan
    $eslintContent = @"
{
  "extends": ["../.eslintrc.json"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
"@
    Set-Content -Path "mcp-servers/$server/.eslintrc.json" -Value $eslintContent
}

# Dependencies o'rnatish
Write-Host "📦 Dependencies o'rnatish..." -ForegroundColor Yellow

# Root dependencies
if (!(Test-Path "node_modules")) {
    Write-Host "  - Root dependencies..." -ForegroundColor Cyan
    npm install
}

# MCP servers dependencies
Set-Location "mcp-servers"
if (Test-Path "package.json") {
    Write-Host "  - MCP servers dependencies..." -ForegroundColor Cyan
    npm install
}

# Har bir server uchun dependencies
foreach ($server in $servers) {
    if (Test-Path "$server/package.json") {
        Write-Host "  - $server dependencies..." -ForegroundColor Cyan
        Set-Location "$server"
        npm install
        Set-Location ".."
    }
}

Set-Location ".."

# Build qilish
Write-Host "🔨 MCP serverlarni build qilish..." -ForegroundColor Yellow

# Core MCP server
if (Test-Path "mcp-server/package.json") {
    Write-Host "  - Core MCP server..." -ForegroundColor Cyan
    Set-Location "mcp-server"
    npm run build
    Set-Location ".."
}

# Boshqa MCP serverlar
Set-Location "mcp-servers"
foreach ($server in $servers) {
    if (Test-Path "$server/package.json") {
        Write-Host "  - $server..." -ForegroundColor Cyan
        Set-Location "$server"
        npm run build
        Set-Location ".."
    }
}
Set-Location ".."

Write-Host "✅ BoshqaruvMobile MCP Servers muvaffaqiyatli o'rnatildi!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Mavjud MCP Serverlar:" -ForegroundColor Yellow
Write-Host "  - boshqaruv-mobile-core (asosiy server)" -ForegroundColor White
Write-Host "  - boshqaruv-mobile-supabase (ma'lumotlar bazasi)" -ForegroundColor White
Write-Host "  - boshqaruv-mobile-react-native (mobile development)" -ForegroundColor White
Write-Host "  - boshqaruv-mobile-nextjs (web development)" -ForegroundColor White
Write-Host "  - boshqaruv-mobile-testing (testing va QA)" -ForegroundColor White
Write-Host "  - boshqaruv-mobile-deployment (deployment va DevOps)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ishlatish uchun:" -ForegroundColor Yellow
Write-Host "  1. Cursor ni qayta ishga tushiring" -ForegroundColor White
Write-Host "  2. MCP serverlar avtomatik yuklanadi" -ForegroundColor White
Write-Host "  3. Har bir server o'z funksiyalarini taqdim etadi" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Development uchun:" -ForegroundColor Yellow
Write-Host "  npm run dev:all  # Barcha serverlarni development rejimida ishga tushirish" -ForegroundColor White
Write-Host "  npm run build:all  # Barcha serverlarni build qilish" -ForegroundColor White
Write-Host "  npm run lint:all  # Barcha serverlarni lint qilish" -ForegroundColor White
