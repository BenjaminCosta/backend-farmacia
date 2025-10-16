# Farmacia Russo - Frontend

Aplicación web moderna para la gestión de una farmacia online, construida con React, TypeScript y Vite.

## 🚀 Características

- **Catálogo de productos** con búsqueda y filtros avanzados
- **Sistema de autenticación** con roles de usuario y administrador
- **Carrito de compras** y lista de deseos
- **Gestión de pedidos** y seguimiento
- **Panel de administración** para gestión de productos y pedidos
- **Diseño responsive** adaptado a todos los dispositivos
- **Interfaz moderna** con Tailwind CSS y shadcn/ui

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **TanStack Query** - Gestión de estado del servidor
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes de UI
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de la build
npm run preview
```

## 🔧 Configuración

Configura las variables de entorno en un archivo `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Imágenes y recursos estáticos
├── components/      # Componentes reutilizables
│   └── ui/         # Componentes de interfaz de shadcn/ui
├── context/        # Context API (Auth, Cart, Wishlist)
├── hooks/          # Custom hooks
├── lib/            # Utilidades y configuraciones
├── pages/          # Páginas de la aplicación
├── App.tsx         # Componente principal
└── main.tsx        # Punto de entrada
```

## 👥 Equipo de Desarrollo

Proyecto desarrollado como parte del Trabajo Práctico Obligatorio de la UADE.

## 📄 Licencia

Este proyecto es privado y de uso académico.
