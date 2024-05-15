#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN D1  // RST-PIN for RC522 - RFID - SPI - Modul GPIO5 
#define SS_PIN D2   // SDA-PIN for RC522 - RFID - SPI - Modul GPIO4 

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance.

void setup() {
  Serial.begin(9600);   // Initialize serial communications with the PC
  SPI.begin();          // Init SPI bus
  mfrc522.PCD_Init();   // Init MFRC522
  Serial.println("Bring your card to the reader...");
  Serial.println();
}

void loop() {
  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // If a card is detected
  Serial.print("Card detected. UID:");
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println();
  Serial.println("Card is successfully scanned.");
  
  // Halt PICC
  mfrc522.PICC_HaltA();
  // Stop encryption on PCD
  mfrc522.PCD_StopCrypto1();
}

