import serial
import time

# Configurar el puerto
puerto = '/dev/ttyUSB0'
baudrate = 9600

print(f"Conectando a {puerto}...")

# Abrir conexión con el Arduino
ser = serial.Serial(puerto, baudrate, timeout=1)

# Esperar a que Arduino se inicialice
time.sleep(2)

print("Conectado. Leyendo datos...\n")

# Leer 10 líneas para probar
for i in range(10):
    if ser.in_waiting > 0:  # ¿Hay datos esperando?
        linea = ser.readline()  # Leer una línea
        linea = linea.decode('utf-8').strip()  # Convertir a texto
        print(f"Arduino dice: {linea}")
    time.sleep(0.5)

ser.close()
print("\nConexión cerrada.")