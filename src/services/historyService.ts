import { STORAGE_KEYS, ConversationEntry } from './types';

export interface SessionData {
  id: string;
  timestamp: number;
  personaName: string;
  conversation: ConversationEntry[];
  state: any; // We'll store the full SegState here
}

export class HistoryService {
  /**
   * Save current session to localStorage
   */
  static saveCurrentSession(state: any, conversation: ConversationEntry[]) {
    const sessionData: SessionData = {
      id: state.id || `session_${Date.now()}`,
      timestamp: Date.now(),
      personaName: state.persona.name,
      conversation,
      state
    };
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionData));
    
    // Only archive if there's some content
    if (conversation.length > 0) {
      this.archiveSession(sessionData);
    }
  }

  /**
   * Load the last active session
   */
  static loadCurrentSession(): SessionData | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse current session:', e);
      return null;
    }
  }

  /**
   * Archive a session to history list
   */
  private static archiveSession(session: SessionData) {
    const historyData = localStorage.getItem(STORAGE_KEYS.NARRATIVE_HISTORY);
    let history: SessionData[] = [];
    
    if (historyData) {
      try {
        history = JSON.parse(historyData);
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
    
    // Find if session already exists in history
    const index = history.findIndex(s => s.id === session.id);
    if (index !== -1) {
      history[index] = session;
    } else {
      history.unshift(session);
    }
    
    // Limit history size to 20 sessions to stay under localStorage limits
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    localStorage.setItem(STORAGE_KEYS.NARRATIVE_HISTORY, JSON.stringify(history));
  }

  /**
   * Get all archived sessions
   */
  static getHistory(): SessionData[] {
    const historyData = localStorage.getItem(STORAGE_KEYS.NARRATIVE_HISTORY);
    if (!historyData) return [];
    try {
      return JSON.parse(historyData);
    } catch (e) {
      console.error('Failed to parse history:', e);
      return [];
    }
  }

  /**
   * Clear all history
   */
  static clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    localStorage.removeItem(STORAGE_KEYS.NARRATIVE_HISTORY);
  }

  /**
   * Export history to a JSON file
   */
  static exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  /**
   * Import history from a JSON string
   */
  static importHistory(jsonData: string) {
    try {
      const history = JSON.parse(jsonData);
      if (Array.isArray(history)) {
        localStorage.setItem(STORAGE_KEYS.NARRATIVE_HISTORY, JSON.stringify(history));
        if (history.length > 0) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(history[0]));
        }
      }
    } catch (e) {
      throw new Error('Invalid history format');
    }
  }
}
