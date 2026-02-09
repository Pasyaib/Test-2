export enum EventStatus {
  Draft = 'Draft',
  Published = 'Published',
  Closed = 'Closed'
}

export enum LocationType {
  Offline = 'Offline',
  Online = 'Online',
  Hybrid = 'Hybrid'
}

export interface EventData {
  id: string;
  title: string;
  category: string;
  date: string;
  locationType: LocationType;
  status: EventStatus;
  registered: number;
  capacity: number;
  revenue: number;
  imageUrl: string;
}

export interface StatMetric {
  label: string;
  value: string | number;
  iconType: 'calendar' | 'eye' | 'users' | 'money';
}