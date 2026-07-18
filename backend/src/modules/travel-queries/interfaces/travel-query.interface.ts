export enum TravelQueryType {
  FLIGHT     = 'FLIGHT',
  HOTEL      = 'HOTEL',
  CAR_RENTAL = 'CAR_RENTAL',
  TRANSPORT  = 'TRANSPORT',
  VISA       = 'VISA',
  STAYS      = 'STAYS',
}

export enum TravelQueryStatus {
  NEW         = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED    = 'RESOLVED',
  CLOSED      = 'CLOSED',
}

export interface ITravelQuery {
  query_id: number;
  query_type: TravelQueryType;
  status: TravelQueryStatus;
  card_number: string;
  client_id?: number | null;
  details?: Record<string, unknown> | null;
  admin_notes?: string | null;
  created_at: Date;
  updated_at: Date;
}
