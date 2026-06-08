# Website Ideas — Session Handoff

_Last updated: June 8, 2026_

## Where we are

The server is deployed, live, and the rename is essentially complete. On June 8, "Website Build Ideas" → "Website Ideas": code + MCP identity (`website-ideas`), npm package, error-reporting slug, **GitHub repo** (`Above-Public-Affairs/website-ideas`), all docs, and the **Railway project ("Website Ideas") + service (`website-ideas`)**. Verified live (MCP handshake reports `serverInfo.name = "website-ideas"`).

**Decision:** the Railway-generated **URL was kept as `https://build-library-mcp-production.up.railway.app`** — renaming the service doesn't change the generated domain, and keeping it means the org Connector needs no change (no delete/re-add). The Connector is unchanged and working.

**Only remaining task:** rename the project folder on disk (see Next steps).

## What's built

- **MCP server** (`src/index.ts`) exposing 7 tools: `save_bookmark`, `search_bookmarks`, `list_bookmarks`, `list_tags`, `get_bookmark`, `update_bookmark`, `delete_bookmark`.
- **Transport:** Streamable HTTP at `/mcp` when `PORT` is set (Railway); stdio otherwise (local use).
- **Storage:** Railway PostgreSQL with full-text search and GIN-indexed tags; migrations run on startup.
- **Deployment:** Railway project **"Website Ideas"**, service **`website-ideas`**. Auto-deploys from `Above-Public-Affairs/website-ideas` on push to `main`. **Live URL:** `https://build-library-mcp-production.up.railway.app` (the original generated domain, kept on purpose — a service rename doesn't change it).
- **Distribution:** Organization Connector in claude.ai, available to the team across Chat, Cowork, and web.
- **Error reporting:** wired via `canter-error-reporter`.

## Environment variables

Set on the Railway `website-ideas` service (the values live in Railway, not here):

- `DATABASE_URL` — Postgres connection string (provided by the Railway Postgres plugin)
- `ERROR_API_URL` — central error-reporter endpoint
- `ERROR_API_KEY` — error-reporter key
- `PORT` — set automatically by Railway; its presence is what switches the server to HTTP transport

**Don't set `AUTH_TOKEN`.** A bearer-token gate on `/mcp` breaks the org Connector (see the notes). The code no longer reads it, but don't reintroduce a `/mcp` auth gate either.

## Next steps

Only the project-folder rename remains:

**Rename the folder** `Development/Website Build Ideas/` → `Development/Website Ideas/`. Caveat: the linked git worktrees under `.claude/worktrees/` hard-reference the old path, so rename when the Claude Code sessions using them are done — then run `git worktree prune` from inside the renamed folder to clear the stale entries. (Their merged work is already on `main`, so nothing is lost.)

After that the rename is fully complete and remaining work is feature-level (new bookmarks, new tools).

## Known issues / notes

- **Keep `/mcp` open.** claude.ai Organization Connectors support only OAuth or no-auth — there's no field for a static bearer header. A bearer-gated `/mcp` returns 401, which makes claude.ai attempt OAuth and fail with "Couldn't register with … sign-in service." That's why the bearer middleware was removed on June 8.
- **A poisoned connector stays poisoned.** A connector first added while the server returned 401 stays stuck in OAuth mode even after the server is fixed. To recover, fully delete the connector and add a fresh one — retrying the old entry keeps failing with a new `ofid_…` each time.
- **If you ever need access control here,** put the secret in the URL path (`/mcp/<token>`) so a bare `/mcp` returns 404, not 401 — never a bearer-token middleware.

## Quick commands

Verify the live server end-to-end (handshake, then list and call a tool):

```
BASE="https://build-library-mcp-production.up.railway.app/mcp"
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

Redeploy or change env vars: use the Railway MCP (project "Website Ideas", service `website-ideas`).
