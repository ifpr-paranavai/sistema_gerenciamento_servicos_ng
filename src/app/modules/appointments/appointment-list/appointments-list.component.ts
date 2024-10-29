import { ChangeDetectionStrategy, Component, OnInit, ViewChild, WritableSignal, signal } from "@angular/core";
import { IAppointmentResponse } from "../../../core/interfaces/appointment-response.interface";
import { AppointmentsRequest } from "../../../core/requests/appointments/appointments.request";
import { catchError, of, take } from "rxjs";
import { ToastService } from "../../../core/requests/toastr/toast.service";
import { AppointmentsCols } from "../../../core/constants/appointments.constant";
import { ITableColumn } from "../../../core/interfaces/table-columns.interface";
import { AppointmentModalComponent } from "../../../core/modals/appointment-modal/appointment-modal.component";
import { AppointmentStatusEnum } from "../../../core/interfaces/appointment-status.interface";
import { PrimeNgSeverity } from "../../../core/types/primeng.types";

@Component({
    selector: "sgs-appointments-list",
    templateUrl: "./appointments-list.component.html",
    styleUrls: ["./appointments-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsListComponent implements OnInit {
    @ViewChild(AppointmentModalComponent) appointmentModal?: AppointmentModalComponent;

    appointments: WritableSignal<IAppointmentResponse[]> = signal([]);
    appointmentsColumns: ITableColumn[] = AppointmentsCols;

    severityMap: Record<AppointmentStatusEnum, PrimeNgSeverity> = {
        [AppointmentStatusEnum.PENDING]: 'info',
        [AppointmentStatusEnum.IN_PROGRESS]: 'info',
        [AppointmentStatusEnum.COMPLETED]: 'success',
        [AppointmentStatusEnum.CANCELED]: 'danger'
    };

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
                    const appointmentsWithSeverety = appointments.map(appointment => ({
                        ...appointment,
                        severity: this.severityMap[appointment.status] as PrimeNgSeverity
                    }));
                    this.appointments.set(appointmentsWithSeverety);
                }
            });
    }

    editAppointment(appointment: IAppointmentResponse): void {
        this.openAppointmentModal(appointment);
    }

    deleteAppointment(appointment: IAppointmentResponse): void {
        this.appointmentsService
            .deleteAppointment(appointment.id)
            .pipe(
                take(1),
                catchError(error => {
                    console.error('Error deleting appointment:', error);
                    return of();
                })
            )
            .subscribe({
                next: () => {
                    this.appointments.set(
                        this.appointments().filter(a => a.id !== appointment.id)
                    );
                },
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

    openAppointmentModal(appointment: IAppointmentResponse): void {
        if (!this.appointmentModal) throw new Error('AppointmentModalComponent not found');

        this.appointmentModal.openDialog(appointment);
    }
}
