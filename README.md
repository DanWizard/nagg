# Smagg: Telegram News Aggregation Tool

## Overview

Smagg is an automated news aggregation tool that retrieves and processes messages from specified Telegram chats, generating summarized reports using Claude AI. The project is designed to run on a server with a scheduled task, collecting recent messages from important chat sources and creating structured documentation.

## Features

- Authenticate and connect to Telegram using TDLib
- Retrieve messages from predefined important chat sources
- Filter messages based on recency
- Format and prepare messages for analysis
- Generate AI-powered summaries using Anthropic's Claude
- Automatically run on a predefined schedule using systemd

## Prerequisites

- Bun runtime
- Node.js
- Telegram API credentials
- Anthropic API key
- systemd (for scheduled runs)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file with the following variables:
   ```
   API_ID=your_telegram_api_id
   API_HASH=your_telegram_api_hash
   PN=your_phone_number
   PW=your_telegram_password
   CLAUDE_SECRET=your_anthropic_api_key
   PROMPT=your_claude_summarization_prompt
   IMPORTANT_CHATS=[{"id": chat_id, "name": "Chat Name", "desc": "Description", "importance": "High"}]
   ```

## Project Structure

- `index.js`: Main script for Telegram message retrieval
- `helpers.js`: Utility functions for chat processing
- `claude.js`: Claude AI interaction and report generation
- `test.sh`: Cron job configuration
- `package.json`: Project dependencies and scripts

## Scheduled Execution

The project uses a systemd timer to run at specific intervals (8 AM, 1 PM, and 5 PM in the current configuration). The script is triggered via Bun runtime.

## Usage Scripts

- `bun telegram`: Retrieve and process Telegram messages
- `bun ai`: Generate AI summary using Claude
- `bun testing`: Run testing script

## Deployment

1. Set up systemd timer
2. Ensure `.env` is properly configured
3. Run the script via `bun telegram`

## Security Considerations

- Keep `.env` file secure and out of version control
- Use environment variables for sensitive credentials
- Ensure proper permissions on server-side scripts

## Troubleshooting

- Verify Telegram API credentials
- Check Anthropic API key
- Ensure Bun runtime is correctly installed
- Review systemd timer logs for execution issues

## Contributing

Contributions are welcome. Please submit pull requests or open issues for any improvements or bug fixes.

## License

[Add your license information here]

## Disclaimer

This tool is for informational purposes. Ensure compliance with Telegram's terms of service and respect privacy guidelines.
