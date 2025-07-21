# Walletfy - Gestión de Billetera Personal

Una aplicación web para gestionar el flujo de balance personal a través del registro de eventos de ingresos y egresos.

## Descripción

Walletfy es una aplicación de gestión de billetera que permite a los usuarios:
- Definir un balance inicial
- Registrar eventos de ingreso y egreso de dinero
- Visualizar el flujo de balance a lo largo del tiempo
- Agrupar eventos por mes con cálculos automáticos
- Alternar entre tema claro y oscuro

### Arquitectura de la Aplicación

**Frontend:**
- **React 18** con TypeScript para la interfaz de usuario
- **Redux Toolkit** para el manejo del estado global con thunks async
- **TanStack Router** para el enrutamiento (preparado para expansión futura)
- **Tailwind CSS** para el diseño responsivo
- **Zod** para validación de esquemas
- **Moment.js** para manejo de fechas
- **React Hook Form** para gestión de formularios

**Estructura de Carpetas:**
```
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas principales
├── store/              # Redux store y slices
├── types/              # Definiciones de tipos TypeScript
├── utils/              # Utilidades y helpers
└── hooks/              # Custom hooks
```

**Persistencia:**
- **LocalStorage** para persistir datos en el navegador
- Manejo automático de serialización/deserialización de fechas

**Características Técnicas:**
- Validación de formularios con Zod
- Gestión de estado inmutable con Redux Toolkit
- Componentes funcionales con hooks
- Funciones de orden superior (map, filter, reduce)
- Debouncing para búsqueda optimizada
- Manejo de imágenes en Base64
- Tooltips y modales para UX mejorada

## Ejecución Local

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos para ejecutar localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd walletfy
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   - La aplicación estará disponible en `http://localhost:5173`

### Scripts disponibles:
- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Preview de la build de producción
- `npm run lint` - Ejecuta el linter

## Despliegue

### Despliegue en Cloudflare Pages

1. **Preparar la aplicación:**
   ```bash
   npm run build
   ```

2. **Subir a GitHub:**
   - Asegúrate de que el código esté en un repositorio público en GitHub
   - El directorio de build es `dist/`

3. **Configurar Cloudflare Pages:**
   - Ir a [Cloudflare Pages](https://pages.cloudflare.com/)
   - Conectar con GitHub
   - Seleccionar el repositorio
   - Configurar build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
     - **Root directory:** `/` (raíz del proyecto)

4. **Variables de entorno (si las hay):**
   - No se requieren variables de entorno adicionales para esta aplicación

5. **Deploy automático:**
   - Cloudflare Pages se encargará del deploy automático en cada push a la rama principal

### Alternativas de Despliegue

**Netlify:**
- Conectar repositorio de GitHub
- Build command: `npm run build`
- Publish directory: `dist`

**Vercel:**
- Importar proyecto desde GitHub
- Framework: Vite
- Build command se detecta automáticamente

## Funcionalidades Principales

### Gestión de Eventos
- Crear, editar y eliminar eventos
- Validación de formularios en tiempo real
- Adjuntar imágenes a los eventos
- Tooltips informativos

### Cálculos de Balance
- Balance mensual (ingresos - egresos)
- Balance global acumulativo
- Agrupación automática por mes
- Búsqueda de meses con debouncing

### Interfaz de Usuario
- Diseño responsivo para móvil y desktop
- Tema claro/oscuro persistente
- Animaciones y micro-interacciones
- Modales para detalles de eventos

### Características Adicionales
- Persistencia automática en LocalStorage
- Búsqueda en tiempo real
- Formato de moneda automático
- Validación de tipos de archivo para imágenes

## Tecnologías Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Redux Toolkit** - Gestión de estado
- **Tailwind CSS** - Estilos
- **Zod** - Validación de esquemas
- **Moment.js** - Manejo de fechas
- **React Hook Form** - Gestión de formularios
- **Vite** - Bundler y servidor de desarrollo
- **React Tooltip** - Tooltips interactivos
- **UUID** - Generación de IDs únicos
- **Lucide React** - Iconografía

## Contribución

Para contribuir al proyecto:
1. Fork el repositorio
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request