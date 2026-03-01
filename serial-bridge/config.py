import os
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

# Configuración del puerto serial
SERIAL_PORT = os.getenv('SERIAL_PORT', '/dev/ttyUSB0')
SERIAL_BAUDRATE = int(os.getenv('SERIAL_BAUDRATE', 9600))

# Configuración del backend (lo usaremos después)
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:3000')
COMMUNICATION_MODE = os.getenv('COMMUNICATION_MODE', 'websocket')

# Debug
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'