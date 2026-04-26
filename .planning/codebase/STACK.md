# Technology Stack

**Analysis Date:** 2026-04-26

## Languages

**Primary:**
- TypeScript 5.2 - Frontend application logic and components
- Python 3.10+ - MCP server implementation and core grounding logic

**Secondary:**
- CSS (Tailwind) - Application styling
- HTML - Entry point and structure

## Runtime

**Environment:**
- Node.js 20.x - Frontend development and build environment
- Python 3.10+ - Backend/MCP server runtime

**Package Manager:**
- npm 10.x - Frontend dependencies
- pip (via requirements.txt) - Python dependencies

## Frameworks

**Core:**
- React 18.2 - UI library
- Vite 5.0 - Frontend build tool and dev server
- Model Context Protocol (MCP) - Communication protocol for AI integration

**UI/Styling:**
- Tailwind CSS 3.3 - Styling framework
- Radix UI - Accessible UI primitives (Dialog, Tabs, Slider, etc.)
- Framer Motion 10.16 - Animation library
- Lucide React - Icon set

**Testing:**
- None detected (no test scripts or files found)

**Build/Dev:**
- TypeScript 5.2 - Type safety and transpilation
- PostCSS / Autoprefixer - CSS processing

## Key Dependencies

**Critical:**
- `mcp` >= 1.0.0 - Core MCP server SDK
- `axios` ^1.6.2 - HTTP client for AI service communication
- `framer-motion` ^10.16.4 - Used for complex UI transitions and animations
- `anyio` >= 4.0.0 - Asynchronous I/O for Python

**Infrastructure:**
- `@vitejs/plugin-react` - Vite integration for React
- `class-variance-authority` - UI component variance management

## Configuration

**Environment:**
- `.env` files (implied for AI API keys)
- `python-dotenv` for Python environment management

**Build:**
- `vite.config.ts` - Vite configuration and aliases
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.js` - Tailwind theme and content configuration
- `postcss.config.js` - CSS processing configuration

## Platform Requirements

**Development:**
- Linux (Pop!_OS) as per user information
- Node.js and Python environments required
- NVIDIA GPU (RTX 3060) available for local inference if needed

**Production:**
- Frontend: Static hosting (Vercel/Netlify) or Node.js server
- Backend: Python-capable hosting or MCP-compatible environment

---

*Stack analysis: 2026-04-26*
*Update after major dependency changes*
