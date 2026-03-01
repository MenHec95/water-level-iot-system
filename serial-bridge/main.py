#!/usr/bin/env python3
import serial
import json
import time
import requests
from datetime import datetime
from config import SERIAL_PORT, SERIAL_BAUDRATE, BACKEND_URL, DEBUG

def log(mensaje, nivel="INFO"):
    """Función para imprimir logs con timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{nivel}] {mensaje}")

def conectar_serial():
    """Conectar al Arduino"""
    try:
        log(f"Conectando a {SERIAL_PORT} @ {SERIAL_BAUDRATE} baud...")
        ser = serial.Serial(SERIAL_PORT, SERIAL_BAUDRATE, timeout=1)
        time.sleep(2)  # Esperar reset del Arduino
        ser.reset_input_buffer()  # Limpiar buffer
        log("✅ Conectado al Arduino", "SUCCESS")
        return ser
    except Exception as e:
        log(f"❌ Error al conectar: {e}", "ERROR")
        return None

def enviar_http(datos):
    """Enviar datos al backend por HTTP POST"""
    try:
        respuesta = requests.post(
            f"{BACKEND_URL}/api/readings",
            json=datos,
            timeout=5
        )
        
        if respuesta.status_code in [200, 201]:
            if DEBUG:
                log(f"✅ HTTP enviado", "DEBUG")
            return True
        else:
            log(f"⚠️ HTTP {respuesta.status_code}", "WARNING")
            return False
    
    except Exception as e:
        log(f"❌ Error HTTP: {e}", "ERROR")
        return False

def procesar_datos(linea):
    """Procesar línea del Arduino y convertir a JSON"""
    try:
        datos = json.loads(linea)
        
        # Agregar timestamp del servidor
        datos['server_timestamp'] = datetime.now().isoformat()
        
        if DEBUG:
            nivel = datos.get('level', '?')
            alerta = datos.get('alert', False)
            log(f"📊 Nivel: {nivel}% | Alerta: {alerta}", "DEBUG")
        
        return datos
    
    except json.JSONDecodeError:
        log(f"⚠️ JSON inválido: {linea}", "WARNING")
        return None
    
def main():
    """Loop principal del bridge"""
    log("=" * 50)
    log("🌊 SERIAL BRIDGE - Arduino → Backend")
    log("=" * 50)
    log(f"Puerto: {SERIAL_PORT}")
    log(f"Backend: {BACKEND_URL}")
    log(f"Debug: {'ON' if DEBUG else 'OFF'}")
    log("=" * 50)
    
    # Conectar al Arduino
    ser = conectar_serial()
    if not ser:
        log("No se pudo conectar. Saliendo.", "ERROR")
        return
    
    log("✅ Bridge operativo. Presiona Ctrl+C para detener\n")
    
    try:
        # Loop infinito de lectura
        while True:
            if ser.in_waiting > 0:
                linea = ser.readline().decode('utf-8', errors='ignore').strip()
                
                if linea:
                    if DEBUG:
                        log(f"Arduino → {linea}", "DEBUG")
                    
                    # Procesar datos
                    datos = procesar_datos(linea)
                    
                    if datos:
                        # Enviar al backend
                        enviar_http(datos)
            
            time.sleep(0.01)  # Pequeña pausa
    
    except KeyboardInterrupt:
        log("\n🛑 Deteniendo bridge...", "INFO")
    
    finally:
        if ser and ser.is_open:
            ser.close()
            log("Puerto serial cerrado", "INFO")
        log("Bridge detenido", "INFO")

if __name__ == "__main__":
    main()