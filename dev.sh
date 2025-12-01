#!/bin/bash

# Script de desenvolvimento - Bio Verbo PL
# Inicia servidor React (Vite) e servidor PHP simultaneamente

echo "🚀 Iniciando servidores de desenvolvimento..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Encerrando servidores..."
    kill $VITE_PID $PHP_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar servidor PHP na porta 8000
echo -e "${BLUE}📦 Iniciando servidor PHP na porta 8000...${NC}"
php -S localhost:8000 -t . &
PHP_PID=$!
sleep 1

# Iniciar servidor Vite (React)
echo -e "${GREEN}⚛️  Iniciando servidor Vite (React) na porta 3000...${NC}"
npm run dev &
VITE_PID=$!

echo ""
echo "✅ Servidores iniciados!"
echo ""
echo "📍 URLs disponíveis:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000/api"
echo ""
echo "💡 Pressione Ctrl+C para encerrar os servidores"
echo ""

# Aguardar processos
wait $VITE_PID $PHP_PID
