// =============================================
// SISTEMA DE MONITOREO DE NIVEL DE AGUA
// Shield: HW-262 | Arduino UNO
// =============================================

// --- Pines del Display (74HC595) ---
#define LATCH_PIN 4
#define CLK_PIN   7
#define DATA_PIN  8

// --- LEDs ---
#define LED_1 13  // Verde  → Nivel OK    (>60%)
#define LED_2 12  // Amarillo → Nivel medio (30-60%)
#define LED_3 11  // Rojo   → Nivel crítico (<30%)
#define LED_4 10  // Parpadea en alerta crítica

// --- Botones ---
#define BUTTON_1 A1  // Cambiar modo de visualización
#define BUTTON_2 A2  // Reset de alertas
#define BUTTON_3 A3  // Modo calibración / demo

// --- Potenciómetro ---
#define POT_PIN A0

// --- Buzzer ---
// #define BUZZER_PIN 3

// --- Mapa de segmentos (Common Anode) ---
// Si los números se ven mal, cambia cada valor por: 255 - valor
const byte SEGMENT_MAP[] = {
  0xC0, // 0
  0xF9, // 1
  0xA4, // 2
  0xB0, // 3
  0x99, // 4
  0x92, // 5
  0x82, // 6
  0xF8, // 7
  0x80, // 8
  0x90  // 9
};
const byte SEGMENT_OFF    = 0xFF;
const byte SEGMENT_SELECT[] = {0xF1, 0xF2, 0xF4, 0xF8};

// --- Variables de estado ---
int waterLevel   = 0;   // 0-100%
int displayMode  = 0;   // 0: porcentaje, 1: litros, 2: altura (cm)
bool alertActive = false;
bool calibMode   = false;

// Configuración del tanque (configurable desde backend)
int tankCapacity = 1000; // litros
int tankHeight   = 200;  // cm

// Debounce de botones
bool lastBtn1 = HIGH, lastBtn2 = HIGH, lastBtn3 = HIGH;
unsigned long lastDebounce1 = 0, lastDebounce2 = 0, lastDebounce3 = 0;
const int DEBOUNCE_DELAY = 200;

// Temporizador
unsigned long lastSend    = 0;
unsigned long lastBlink   = 0;
bool          blinkState  = false;
const int     SEND_INTERVAL = 500; // ms

void setup() {
  Serial.begin(9600);

  // Display
  pinMode(LATCH_PIN, OUTPUT);
  pinMode(CLK_PIN,   OUTPUT);
  pinMode(DATA_PIN,  OUTPUT);

  // LEDs
  pinMode(LED_1, OUTPUT);
  pinMode(LED_2, OUTPUT);
  pinMode(LED_3, OUTPUT);
  pinMode(LED_4, OUTPUT);

  // Buzzer
//  pinMode(BUZZER_PIN, OUTPUT);

  // Botones con pull-up interno
  pinMode(BUTTON_1, INPUT_PULLUP);
  pinMode(BUTTON_2, INPUT_PULLUP);
  pinMode(BUTTON_3, INPUT_PULLUP);

  // Apagar todo
  allLedsOff();
  clearDisplay();

  // Mensaje de inicio en display: "----"
  showDashes();
  delay(1000);
}

void loop() {
  // 1. Leer potenciómetro y mapear a 0-100%
  waterLevel = map(analogRead(POT_PIN), 0, 1023, 0, 100);

  // 2. Leer botones
  handleButtons();

  // 3. Actualizar LEDs según nivel
  updateLEDs();

  // 4. Actualizar display
  updateDisplay();

  // 5. Leer comandos desde el backend (Serial IN)
  handleSerialCommands();

  // 6. Enviar datos al backend cada SEND_INTERVAL ms
  if (millis() - lastSend >= SEND_INTERVAL) {
    sendSerialData();
    lastSend = millis();
  }
}

// =============================================
// BOTONES
// =============================================
void handleButtons() {
  unsigned long now = millis();

  // Botón 1: Cambiar modo display
  bool b1 = digitalRead(BUTTON_1);
  if (b1 == LOW && lastBtn1 == HIGH && (now - lastDebounce1) > DEBOUNCE_DELAY) {
    displayMode = (displayMode + 1) % 3;
    lastDebounce1 = now;
    // Notificar al backend
    Serial.print("{\"action\":\"mode_change\",\"mode\":");
    Serial.print(displayMode);
    Serial.println("}");
  }
  lastBtn1 = b1;

  // Botón 2: Reset de alertas
  bool b2 = digitalRead(BUTTON_2);
  if (b2 == LOW && lastBtn2 == HIGH && (now - lastDebounce2) > DEBOUNCE_DELAY) {
    alertActive = false;
//    digitalWrite(BUZZER_PIN, LOW);
    lastDebounce2 = now;
    Serial.println("{\"action\":\"reset_alert\"}");
  }
  lastBtn2 = b2;

  // Botón 3: Toggle calibración / demo
  bool b3 = digitalRead(BUTTON_3);
  if (b3 == LOW && lastBtn3 == HIGH && (now - lastDebounce3) > DEBOUNCE_DELAY) {
    calibMode = !calibMode;
    lastDebounce3 = now;
    Serial.print("{\"action\":\"calib_toggle\",\"active\":");
    Serial.print(calibMode ? "true" : "false");
    Serial.println("}");
  }
  lastBtn3 = b3;
}

