cat > README.md << 'EOF'

# 🌊 Sistema IoT de Monitoreo de Nivel de Agua

Sistema full-stack IoT para monitorear el nivel de agua en tiempo real, desarrollado con Arduino, Python, NestJS y React.

## 🎯 Características

- **Hardware**: Arduino UNO + Shield HW-262 simulando sensor de nivel
- **Comunicación**: Serial/USB → Python Bridge → WebSocket
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: React con gráficos en tiempo real
- **Deploy**: Backend en Railway/Render, Frontend en Vercel

## 📦 Estructura del Proyecto

```
water-level-iot-system/
├── arduino/           # Código del microcontrolador
├── serial-bridge/     # Script Python para comunicación serial
├── backend/           # API NestJS
└── frontend/          # Dashboard React
```

## 🚀 Estado del Proyecto

- [x] Código Arduino
- [ ] Serial Bridge Python
- [ ] Backend NestJS
- [ ] Frontend React
- [ ] Deploy

## 🛠️ Stack Tecnológico

### Hardware

- Arduino UNO
- Shield Multifunción HW-262
  - Display 7 segmentos (4 dígitos)
  - 4 LEDs de estado
  - 3 Botones
  - 1 Potenciómetro (simula sensor)

### Software

- **Embedded**: C/C++ (Arduino)
- **Bridge**: Python + PySerial
- **Backend**: NestJS + Prisma + PostgreSQL + Socket.io
- **Frontend**: React + Chart.js + Socket.io-client
- **Deploy**: Railway/Render + Vercel

## 📖 Documentación por Módulo

Cada carpeta contiene su propio README con instrucciones específicas:

- [Arduino](./arduino/README.md)
- [Serial Bridge](./serial-bridge/README.md) _(próximamente)_
- [Backend](./backend/README.md) _(próximamente)_
- [Frontend](./frontend/README.md) _(próximamente)_

## 👤 Autor

Proyecto desarrollado para portfolio profesional.

## 📄 Licencia

MIT
EOF
