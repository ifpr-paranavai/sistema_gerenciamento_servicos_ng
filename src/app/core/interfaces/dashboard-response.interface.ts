export interface IDashboardResponse {
  totalRevenue: number;
  serviceStats: IServiceStats[];
  currentAppointments: IAppointmentStats[];
  upcomingAppointments: IAppointmentStats[];
}

export interface IServiceStats {
  serviceId: number;
  serviceName: string;
  totalValue: number;
}

export interface IAppointmentStats {
  id: number;
  serviceName: string;
  clientName: string;
  date: string;
  value: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}