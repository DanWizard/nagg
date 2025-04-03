const path = require("path");
const fs = require("fs/promises");
const { tg } = require("./tg.js");
const { rss } = require("./rss.js");
const { combineStandardization } = require("./helpers/ai-helpers.js");

async function main() {
  const tgres = await tg();
  const rssres = await rss();

  const combinedCrypto = rssres.Crypto + `\n\nSEPARATOR\n\n${tgres.Crypto}`;
  const cryptoRes = (await combineStandardization(combinedCrypto)).content[0]
    .text;

  const combinedGeopolitics =
    rssres.Geopolitics + `\n\nSEPARATOR\n\n${tgres.Geopolitics}`;
  const geoRes = (await combineStandardization(combinedGeopolitics)).content[0]
    .text;

  const newsdoc = `CRYPTO

${cryptoRes}

GEOPOLITICS

${geoRes}


HEALTH

${rssres.Health}


MACRO

${rssres.Macro}


CONSPIRACY

${rssres.Conspiracy}
`;

  fs.writeFile(
    `/home/test/code/smagg/reports/rss-report.txt`,
    newsdoc,
    (err) => {
      if (err) throw err;
      console.log("The file has been saved in the same directory!");
    },
  );
}

main().catch(console.error);
