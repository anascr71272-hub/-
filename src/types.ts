export interface FeatureItem {
  title: string;
  desc: string;
}

export interface ServerConfig {
  serverName: string;
  javaIp: string;
  bedrockIp: string;
  bedrockPort: string;
  motd: string;
  version: string;
  discordUrl: string;
  storeUrl?: string;
  status: 'online' | 'maintenance' | 'event';
  maintenanceMessage: string;
  onlinePlayersCount: number;
  maxPlayers: number;
  announcement: string;
  features: FeatureItem[];
  rules: string[];
  hasAdminPin?: boolean;
  isDefaultPin?: boolean;
}

export interface PingResult {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  motd?: string;
  version?: string;
  latencyMs?: number;
}