// =============================================
// LEDs DE ESTADO
// =============================================
void updateLEDs() {
  allLedsOff();

  if (waterLevel > 60) {
    // OK: Verde encendido
    digitalWrite(LED_1, LOW);  // Activo en LOW (common anode)
    alertActive = false;
  //  digitalWrite(BUZZER_PIN, LOW);

  } else if (waterLevel > 30) {
    // Medio: Amarillo
    digitalWrite(LED_2, LOW);
    alertActive = false;
 //   digitalWrite(BUZZER_PIN, LOW);

  } else {
    // Crítico: Rojo + LED_4 parpadea + buzzer
    digitalWrite(LED_3, LOW);
    alertActive = true;

    // Parpadeo de LED_4
    if (millis() - lastBlink > 500) {
      blinkState = !blinkState;
      digitalWrite(LED_4, blinkState ? LOW : HIGH);
      // Buzzer breve en cada parpadeo
//      digitalWrite(BUZZER_PIN, blinkState ? HIGH : LOW);
      lastBlink = millis();
    }
  }
}

void allLedsOff() {
  // HIGH = apagado en common anode
  digitalWrite(LED_1, HIGH);
  digitalWrite(LED_2, HIGH);
  digitalWrite(LED_3, HIGH);
  digitalWrite(LED_4, HIGH);
}

// =============================================
// DISPLAY 7 SEGMENTOS
// =============================================
void updateDisplay() {
  int value = 0;

  switch (displayMode) {
    case 0: // Porcentaje
      value = waterLevel;
      break;
    case 1: // Litros
      value = (waterLevel * tankCapacity) / 100;
      if (value > 9999) value = 9999;
      break;
    case 2: // Centímetros de altura
      value = (waterLevel * tankHeight) / 100;
      if (value > 9999) value = 9999;
      break;
  }

  writeNumber(value);
}

void writeNumber(int number) {
  int digits[4];
  digits[0] = (number / 1000) % 10;
  digits[1] = (number / 100)  % 10;
  digits[2] = (number / 10)   % 10;
  digits[3] =  number         % 10;

  for (int i = 0; i < 4; i++) {
    writeSegment(i, digits[i]);
  }
}

void writeSegment(byte segment, byte value) {
  digitalWrite(LATCH_PIN, LOW);
  shiftOut(DATA_PIN, CLK_PIN, MSBFIRST, SEGMENT_MAP[value]);
  shiftOut(DATA_PIN, CLK_PIN, MSBFIRST, SEGMENT_SELECT[segment]);
  digitalWrite(LATCH_PIN, HIGH);
}

void clearDisplay() {
  for (int i = 0; i < 4; i++) {
    digitalWrite(LATCH_PIN, LOW);
    shiftOut(DATA_PIN, CLK_PIN, MSBFIRST, SEGMENT_OFF);
    shiftOut(DATA_PIN, CLK_PIN, MSBFIRST, SEGMENT_SELECT[i]);
    digitalWrite(LATCH_PIN, HIGH);
  }
}

void showDashes() {
  byte dash = 0xBF; // Segmento G = guión
  for (int i = 0; i < 4; i++) {
    digitalWrite(LATCH_PIN, LOW);
    shiftOut(DATA_PIN, CLK_PIN, MSBFIRST, dash);
    shiftOut(DATA_PIN, CLK_PIN, MSBFIRST, SEGMENT_SELECT[i]);
    digitalWrite(LATCH_PIN, HIGH);
  }
}

// =============================================
// COMUNICACIÓN SERIAL
// =============================================
void sendSerialData() {
  Serial.print("{\"type\":\"reading\"");
  Serial.print(",\"level\":");    Serial.print(waterLevel);
  Serial.print(",\"mode\":");     Serial.print(displayMode);
  Serial.print(",\"alert\":");    Serial.print(alertActive ? "true" : "false");
  Serial.print(",\"calib\":");    Serial.print(calibMode   ? "true" : "false");
  Serial.print(",\"uptime\":");   Serial.print(millis());
  Serial.println("}");
}

// Recibir comandos desde el backend (ej: cambiar capacidad del tanque)
void handleSerialCommands() {
  if (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();

    if (cmd.startsWith("{\"cmd\":\"set_capacity\"")) {
      // Ejemplo: {"cmd":"set_capacity","value":500}
      int idx = cmd.indexOf("\"value\":");
      if (idx != -1) {
        tankCapacity = cmd.substring(idx + 8).toInt();
      }
    }

    if (cmd.startsWith("{\"cmd\":\"set_height\"")) {
      int idx = cmd.indexOf("\"value\":");
      if (idx != -1) {
        tankHeight = cmd.substring(idx + 8).toInt();
      }
    }

    if (cmd == "{\"cmd\":\"ping\"}") {
      Serial.println("{\"type\":\"pong\"}");
    }
  }
}
