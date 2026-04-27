import asyncio
from mcp.server import Server
from mcp.server.stdio import stdio_server
import mcp.types as types

app = Server("dummy")

@app.list_tools()
async def list_tools():
    return [types.Tool(name="ping", description="ping", inputSchema={"type": "object"})]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    return [types.TextContent(type="text", text="pong")]

async def main():
    async with stdio_server() as (read, write):
        await app.run(read, write, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
