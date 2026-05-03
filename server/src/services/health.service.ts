import { getDbState } from "../config/db";

export interface HealthPayload {
  ok: boolean;
  service: string;
  uptimeSeconds: number;
  timestamp: string;
  db: {
    connected: boolean;
    readyState: number;
  };
}

export function getHealthPayload(): HealthPayload {
  return {
    ok: true,
    service: "odyssey-server",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    db: getDbState()
  };
}
