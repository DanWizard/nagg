# Nagg - News Aggregator

Nagg is a powerful news aggregation system that collects, processes, and summarizes content from various sources including Telegram channels and RSS feeds. It uses Claude AI to standardize and combine information into digestible summaries organized by topic.

## Features

- Collects content from multiple Telegram channels
- Aggregates data from RSS feeds
- Uses Claude AI to process and standardize content into facts and opinions
- Organizes content by topics (Geopolitics, Crypto, Health, Macro, Conspiracy, Reddit)
- Runs on a schedule using systemd timers

## Prerequisites

- Node.js/Bun runtime
- Telegram API credentials
- Claude API key
- Newsboat RSS reader (for RSS database)
- Linux environment with systemd (for scheduling)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nagg.git
cd nagg
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables by creating a `.env` file in the project root:
```
CLAUDE_SECRET=your_claude_api_key
API_ID=your_telegram_api_id
API_HASH=your_telegram_api_hash
PN=your_telegram_phone_number
PW=your_telegram_password
```

4. Configure systemd timer:
   Create `/etc/systemd/system/nagg.service`:
```
[Unit]
Description=News Aggregation Service

[Service]
ExecStart=/path/to/bun /path/to/nagg/src/index.js --year=2025 --month=04 --day=05 --time=morning
WorkingDirectory=/path/to/nagg
User=your_username
Group=your_group
Environment=NODE_ENV=production
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

   Create `/etc/systemd/system/nagg.timer`:
```
[Unit]
Description="Run nagg service at 6 and 18 UTC+1 daily"

[Timer]
OnCalendar=*-*-* 08:00:00
OnCalendar=*-*-* 18:00:00
Persistent=true
Unit=nagg.service

[Install]
WantedBy=timers.target
```

5. Enable and start the timer:
```bash
sudo systemctl daemon-reload
sudo systemctl enable nagg.timer
sudo systemctl start nagg.timer
```

## Usage

Nagg runs automatically at the scheduled times (8:00 and 18:00 UTC+1) each day. 

You can also run it manually:

```bash
bun run src/index.js --year=2025 --month=04 --day=05 --time=morning
```

This will:
1. Collect recent messages from configured Telegram channels
2. Fetch RSS feed items from the Newsboat database
3. Process the content using Claude AI
4. Generate a report organized by topic
5. Save the report to `/home/test/code/news/YYYY/MM/DD/[morning|evening].txt`

## Project Structure

- `src/index.js` - Main entry point
- `src/tg.js` - Telegram data collection
- `src/rss.js` - RSS feed processing
- `src/helpers/` - Utility functions
  - `ai-helpers.js` - Claude API interaction
  - `args.js` - Command line argument parsing
  - `content-sources.js` - Configuration for sources
  - `db-helpers.js` - Database interaction
  - `prompts.js` - Claude prompt templates
  - `rss-helpers.js` - RSS item retrieval
  - `tg-helpers.js` - Telegram client functions
  - `time-helpers.js` - Time-related utilities

## Configuration

Edit `src/helpers/content-sources.js` to add or modify content sources:

- `topics` - List of content categories
- `tg` - Telegram channels by topic
- `rss` - RSS feeds by topic

## Troubleshooting

If the timer isn't triggering the service:
1. Check systemd logs: `journalctl -u nagg.timer`
2. Verify timer status: `systemctl status nagg.timer`
3. Ensure the timer is enabled and active
4. Check that the service unit is properly referenced in the timer

## License

[Your License Here]
