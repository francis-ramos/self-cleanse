# Emergency Message & Reaction Cleanup

A Bun/TypeScript utility built with [`discord.js-selfbot-v13`](https://www.npmjs.com/package/discord.js-selfbot-v13). It scans selected Discord text channels and DMs to remove messages and reactions belonging to the logged-in account.

> **Important:** Discord prohibits automating normal user accounts (self-bots). Using this project may expose your account to restriction or termination. Deletions are irreversible. Use only where you have authority, and understand the risks before proceeding.

## What it does

- On login, scans supported text, announcement/news, and DM channels available in the client's channel cache.
- Deletes messages authored by the logged-in account.
- Removes the logged-in account's own reactions from messages.
- Repeats the scan every 10 minutes while running.
- Prints scan progress and errors to the console.

It does **not** delete other users' messages or remove their reactions. Results depend on channel availability and Discord's access restrictions; this tool cannot guarantee that every item will be found or removed.

## Requirements

- [Bun](https://bun.sh/) installed
- A configured Discord account token (see the warning above)

## Setup

Install dependencies:

```bash
bun install
```

Set the `token` and `target` values in `config.json`:

```json
{
  "token": "YOUR_ACCOUNT_TOKEN",
  "target": "CHANNEL_ID"
}
```

Use a specific channel ID for a limited scan. The special value `"all"` selects every supported channel in the client's cache and can result in extensive, irreversible deletions. An empty `target` does not select any channels.

**Keep your token private.** Never commit or share `config.json`, screenshots containing the token, or logs that might expose account details. If the token is exposed, secure your account immediately.

## Run

```bash
bun run index.ts
```

The initial scan starts after the client is ready; subsequent scans run every 10 minutes. Stop the process to stop further scans.

## Project structure

```text
.
├── index.ts
├── config.json
└── methods/
    ├── user.ts
    ├── userDM.ts
    └── userDMReaction.ts
```

## Author

Made by **Francis Enrico G. Ramos**.
