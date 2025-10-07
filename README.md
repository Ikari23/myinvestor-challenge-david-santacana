# Prueba Técnica MyInvestor — David Santacana Rubireta

> **Prueba Técnica Frontend** - Plataforma de gestión de fondos de inversión desarrollada con React, TypeScript y tecnologías modernas.

## Cómo ejecutar el proyecto

### Requisitos
- **Node.js** ^24.5.0
- **Yarn** ^4.5.1

### Instalación
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

### Scripts adicionales
```bash
yarn test          # Ejecutar tests unitarios
yarn lint          # Linter ESLint
yarn format        # Formatear código con Prettier
yarn build         # Build de producción
```

## Decisiones Técnicas

### **Stack Tecnológico**

**Frontend:**
- **React 18** + **TypeScript** - Type safety y desarrollo moderno
- **Vite** - Build tool rápido y eficiente para desarrollo
- **SCSS con CSS Modules** - Encapsulación de estilos y variables reutilizables
- **Zustand** - Estado global ligero y sin boilerplate
- **Axios** - Cliente HTTP con mejor manejo de errores que fetch

**Código y Calidad:**
- **ESLint + Prettier** - Linting y formateo automático
- **Mobile-first SCSS** - Diseño responsive progresivo

### **Arquitectura y Patrones**

1. **Separación de responsabilidades:**
   - `components/` - Componentes reutilizables
   - `hooks/` - Lógica de negocio reutilizable
   - `stores/` - Estado global con Zustand
   - `types/` - Definiciones TypeScript centralizadas

2. **Composición de componentes:**
   - Componentes pequeños y especializados
   - Props tipadas estrictamente
   - Hooks personalizados para lógica compleja

3. **Gestión de estado:**
   - **Local**: useState/useEffect para UI específica
   - **Global**: Zustand para datos compartidos (fondos, paginación)
   - **Servidor**: Axios con manejo de estados (loading, error, success)

## Funcionalidades Implementadas

### **Listado de Fondos**
- Tabla responsive con fondos obtenidos mediante API
- Sorting bidireccional en columnas sorteables (ASC → DESC → None)
- Paginación client-side
- Menú de acciones dropdown con "Comprar" y "Ver detalle"

### **Accesibilidad (WCAG 2.1 AA)**
- Estructura semántica
- Estados de sorting con `aria-sort` dinámico
- Labels descriptivos para lectores de pantalla
- Navegación por teclado y focus management

## Mejoras con Más Tiempo
A parte de las funcionalidades descritas en el archivo de Instructions.MD que han quedado pendientes de implementar.

- Tests Unitarios de todos los componentes
- Tests de Integración de hooks + API
- Test E2E con Playwright
- Substitución de Zustand por React QUERY
- Adición de skeleton en la tabla durante la carga de datos
- Mejoras en la visualización de datos, como en las columnas de rentabilidad para que se muestren correctamente los decimales
