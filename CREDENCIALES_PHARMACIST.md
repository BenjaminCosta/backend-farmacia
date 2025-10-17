# 🔐 Credenciales de Usuario PHARMACIST

## ✅ Usuario de Prueba - Farmacéutico (ACTUALIZADO Y FUNCIONANDO)

Para probar el Panel de Farmacéutico, utiliza las siguientes credenciales:

### ✨ Credenciales Actualizadas

**Email:** `farmaceutico@farmacia.com`  
**Contraseña:** `farmacia123`  
**Rol:** `PHARMACIST`

> ⚠️ **IMPORTANTE**: La contraseña ha sido actualizada automáticamente en la base de datos.
> El backend ya confirmó: "✅ Usuario PHARMACIST actualizado"

### Opción 2: Crear usuario manualmente (si el anterior no funciona)

Si el usuario automático no se creó, puedes crearlo manualmente usando el endpoint de admin:

```bash
POST http://localhost:4002/api/admin/users
Content-Type: application/json
Authorization: Bearer {TOKEN_DE_ADMIN}

{
  "email": "farmaceutico@farmacia.com",
  "password": "farmacia123",
  "firstname": "María",
  "lastname": "Farmacéutica",
  "role": "PHARMACIST"
}
```

## 🚀 Pasos para Probar

1. **Iniciar el Backend** (si no está corriendo):
   ```bash
   cd /Users/benjacosta/Documents/FarmaciaTPO/Farmacia
   mvn spring-boot:run
   ```

2. **Iniciar el Frontend**:
   ```bash
   cd /Users/benjacosta/Documents/FarmaciaTPO/Frontend
   npm run dev
   # o
   bun run dev
   ```

3. **Acceder a la aplicación**:
   - Abre el navegador en `http://localhost:5173` (o el puerto que use tu frontend)
   - Haz clic en "Ingresar"
   - Usa las credenciales de arriba:
     - Email: `farmaceutico@farmacia.com`
     - Contraseña: `farmacia123`

4. **Acceder al Panel**:
   - Una vez autenticado, verás tu nombre en la esquina superior derecha
   - Haz clic en el icono de usuario
   - Selecciona "Panel Farmacéutico"
   - Serás redirigido a `/pharmacist`

## ✨ Funcionalidades Disponibles

### En el Panel Farmacéutico podrás:

✅ **Ver Estadísticas**:
- Total de productos en catálogo
- Productos con stock bajo
- Pedidos pendientes
- Ingresos totales

✅ **Gestionar Productos**:
- Listar todos los productos
- Crear nuevos productos
- Editar productos existentes
- Eliminar productos
- Ver stock actual

✅ **Gestionar Categorías**:
- Listar categorías
- Crear nuevas categorías
- Editar categorías
- Eliminar categorías

✅ **Gestionar Pedidos**:
- Ver todos los pedidos
- Actualizar estado de pedidos:
  - PENDING → PROCESSING
  - PROCESSING → COMPLETED
- Ver detalles de cada pedido

✅ **Monitor de Stock Bajo**:
- Ver productos con menos de 10 unidades
- Identificar productos que necesitan reabastecimiento

## 🔧 Verificación de Rol

Si quieres verificar que el usuario tiene el rol correcto, puedes:

1. **Ver en la consola del navegador** (al iniciar sesión):
   ```javascript
   localStorage.getItem('user')
   // Debería mostrar: {"email":"farmaceutico@farmacia.com","role":"PHARMACIST",...}
   ```

2. **Verificar en la base de datos**:
   ```sql
   SELECT u.email, r.name as role 
   FROM users u 
   JOIN roles r ON u.role_id = r.id 
   WHERE u.email = 'farmaceutico@farmacia.com';
   ```

## 🆘 Solución de Problemas

### No puedo acceder al panel
- Verifica que iniciaste sesión con el usuario correcto
- Revisa en `localStorage.getItem('user')` que el rol sea `PHARMACIST`
- Asegúrate de que el backend esté corriendo en el puerto 4002

### El usuario no existe
- Revisa los logs del backend al iniciar
- Busca el mensaje: "✅ Usuario PHARMACIST de prueba creado"
- Si no aparece, el usuario ya existía previamente

### Errores de permisos en endpoints
- Verifica que el token JWT sea válido
- Asegúrate de que el backend tenga configurado `@PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")`

## 📞 Soporte

Si tienes problemas, revisa:
- Logs del backend en la terminal
- Consola del navegador (F12)
- Network tab para ver errores de API
