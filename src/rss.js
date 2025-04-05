const { contentMap } = require("./helpers/content-sources.js");
const path = require("path");
const fs = require("fs/promises");
const { tg } = require("./tg.js");
const { getRssItems } = require("./helpers/rss-helpers.js");
const {
  splitIntoChunks,
  standardizeRSS,
  combineStandardization,
} = require("./helpers/ai-helpers.js");

function stripTags(xmlString) {
  return xmlString.replace(/<[^>]*>?/g, "");
}

export const rss = async (lookBack) => {
  const newstree = {};
  const topics = contentMap.topics;
  for (let v = 0; v < topics.length; v++) {
    const topic = topics[v];
    newstree[topic] = {};
    const feeds = contentMap.rss[topic];
    for (let i = 0; i < feeds.length; i++) {
      const feed = feeds[i].rssurl;
      console.log("call db");
      const items = await getRssItems(feed, lookBack);
      console.log("db finish");
      newstree[topic][feed] = items;
    }
  }
  // console.log(newstree);
  let strArr = [];
  const entries = Object.entries(newstree);
  entries.forEach(([category, category_items]) => {
    const category_entries = Object.entries(category_items);
    category_entries.forEach(([rssurl, rssitems]) => {
      rssitems.forEach((item) => {
        strArr.push(stripTags(item.content));
      });
    });
    const chunked = splitIntoChunks(strArr);
    newstree[category] = chunked;
    strArr = [];
  });

  // console.log(newstree);

  const aientries = Object.entries(newstree);

  const resulttree = {};
  for (let i = 0; i < aientries.length; i++) {
    let category = aientries[i][0];
    let prompts = aientries[i][1];
    const standardizedRes = [];
    for (let v = 0; v < prompts.length; v++) {
      const prompt = prompts[v];
      console.log("call ai");
      const airesponse = await standardizeRSS(prompt);
      console.log("ai finish");
      standardizedRes.push(airesponse.content[0].text);
    }
    let categorySummary = [];
    if (standardizedRes.length) {
      categorySummary = standardizedRes.reduce(
        (acc, curr) => acc + `\n\nSEPARATOR\n\n${curr}`,
      );
      console.log("combine ai");
      categorySummary = (await combineStandardization(categorySummary))
        .content[0].text;
      console.log("combine ai finished");
    }
    console.log(categorySummary);
    resulttree[category] = categorySummary;
  }

  // const newsdoc = `
  // CRYPTO
  // ${resulttree.Crypto}

  // GEOPOLITICS
  // ${resulttree.Geopolitics}

  // HEALTH
  // ${resulttree.Health}

  // MACRO
  // ${resulttree.Macro}

  // CONSPIRACY
  // ${resulttree.Conspiracy}
  // `;

  // fs.writeFile(
  //   `/home/test/code/smagg/reports/rss-report.txt`,
  //   newsdoc,
  //   (err) => {
  //     if (err) throw err;
  //     console.log("The file has been saved in the same directory!");
  //   },
  // );
  return resulttree;
};
