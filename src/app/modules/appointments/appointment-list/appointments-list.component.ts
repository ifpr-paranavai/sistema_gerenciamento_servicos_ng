import { ChangeDetectionStrategy, Component, OnInit, ViewChild, WritableSignal, signal } from "@angular/core";
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { IAppointmentResponse } from "../../../core/interfaces/appointment-response.interface";
import { AppointmentsRequest } from "../../../core/requests/appointments/appointments.request";
import { catchError, of, take } from "rxjs";
import { ToastService } from "../../../core/requests/toastr/toast.service";
import { AppointmentsCols } from "../../../core/constants/appointments.constant";
import { ITableColumn } from "../../../core/interfaces/table-columns.interface";
import { AppointmentModalComponent } from "../../../core/modals/appointment-modal/appointment-modal.component";
import { AppointmentStatusEnum } from "../../../core/interfaces/appointment-status.interface";
import { PrimeNgSeverity } from "../../../core/types/primeng.types";
import { AuthenticationRequest } from "../../../core/requests/authentication/authentication.request";
// import { AuthService } from '../../../core/services/auth.service';

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
    isProvider = signal<boolean>(false);

    severityMap: Record<AppointmentStatusEnum, PrimeNgSeverity> = {
        [AppointmentStatusEnum.PENDING]: 'info',
        [AppointmentStatusEnum.IN_PROGRESS]: 'info',
        [AppointmentStatusEnum.COMPLETED]: 'success',
        [AppointmentStatusEnum.CANCELED]: 'danger'
    };

    statusOptions = [
        { label: 'Pendente', value: AppointmentStatusEnum.PENDING },
        { label: 'Em Andamento', value: AppointmentStatusEnum.IN_PROGRESS },
        { label: 'Concluído', value: AppointmentStatusEnum.COMPLETED },
        { label: 'Cancelado', value: AppointmentStatusEnum.CANCELED }
    ];

    constructor(
        private appointmentsService: AppointmentsRequest,
        private toastService: ToastService,
        private authRequest: AuthenticationRequest
    ) { }

    ngOnInit() {
        this.loadAppointments();
        this.isProvider.set(this.authRequest.currentUserValue?.user.role?.role_type === 'provider');
    }

    loadAppointments(): void {
        this.appointmentsService.getAppointments()
            .pipe(
                take(1),
                catchError(error => {
                    console.error(error);
                    this.toastService.error('Erro ao carregar agendamentos', 'Não foi possível carregar os agendamentos');
                    return of();
                })
            ).subscribe({
                next: (appointments) => {
                    const appointmentsWithSeverety = appointments.map(appointment => ({
                        ...appointment,
                        severity: this.severityMap[appointment.status]
                    }));
                    this.appointments.set(appointmentsWithSeverety);
                }
            });
    }

    getStatusActions(appointment: IAppointmentResponse): MenuItem[] {
        if (!this.isProvider()) return [];

        return this.statusOptions
            .filter(status => status.value !== appointment.status)
            .map(status => ({
                label: `Alterar para ${status.label}`,
                icon: this.getStatusIcon(status.value),
                command: () => this.updateAppointmentStatus(appointment, status.value)
            }));
    }

    getStatusIcon(status: AppointmentStatusEnum): string {
        switch (status) {
            case AppointmentStatusEnum.PENDING:
                return 'pi pi-clock';
            case AppointmentStatusEnum.IN_PROGRESS:
                return 'pi pi-sync';
            case AppointmentStatusEnum.COMPLETED:
                return 'pi pi-check';
            case AppointmentStatusEnum.CANCELED:
                return 'pi pi-times';
            default:
                return 'pi pi-clock';
        }
    }

    updateAppointmentStatus(appointment: IAppointmentResponse, newStatus: AppointmentStatusEnum): void {
        this.appointmentsService
            .updateAppointmentStatus(appointment.id, newStatus)
            .pipe(
                take(1),
                catchError(error => {
                    console.error('Error updating appointment status:', error);
                    this.toastService.error(
                        'Erro ao atualizar status',
                        'Não foi possível atualizar o status do agendamento'
                    );
                    return of();
                })
            )
            .subscribe({
                next: (updatedAppointment) => {
                    const updatedAppointments = this.appointments().map(a => 
                        a.id === appointment.id 
                            ? { 
                                ...updatedAppointment, 
                                severity: this.severityMap[updatedAppointment.status] 
                              }
                            : a
                    );
                    this.appointments.set(updatedAppointments);
                    this.toastService.success(
                        'Status atualizado',
                        'Status do agendamento atualizado com sucesso'
                    );
                }
            });
    }

    editAppointment(appointment: IAppointmentResponse): void {
        if (!this.appointmentModal) throw new Error('AppointmentModalComponent not found');
        this.appointmentModal.openDialog(appointment);
    }

    deleteAppointment(appointment: IAppointmentResponse): void {
        this.appointmentsService
            .deleteAppointment(appointment.id)
            .pipe(
                take(1),
                catchError(error => {
                    console.error('Error deleting appointment:', error);
                    this.toastService.error('Erro ao excluir agendamento', 'Não foi possível excluir o agendamento');
                    return of();
                })
            )
            .subscribe({
                next: () => {
                    this.appointments.set(
                        this.appointments().filter(a => a.id !== appointment.id)
                    );
                    this.toastService.success('Agendamento excluído com sucesso', 'Agendamento excluído');
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

    openAppointmentModal(): void {
        if (!this.appointmentModal) throw new Error('AppointmentModalComponent not found');
        this.appointmentModal.openDialog();
    }
}