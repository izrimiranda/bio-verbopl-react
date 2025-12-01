export interface EventItem {
  id: string;
  name: string;
  link: string;
  coverImage: string;
  order: number;
  active: boolean;
  startDate?: string; // ISO Date string YYYY-MM-DD
  endDate?: string;   // ISO Date string YYYY-MM-DD
}

export interface GroupItem {
  id: string;
  city: string;
  neighborhood: string;
  address: string;
  leaders: string;
  phone: string;
  contactLink: string;
}

export interface NeighborhoodOption {
  value: string;
  label: string;
}

export interface CityData {
  [key: string]: NeighborhoodOption[];
}

// Stats interface for Admin Dashboard
export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  groupsCount: number;
  views: number;
}
