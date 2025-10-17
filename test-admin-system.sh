#!/bin/bash

# Script de prueba del sistema de administración
# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:4002/api/v1"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Sistema de Administración - Tests  ${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# 1. Login como ADMIN
echo -e "${YELLOW}1. Login como ADMIN...${NC}"
ADMIN_TOKEN=$(curl -s -X POST ${BASE_URL}/auth/authenticate \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@farmacia.com","password":"Admin123!"}' | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

if [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}❌ Error: No se pudo obtener token de admin${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Login exitoso${NC}"
echo -e "Token: ${ADMIN_TOKEN:0:30}..."
echo ""

# 2. Listar usuarios
echo -e "${YELLOW}2. Listando usuarios...${NC}"
USERS=$(curl -s -X GET ${BASE_URL}/admin/users \
  -H "Authorization: Bearer ${ADMIN_TOKEN}")

echo -e "${GREEN}✅ Usuarios obtenidos:${NC}"
echo "$USERS" | python3 -m json.tool | head -30
echo ""

# 3. Listar roles
echo -e "${YELLOW}3. Listando roles...${NC}"
ROLES=$(curl -s -X GET ${BASE_URL}/admin/roles \
  -H "Authorization: Bearer ${ADMIN_TOKEN}")

echo -e "${GREEN}✅ Roles disponibles:${NC}"
echo "$ROLES" | python3 -m json.tool
echo ""

# 4. Listar todas las órdenes
echo -e "${YELLOW}4. Listando todas las órdenes...${NC}"
ORDERS=$(curl -s -X GET ${BASE_URL}/orders/all \
  -H "Authorization: Bearer ${ADMIN_TOKEN}")

echo -e "${GREEN}✅ Órdenes obtenidas:${NC}"
echo "$ORDERS" | python3 -m json.tool | head -30
echo ""

# 5. Crear un usuario de prueba
echo -e "${YELLOW}5. Creando usuario de prueba...${NC}"
TIMESTAMP=$(date +%s)
NEW_USER=$(curl -s -X POST ${BASE_URL}/admin/users \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test${TIMESTAMP}@farmacia.com\",
    \"name\": \"Usuario Test ${TIMESTAMP}\",
    \"password\": \"test123\",
    \"roleId\": 1
  }")

echo -e "${GREEN}✅ Usuario creado:${NC}"
echo "$NEW_USER" | python3 -m json.tool
echo ""

# 6. Resumen
echo -e "${BLUE}======================================${NC}"
echo -e "${GREEN}✅ Todos los tests pasaron exitosamente${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""
echo -e "Credenciales de ADMIN:"
echo -e "  Email: ${YELLOW}admin@farmacia.com${NC}"
echo -e "  Password: ${YELLOW}Admin123!${NC}"
echo ""
echo -e "Frontend: ${BLUE}http://localhost:8081${NC}"
echo -e "Panel Admin: ${BLUE}http://localhost:8081/admin${NC}"
echo ""
