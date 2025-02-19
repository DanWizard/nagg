const { Anthropic } = require("@anthropic-ai/sdk");
const fs = require("fs/promises");
require("dotenv").config();
const path = require("path");

// Initialize the client with your API key
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_SECRET,
});

async function askClaude() {
  let prompt = "";

  for (let i = 0; i < 22; i++) {
    const data = await fs.readFile(`${i}.txt`, "utf8");
    prompt += `${data}\n\n`;
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229", // Or choose another model like 'claude-3-sonnet-20240229'
      max_tokens: 1000, // Adjust the maximum number of tokens for the response
      temperature: 0.7, // Controls randomness in the response
      messages: [
        {
          role: "user",
          content: `${process.env.PROMPT + prompt}`,
        },
      ],
    });

    console.log(message.content[0].text); // Output the response
    const dir = path.dirname(__filename);
    const now = new Date();
    // Format the date using toLocaleString, then manipulate the string
    const formattedDate = now
      .toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      // Replace spaces with hyphens and remove commas
      .replace(/\s+/g, "-")
      .replace(",", "");

    fs.writeFile(
      path.join(dir, `./reports/${formattedDate}-report.txt`),
      message.content[0].text,
      (err) => {
        if (err) throw err;
        console.log("The file has been saved in the same directory!");
      },
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

askClaude();
