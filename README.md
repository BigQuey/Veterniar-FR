# 🐾 Veterinaria PR - Sistema de Gestión Veterinaria

Una aplicación moderna y eficiente para la gestión integral de clínicas veterinarias, diseñada con una estética de vanguardia y centrada en la experiencia del usuario.

## ✨ Características Principales

- **Dashboard Inteligente**: Vista general de las métricas clave de la clínica.
- **Gestión de Pacientes (Mascotas)**: Control detallado de animales, incluyendo especies, razas y propietarios.
- **Historial Clínico Digital**: Seguimiento exhaustivo de consultas, diagnósticos y tratamientos.
- **Control de Citas**: Sistema de agendamiento para optimizar el flujo de trabajo.
- **Facturación y Pagos**: Emisión de facturas con actualización de estado de pago en tiempo real y soporte para múltiples métodos de pago (Efectivo, Tarjeta, Transferencia).
- **Inventario de Medicamentos**: Gestión de stock de fármacos y suministros médicos.
- **Seguridad y Roles**: Protección de rutas mediante Guards y manejo de sesiones con JWT.

## 🛠️ Stack Tecnológico

- **Frontend**: [Angular 19](https://angular.dev/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconografía**: [Heroicons](https://heroicons.com/)
- **Gestión de Estado**: Servicios reactivos con Observables (RxJS)
- **Diseño**: Glassmorphism, Gradientes modernos y Micro-animaciones.

## 🚀 Instalación y Desarrollo

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/veterinaria-fr.git
   cd veterinaria-fr
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar servidor de desarrollo**:
   ```bash
   ng serve
   ```
   Accede a `http://localhost:4200/` en tu navegador.

## 📦 Construcción para Producción

Para generar el bundle de producción, ejecuta:
```bash
ng build
```
Los archivos compilados se guardarán en el directorio `dist/`.

## 🔒 Protección de Rutas

El acceso al dashboard está protegido mediante el `AuthGuard`, asegurando que solo usuarios autenticados puedan ver y gestionar la información sensible de la clínica.

---
Desarrollado con ❤️ para veterinarios modernos.
