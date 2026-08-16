/**
 * TypeFast Production Express Server Architecture
 */

export interface ServerConfig {
  port: number;
  databaseUrl: string;
  authSecret: string;
  corsOrigin: string;
}

export function createServerConfig(): ServerConfig {
  return {
    port: 4000,
    databaseUrl: 'postgresql://typefast_user:secret@localhost:5432/typefast_db',
    authSecret: 'typefast-production-jwt-secret-key-2026',
    corsOrigin: 'http://localhost:5173'
  };
}

export const SERVER_INFO = {
  name: 'TypeFast API Gateway',
  version: '4.0.0',
  status: 'active',
  supportedEngines: ['PostgreSQL 14+', 'Node.js 18+']
};
