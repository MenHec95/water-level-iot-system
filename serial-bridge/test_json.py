import serial
import time
import json
from config import SERIAL_PORT, SERIAL_BAUDRATE, DEBUG  # Importar del config

print(f"Conectando a {SERIAL_PORT}...")
ser = serial.Serial(SERIAL_PORT, SERIAL_BAUDRATE, timeout=1)
time.sleep(2)
print("Conectado. Leyendo datos...\n")

for i in range(5):
    if ser.in_waiting > 0:
        linea = ser.readline().decode('utf-8').strip()
        
        if DEBUG:
            print(f"[DEBUG] Línea cruda: {linea}")
        
        datos = json.loads(linea)
        nivel = datos['level']
        alerta = datos['alert']
        
        print(f"Nivel: {nivel}% | Alerta: {alerta}")
    
    time.sleep(0.5)

ser.close()