# 💧 Sistema IoT de Monitoreo de Nivel de Agua — Backend

Servicio backend para un sistema de monitoreo de nivel de agua en tiempo real, construido con Arduino UNO + shield de sensor HW-262.

## 🏗️ Arquitectura

Este proyecto sigue el patrón de **Arquitectura en Capas**:

```
Controller → Service → Repository → Database
```

- **Entidades de dominio** desacopladas de los modelos de Prisma
- **TypeScript estricto** (sin any implícito, verificación estricta de nulos)
- **Datos en tiempo real** via Socket.io
- **Persistencia inteligente** — guarda por intervalo + eventos críticos

## 🛠️ Stack Tecnológico

| Capa          | Tecnología                 |
| ------------- | -------------------------- |
| Framework     | NestJS                     |
| Lenguaje      | TypeScript (modo estricto) |
| ORM           | Prisma                     |
| Base de datos | PostgreSQL                 |
| Tiempo real   | Socket.io                  |
| Validación    | class-validator            |
| Documentación | Swagger / OpenAPI          |

## 📡 Integración con Hardware

```
Arduino UNO + HW-262
       ↓
Python Serial Bridge (HTTP)
       ↓
NestJS Backend
       ↓
Socket.io → React Frontend
```

## 🚀 Inicio Rápido

### Requisitos previos

- Node.js 18+
- PostgreSQL
- npm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MenHec95/water-level-iot-system

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Ejecutar migraciones de base de datos
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run start:dev
```

## 🔌 Endpoints de la API

| Método | Endpoint           | Descripción                            |
| ------ | ------------------ | -------------------------------------- |
| POST   | `/readings`        | Recibe lectura del serial bridge       |
| GET    | `/readings`        | Obtiene historial paginado de lecturas |
| GET    | `/readings/latest` | Obtiene la última lectura              |
| GET    | `/readings/stats`  | Obtiene estadísticas agregadas         |
| POST   | `/simulator/start` | Inicia el simulador de datos           |
| POST   | `/simulator/stop`  | Detiene el simulador de datos          |

## 🌐 Eventos WebSocket

| Evento             | Dirección          | Descripción                    |
| ------------------ | ------------------ | ------------------------------ |
| `reading:new`      | Servidor → Cliente | Nueva lectura del sensor       |
| `reading:alert`    | Servidor → Cliente | Evento crítico detectado       |
| `simulator:status` | Servidor → Cliente | Cambio de estado del simulador |

## ⚙️ Variables de Entorno

Ver `.env.example` para todas las variables requeridas.

## 📦 Estructura del Proyecto

```
src/
├── common/          # Filtros, guards e interceptores compartidos
├── config/          # Configuración centralizada
├── modules/
│   ├── readings/    # Módulo principal de datos IoT
│   └── simulator/   # Generador de datos simulados
├── prisma/          # Capa de base de datos
├── app.module.ts
└── main.ts
```

## 🔗 Repositorios Relacionados

- [Firmware Arduino + Python Serial Bridge](https://github.com/MenHec95/water-level-iot-system)

## 📄 Licencia

MIT

## 🌐 Traducciones

- [English](./README.md)
