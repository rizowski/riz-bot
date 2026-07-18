# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Yarn 4 (via the checked-in `.yarn/releases` bundle) on Node 26. ESM throughout (`"type": "module"`).

- `yarn test` — run the vitest suite once (`yarn test:watch` for watch mode)
- `yarn vitest run src/music/format.test.js` — run a single test file
- `yarn lint` / `yarn lint:fix` — oxlint
- `yarn format` / `yarn format:check` — oxfmt (config migrated from Prettier: 120 cols, single quotes)
- `yarn local` — run with hot reload; requires Doppler auth (`doppler run -c dev`) plus `ffmpeg` and `yt-dlp` on PATH for music playback
- `docker build .` — production image (node:26-alpine + Doppler + ffmpeg + yt-dlp); deploy via `scripts/deploy.sh`

Lefthook runs oxlint/oxfmt on pre-commit and the test suite on pre-push (installed by the `postinstall` script).

## Configuration

`node-config` with `.cjs` config files in `config/` (they must stay CommonJS). Secrets come from Doppler at runtime: `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID` map through `config/custom-environment-variables.cjs`. This is a single-guild bot; several Discord snowflakes (shitpost users/emojis/roles, bot owner) are intentionally hardcoded.

## Architecture

Yarn workspaces: the root app (`src/`) plus three local packages —
`@local/discord` (the discord.js v14 Client wrapper: intents, event wiring, login/shutdown), `@local/logger` (pino; `STAGE=local` gets a pino-pretty transport, `STAGE=test` is silent), `@local/responses` (embed payload builders — always the plural `embeds: [...]` shape).

### Slash command system — single source of truth

Each command family lives in `src/interactions/<name>/` and its `index.js` exports two things:

- `definitions` — an array of `SlashCommandBuilder`s
- `cmds` — an array of handler objects `{ trigger(interaction), ephemeral, action(interaction, client), autocomplete? }`

`src/interactions/all.js` aggregates every family; `src/index.js` registers `definitions` against the guild on ready (`guild.commands.set`), so **there is no separate registration script** — adding a command family to `all.js` is the only wiring needed, and stale commands disappear on the next boot. `src/interactions/all.test.js` enforces that every registered (command, subcommand) pair matches exactly one handler and every handler is reachable — a new subcommand without a matching `trigger` fails the suite.

The router (`src/interactions/index.js`) defers the reply with the handler's `ephemeral` flag (`MessageFlags.Ephemeral`), so handlers use `editReply` and never set ephemeral themselves. Autocomplete interactions route to the handler's optional `autocomplete(interaction)` (see `src/interactions/groups.js` for the group-role autocomplete + resolver shared by join/leave/group-info). `subcommand(command, name)` in `src/interactions/shared.js` builds trigger predicates.

### Feature domains

- **Groups** — roles prefixed `g:` with a matching category/text/voice channel set (`create/group.js` builds them; `groups.js` resolves them).
- **Music** (`src/music/`) — per-guild sessions in `player.js`: yt-dlp child process streams bestaudio → `@discordjs/voice` ffmpeg pipeline with inline volume → opusscript encoder. `classify.js` decides search vs video vs playlist; sessions kill the yt-dlp process on skip/stop and auto-disconnect after 5 idle minutes. Playback needs `ffmpeg` + `yt-dlp` binaries (in the Docker image; install locally for dev).
- **Shitpost** (`src/shitpost/`) — port of zack37/shitpost-bot-rs. `triggers.js` is an array of functions run via `Promise.allSettled` on every guild message (bots and URL-only messages skipped); each receives `(message, lower)` where `lower` is the content lowercased once. The in-memory toggle (`state.js`, default on) is controlled by `/shitpost on|off`, restricted to the user IDs in `users.js`.

### Intents

The client requests `Guilds`, `GuildVoiceStates`, `GuildMessages`, and `MessageContent`. **MessageContent is privileged** — it must be enabled in the Discord developer portal or login is rejected. `/group info` shows cached (approximate) member counts because the privileged `GuildMembers` intent is deliberately not requested.

## Testing conventions

Vitest, colocated `*.test.js`, `STAGE=test` set by `vitest.config.js`. No live Discord client is ever constructed: handlers are tested with plain-object fake interactions (`{ commandName, options: { getSubcommand: () => ... }, editReply: vi.fn() }`) and pure logic is factored into testable modules (`src/music/format.js`, `src/shitpost/lib.js`, `src/interactions/groups.js`).
