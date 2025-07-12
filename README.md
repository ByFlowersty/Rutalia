# RUTALIA - Aplicación de Transporte Público

Una aplicación moderna para la gestión y visualización de rutas de transporte público en Ciudad de México.

## Características

- 🗺️ Mapa interactivo con Leaflet
- 🚌 Visualización de rutas de transporte (Metro, Autobús, Combi)
- 📍 Marcadores personalizados para paradas
- 📱 Diseño responsive para móvil y escritorio
- 🎨 Interfaz moderna con Tailwind CSS
- ⚡ Construido con Next.js 14

## Instalación

1. Clona el repositorio:
\`\`\`bash
git clone <repository-url>
cd rutalia-app
\`\`\`

2. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

3. Ejecuta el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Leaflet** - Biblioteca de mapas interactivos
- **Lucide React** - Iconos
- **Radix UI** - Componentes de UI

## Estructura del Proyecto

\`\`\`
rutalia-app/
├── app/
│   ├── components/
│   │   ├── MapComponent.tsx
│   │   └── CustomMapComponent.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── switch.tsx
│       ├── badge.tsx
│       └── dialog.tsx
├── lib/
│   └── utils.ts
└── hooks/
    ├── use-mobile.tsx
    └── use-toast.ts
\`\`\`

## Funcionalidades

### Mapa Interactivo
- Visualización de rutas de transporte público
- Marcadores personalizados para diferentes tipos de paradas
- Popups informativos con detalles de paradas
- Controles de zoom y navegación

### Rutas de Transporte
- Metro (Líneas azules)
- Autobús (Líneas rojas)
- Combi (Líneas verdes)

### Interfaz de Usuario
- Pantallas de registro e inicio de sesión
- Dashboard principal con mapa
- Búsqueda de rutas
- Perfil de usuario
- Configuraciones

## Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
