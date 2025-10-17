#!/bin/bash

echo "========================================="
echo "Test de Autenticación - Backend Farmacia"
echo "========================================="
echo ""

BASE_URL="http://localhost:4002/api/v1"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Probando OPTIONS preflight (CORS)${NC}"
curl -i -X OPTIONS "${BASE_URL}/auth/authenticate" \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
echo ""
echo ""

echo -e "${YELLOW}2. Probando POST /auth/register (nuevo usuario)${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Test",
    "lastname": "User",
    "email": "test@farmacia.com",
    "password": "test123"
  }')

echo "$REGISTER_RESPONSE" | jq '.'
echo ""

# Extraer token del registro
REGISTER_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token // empty')
if [ -n "$REGISTER_TOKEN" ]; then
  echo -e "${GREEN}✓ Registro exitoso - Token recibido${NC}"
  echo "Token: ${REGISTER_TOKEN:0:50}..."
else
  echo -e "${RED}✗ Registro falló - No se recibió token${NC}"
fi
echo ""
echo ""

echo -e "${YELLOW}3. Probando POST /auth/authenticate (login)${NC}"
echo "Email: test@farmacia.com | Password: test123"
AUTH_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/authenticate" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@farmacia.com",
    "password": "test123"
  }')

echo "$AUTH_RESPONSE" | jq '.'
echo ""

# Extraer token del login
AUTH_TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.token // empty')
if [ -n "$AUTH_TOKEN" ]; then
  echo -e "${GREEN}✓ Login exitoso - Token recibido${NC}"
  echo "Token: ${AUTH_TOKEN:0:50}..."
else
  echo -e "${RED}✗ Login falló - No se recibió token${NC}"
fi
echo ""
echo ""

echo -e "${YELLOW}4. Probando credenciales incorrectas${NC}"
WRONG_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "${BASE_URL}/auth/authenticate" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@farmacia.com",
    "password": "wrongpassword"
  }')

RESPONSE_BODY=$(echo "$WRONG_RESPONSE" | sed -n '1,/HTTP_CODE:/p' | sed 's/HTTP_CODE:.*//')
HTTP_CODE=$(echo "$WRONG_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)

echo "$RESPONSE_BODY" | jq '.'
if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ Error 401 correcto para credenciales inválidas${NC}"
else
  echo -e "${RED}✗ Código HTTP inesperado: $HTTP_CODE (se esperaba 401)${NC}"
fi
echo ""
echo ""

echo "========================================="
echo "Tests completados"
echo "========================================="
