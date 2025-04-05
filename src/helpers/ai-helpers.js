const { Anthropic } = require("@anthropic-ai/sdk");
const fs = require("fs/promises");
require("dotenv").config({ path: "/home/test/code/nagg/.env" });
const {
  standardizationSystemPromptRSS,
  standardizationSystemPromptTG,
  combinationPrompt,
} = require("./prompts.js");
const path = require("path");

// Initialize the client with your API key
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_SECRET,
});

export const splitIntoChunks = (arrString) => {
  const maxLen = 20000;
  const combined = [];
  const reserved = new Set([]);
  for (let i = 0; i < arrString.length; i++) {
    if (reserved.has(i)) continue;
    let str = arrString[i];
    let currentCombination = str;
    reserved.add(i);
    // handle if currentCombination > maxLen with own func
    for (let v = 0; v < arrString.length; v++) {
      if (v === i) continue;
      if (reserved.has(v)) continue;

      let nextStr = arrString[v];
      if (currentCombination.length + nextStr.length < maxLen) {
        currentCombination += `\n\nSEPARATOR\n\n${nextStr}`;
        reserved.add(v);
      }
    }
    combined.push(currentCombination);
  }
  return combined;
};

export const standardizeRSS = async (prompt) => {
  const message = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219", // Or choose another model like 'claude-3-sonnet-20240229'
    max_tokens: 10000, // Adjust the maximum number of tokens for the response
    temperature: 1, // Controls randomness in the response
    system: standardizationSystemPromptRSS,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return message;
};

export const standardizeTG = async (prompt) => {
  const message = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219", // Or choose another model like 'claude-3-sonnet-20240229'
    max_tokens: 10000, // Adjust the maximum number of tokens for the response
    temperature: 1, // Controls randomness in the response
    system: standardizationSystemPromptRSS,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return message;
};

export const combineStandardization = async (prompt) => {
  const message = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219", // Or choose another model like 'claude-3-sonnet-20240229'
    max_tokens: 10000, // Adjust the maximum number of tokens for the response
    temperature: 1, // Controls randomness in the response
    system: combinationPrompt,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return message;
};
