import { ITableColumn } from "../interfaces/table-columns.interface";

export const ServicesCols: ITableColumn[] = [
    { field: 'name', header: 'Nome' },
    { field: 'description', header: 'Descrição' },
    { field: 'cost', header: 'Valor', type: 'currency' },
    { field: 'duration', header: 'Duração', type: 'time' },
    { field: 'ratting_avg', header: 'Avaliação', type: 'rating' },
];