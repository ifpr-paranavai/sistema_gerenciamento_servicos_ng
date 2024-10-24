import { ITableColumn } from "../interfaces/table-columns.interface";

export const AppointmentsCols: ITableColumn[] = [
    { field: 'appointment_date', header: 'Data de Agendamento', type: 'date' },
    { field: 'status', header: 'Status', type: 'severity' },
    { field: 'client', header: 'Cliente', type: 'object' },
    { field: 'provider', header: 'Provedor', type: 'object' },
    { field: 'services', header: 'Serviços', type: 'array' },
    { field: 'is_completed', header: 'Concluído', type: 'boolean' },
    { field: 'rating', header: 'Avaliação', type: 'rating' },
];