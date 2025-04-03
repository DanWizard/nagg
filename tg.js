import { standardizeTG } from "./helpers/ai-helpers.js";

const path = require("path");
const fs = require("fs/promises");
const {
  loadChat,
  importantChats,
  auth,
  filterMsgs,
  formatMsgs,
  getChatMsgs,
  getChats,
} = require("./helpers/tg-helpers.js");
const { contentMap } = require("./helpers/content-sources.js");

export const tg = async () => {
  const topics = contentMap.topics;
  const newstree = {};

  const client = await auth();
  await getChats(client);
  await getChats(client);
  await getChats(client);

  console.log(topics);
  for (let v = 0; v < topics.length; v++) {
    const currentTopic = topics[v];
    console.log(currentTopic);
    newstree[currentTopic] = {};
    let topicChats = contentMap.tg[currentTopic];
    let msgs = [];
    if (topicChats) {
      let topicLength = 0;
      for (let i = 0; i < topicChats.length; i++) {
        const currentChat = topicChats[i];
        console.log(currentChat);
        const loadedChat = await loadChat(client, currentChat.id);
        msgs = await getChatMsgs(client, loadedChat, currentChat);
        msgs = await filterMsgs(msgs, currentChat);
        let formattedForAgg = formatMsgs(msgs, currentChat);
        topicLength += formattedForAgg.length;
        console.log(
          `${currentChat.name} msg length: ${formattedForAgg.length}`,
        );
        newstree[currentTopic][currentChat.name] = formattedForAgg;
      }
      newstree[currentTopic].length = topicLength;
    }
  }
  console.log(newstree);
  const entries = Object.entries(newstree);
  const resulttree = {};
  for (let i = 0; i < entries.length; i++) {
    const [category, chats] = entries[i];
    if (!chats.length) continue;
    const chatentries = Object.entries(chats);
    resulttree[category] = chatentries.reduce(
      (acc, curr) => acc + `\n\nSEPARATOR\n\n${curr[1]}`,
    );
    const resultentries = Object.entries(resulttree);
    for (let v = 0; v < resultentries.length; v++) {
      const [_cat, content] = resultentries[v];
      console.log("content", content);
      const summary = await standardizeTG(content);
      console.log("summary", summary);
      resulttree[category] = summary.content[0].text;
    }
  }

  await client.close();
  return resulttree;
};
