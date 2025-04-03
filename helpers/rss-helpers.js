const { closeDb, db } = require("./db-helpers.js");

export const getRssItems = async (feedUrl) => {
  const query = `
    SELECT 
      content
    FROM rss_item 
    WHERE feedurl = '${feedUrl}' and pubDate >= (strftime('%s', 'now') - 86400)
  `;

  try {
    return await new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  } catch (err) {
    console.error(`Query error: ${err.message}`);
    throw err;
  } finally {
    closeDb();
  }
};
