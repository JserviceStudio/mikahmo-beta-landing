import Database from 'better-sqlite3';
import path from 'path';

// Utiliser un chemin absolu vers le fichier de la base de données, à la racine du projet
const dbPath = path.resolve(process.cwd(), 'subscribers.db');

let db: Database.Database;

try {
  db = new Database(dbPath);
  
  // Créer la table si elle n'existe pas
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      whatsapp TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    const tableInfo = db.prepare("PRAGMA table_info(subscribers)").all() as any[];
    const hasWhatsapp = tableInfo.some(col => col.name === 'whatsapp');
    if (!hasWhatsapp) {
      db.exec("ALTER TABLE subscribers ADD COLUMN whatsapp TEXT;");
    }
  } catch (err) {
    console.error("Migration error:", err);
  }
} catch (error) {
  console.error("Erreur lors de l'initialisation de la base de données SQLite:", error);
  throw error;
}

export default db;
