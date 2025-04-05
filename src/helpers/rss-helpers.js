import { closeDb, db } from "./db-helpers.js"; // Switch to import if using ESM

export const getRssItems = async (feedUrl, lookBack) => {
  const query = `
    SELECT 
      content
    FROM rss_item 
    WHERE feedurl = ? AND pubDate >= (strftime('%s', 'now') - ${lookBack * 60 * 60})
  `;

  try {
    // Use parameterized query for safety
    const stmt = db.query(query);
    const rows = stmt.all(feedUrl); // Synchronous in bun:sqlite
    return rows; // Return the rows directly
  } catch (err) {
    console.error(`Query error: ${err.message}`);
    throw err;
  } finally {
    closeDb();
  }
};
