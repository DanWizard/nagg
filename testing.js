const fs = require("fs/promises");
const path = require("path");

const dir = path.dirname(__filename);

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const now = new Date();
const tago = new Date(now.getTime() - day);
