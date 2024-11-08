export interface IProvider {
    id: number;
    name: string;
    email: string;
    cpf: string;
    appointments: {
        id: string;
        start: string;
        end: string;
        service: string;
    }[];
}
