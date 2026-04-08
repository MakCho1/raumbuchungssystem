# Raumbuchungssystem

## 📌 Beschreibung

Dieses Projekt ist ein webbasiertes Raumbuchungssystem, das im Rahmen einer Arbeitsprobe für die Universitätsbibliothek Paderborn entwickelt wurde.

Die Anwendung ermöglicht es, für einen einzelnen Raum Zeitfenster (Slots) in einer Tagesansicht zu buchen und bestehende Buchungen wieder zu stornieren.

---

## 🚀 Technologien

### Frontend

- React (Vite)
- Bootstrap (für modernes UI)
- JavaScript (ES6)

### Backend

- Node.js
- Express.js
- SQLite (Dateibasierte Datenbank)

---

## ⚙️ Lokales Setup

### 1. Repository klonen

```bash
git clone <repo-url>
cd Raumbuchungssystem
```

---

### 2. Backend starten

```bash
cd backend
npm install
npm run dev
```

Backend läuft auf:
👉 http://localhost:3001

---

### 3. Frontend starten

```bash
cd frontend
npm install
npm run dev
```

Frontend läuft auf:
👉 http://localhost:5173

---

## 🧠 Architektur

Die Anwendung ist klar in Frontend und Backend getrennt:

- **Frontend (React)**: Darstellung, Benutzerinteraktion
- **Backend (Express)**: Geschäftslogik & Validierung
- **Repository-Schicht**: Zugriff auf SQLite-Datenbank
- **Service-Schicht**: Business-Logik (z. B. Validierung, Slot-Berechnung)

---

## ✅ Funktionen

### 📅 Tagesansicht

- Anzeige aller Slots von 07:00 bis 21:00
- Belegte Slots werden visuell hervorgehoben

### ➕ Buchung erstellen

- Auswahl eines freien Slots
- Eingabe von Name und optionalem Zweck
- Dauer zwischen 1 und 6 Stunden

### ❌ Buchung stornieren

- Jede Buchung erhält einen eindeutigen Storno-Token
- Stornierung entweder:
  - direkt im UI
  - oder über API

### 🔒 Validierung

- Keine Buchung in der Vergangenheit möglich
- Maximal 7 Tage in die Zukunft
- Keine Doppelbuchungen (Überlappungen werden verhindert)

---

## 🌟 Eigene Erweiterungen

Zusätzlich zu den Mindestanforderungen wurden folgende eigene Ideen umgesetzt:

- Direktes Stornieren einer Buchung im Frontend
- Token-basierte Stornierung ohne Login
- Einschränkung der Datumsauswahl im Frontend für bessere Benutzerführung
- Moderne Oberfläche mit Bootstrap
- Klare Schichtenarchitektur mit Controller, Service und Repository
- Benutzerfreundliche Fehlermeldungen bei ungültigen Eingaben

---

## 🔌 REST API

### 📖 Übersicht

| Methode | Endpoint                        | Beschreibung         |
| ------- | ------------------------------- | -------------------- |
| GET     | `/api/bookings?date=YYYY-MM-DD` | Tagesansicht abrufen |
| POST    | `/api/bookings`                 | Buchung erstellen    |
| DELETE  | `/api/bookings/:token`          | Buchung stornieren   |
| GET     | `/api/health`                   | Health-Check         |

---

### 📥 Beispiel: Buchung erstellen

```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "bookingDate": "2026-04-07",
    "startHour": 10,
    "durationHours": 2,
    "name": "Max Mustermann",
    "purpose": "Lernen"
  }'
```

---

### 📤 Beispiel: Buchung stornieren

```bash
curl -X DELETE http://localhost:3001/api/bookings/<cancelToken>
```

---

## ⚠️ Einschränkungen

- Kein Benutzer-Login (bewusst vereinfacht)
- Nur ein Raum (kein Mehrraumsystem)
- Keine Persistenz über mehrere Instanzen hinaus (lokale SQLite DB)

---

## 🤖 Einsatz von KI-Tools

Zur Unterstützung wurde ChatGPT verwendet, insbesondere für:

- Architekturentscheidungen
- Debugging
- UI-Verbesserungen
- Code-Refactoring

Die finale Implementierung wurde eigenständig verstanden und angepasst.

---

## 🏁 Fazit

Die Anwendung erfüllt alle Kernanforderungen der Aufgabenstellung und wurde zusätzlich um sinnvolle UX- und API-Features erweitert.

---
