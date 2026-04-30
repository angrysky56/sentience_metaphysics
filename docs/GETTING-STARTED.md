<!-- generated-by: gsd-doc-writer -->
# Getting Started

Welcome to the SEG Narrative Organisms project. This guide will help you go from zero to interacting with your first Replicant.

## Prerequisites

- **Node.js**: Version 18 or higher.
- **npm**: (or yarn/pnpm).
- **AI Provider**: You'll need at least one of the following:
    - [Ollama](https://ollama.ai/) (Local)
    - [LM Studio](https://lmstudio.ai/) (Local)
    - OpenAI API Key
    - Google Gemini API Key

## Setup Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/angrysky56/sentience_metaphysics.git
    cd sentience_metaphysics
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Backend Bridge**
    ```bash
    uv run -m mcp_server.bridge
    ```
    *(In a separate terminal)*

4.  **Start the Development Server**
    ```bash
    npm run dev
    ```

4.  **Configure your AI Service**
    - Open `http://localhost:3000` in your browser.
    - Navigate to the **Settings** tab.
    - Select your preferred provider and enter any necessary details (Base URL or API Key).
    - Click "Test Connection" to verify.

## Your First Interaction

1.  Go to the **Persona** tab.
2.  Click **"Generate New Persona"**.
3.  Switch to the **Conversation** tab.
4.  Type a message and witness the Replicant's response, influenced by its unique backstory and current mood.

## Troubleshooting

- **CORS Errors:** If using Ollama or LM Studio, ensure you have enabled CORS. For Ollama, set `OLLAMA_ORIGINS="*"` in your environment.
- **API Failures:** Check the browser console for specific error messages from the AI provider.

---
*Last Updated: 2026-04-30*
