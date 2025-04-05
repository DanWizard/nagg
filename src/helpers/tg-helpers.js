const tdl = require("tdl");
require("dotenv").config({ path: "/home/test/code/nagg/.env" });
const fs = require("fs/promises");
const path = require("path");

function formatDate(date) {
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function isFromLastRun(dateToCheck, lookBack) {
  const now = new Date();
  const isLessThan12HoursOld =
    now.getTime() - dateToCheck.getTime() <= lookBack * 60 * 60 * 1000;
  return isLessThan12HoursOld;
}

const getChats = async (client) => {
  const chats = await client.invoke({
    _: "getChats",
    chat_list: { _: "chatListMain" },
    limit: 50,
  });
  for (let i = 0; i < 50; i++) {
    const chatId = chats.chat_ids[i];
    const chat = await client.invoke({
      _: "getChat",
      chat_id: chatId,
    });
    // console.log(`name: \"${chat.title}\", type: \"CRYPTO\", id: ${chatId}`);
  }
};

const auth = async () => {
  const client = tdl.createClient({
    apiId: process.env.API_ID, // Your api_id
    apiHash: process.env.API_HASH, // Your api_hash
  });

  client.on("error", console.error);

  client.on("update", (update) => {
    // console.log("Received update:", update);
  });

  await client.login({
    async getPhoneNumber(retry) {
      if (retry) throw new Error("Invalid phone number");
      return process.env.PN;
    },
    async getPassword(passwordHint, retry) {
      if (retry) throw new Error("Invalid password");
      return process.env.PW;
    },
  });

  return client;
};

const loadChat = async (client, chat) => {
  let loadedMsgs = {};
  for (let i = 0; i < 4; i++) {
    loadedMsgs = await client.invoke({
      _: "getChatHistory",
      chat_id: chat,
      from_message_id: 0,
      offset: -10,
      limit: 100,
      only_local: false,
    });
  }

  return loadedMsgs;
};

const getChatMsgs = async (client, loadedChat, chat) => {
  const maxLimit = 100;
  let msgCont = [...loadedChat.messages];
  let currentMsgCount = loadedChat.total_count;
  let lastFetchedMsgID = loadedChat.messages[0].id;

  for (let i = 0; i < maxLimit; i++) {
    const fetchedMsgs = await client.invoke({
      _: "getChatHistory",
      chat_id: chat.id,
      from_message_id: lastFetchedMsgID,
      offset: 0,
      limit: 40,
      only_local: false,
    });

    // console.log("fetchedmsgs", fetchedMsgs.messages);
    fetchedMsgs.messages.forEach((e) => {
      let isDup = false;

      msgCont.forEach((t) => {
        if (t.id === e.id) {
          // console.log("isDup");
          isDup = true;
        }
      });

      if (!isDup) {
        msgCont.push(e);
      }
    });
    currentMsgCount = msgCont.length;
    if (currentMsgCount >= maxLimit || loadedChat.total_count === 0) break;
    loadedChat.messages.forEach((e) => {
      // console.log("message content for id:", e.id);
      // console.log("\n");
      // console.log("*************");
      // console.log("\n");
      // console.log("*************");
      if (e.content._ === "messageText") {
        // console.log(e.content.text.text);
      } else if (e.content._ === "messagePhoto" && e.content.caption.text) {
        // console.log(e.content.caption.text);
      } else {
        // console.log("null");
      }
      // console.log("*************");
      // console.log("\n");
    });
    // console.log("new last message to fetch from", msgs.messages[0].id);
    lastFetchedMsgID = loadedChat.messages[loadedChat.messages.length - 1].id;
  }
  return msgCont;
};

const filterMsgs = async (msgs, lookBack) => {
  const smple = msgs.map((m) => {
    // console.log("messageid", m.id);
    let icontent = null;
    if (m.content._ === "messageText") {
      icontent = m.content.text.text;
    } else if (m.content._ === "messagePhoto" && m.content.caption.text) {
      icontent = m.content.caption.text;
    }
    return { id: m.id, date: m.date, content: icontent };
  });
  // console.log("messages", smple);
  // console.log("message date", formatDate(new Date(msgCont[0].date * 1000)));
  // console.log("messages count", msgCont.length);
  // console.log("final s", smple);
  const recentMsgs = [];
  for (let j = 0; j < smple.length; j++) {
    const isNew = await isFromLastRun(new Date(smple[j].date * 1000), lookBack);
    if (isNew && smple[j].content) {
      recentMsgs.push(smple[j]);
    }
  }

  return recentMsgs;
};

const formatMsgs = (msgs, chat) => {
  let page_to_submit = "";
  const header = `Chat Name: ${chat.name}\n`;
  const desc = `Chat Description: ${chat.desc}\n`;
  const imp = `Chat Importance: ${chat.importance}\n\n`;
  page_to_submit += header;
  page_to_submit += desc;
  page_to_submit += imp;

  for (let i = 0; i < msgs.length; i++) {
    const msg = msgs[i];
    const msgdatefield = `Message Date: ${formatDate(new Date(msg.date * 1000))}\n`;
    const msgcontentfield = `Message Content: ${msg.content}\n\n`;
    page_to_submit += msgdatefield;
    page_to_submit += msgcontentfield;
  }

  // console.log(page_to_submit);
  return page_to_submit;
};

module.exports = {
  formatMsgs,
  filterMsgs,
  getChats,
  getChatMsgs,
  loadChat,
  isFromLastRun,
  formatDate,
  auth,
};
