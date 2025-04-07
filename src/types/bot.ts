export interface BotNode {
  id: string;
  type: 'message' | 'condition' | 'ai' | 'input' | 'media' | 'flow';
  content: string;
  children: string[];
  position?: {
    x: number;
    y: number;
  };
  conditions?: {
    type: 'text' | 'number' | 'boolean';
    operator: string;
    value: string;
  }[];
  metadata?: {
    responseType?: 'text' | 'options' | 'file';
    options?: string[];
    fileTypes?: string[];
    maxSize?: number;
    aiModel?: string;
    aiTemperature?: number;
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'audio';
    flowId?: string;
  };
}

export interface BotFlow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  nodes: Record<string, BotNode>;
  rootNode: string;
  isActive: boolean;
}