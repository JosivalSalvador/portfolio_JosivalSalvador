export type ServiceName = 'database' | 'redis';

export type ServiceStatus = 'up' | 'down';

export interface HealthReport {
  status: 'ok' | 'error';
  services: Record<ServiceName, ServiceStatus>;
}