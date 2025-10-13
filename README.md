# Prueba Técnica MyInvestor — David Santacana Rubireta

> **Prueba Técnica Frontend** - Plataforma de gestión de fondos de inversión desarrollada con React, TypeScript y tecnologías modernas.

## Cómo ejecutar el proyecto

### Requisitos
- **Node.js** ^24.5.0
- **Yarn** ^4.5.1

### Instalación y ejecución
```bash
# Clonar el repositorio
git clone https://github.com/Ikari23/myinvestor-challenge-david-santacana
cd myinvestor-challenge

# Instalar dependencias
yarn install

# Ejecutar el servidor API (terminal 1)
yarn start

# Ejecutar la aplicación React (terminal 2)
yarn dev
```

### URLs disponibles
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000

### Scripts disponibles
```bash
yarn dev                # Ejecutar en modo desarrollo
yarn build              # Build de producción
yarn preview            # Preview del build
yarn start              # Ejecutar servidor API
yarn test               # Ejecutar tests unitarios
yarn test:ui            # Ejecutar tests con interfaz visual
yarn test:coverage      # Generar reporte de cobertura
yarn lint               # Linter ESLint
yarn format             # Formatear código con Prettier
```

## Stack Tecnológico

### **Frontend**
- **React 18** + **TypeScript** - Desarrollo moderno con type safety
- **Vite** - Build tool rápido con HMR
- **SCSS + CSS Modules** - Estilos encapsulados y variables reutilizables
- **React Hook Form** - Manejo eficiente de formularios con validación
- **TanStack Query (React Query)** - Gestión de estado del servidor con caché inteligente
- **Vitest** - Framework de testing rápido y moderno

### **Gestión de Estado y Datos**
- **React Query** - Caché automático y sincronización de datos del servidor
- **Axios** - Cliente HTTP con interceptors y manejo de errores
- **React Hook Form** - Estado de formularios optimizado

## Funcionalidades Implementadas

### **Listado de Fondos**
- Tabla responsive con datos obtenidos de API REST
- Ordenación bidireccional por columnas (ASC → DESC → None)
- Paginación client-side personalizable (10, 20, 50 elementos)
- Estados de carga, error y datos vacíos
- Manejo de errores con reintento automático

### **Funcionalidad de Compra**
- Diálogo modal para compra de fondos
- Formulario con validación en tiempo real
- Cálculo automático de unidades basado en precio
- Mensajes de confirmación y error
- Formateo de números según locale español (es-ES)

### **Portfolio (Vista Mi Cartera)**
- Cards responsivas con información de fondos
- Filtrado por categorías dinámicas
- Acciones rápidas (Comprar/Ver detalle)
- Diseño mobile-first optimizado

### **Testing y Calidad**
- **187 tests unitarios** con 100% de aprobación
- **22 archivos de test** cubriendo componentes y hooks

## Arquitectura del Proyecto

### **Estructura de Carpetas**
```
src/
├── components/          # Componentes React reutilizables
│   ├── ActionMenu/     # Menú dropdown de acciones
│   ├── Dialog/         # Modal de compra de fondos
│   ├── FundsTable/     # Tabla principal de fondos
│   ├── Navigation/     # Navegación principal
│   ├── Pagination/     # Componente de paginación
│   ├── Portfolio/      # Vista de cards de portfolio
│   ├── SortIcon/       # Iconos de ordenación
│   └── Toast/          # Notificaciones temporales
├── hooks/              # Custom hooks para lógica de negocio
│   ├── useBuyFund.ts   # Lógica de compra de fondos
│   ├── useFunds.ts     # Gestión de datos de fondos
│   ├── useToast.ts     # Sistema de notificaciones
│   └── ...             # Otros hooks utilitarios
├── types/              # Definiciones TypeScript
├── utils/              # Funciones utilitarias
└── styles/             # Estilos globales y variables
```
