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
} = require("./helpers.js");

async function main() {
  const dir = path.dirname(__filename);
  const client = await auth();

  await getChats(client);
  await getChats(client);
  await getChats(client);

  let msgs = [];
  for (let i = 0; i < importantChats.length; i++) {
    const currentChat = importantChats[i];
    const loadedChat = await loadChat(client, currentChat.id);
    msgs = await getChatMsgs(client, loadedChat, currentChat);
    msgs = await filterMsgs(msgs, currentChat);
    formattedForAgg = formatMsgs(msgs, currentChat);

    // Get the directory name of the current script

    fs.writeFile(path.join(dir, `${i}.txt`), formattedForAgg, (err) => {
      if (err) throw err;
      console.log(
        `The file for ${currentChat.name} has been saved in the same directory!`,
      );
    });
    console.log(
      `The file for ${currentChat.name} has been saved in the same directory!`,
    );
  }
  await client.close();
  const now = new Date();
  fs.writeFile(path.join(dir, `last_run.txt`), now.toISOString(), (err) => {
    if (err) throw err;
  });
  console.log("last_run has been updated to:", now.toLocaleString());
}

main().catch(console.error);
