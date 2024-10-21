import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { AppointmentResponse } from "../../../core/interfaces/appointment-response.interface";
import { AppointmentsService } from "../../../core/services/appointments/appointments.service";

type AppointmentField = keyof AppointmentResponse;

interface Column {
    field: AppointmentField;
    header: string;
    type?: 'date' | 'severity' | 'boolean' | 'object' | 'array' | 'rating';
}

@Component({
    selector: "sgs-appointments-list",
    templateUrl: "./appointments-list.component.html",
    styleUrls: ["./appointments-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsListComponent implements OnInit {
    appointments: AppointmentResponse[] = [];

    cols: Column[] = [
        { field: 'appointment_date', header: 'Data de Agendamento', type: 'date' },
        { field: 'status', header: 'Status', type: 'severity' },
        { field: 'client', header: 'Cliente', type: 'object' },
        { field: 'provider', header: 'Provedor', type: 'object' },
        { field: 'services', header: 'Serviços', type: 'array' },
        { field: 'is_completed', header: 'Concluído', type: 'boolean' },
        { field: 'rating', header: 'Avaliação', type: 'rating' },
    ];

    constructor(
        private appointmentsService: AppointmentsService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadAppointments();
    }

    loadAppointments() {
        this.appointmentsService.getAppointments().subscribe(
            (appointments: AppointmentResponse[]) => {
                this.appointments = appointments;
                console.log('Agendamentos carregados:', this.appointments);
                this.cdr.detectChanges();
            },
            (error: Error) => {
                console.error('Erro ao carregar agendamentos:', error);
            }
        );
    }

    getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
        switch (status.toUpperCase()) {
            case 'AGENDADO':
                return 'info';
            case 'CONCLUÍDO':
                return 'success';
            case 'CANCELADO':
                return 'danger';
            default:
                return 'warning';
        }
    }

    editAppointment(appointment: AppointmentResponse) {
        console.log('Edit appointment:', appointment);
    }

    deleteAppointment(appointment: AppointmentResponse) {
        this.appointmentsService.deleteAppointment(appointment.id).subscribe({
            next: () => {
                console.log('Appointment deleted:', appointment);
                this.appointments = this.appointments.filter(a => a.id !== appointment.id);
                this.cdr.detectChanges();
            }, 
            error: (error: Error) => {
                console.error('Error deleting appointment:', error);
            }
        });
    }

    getCellContent(appointment: AppointmentResponse, field: AppointmentField): string | number {
        switch (field) {
            case 'appointment_date':
                return new Date(appointment[field]).toLocaleString();
            case 'client':
            case 'provider':
                return appointment[field].name;
            case 'services':
                return appointment[field].map(service => service.description).join(', ');
            case 'is_completed':
                return appointment[field] ? 'Sim' : 'Não';
            case 'rating':
                return appointment[field];
            default:
                return String(appointment[field]);
        }
    }
}