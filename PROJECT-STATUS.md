# Website Ideas — Project Status

## Current Status

**Phase:** Deployed
**Last Updated:** June 8, 2026

The Website Ideas server is live on Railway with PostgreSQL storage and is available to the team as an Organization Connector in claude.ai. All 7 tools work — verified end-to-end on June 8 with a full MCP handshake and a live `list_tags` call against the deployed endpoint. The `/mcp` endpoint is open (no auth), matching the team's other six connectors; access is gated by the obscure Railway URL.

## Infrastructure

- Railway **project "Website Ideas" / service `website-ideas`** deployed and healthy (Streamable HTTP at `/mcp`) at `https://build-library-mcp-production.up.railway.app` — the original generated URL was kept (a service rename doesn't change it), so the org Connector is unchanged and working
- PostgreSQL database running with auto-migration on startup
- Distributed as an Organization Connector in claude.ai (Chat, Cowork, and web) — the old `team-mcp-servers.json` setup-script mechanism is retired
- GitHub repo (`Above-Public-Affairs/website-ideas`) connected for auto-deploy on push to `main`

## To-Do

- [x] Build MCP server with all 7 tools
- [x] Deploy to Railway with Postgres
- [x] Test all tools end-to-end
- [x] Migrate Hut 8 entry
- [x] Remove bearer-token auth so the endpoint works as an org Connector (June 8)
- [x] Add to claude.ai as an Organization Connector
- [x] Update CLAUDE.md and PROJECTS-STATUS.md
- [x] Rename project to **Website Ideas** — code, MCP identity, npm package, error-reporting slug, GitHub repo, and all docs (June 8)
- [x] Railway: renamed **project** → "Website Ideas" and **service** → `website-ideas`; reconnected the GitHub source after the repo rename (June 8)
- [x] Decided to **keep the existing URL** `build-library-mcp-production.up.railway.app` (a service rename doesn't change the generated domain, and keeping it avoids re-adding the org Connector) — Connector unchanged and working
- [ ] **Rename the folder** `Website Build Ideas/` → `Website Ideas/` on disk (in progress — remove the git worktrees under `.claude/worktrees/` first, or `git worktree prune` after)
