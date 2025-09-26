#!/bin/bash

echo "🚀 BoshqaruvMobile MCP Servers o'rnatish boshlandi..."

# Root papkaga o'tish
cd "$(dirname "$0")"

# MCP servers papkasini yaratish
echo "📁 MCP servers papkasini yaratish..."
mkdir -p mcp-servers

# Har bir MCP server uchun tsconfig.json yaratish
echo "⚙️ TypeScript konfiguratsiyalarini yaratish..."

for server in supabase-mcp react-native-mcp nextjs-mcp testing-mcp deployment-mcp; do
  echo "  - $server uchun tsconfig.json..."
  cat > "mcp-servers/$server/tsconfig.json" << EOF
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
done

# Har bir MCP server uchun .eslintrc.json yaratish
echo "🔍 ESLint konfiguratsiyalarini yaratish..."

for server in supabase-mcp react-native-mcp nextjs-mcp testing-mcp deployment-mcp; do
  echo "  - $server uchun .eslintrc.json..."
  cat > "mcp-servers/$server/.eslintrc.json" << EOF
{
  "extends": ["../.eslintrc.json"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
EOF
done

# Dependencies o'rnatish
echo "📦 Dependencies o'rnatish..."

# Root dependencies
if [ ! -d "node_modules" ]; then
  echo "  - Root dependencies..."
  npm install
fi

# MCP servers dependencies
cd mcp-servers
if [ -f "package.json" ]; then
  echo "  - MCP servers dependencies..."
  npm install
fi

# Har bir server uchun dependencies
for server in supabase-mcp react-native-mcp nextjs-mcp testing-mcp deployment-mcp; do
  if [ -f "$server/package.json" ]; then
    echo "  - $server dependencies..."
    cd "$server"
    npm install
    cd ..
  fi
done

cd ..

# Build qilish
echo "🔨 MCP serverlarni build qilish..."

# Core MCP server
if [ -f "mcp-server/package.json" ]; then
  echo "  - Core MCP server..."
  cd mcp-server
  npm run build
  cd ..
fi

# Boshqa MCP serverlar
cd mcp-servers
for server in supabase-mcp react-native-mcp nextjs-mcp testing-mcp deployment-mcp; do
  if [ -f "$server/package.json" ]; then
    echo "  - $server..."
    cd "$server"
    npm run build
    cd ..
  fi
done
cd ..

echo "✅ BoshqaruvMobile MCP Servers muvaffaqiyatli o'rnatildi!"
echo ""
echo "📋 Mavjud MCP Serverlar:"
echo "  - boshqaruv-mobile-core (asosiy server)"
echo "  - boshqaruv-mobile-supabase (ma'lumotlar bazasi)"
echo "  - boshqaruv-mobile-react-native (mobile development)"
echo "  - boshqaruv-mobile-nextjs (web development)"
echo "  - boshqaruv-mobile-testing (testing va QA)"
echo "  - boshqaruv-mobile-deployment (deployment va DevOps)"
echo ""
echo "🚀 Ishlatish uchun:"
echo "  1. Cursor ni qayta ishga tushiring"
echo "  2. MCP serverlar avtomatik yuklanadi"
echo "  3. Har bir server o'z funksiyalarini taqdim etadi"
echo ""
echo "🔧 Development uchun:"
echo "  npm run dev:all  # Barcha serverlarni development rejimida ishga tushirish"
echo "  npm run build:all  # Barcha serverlarni build qilish"
echo "  npm run lint:all  # Barcha serverlarni lint qilish"
