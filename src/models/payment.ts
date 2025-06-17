export interface Payment {
  id: string;
  name: string;
  description?: string;
  fee?: number;
  enabled: boolean;
}