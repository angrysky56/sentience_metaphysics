"""Pytest configuration: ensure mcp_server package is importable.

Adds the project root (parent of the mcp_server/ package) to sys.path so
test files can use `from mcp_server.X import Y` regardless of where pytest
is invoked from. This is the cwd-independent companion to ai_service.py's
project-rooted .env loader — together they let tests, scripts, and the
running server all use the same import style.
"""
import sys
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))
