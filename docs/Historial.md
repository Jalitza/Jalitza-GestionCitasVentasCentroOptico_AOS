# Documentación del Componente de Historial de Accesos

## Descripción General
Componente Angular que gestiona y visualiza el historial de accesos de usuarios, integrado con Firestore para el almacenamiento de datos. Proporciona funcionalidades avanzadas de filtrado y paginación.

## Características Principales
- **Visualización de accesos**: Muestra nombre, email, método de autenticación, dispositivo y fecha
- **Filtrado avanzado**:
  - Por texto (nombre, email, proveedor o dispositivo)
  - Por fecha con ajuste UTC-5
- **Paginación inteligente**: 10 registros por página (configurable)
- **Diseño responsive**: Adaptable a móviles y desktop
- **Badges de identificación**: Colores distintivos por proveedor

## Estructura de Datos
```typescript
interface HistorialAcceso {
  userId: string;
  email: string;
  proveedor: 'email' | 'google' | 'facebook' | 'github';
  dispositivo: 'Móvil' | 'Tablet' | 'Escritorio' | 'iOS' | 'Android';
  fechaAcceso: Timestamp;
}