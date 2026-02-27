# 🔌 Arduino - Monitor de Nivel de Agua

Código del microcontrolador para el sistema IoT de monitoreo de nivel de agua.

## 📋 Hardware Requerido

- **Arduino UNO** (o compatible)
- **Shield Multifunción HW-262** que incluye:
  - Display 7 segmentos (4 dígitos, controlador 74HC595)
  - 4 LEDs (pines 13, 12, 11, 10)
  - 3 Botones (pines A1, A2, A3)
  - 1 Potenciómetro (pin A0)
  - 1 Buzzer (pin 3) - *desactivado en este proyecto*

## 🔧 Configuración de Pines

```cpp
// Display 7 segmentos (74HC595)
LATCH_PIN = 4
CLK_PIN   = 7
DATA_PIN  = 8

// LEDs
LED_1 (Verde)    = 13  // Nivel OK (>60%)
LED_2 (Amarillo) = 12  // Nivel medio (30-60%)
LED_3 (Rojo)     = 11  // Nivel crítico (<30%)
LED_4 (Alerta)   = 10  // Parpadea en estado crítico

// Botones (con pull-up interno)
BUTTON_1 = A1  // Cambiar modo de visualización
BUTTON_2 = A2  // Reset de alertas
BUTTON_3 = A3  // Modo calibración/demo

// Potenciómetro
POT_PIN = A0   // Simula sensor de nivel (0-100%)
```

## 🎮 Funcionalidades

### Modos de Visualización (BUTTON_1)
1. **Modo 0**: Porcentaje (0-100%)
2. **Modo 1**: Litros calculados según capacidad del tanque
3. **Modo 2**: Altura en centímetros

### Indicadores LED
- **Verde (LED_1)**: Nivel óptimo (>60%)
- **Amarillo (LED_2)**: Nivel medio (30-60%)
- **Rojo (LED_3) + LED_4 parpadeando**: Nivel crítico (<30%)

### Comunicación Serial (9600 baud)

**Datos enviados cada 500ms:**
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

**Comandos recibidos:**
```json
// Cambiar capacidad del tanque
{"cmd":"set_capacity","value":500}

// Cambiar altura del tanque
{"cmd":"set_height","value":150}

// Obtener configuración actual
{"cmd":"get_config"}

// Ping de conectividad
{"cmd":"ping"}
```

## 💾 Persistencia de Datos (EEPROM)

La configuración se guarda en la EEPROM y persiste al apagarse:
- Capacidad del tanque (litros)
- Altura del tanque (cm)
- Último modo de visualización seleccionado

**Mapa de memoria EEPROM:**
```
ADDR_INIT     (0): Flag de inicialización (0xAA)
ADDR_CAPACITY (1): Tank capacity - 2 bytes
ADDR_HEIGHT   (3): Tank height - 2 bytes
ADDR_MODE     (5): Display mode - 1 byte
```

## 🚀 Instalación

1. **Instalar Arduino IDE**
   - Descargar de: https://www.arduino.cc/en/software

2. **Abrir el sketch**
   ```bash
   arduino/water_level_monitor/water_level_monitor.ino
   ```

3. **Configurar Arduino IDE**
   - Herramientas → Placa → Arduino UNO
   - Herramientas → Puerto → Seleccionar puerto COM

4. **Subir el código**
   - Verificar (✓)
   - Subir (→)

## 🔍 Solución de Problemas

### Display muestra números invertidos
El shield puede tener display Common Cathode en vez de Common Anode. 
Cambiar en el código:
```cpp
const byte SEGMENT_MAP[] = {
  255 - 0xC0, // 0
  255 - 0xF9, // 1
  // ... aplicar a todos
};
```

### Puerto Serial no disponible
- Verificar que el cable USB esté bien conectado
- Cerrar otros programas que puedan estar usando el puerto (Arduino IDE, PuTTY, etc.)
- En Linux, agregar permisos: `sudo usermod -a -G dialout $USER`

### LEDs no encienden
El shield HW-262 usa lógica Common Anode:
- `LOW` = LED encendido
- `HIGH` = LED apagado

## 📊 Monitoreo Serial

Para ver los datos en tiempo real sin el backend:

**Arduino IDE:** Herramientas → Monitor Serie (9600 baud)

**Linux/Mac:**
```bash
screen /dev/ttyUSB0 9600
# o
cat /dev/ttyUSB0
```

**Windows:**
```bash
# Usar PuTTY o Arduino IDE
```

## 🔗 Integración con el Sistema

Este código es la primera capa del sistema completo:

```
Arduino (este código)
      ↓ USB/Serial (JSON)
Serial Bridge (Python)
      ↓ HTTP/WebSocket
Backend (NestJS)
      ↓ WebSocket
Frontend (React)
```

## 📝 Notas de Desarrollo

- **Memoria SRAM**: 2KB - El código usa ~100 bytes de variables globales
- **Baudrate**: 9600 - Suficiente para JSON simple cada 500ms
- **Sin uso de String**: Para evitar fragmentación de memoria
- **F() macro**: Strings literales en Flash para ahorrar SRAM

## 📄 Licencia

MIT
