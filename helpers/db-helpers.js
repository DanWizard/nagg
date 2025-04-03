const sqlite3 = require("sqlite3").verbose();
const os = require("os");
const path = require("path");

// Path to the Newsboat database
const dbPath = path.join(os.homedir(), ".newsboat", "cache.db");

// Connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`Error connecting to database: ${err.message}`);
    process.exit(1);
  }
  console.log("Connected to the Newsboat database.");
});
// Close the database connection when done

const closeDb = () => {
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error(`Error closing database: ${err.message}`);
      } else {
        console.log("Database connection closed.");
      }
    });
  }, 1000); // Small delay to ensure queries complete
};

export { db, closeDb };
