import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, signal } from "@angular/core";
import { IAppointmentResponse } from "../../../core/interfaces/appointment-response.interface";
import { AppointmentsRequest } from "../../../core/requests/appointments/appointments.request";
import { catchError, of, take } from "rxjs";
import { ToastService } from "../../../core/requests/toastr/toast.service";
import { AppointmentsCols } from "../../../core/constants/appointments.constant";
import { ITableColumn } from "../../../core/interfaces/table-columns.interface";

@Component({
    selector: "sgs-appointments-list",
    templateUrl: "./appointments-list.component.html",
    styleUrls: ["./appointments-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsListComponent implements OnInit {
    appointments: WritableSignal<IAppointmentResponse[]> = signal([]);
    appointmentsColumns: ITableColumn[] = AppointmentsCols;

    constructor(
        private appointmentsService: AppointmentsRequest,
        private toastService: ToastService,

    ) { }

    ngOnInit() {
        this.loadAppointments();
    }

    loadAppointments(): void {
        this.appointmentsService.getAppointments()
            .pipe(
                take(1),
                catchError(error => {
                    console.log(error);
                    return of();
                })
            ).subscribe({
            next: (appointments) => {
                this.appointments.set(appointments);
                console.log('Agendamentos carregados:', this.appointments());
            }
        });
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

    editAppointment(appointment: IAppointmentResponse): void {
        console.log('Edit appointment:', appointment);
    }

    deleteAppointment(appointment: IAppointmentResponse): void {
        this.appointmentsService.deleteAppointment(appointment.id).pipe(take(1)).subscribe({
            next: () => {
                console.log('Appointment deleted:', appointment);
                this.appointments.set(
                    this.appointments().filter(a => a.id !== appointment.id)
                );
            },
            error: (error: Error) => {
                console.error('Error deleting appointment:', error);
            }
        });
    }

    getCellContent(appointment: IAppointmentResponse, field: string): string | number {
        switch (field) {
            case 'appointment_date':
                return new Date(appointment[field]).toLocaleString();
            case 'client':
                return appointment[field].name;
            case 'provider':
                return appointment[field].name;
            case 'services':
                return appointment[field].map(service => service.description).join(', ');
            case 'is_completed':
                return appointment[field] ? 'Sim' : 'Não';
            case 'rating':
                return appointment[field];
            default:
                return '';
        }
    }
}
