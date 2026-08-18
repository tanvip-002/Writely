export interface AIProviderRequest {
  tool: string;
  text: string;
  tone?: string;
  context?: string;
  genre?: string;
}

export interface AIProviderResponse {
  output: string;
  metadata?: Record<string, unknown>;
}

export interface IAIProvider {
  name: string;
  isAvailable(): boolean;
  execute(request: AIProviderRequest): Promise<AIProviderResponse>;
}
