const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const dataDir = path.join(__dirname, "../../data");
const dbPath = path.join(dataDir, "bookings.db");
const initSqlPath = path.join(__dirname, "init.sql");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

const initSql = fs.readFileSync(initSqlPath, "utf-8");

db.exec(initSql, (err) => {
  if (err) {
    console.error("DB Init Fehler:", err.message);
  } else {
    console.log("DB bereit");
  }
});

module.exports = db;