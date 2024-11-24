export interface IDashboardResponse {
  totalRevenue: number;
  serviceStats: IServiceStats[];
  currentAppointments: IAppointmentStats[];
  upcomingAppointments: IAppointmentStats[];
}

export interface IServiceStats {
  serviceName: string;
  totalValue: number;
  quantity: number;
  averageValue: number;
  date: string | Date;
}

export interface IAppointmentStats {
  id: number;
  serviceName: string;
  clientName: string;
  date: string;
  value: number;
  appointment_date: string;
  status: 'Agendado' | 'Em andamento' | 'Cancelado' | 'Concluido';
}

export interface IServiceMonthlyData {
  [serviceName: string]: {
    [month: string]: number;
  };
}