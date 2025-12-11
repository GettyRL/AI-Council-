export enum AgentRole {
  USER = 'user',
  PLANNER = 'planner',
  EXECUTOR = 'executor',
  CRITIC = 'critic',
  MANAGER = 'manager'
}

export interface AgentConfig {
  id: AgentRole;
  name: string;
  title: string;
  description: string;
  color: string;
  iconName: string; // mapping to lucide icons
  systemInstruction: string;
}

export interface Message {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: number;
  isThinking?: boolean;
  metadata?: {
    confidence?: number;
    sources?: string[];
  };
}

export interface Session {
  id: string;
  title: string;
  templateId: string;
  lastModified: number;
  messages: Message[];
  status: 'active' | 'completed';
}

export interface CouncilState {
  view: 'dashboard' | 'chat';
  currentSessionId: string | null;
  sessions: Session[];
  status: 'idle' | 'active' | 'completed';
  currentAgent: AgentRole | null;
}

export interface CouncilTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  roles: Partial<Record<Exclude<AgentRole, AgentRole.USER>, Partial<AgentConfig>>>;
}