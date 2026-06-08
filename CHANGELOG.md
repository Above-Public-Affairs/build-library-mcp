# Changelog

## [2026-06-08]

### Fixed
- Couldn't be added as an Organization Connector in claude.ai. The `/mcp` endpoint required a bearer token, but the Connector UI has no field to supply one — so Claude fell back to OAuth, tried to self-register, and failed ("Couldn't register with Website Ideas's sign-in service"). The endpoint is now open like the team's other servers; access is gated by the obscure Railway URL.

### Removed
- Bearer-token auth middleware on `/mcp` (incompatible with claude.ai Organization Connectors, which only support OAuth or no-auth).

## [2026-04-12]

### Added
- Initial release of Website Build Ideas server
- 7 MCP tools: save_bookmark, search_bookmarks, list_bookmarks, list_tags, get_bookmark, update_bookmark, delete_bookmark
- PostgreSQL database with full-text search and GIN-indexed tags
- Streamable HTTP transport for Railway deployment
- Auto-migration on startup
- Health check endpoint
- Migrated Hut 8 Corporate Website entry from websites-ideas.md
