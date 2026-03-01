# 🐍 Serial Bridge - Python

Puente de comunicación entre Arduino (USB/Serial) y el Backend NestJS.

## 📋 Descripción

Este script actúa como intermediario que:

1. Lee datos JSON del Arduino por puerto serial
2. Los procesa y valida
3. Los envía al backend via HTTP o WebSocket

```
Arduino (USB) → Serial Bridge (Python) → Backend (NestJS)
```

## 🚀 Instalación

### Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos

1. **Crear entorno virtual**:

```bash
python3 -m venv venv
```

2. **Activar el entorno virtual**:

Linux/Mac:

```bash
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

3. **Instalar dependencias**:

```bash
python -m pip install -r requirements.txt
```

4. **Configurar variables de entorno**:

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
nano .env
```

## ⚙️ Configuración

Editá el archivo `.env`:

```env
# Puerto serial del Arduino
SERIAL_PORT=/dev/ttyUSB0    # Linux
# SERIAL_PORT=COM3          # Windows
# SERIAL_PORT=/dev/cu.usbmodem14101  # Mac

SERIAL_BAUDRATE=9600
BACKEND_URL=http://localhost:3000
COMMUNICATION_MODE=http
DEBUG=False
```

### Encontrar el Puerto Serial

**Linux:**

```bash
# Ver puertos disponibles
ls /dev/tty*

# Buscar: /dev/ttyUSB0 o /dev/ttyACM0

# Dar permisos
sudo usermod -a -G dialout $USER
# Reiniciar sesión después
```

**Windows:**

```bash
# En Arduino IDE: Herramientas → Puerto
# O listar en Python:
python -c "import serial.tools.list_ports; [print(p.device) for p in serial.tools.list_ports.comports()]"
```

**Mac:**

```bash
ls /dev/cu.*
# Buscar: /dev/cu.usbmodem* o /dev/cu.usbserial-*
```

## 🏃 Ejecución

```bash
# Asegúrate de tener el entorno virtual activado (ver el (venv) al inicio)
python main.py
```

Deberías ver:

```
[2026-03-01 17:03:02] [INFO] ==================================================
[2026-03-01 17:03:02] [INFO] 🌊 SERIAL BRIDGE - Arduino → Backend
[2026-03-01 17:03:02] [INFO] ==================================================
[2026-03-01 17:03:02] [SUCCESS] ✅ Conectado al Arduino
[2026-03-01 17:03:04] [DEBUG] 📊 Nivel: 42% | Alerta: False
```

Para detenerlo: `Ctrl+C`

## 📡 Flujo de Datos

### Arduino → Backend

Cada 500ms el Arduino envía:

```json
{
  "type": "reading",
  "level": 75,
  "mode": 0,
  "alert": false,
  "calib": false,
  "uptime": 12400
}
```

El bridge agrega:

```json
{
  ...
  "server_timestamp": "2026-03-01T17:03:04.123456"
}
```

## 🐛 Solución de Problemas

### Error: "Port already in use"

Cerrar otros programas que usen el puerto:

- Arduino IDE (Serial Monitor)
- Otra instancia del bridge

### Error: "Permission denied" (Linux)

```bash
sudo usermod -a -G dialout $USER
# Reiniciar sesión
```

### Error: "Connection refused" al backend

Es normal si el backend no está corriendo. El bridge seguirá intentando.

### Backend no responde

Verificar que el backend esté corriendo:

```bash
curl http://localhost:3000/health
```

## 📊 Scripts de Prueba

El proyecto incluye scripts de prueba:

- `test_serial.py` - Prueba básica de lectura serial
- `test_json.py` - Prueba de parsing JSON
- `test_http.py` - Prueba de envío HTTP

Ejecutar:

```bash
python test_serial.py
```

## 🔗 Integración con el Sistema

Este es el módulo 2 del sistema completo:

```
1. Arduino (hardware)
      ↓ USB/Serial
2. Serial Bridge (este script) ← ESTÁS AQUÍ
      ↓ HTTP/WebSocket
3. Backend NestJS
      ↓ WebSocket
4. Frontend React
```

## 📝 Dependencias

- **pyserial**: Comunicación serial con Arduino
- **requests**: HTTP POST al backend
- **python-dotenv**: Variables de entorno desde .env
- **python-socketio**: WebSocket en tiempo real (preparado para uso futuro)

## 📄 Licencia

MIT
