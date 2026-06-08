# Changelog

## [2026-06-08]

### Changed
- Renamed the project from "Website Build Ideas" to "Website Ideas" — updated the display name, MCP server identity (`website-ideas`), error-reporting slug, GitHub repo, Railway service and live URL, npm package, and project folder.

## [2026-04-12]

### Added
- Initial release of Website Ideas server
- 7 MCP tools: save_bookmark, search_bookmarks, list_bookmarks, list_tags, get_bookmark, update_bookmark, delete_bookmark
- PostgreSQL database with full-text search and GIN-indexed tags
- Streamable HTTP transport for Railway deployment
- Auto-migration on startup
- Health check endpoint
- Migrated Hut 8 Corporate Website entry from websites-ideas.md
