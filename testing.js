const fs = require("fs/promises");
const path = require("path");

const dir = path.dirname(__filename);

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const now = new Date();
const tago = new Date(now.getTime() - day);
fs.writeFile(path.join(dir, `last_run.txt`), tago.toISOString(), (err) => {
  if (err) throw err;
  console.log(
    `The file for ${currentChat.name} has been saved in the same directory!`,
  );
});
