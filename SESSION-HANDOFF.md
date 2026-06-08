# Website Ideas — Session Handoff

_Last updated: June 8, 2026_

## Where we are

The server is deployed and live. On June 8 it was renamed from "Website Build Ideas" to "Website Ideas". **Done and shipped to `main`:** code + MCP identity (`website-ideas`), npm package, error-reporting slug, the **GitHub repo** (`Above-Public-Affairs/website-ideas`), and all docs. The renamed code is deployed and verified (the MCP handshake reports `serverInfo.name = "website-ideas"`).

**Still pending — manual steps (see Next steps):** the Railway service/project rename and the public-URL change (the Railway API only *stages* domain edits and they don't apply — these must be done in the Railway dashboard), the project-folder rename on disk, and re-adding the org Connector once the URL actually changes. The current live URL is still `https://build-library-mcp-production.up.railway.app` and the existing org Connector still works against it — **do NOT delete that connector until the new URL is live.**

## What's built

- **MCP server** (`src/index.ts`) exposing 7 tools: `save_bookmark`, `search_bookmarks`, `list_bookmarks`, `list_tags`, `get_bookmark`, `update_bookmark`, `delete_bookmark`.
- **Transport:** Streamable HTTP at `/mcp` when `PORT` is set (Railway); stdio otherwise (local use).
- **Storage:** Railway PostgreSQL with full-text search and GIN-indexed tags; migrations run on startup.
- **Deployment:** Railway service still named `build-library-mcp` (project "Website Build Ideas") — renaming these to `website-ideas` / "Website Ideas" is a pending manual dashboard step (not available via the Railway API). Auto-deploys from `Above-Public-Affairs/website-ideas` (repo already renamed) on push to `main`. **Current live URL:** `https://build-library-mcp-production.up.railway.app`. **Target URL after the dashboard rename:** `https://website-ideas-production.up.railway.app`.
- **Distribution:** Organization Connector in claude.ai, available to the team across Chat, Cowork, and web.
- **Error reporting:** wired via `canter-error-reporter`.

## Environment variables

Set on the Railway service (currently named `build-library-mcp`; the values live in Railway, not here):

- `DATABASE_URL` — Postgres connection string (provided by the Railway Postgres plugin)
- `ERROR_API_URL` — central error-reporter endpoint
- `ERROR_API_KEY` — error-reporter key
- `PORT` — set automatically by Railway; its presence is what switches the server to HTTP transport

**Don't set `AUTH_TOKEN`.** A bearer-token gate on `/mcp` breaks the org Connector (see the notes). The code no longer reads it, but don't reintroduce a `/mcp` auth gate either.

## Next steps

Three manual steps remain to finish the infra rename. Order matters; nothing is broken in the meantime (the old URL + connector keep working).

1. **Railway dashboard rename** (the API can't do these — it only stages domain edits that never apply):
   - Service → Settings → rename `build-library-mcp` → `website-ideas`.
   - Project → Settings → rename "Website Build Ideas" → "Website Ideas".
   - Service → Settings → Networking → change the generated domain to `website-ideas-production.up.railway.app` (rename the service first, then regenerate/edit the generated domain prefix). If Railway left a staged/unapplied networking change from the rename attempt, review and discard it first so you start clean.
   - Verify: `https://website-ideas-production.up.railway.app/health` returns `{"name":"website-ideas"}`.
2. **Re-add the org Connector** — only after the new URL is confirmed live. In claude.ai → Organization settings → Connectors, **delete the old connector and add a fresh one** (don't edit the old entry — see the "poisoned connector" note) pointing at `https://website-ideas-production.up.railway.app/mcp`, named `website-ideas`.
3. **Rename the project folder** on disk: `Development/Website Build Ideas/` → `Development/Website Ideas/`, once no git worktrees are active inside it (there are linked worktrees under `.claude/worktrees/` — remove them first).

After those, the rename is fully complete and future work is feature-level (new bookmarks, new tools).

## Known issues / notes

- **Keep `/mcp` open.** claude.ai Organization Connectors support only OAuth or no-auth — there's no field for a static bearer header. A bearer-gated `/mcp` returns 401, which makes claude.ai attempt OAuth and fail with "Couldn't register with … sign-in service." That's why the bearer middleware was removed on June 8.
- **A poisoned connector stays poisoned.** A connector first added while the server returned 401 stays stuck in OAuth mode even after the server is fixed. To recover, fully delete the connector and add a fresh one — retrying the old entry keeps failing with a new `ofid_…` each time.
- **If you ever need access control here,** put the secret in the URL path (`/mcp/<token>`) so a bare `/mcp` returns 404, not 401 — never a bearer-token middleware.

## Quick commands

Verify the live server end-to-end (handshake, then list and call a tool):

```
BASE="https://build-library-mcp-production.up.railway.app/mcp"   # current live URL; switch to website-ideas-production once the dashboard domain rename is done
# initialize and capture the session id
curl -sS -D /tmp/h.txt -o /dev/null -X POST "$BASE" \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"verify","version":"1.0"}}}'
SID=$(grep -i '^mcp-session-id:' /tmp/h.txt | tr -d '\r' | awk -F': ' '{print $2}')
# list tools, then call list_tags
curl -sS -X POST "$BASE" -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' -H "mcp-session-id: $SID" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
```

Build locally:

```
npm run build
```

Redeploy or change env vars: use the Railway MCP (project "Website Build Ideas", service `build-library-mcp` — names pending the dashboard rename above).
