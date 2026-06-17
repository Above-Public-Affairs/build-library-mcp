import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DatabaseClient } from "./db/client.js";
import { registerSaveTools } from "./tools/save.js";
import { registerSearchTools } from "./tools/search.js";
import { registerManageTools } from "./tools/manage.js";

const ICON =
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjExMiIgZmlsbD0iI0Q5NzcwNiIvPgogIDxwYXRoIGQ9Ik0xOTQgMTIwIEgzMTggYTE4IDE4IDAgMCAxIDE4IDE4IFYzOTIgTDI1NiAzMzIgTDE3NiAzOTIgVjEzOCBhMTggMTggMCAwIDEgMTggLTE4IFoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+Cg==";

export function createServer(db: DatabaseClient): McpServer {
  const server = new McpServer(
    {
      name: "website-ideas",
      version: "1.0.0",
      icons: [{ src: ICON, mimeType: "image/svg+xml", sizes: ["any"] }],
    } as any,
    {
      instructions: `Website Ideas — a personal reference library for bookmarking websites, UI patterns, and technical implementations. Use save_bookmark to store entries, search_bookmarks to find them, and list_tags to browse categories.`,
    }
  );

  registerSaveTools(server, db);
  registerSearchTools(server, db);
  registerManageTools(server, db);

  return server;
}
