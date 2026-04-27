import axios from "axios";

const API_BASE = "http://localhost:8000";

export interface Replicant {
  id: string;
  name: string;
  archetype: string;
  description: string;
}

export interface CouncilStatus {
  session_id: string;
  current_step: string;
  premise: string;
  agent_ids: string[];
  responses_count: number;
  is_complete: boolean;
  results?: {
    synthesis?: string;
  };
  error?: string;
}

export const councilService = {
  async getReplicants(): Promise<Replicant[]> {
    const response = await axios.get(`${API_BASE}/replicants`);
    return response.data;
  },

  async startCouncil(premise: string, agent_ids: string[]): Promise<string> {
    const response = await axios.post(`${API_BASE}/council/start`, {
      premise,
      agent_ids,
    });
    return response.data.session_id;
  },

  async getStatus(session_id: string): Promise<CouncilStatus> {
    const response = await axios.get(`${API_BASE}/council/${session_id}`);
    return response.data;
  },
};
