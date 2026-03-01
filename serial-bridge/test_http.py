import serial
import time
import json
import requests
from config import SERIAL_PORT, SERIAL_BAUDRATE

puerto_serial = SERIAL_PORT
baudrate = SERIAL_BAUDRATE
url_servidor = "https://httpbin.org/post"  # Servidor de prueba

print(f"Conectando a {puerto_serial}...")
ser = serial.Serial(puerto_serial, baudrate, timeout=1)
time.sleep(2)
print("Conectado. Leyendo y enviando datos...\n")

# Leer y enviar 3 lecturas
for i in range(3):
    if ser.in_waiting > 0:
        linea = ser.readline().decode('utf-8').strip()
        datos = json.loads(linea)
        
        print(f"📖 Leído: Nivel {datos['level']}%")
        
        # Enviar por HTTP POST
        try:
            respuesta = requests.post(url_servidor, json=datos, timeout=5)
            
            if respuesta.status_code == 200:
                print(f"✅ Enviado correctamente al servidor")
            else:
                print(f"❌ Error: código {respuesta.status_code}")
        
        except Exception as e:
            print(f"❌ Error al enviar: {e}")
        
        print()  # Línea en blanco
    
    time.sleep(1)

ser.close()
print("Conexión cerrada.")
