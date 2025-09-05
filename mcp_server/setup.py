#!/usr/bin/env python3
"""
SEG MCP Server Setup Script

Simple setup script to initialize the SEG MCP server environment.
"""

import subprocess
import sys
from pathlib import Path


def setup_environment():
    """Set up the Python environment for the SEG MCP server."""
    print("🔧 Setting up SEG MCP Server environment...")
    
    # Check if we're in the right directory
    server_dir = Path(__file__).parent
    if not (server_dir / "server.py").exists():
        print("❌ Error: server.py not found. Run this script from the mcp_server directory.")
        return False
    
    # Install dependencies using uv if available, otherwise pip
    try:
        subprocess.run(["uv", "--version"], check=True, capture_output=True)
        print("📦 Installing dependencies with uv...")
        subprocess.run(["uv", "add", "-r", "requirements.txt"], check=True)
        print("✅ Dependencies installed successfully with uv")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("📦 Installing dependencies with pip...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependencies installed successfully with pip")
    
    return True


def test_server():
    """Test that the server can be imported without errors."""
    print("🧪 Testing server imports...")
    try:
        import server
        import seg_core
        import replicants
        import templates
        print("✅ All modules import successfully")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False


def show_usage():
    """Show usage instructions for the MCP server."""
    print("""
🎭 SEG MCP Server Setup Complete!

📖 Usage Instructions:

1. **Run the server directly:**
   python server.py

2. **Use with MCP clients:**
   # The server runs on stdio, so it can be used with any MCP client
   # Example with a hypothetical MCP client:
   mcp-client path/to/server.py

3. **Available Tools:**
   - generate_persona: Create SEG personas with 6-component architecture
   - run_council_session: Orchestrate multi-persona reasoning sessions
   - analyze_through_seg_lens: Analyze content through experiential lenses
   - create_custom_replicant: Build new replicant archetypes
   - get_replicant_details: Examine existing replicants

4. **Available Resources:**
   - seg://replicants/all: List of all replicants
   - seg://replicants/detailed: Full replicant definitions
   - seg://framework/components: SEG architecture documentation
   - seg://templates/council: Council protocol templates
   - seg://examples/personas: Example persona implementations

5. **Available Prompts:**
   - seg_persona_creation: Templates for creating personas
   - council_protocol: Templates for council sessions
   - experiential_analysis: Templates for SEG analysis

🔗 Integration Notes:
- Server implements Model Context Protocol v1.0
- Compatible with Claude Desktop, Amazon Q, and other MCP clients
- All tools return structured JSON responses
- Resources provide comprehensive framework documentation

📚 Framework Information:
Your SEG (Simulated Experiential Grounding) framework is now accessible 
programmatically through standardized MCP interfaces. AI systems can:
- Generate sophisticated personas with experiential grounding
- Run multi-perspective reasoning sessions
- Apply experiential lenses to analysis tasks
- Access your complete replicant library

Happy reasoning! 🧠✨
""")


def main():
    """Main setup function."""
    print("🎭 SEG (Simulated Experiential Grounding) MCP Server Setup\n")
    
    # Setup environment
    if not setup_environment():
        print("❌ Setup failed!")
        return 1
    
    # Test imports
    if not test_server():
        print("❌ Server testing failed!")
        return 1
    
    # Show usage
    show_usage()
    
    print("🎉 Setup complete! Your SEG framework is now ready for MCP integration.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
