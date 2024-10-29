import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from "@angular/core";
import { ServiceRequest } from "../../requests/services/service.request";
import { ToastService } from "../../requests/toastr/toast.service";
import { IAppointmentResponse } from "../../interfaces/appointment-response.interface";
import { forkJoin, Observable, take } from "rxjs";
import { IDropdown } from "../../interfaces/dropdown.interface";
import { FormControl, FormGroup } from "@angular/forms";
import { ClientRequest } from "../../requests/clients/clients.request";
import { ProviderRequest } from "../../requests/providers/providers.request";
import { ServiceResponse } from "../../interfaces/service-response.interface";
import { IClient } from "../../interfaces/client.interface";
import { IProvider } from "../../interfaces/provider.interface";
import { AppointmentStatusEnum } from "../../interfaces/appointment-status.interface";

interface IAppointmentFg {
    id: FormControl<number | null>;
    serviceId: FormControl<string | null>;
    documentType: FormControl<DocumentType | null>;
    clientId: FormControl<number | null>;
    providerId: FormControl<number | null>;
    status: FormControl<AppointmentStatusEnum | null>;
    appointmentDate: FormControl<Date | null>;
    observation: FormControl<string | null>;
}

@Component({
    selector: 'sgs-appointment-modal',
    templateUrl: './appointment-modal.component.html',
    styleUrls: ['./appointment-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentModalComponent implements OnInit {
    visible: WritableSignal<boolean> = signal(false);
    loading: WritableSignal<boolean> = signal(false);
    isEdit: WritableSignal<boolean> = signal(false);
    servicesDropdownOptions: WritableSignal<IDropdown[]> = signal([]);
    clientDropdownOptions: WritableSignal<IDropdown[]> = signal([]);
    providerDropdownOptions: WritableSignal<IDropdown[]> = signal([]);

    appointmentFg: FormGroup<IAppointmentFg> = new FormGroup<IAppointmentFg>({
        id: new FormControl<number | null>(null),
        serviceId: new FormControl<string | null>(null),
        documentType: new FormControl<DocumentType | null>(null),
        clientId: new FormControl<number | null>(null),
        providerId: new FormControl<number | null>(null),
        status: new FormControl<AppointmentStatusEnum | null>(null),
        appointmentDate: new FormControl<Date | null>(null),
        observation: new FormControl<string | null>(null),
    });

    constructor(
        private toastService: ToastService,
        private readonly serviceRequest: ServiceRequest,
        private readonly clientRequest: ClientRequest,
        private readonly providerRequest: ProviderRequest,
    ) { }

    ngOnInit(): void {
        this.getDropdownOptions();
    }

    openDialog(appointment?: IAppointmentResponse): void {
        this.visible.set(true);
        console.log(appointment);
    }

    onSubmit(): void {
        if (this.loading()) return;

        if (this.appointmentFg.invalid) {
            this.toastService.error("Atenção", "Preencha todos os campos obrigatórios.");
            this.appointmentFg.markAllAsTouched();
            return;
        }

        console.log(this.appointmentFg.value);
    }

    private getDropdownOptions(): void {
        forkJoin([
            this.getServicesOptions(),
            this.getClientsOptions(),
            this.getProvidersOptions(),
        ]).pipe(take(1)).subscribe(([services, clients, providers]) => {
            this.servicesDropdownOptions.set(
                services.map(service => ({ label: service.name, value: service.id! }))
            );
            this.clientDropdownOptions.set(
                clients.map(client => ({ label: client.name, value: client.id!, complement: client.cpf }))
            );
            this.providerDropdownOptions.set(
                providers.map(provider => ({ label: provider.name, value: provider.id!, complement: provider.cpf }))
            );
        });
    }

    private getServicesOptions(): Observable<ServiceResponse[]> {
        return this.serviceRequest
            .getServices()
            .pipe(take(1));
    }

    private getClientsOptions(): Observable<IClient[]> {
        return this.clientRequest
            .getClients()
            .pipe(take(1));
    }

    private getProvidersOptions(): Observable<IProvider[]> {
        return this.providerRequest
            .getProviders()
            .pipe(take(1));
    }
}
