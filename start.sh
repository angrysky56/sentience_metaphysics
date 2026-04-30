#!/usr/bin/env bash

# SEG Narrative Organisms - Startup Script
# This script launches both the Python Backend Bridge and the React Frontend.

set -euo pipefail

# --- Configuration ---
BACKEND_PORT=8000
FRONTEND_PORT=3000
LOG_FILE="startup.log"

# --- Colors for Output ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# --- Logging ---
log_info() { echo -e "${BLUE}[INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $*"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# --- Cleanup on Exit ---
cleanup() {
    echo ""
    log_warn "Shutting down servers..."
    
    # Kill the process groups
    if [[ -n "${BACKEND_PID:-}" ]]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [[ -n "${FRONTEND_PID:-}" ]]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    
    log_success "Shutdown complete."
    exit 0
}

trap cleanup SIGINT SIGTERM

# --- Dependency Checks ---
check_deps() {
    log_info "Checking dependencies..."
    
    if ! command -v uv &> /dev/null; then
        log_error "'uv' is not installed. Please install it first: https://github.com/astral-sh/uv"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "'npm' is not installed. Please install Node.js."
        exit 1
    fi
    
    log_success "Dependencies verified."
}

# --- Main Logic ---
main() {
    clear
    echo -e "${PURPLE}"
    echo "  ╔══════════════════════════════════════════════════════════╗"
    echo "  ║                                                          ║"
    echo "  ║              SEG NARRATIVE ORGANISMS                     ║"
    echo "  ║           Simulated Experiential Grounding               ║"
    echo "  ║                                                          ║"
    echo "  ╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    check_deps

    # 1. Start Backend Bridge
    log_info "Starting Python Backend Bridge on port ${BACKEND_PORT}..."
    uv run -m mcp_server.bridge > "$LOG_FILE" 2>&1 &
    BACKEND_PID=$!
    
    # Give it a second to start
    sleep 2
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        log_error "Backend failed to start. Check $LOG_FILE for details."
        exit 1
    fi
    log_success "Backend Bridge is running (PID: $BACKEND_PID)."

    # 2. Start Frontend
    log_info "Starting React Frontend on port ${FRONTEND_PORT}..."
    # We use --silent to keep the terminal clean, but users can check browser
    npm run dev -- --port "$FRONTEND_PORT" &
    FRONTEND_PID=$!
    
    log_success "Frontend development server is starting (PID: $FRONTEND_PID)."
    echo ""
    echo -e "${CYAN}------------------------------------------------------------${NC}"
    echo -e "${GREEN}  Dashboard:  ${NC} http://localhost:${FRONTEND_PORT}"
    echo -e "${GREEN}  API Bridge: ${NC} http://localhost:${BACKEND_PORT}"
    echo -e "${CYAN}------------------------------------------------------------${NC}"
    echo -e "${YELLOW}  Press CTRL+C to stop both servers.${NC}"
    echo ""

    # Keep script alive
    wait
}

main "$@"
