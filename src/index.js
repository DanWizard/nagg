const path = require("path");
const fs = require("fs/promises");
const { tg } = require("./tg.js");
const { rss } = require("./rss.js");
const { combineStandardization } = require("./helpers/ai-helpers.js");
const { handleArgs } = require("./helpers/args.js");
const { getLookBackHours } = require("./helpers/time-helpers.js");

async function main() {
  const argObj = handleArgs();
  const lookBack = getLookBackHours();
  const tgres = await tg(lookBack);
  const rssres = await rss(lookBack);

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


REDDIT

${rssres.Reddit}


`;

  fs.writeFile(
    `/home/test/code/news/${argObj.year}/${argObj.month}/${argObj.day}/${argObj.time}.txt`,
    newsdoc,
    (err) => {
      if (err) throw err;
      console.log("The file has been saved in the same directory!");
    },
  );
}

main().catch(console.error);
